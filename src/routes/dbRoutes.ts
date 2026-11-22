import crypto from "crypto";
import express, { NextFunction, Request, Response } from "express";
import { RowDataPacket } from "mysql2/promise";
import { checkMariaDbHealth, getMariaDbPool, isMariaDbEnabled } from "../lib/mariadb.ts";

const router = express.Router();

const SESSION_SECRET =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16
    ? process.env.SESSION_SECRET
    : crypto.randomBytes(32).toString("hex");

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

interface AdminRequest extends Request {
  adminEmail?: string;
}

function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function isValidString(val: unknown, maxLen: number, minLen = 1): val is string {
  return typeof val === "string" && val.trim().length >= minLen && val.length <= maxLen;
}

function isValidOptionalString(val: unknown, maxLen: number): boolean {
  return val === undefined || val === null || (typeof val === "string" && val.length <= maxLen);
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, originalHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const original = Buffer.from(originalHex, "hex");
  if (derived.length !== original.length) return false;
  return crypto.timingSafeEqual(derived, original);
}

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function signAdminToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + TOKEN_TTL_MS }),
    "utf8"
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyAdminToken(token: string): { email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");
  if (!constantTimeEquals(sigB64, expectedSig)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!parsed || typeof parsed.email !== "string" || typeof parsed.exp !== "number") {
      return null;
    }
    if (Date.now() > parsed.exp) return null;
    return { email: parsed.email };
  } catch {
    return null;
  }
}

function requireMariaDb(_req: Request, res: Response, next: NextFunction) {
  if (!isMariaDbEnabled()) {
    return res.status(503).json({ error: "MariaDB local mode is not active." });
  }
  next();
}

function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing admin token." });
  }
  const token = authHeader.slice("Bearer ".length).trim();
  const verified = verifyAdminToken(token);
  if (!verified) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired admin token." });
  }
  req.adminEmail = verified.email;
  next();
}

// --- Database Health / Provider Status ---
router.get("/status", async (_req, res) => {
  const health = await checkMariaDbHealth();
  res.json(health);
});

// --- Local Admin Auth Endpoints ---
router.get("/admin/status", requireMariaDb, async (_req, res) => {
  try {
    const envPasscodeConfigured = Boolean((process.env.ADMIN_PASSCODE || "").trim());
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS cnt FROM admin_users"
    );
    const hasDbAdmin = Number(rows[0]?.cnt || 0) > 0;
    res.json({
      initialized: envPasscodeConfigured || hasDbAdmin,
      envPasscodeConfigured,
    });
  } catch (error) {
    console.error("Failed to check admin status:", error);
    res.status(500).json({ error: "Failed to check admin status." });
  }
});

router.post("/admin/setup", requireMariaDb, async (req, res) => {
  try {
    if ((process.env.ADMIN_PASSCODE || "").trim()) {
      return res.status(403).json({ error: "Admin passcode is managed by environment configuration." });
    }
    const { email, password } = req.body || {};
    if (!isValidString(email, 200) || !email.includes("@")) {
      return res.status(400).json({ error: "Valid admin email is required." });
    }
    if (!isValidString(password, 128, 8)) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const pool = getMariaDbPool();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS cnt FROM admin_users FOR UPDATE"
      );
      if (Number(rows[0]?.cnt || 0) > 0) {
        await conn.rollback();
        return res.status(409).json({ error: "Admin account has already been initialized." });
      }
      const normalizedEmail = email.trim().toLowerCase();
      const hashed = hashPassword(password);
      await conn.execute(
        "INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)",
        [normalizedEmail, hashed, "Super Admin"]
      );
      await conn.commit();
      const token = signAdminToken(normalizedEmail);
      res.status(201).json({ token, email: normalizedEmail });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Admin setup failed:", error);
    res.status(500).json({ error: "Failed to complete admin setup." });
  }
});

router.post("/admin/login", requireMariaDb, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!isValidString(email, 200) || !isValidString(password, 128)) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const envPasscode = (process.env.ADMIN_PASSCODE || "").trim();
    const envEmail = (process.env.ADMIN_EMAIL || "admin@apj.ac.id").trim().toLowerCase();

    if (envPasscode) {
      if (normalizedEmail === envEmail && constantTimeEquals(password, envPasscode)) {
        return res.json({ token: signAdminToken(normalizedEmail), email: normalizedEmail });
      }
      return res.status(401).json({ error: "Email atau kata sandi administrator salah." });
    }

    const pool = getMariaDbPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT email, password_hash FROM admin_users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );
    if (rows.length === 0 || !verifyPassword(password, String(rows[0].password_hash))) {
      return res.status(401).json({ error: "Email atau kata sandi administrator salah." });
    }

    return res.json({ token: signAdminToken(normalizedEmail), email: normalizedEmail });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Authentication service error." });
  }
});

// --- Announcements ---
router.get("/announcements", requireMariaDb, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, category, date, title, desc_text AS `desc`, image, content, created_at AS createdAt FROM announcements ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error reading announcements:", error);
    res.status(500).json({ error: "Failed to load announcements." });
  }
});

router.post("/announcements", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { category, date, title, desc, image, content, createdAt } = req.body || {};
    if (
      !isValidString(category, 100) ||
      !isValidString(date, 50) ||
      !isValidString(title, 300) ||
      !isValidString(desc, 3000) ||
      !isValidString(image, 2097152) ||
      !isValidOptionalString(content, 50000)
    ) {
      return res.status(400).json({ error: "Invalid announcement payload." });
    }
    const id = generateId("ann");
    const ts = isValidString(createdAt, 40) ? createdAt : new Date().toISOString();
    const pool = getMariaDbPool();
    await pool.execute(
      "INSERT INTO announcements (id, category, date, title, desc_text, image, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, category.trim(), date.trim(), title.trim(), desc.trim(), image, content ?? null, ts]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ error: "Failed to create announcement." });
  }
});

router.patch("/announcements/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const { category, date, title, desc, image, content } = req.body || {};

    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    if (category !== undefined) {
      if (!isValidString(category, 100)) return res.status(400).json({ error: "Invalid category." });
      fields.push("category = ?");
      values.push(category.trim());
    }
    if (date !== undefined) {
      if (!isValidString(date, 50)) return res.status(400).json({ error: "Invalid date." });
      fields.push("date = ?");
      values.push(date.trim());
    }
    if (title !== undefined) {
      if (!isValidString(title, 300)) return res.status(400).json({ error: "Invalid title." });
      fields.push("title = ?");
      values.push(title.trim());
    }
    if (desc !== undefined) {
      if (!isValidString(desc, 3000)) return res.status(400).json({ error: "Invalid desc." });
      fields.push("desc_text = ?");
      values.push(desc.trim());
    }
    if (image !== undefined) {
      if (!isValidString(image, 2097152)) return res.status(400).json({ error: "Invalid image." });
      fields.push("image = ?");
      values.push(image);
    }
    if (content !== undefined) {
      if (!isValidOptionalString(content, 50000)) return res.status(400).json({ error: "Invalid content." });
      fields.push("content = ?");
      values.push(content);
    }
    if (fields.length === 0) return res.json({ ok: true });

    values.push(id);
    const pool = getMariaDbPool();
    await pool.execute(`UPDATE announcements SET ${fields.join(", ")} WHERE id = ?`, values);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ error: "Failed to update announcement." });
  }
});

router.delete("/announcements/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    await pool.execute("DELETE FROM announcements WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Failed to delete announcement." });
  }
});

// --- News Categories ---
router.get("/news-categories", requireMariaDb, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT name FROM news_categories ORDER BY sort_order ASC, id ASC"
    );
    res.json(rows.map((r) => r.name));
  } catch (error) {
    console.error("Error loading news categories:", error);
    res.status(500).json({ error: "Failed to load news categories." });
  }
});

router.put("/news-categories", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { categories } = req.body || {};
    if (
      !Array.isArray(categories) ||
      categories.length > 50 ||
      !categories.every((c) => isValidString(c, 120))
    ) {
      return res.status(400).json({ error: "Invalid categories array." });
    }
    const pool = getMariaDbPool();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute("DELETE FROM news_categories");
      for (let i = 0; i < categories.length; i++) {
        await conn.execute(
          "INSERT INTO news_categories (name, sort_order) VALUES (?, ?)",
          [categories[i].trim(), i + 1]
        );
      }
      await conn.commit();
      res.json({ ok: true });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error saving news categories:", error);
    res.status(500).json({ error: "Failed to save news categories." });
  }
});

// --- Website Settings ---
router.get("/settings", requireMariaDb, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT director_name AS directorName, director_title AS directorTitle, established_year AS establishedYear, foundation_name AS foundationName, address, phone_lines AS phoneLines, pmb_email AS pmbEmail, consultation_hours AS consultationHours FROM website_settings WHERE setting_key = ? LIMIT 1",
      ["general"]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Settings not found." });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error loading settings:", error);
    res.status(500).json({ error: "Failed to load settings." });
  }
});

router.put("/settings", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const {
      directorName,
      directorTitle,
      establishedYear,
      foundationName,
      address,
      phoneLines,
      pmbEmail,
      consultationHours,
    } = req.body || {};
    if (
      !isValidString(directorName, 200) ||
      !isValidString(directorTitle, 200) ||
      !isValidString(establishedYear, 10) ||
      !isValidString(foundationName, 200) ||
      !isValidString(address, 500) ||
      !isValidString(phoneLines, 200) ||
      !isValidString(pmbEmail, 200) ||
      !isValidString(consultationHours, 300)
    ) {
      return res.status(400).json({ error: "Invalid website settings payload." });
    }
    const pool = getMariaDbPool();
    await pool.execute(
      `INSERT INTO website_settings (setting_key, director_name, director_title, established_year, foundation_name, address, phone_lines, pmb_email, consultation_hours)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         director_name = VALUES(director_name),
         director_title = VALUES(director_title),
         established_year = VALUES(established_year),
         foundation_name = VALUES(foundation_name),
         address = VALUES(address),
         phone_lines = VALUES(phone_lines),
         pmb_email = VALUES(pmb_email),
         consultation_hours = VALUES(consultation_hours)`,
      [
        "general",
        directorName.trim(),
        directorTitle.trim(),
        establishedYear.trim(),
        foundationName.trim(),
        address.trim(),
        phoneLines.trim(),
        pmbEmail.trim(),
        consultationHours.trim(),
      ]
    );
    res.json({ ok: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ error: "Failed to save settings." });
  }
});

// --- Board Members ---
router.get("/board-members", requireMariaDb, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, role, education, avatar, category, sort_order AS `order` FROM board_members ORDER BY sort_order ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error loading board members:", error);
    res.status(500).json({ error: "Failed to load board members." });
  }
});

router.post("/board-members", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { name, role, education, avatar, category, order } = req.body || {};
    if (
      !isValidString(name, 200) ||
      !isValidString(role, 200) ||
      !isValidString(education, 200) ||
      !isValidString(avatar, 1048576) ||
      (category !== "APJ" && category !== "Yayasan") ||
      typeof order !== "number"
    ) {
      return res.status(400).json({ error: "Invalid board member payload." });
    }
    const id = generateId("board");
    const pool = getMariaDbPool();
    await pool.execute(
      "INSERT INTO board_members (id, name, role, education, avatar, category, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, name.trim(), role.trim(), education.trim(), avatar, category, Math.trunc(order)]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error("Error creating board member:", error);
    res.status(500).json({ error: "Failed to create board member." });
  }
});

router.patch("/board-members/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const { name, role, education, avatar, category, order } = req.body || {};
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (name !== undefined) {
      if (!isValidString(name, 200)) return res.status(400).json({ error: "Invalid name." });
      fields.push("name = ?");
      values.push(name.trim());
    }
    if (role !== undefined) {
      if (!isValidString(role, 200)) return res.status(400).json({ error: "Invalid role." });
      fields.push("role = ?");
      values.push(role.trim());
    }
    if (education !== undefined) {
      if (!isValidString(education, 200)) return res.status(400).json({ error: "Invalid education." });
      fields.push("education = ?");
      values.push(education.trim());
    }
    if (avatar !== undefined) {
      if (!isValidString(avatar, 1048576)) return res.status(400).json({ error: "Invalid avatar." });
      fields.push("avatar = ?");
      values.push(avatar);
    }
    if (category !== undefined) {
      if (category !== "APJ" && category !== "Yayasan") return res.status(400).json({ error: "Invalid category." });
      fields.push("category = ?");
      values.push(category);
    }
    if (order !== undefined) {
      if (typeof order !== "number") return res.status(400).json({ error: "Invalid order." });
      fields.push("sort_order = ?");
      values.push(Math.trunc(order));
    }

    if (fields.length === 0) return res.json({ ok: true });
    values.push(id);
    const pool = getMariaDbPool();
    await pool.execute(`UPDATE board_members SET ${fields.join(", ")} WHERE id = ?`, values);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating board member:", error);
    res.status(500).json({ error: "Failed to update board member." });
  }
});

router.delete("/board-members/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    await pool.execute("DELETE FROM board_members WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting board member:", error);
    res.status(500).json({ error: "Failed to delete board member." });
  }
});

// --- Joomla Template Styles ---
function mapTemplateRow(row: RowDataPacket) {
  let extra: Record<string, unknown> = {};
  if (typeof row.extra_config === "string" && row.extra_config.trim()) {
    try {
      extra = JSON.parse(row.extra_config);
    } catch {
      extra = {};
    }
  }
  return {
    ...extra,
    id: row.id,
    name: row.name,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    accentColor: row.accent_color,
    backgroundColor: row.background_color,
    fontFamily: row.font_family,
    headingFontName: row.heading_font_name,
    cardRadius: row.card_radius,
    headerStyle: row.header_style,
    showHeroBackground: Boolean(row.show_hero_background),
    badgeStyle: row.badge_style,
    isSystem: Boolean(row.is_system),
  };
}

function splitTemplateFields(body: Record<string, unknown>) {
  const {
    id: _id,
    name,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    fontFamily,
    headingFontName,
    cardRadius,
    headerStyle,
    showHeroBackground,
    badgeStyle,
    isSystem,
    ...extra
  } = body;
  return {
    name,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    fontFamily,
    headingFontName,
    cardRadius,
    headerStyle,
    showHeroBackground,
    badgeStyle,
    isSystem,
    extra,
  };
}

router.get("/template-styles", requireMariaDb, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM joomla_template_styles");
    res.json(rows.map(mapTemplateRow));
  } catch (error) {
    console.error("Error loading template styles:", error);
    res.status(500).json({ error: "Failed to load template styles." });
  }
});

router.post("/template-styles", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const parsed = splitTemplateFields(req.body || {});
    if (
      !isValidString(parsed.name, 150) ||
      !isValidString(parsed.primaryColor, 32) ||
      !isValidString(parsed.secondaryColor, 32) ||
      !isValidString(parsed.accentColor, 32) ||
      !isValidString(parsed.backgroundColor, 32)
    ) {
      return res.status(400).json({ error: "Invalid template style payload." });
    }
    const id = generateId("tpl");
    const pool = getMariaDbPool();
    await pool.execute(
      `INSERT INTO joomla_template_styles
       (id, name, primary_color, secondary_color, accent_color, background_color, font_family, heading_font_name, card_radius, header_style, show_hero_background, badge_style, is_system, extra_config)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        parsed.name.trim(),
        parsed.primaryColor.trim(),
        parsed.secondaryColor.trim(),
        parsed.accentColor.trim(),
        parsed.backgroundColor.trim(),
        isValidString(parsed.fontFamily, 50) ? parsed.fontFamily : "font-sans",
        isValidString(parsed.headingFontName, 100) ? parsed.headingFontName : "Inter",
        isValidString(parsed.cardRadius, 50) ? parsed.cardRadius : "rounded-xl",
        isValidString(parsed.headerStyle, 50) ? parsed.headerStyle : "sticky",
        parsed.showHeroBackground === false ? 0 : 1,
        isValidString(parsed.badgeStyle, 50) ? parsed.badgeStyle : "pill",
        parsed.isSystem ? 1 : 0,
        JSON.stringify(parsed.extra),
      ]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error("Error creating template style:", error);
    res.status(500).json({ error: "Failed to create template style." });
  }
});

router.patch("/template-styles/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    const [existingRows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM joomla_template_styles WHERE id = ? LIMIT 1",
      [id]
    );
    if (existingRows.length === 0) return res.status(404).json({ error: "Template not found." });

    const current = mapTemplateRow(existingRows[0]);
    const merged = { ...current, ...(req.body || {}) };
    const parsed = splitTemplateFields(merged);

    await pool.execute(
      `UPDATE joomla_template_styles SET
        name = ?, primary_color = ?, secondary_color = ?, accent_color = ?, background_color = ?,
        font_family = ?, heading_font_name = ?, card_radius = ?, header_style = ?,
        show_hero_background = ?, badge_style = ?, extra_config = ?
       WHERE id = ?`,
      [
        String(parsed.name || current.name),
        String(parsed.primaryColor || current.primaryColor),
        String(parsed.secondaryColor || current.secondaryColor),
        String(parsed.accentColor || current.accentColor),
        String(parsed.backgroundColor || current.backgroundColor),
        String(parsed.fontFamily || current.fontFamily),
        String(parsed.headingFontName || current.headingFontName),
        String(parsed.cardRadius || current.cardRadius),
        String(parsed.headerStyle || current.headerStyle),
        parsed.showHeroBackground === false ? 0 : 1,
        String(parsed.badgeStyle || current.badgeStyle),
        JSON.stringify(parsed.extra),
        id,
      ]
    );
    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating template style:", error);
    res.status(500).json({ error: "Failed to update template style." });
  }
});

router.delete("/template-styles/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    await pool.execute("DELETE FROM joomla_template_styles WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting template style:", error);
    res.status(500).json({ error: "Failed to delete template style." });
  }
});

// --- Joomla Menu Items ---
router.get("/menu-items", requireMariaDb, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, label, section_id AS sectionId, tab_id AS tabId, parent_id AS parentId, sort_order AS `order`, template_style_id AS templateStyleId FROM joomla_menu_items ORDER BY sort_order ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error loading menu items:", error);
    res.status(500).json({ error: "Failed to load menu items." });
  }
});

router.post("/menu-items", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { label, sectionId, tabId, parentId, order, templateStyleId } = req.body || {};
    if (
      !isValidString(label, 150) ||
      !isValidString(sectionId, 100) ||
      typeof order !== "number" ||
      !isValidString(templateStyleId, 64)
    ) {
      return res.status(400).json({ error: "Invalid menu item payload." });
    }
    const id = generateId("menu");
    const pool = getMariaDbPool();
    await pool.execute(
      "INSERT INTO joomla_menu_items (id, label, section_id, tab_id, parent_id, sort_order, template_style_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        label.trim(),
        sectionId.trim(),
        typeof tabId === "string" ? tabId.trim() : "",
        typeof parentId === "string" && parentId.trim() ? parentId.trim() : null,
        Math.trunc(order),
        templateStyleId.trim(),
      ]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ error: "Failed to create menu item." });
  }
});

router.patch("/menu-items/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const { label, sectionId, tabId, parentId, order, templateStyleId } = req.body || {};
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (label !== undefined) {
      if (!isValidString(label, 150)) return res.status(400).json({ error: "Invalid label." });
      fields.push("label = ?");
      values.push(label.trim());
    }
    if (sectionId !== undefined) {
      if (!isValidString(sectionId, 100)) return res.status(400).json({ error: "Invalid sectionId." });
      fields.push("section_id = ?");
      values.push(sectionId.trim());
    }
    if (tabId !== undefined) {
      if (typeof tabId !== "string" || tabId.length > 100) return res.status(400).json({ error: "Invalid tabId." });
      fields.push("tab_id = ?");
      values.push(tabId.trim());
    }
    if (parentId !== undefined) {
      fields.push("parent_id = ?");
      values.push(typeof parentId === "string" && parentId.trim() ? parentId.trim() : null);
    }
    if (order !== undefined) {
      if (typeof order !== "number") return res.status(400).json({ error: "Invalid order." });
      fields.push("sort_order = ?");
      values.push(Math.trunc(order));
    }
    if (templateStyleId !== undefined) {
      if (!isValidString(templateStyleId, 64)) return res.status(400).json({ error: "Invalid templateStyleId." });
      fields.push("template_style_id = ?");
      values.push(templateStyleId.trim());
    }

    if (fields.length === 0) return res.json({ ok: true });
    values.push(id);
    const pool = getMariaDbPool();
    await pool.execute(`UPDATE joomla_menu_items SET ${fields.join(", ")} WHERE id = ?`, values);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item." });
  }
});

router.delete("/menu-items/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    await pool.execute("DELETE FROM joomla_menu_items WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item." });
  }
});

// --- PMB Applications ---
const VALID_PMB_STATUS = new Set(["Pending", "Verified", "Lulus Seleksi", "Tidak Lulus"]);

router.post("/pmb", requireMariaDb, async (req, res) => {
  try {
    const { applicationId, name, email, phone, highSchool, gradYear, major, classType } =
      req.body || {};
    if (
      !isValidString(applicationId, 64) ||
      !isValidString(name, 200) ||
      !isValidString(email, 200) ||
      !isValidString(phone, 100) ||
      !isValidString(highSchool, 200) ||
      !isValidString(gradYear, 10) ||
      !isValidString(major, 150) ||
      !isValidString(classType, 50)
    ) {
      return res.status(400).json({ error: "Data pendaftaran PMB tidak lengkap." });
    }
    const id = generateId("pmb");
    const createdAt = new Date().toISOString();
    const pool = getMariaDbPool();
    await pool.execute(
      `INSERT INTO pmb_applications
       (id, application_id, name, email, phone, high_school, grad_year, major, class_type, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        id,
        applicationId.trim(),
        name.trim(),
        email.trim(),
        phone.trim(),
        highSchool.trim(),
        gradYear.trim(),
        major.trim(),
        classType.trim(),
        createdAt,
      ]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error("Error submitting PMB application:", error);
    res.status(500).json({ error: "Gagal menyimpan pendaftaran PMB." });
  }
});

router.get("/pmb", requireMariaDb, requireAdmin, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, application_id AS applicationId, name, email, phone, high_school AS highSchool,
              grad_year AS gradYear, major, class_type AS classType, status, notes, created_at AS createdAt
       FROM pmb_applications ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching PMB applications:", error);
    res.status(500).json({ error: "Failed to load PMB applications." });
  }
});

router.patch("/pmb/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body || {};
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    if (!isValidString(status, 30) || !VALID_PMB_STATUS.has(status)) {
      return res.status(400).json({ error: "Invalid PMB status." });
    }
    if (!isValidOptionalString(notes, 2000)) {
      return res.status(400).json({ error: "Invalid notes." });
    }
    const pool = getMariaDbPool();
    if (notes !== undefined) {
      await pool.execute("UPDATE pmb_applications SET status = ?, notes = ? WHERE id = ?", [
        status,
        notes,
        id,
      ]);
    } else {
      await pool.execute("UPDATE pmb_applications SET status = ? WHERE id = ?", [status, id]);
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating PMB application:", error);
    res.status(500).json({ error: "Failed to update PMB application." });
  }
});

router.delete("/pmb/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    await pool.execute("DELETE FROM pmb_applications WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting PMB application:", error);
    res.status(500).json({ error: "Failed to delete PMB application." });
  }
});

// --- Contact Messages ---
router.post("/contacts", requireMariaDb, async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!isValidString(name, 200) || !isValidString(email, 200) || !isValidString(message, 2000)) {
      return res.status(400).json({ error: "Nama, email, dan pesan wajib diisi." });
    }
    const id = generateId("msg");
    const createdAt = new Date().toISOString();
    const pool = getMariaDbPool();
    await pool.execute(
      "INSERT INTO contact_messages (id, name, email, message, is_read, created_at) VALUES (?, ?, ?, ?, 0, ?)",
      [id, name.trim(), email.trim(), message.trim(), createdAt]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({ error: "Gagal mengirim pesan." });
  }
});

router.get("/contacts", requireMariaDb, requireAdmin, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, email, message, is_read AS isRead, reply_note AS replyNote, created_at AS createdAt
       FROM contact_messages ORDER BY created_at DESC`
    );
    res.json(
      rows.map((r) => ({
        ...r,
        isRead: Boolean(r.isRead),
      }))
    );
  } catch (error) {
    console.error("Error loading contact messages:", error);
    res.status(500).json({ error: "Failed to load contact messages." });
  }
});

router.patch("/contacts/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead, replyNote } = req.body || {};
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (isRead !== undefined) {
      if (typeof isRead !== "boolean") return res.status(400).json({ error: "Invalid isRead." });
      fields.push("is_read = ?");
      values.push(isRead ? 1 : 0);
    }
    if (replyNote !== undefined) {
      if (!isValidOptionalString(replyNote, 2000)) return res.status(400).json({ error: "Invalid replyNote." });
      fields.push("reply_note = ?");
      values.push(replyNote);
    }

    if (fields.length === 0) return res.json({ ok: true });
    values.push(id);
    const pool = getMariaDbPool();
    await pool.execute(`UPDATE contact_messages SET ${fields.join(", ")} WHERE id = ?`, values);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating contact message:", error);
    res.status(500).json({ error: "Failed to update contact message." });
  }
});

router.delete("/contacts/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    await pool.execute("DELETE FROM contact_messages WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ error: "Failed to delete contact message." });
  }
});

// --- EduFin SPP & Expenses ---
const VALID_MAJORS = new Set(["D3 Perhotelan", "D3 Usaha Perjalanan Wisata"]);
const VALID_CLASS_TYPES = new Set(["Reguler", "Kelas Karyawan"]);
const VALID_SPP_STATUS = new Set(["Lunas", "Menunggu", "Tunggakan"]);
const VALID_EXPENSE_CATS = new Set([
  "Bahan Lab Praktik",
  "Utilitas Kampus",
  "Perbaikan Lab Hotel",
  "Gaji & Staf",
  "Promosi & PMB",
  "Lain-lain",
]);

router.get("/edufin/spp", requireMariaDb, requireAdmin, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, nim, major, class_type AS classType, amount, status, last_paid AS lastPaid FROM edufin_spp"
    );
    res.json(rows.map((r) => ({ ...r, amount: Number(r.amount) })));
  } catch (error) {
    console.error("Error fetching EduFin SPP:", error);
    res.status(500).json({ error: "Failed to load SPP data." });
  }
});

router.post("/edufin/spp", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { name, nim, major, classType, amount, status, lastPaid } = req.body || {};
    if (
      !isValidString(name, 200) ||
      !isValidString(nim, 100) ||
      !VALID_MAJORS.has(major) ||
      !VALID_CLASS_TYPES.has(classType) ||
      typeof amount !== "number" ||
      !VALID_SPP_STATUS.has(status) ||
      !isValidString(lastPaid, 100)
    ) {
      return res.status(400).json({ error: "Invalid SPP record payload." });
    }
    const id = generateId("spp");
    const pool = getMariaDbPool();
    await pool.execute(
      "INSERT INTO edufin_spp (id, name, nim, major, class_type, amount, status, last_paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, name.trim(), nim.trim(), major, classType, amount, status, lastPaid.trim()]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error("Error adding EduFin SPP:", error);
    res.status(500).json({ error: "Failed to add SPP record." });
  }
});

router.patch("/edufin/spp/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, lastPaid } = req.body || {};
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    if (!VALID_SPP_STATUS.has(status) || !isValidOptionalString(lastPaid, 100)) {
      return res.status(400).json({ error: "Invalid SPP status update." });
    }
    const pool = getMariaDbPool();
    if (lastPaid !== undefined) {
      await pool.execute("UPDATE edufin_spp SET status = ?, last_paid = ? WHERE id = ?", [
        status,
        lastPaid,
        id,
      ]);
    } else {
      await pool.execute("UPDATE edufin_spp SET status = ? WHERE id = ?", [status, id]);
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating EduFin SPP:", error);
    res.status(500).json({ error: "Failed to update SPP status." });
  }
});

router.delete("/edufin/spp/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    await pool.execute("DELETE FROM edufin_spp WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting EduFin SPP:", error);
    res.status(500).json({ error: "Failed to delete SPP record." });
  }
});

router.get("/edufin/expenses", requireMariaDb, requireAdmin, async (_req, res) => {
  try {
    const pool = getMariaDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, category, amount, date, description FROM edufin_expenses"
    );
    res.json(rows.map((r) => ({ ...r, amount: Number(r.amount) })));
  } catch (error) {
    console.error("Error fetching EduFin expenses:", error);
    res.status(500).json({ error: "Failed to load expenses data." });
  }
});

router.post("/edufin/expenses", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { category, amount, date, description } = req.body || {};
    if (
      !VALID_EXPENSE_CATS.has(category) ||
      typeof amount !== "number" ||
      !isValidString(date, 100) ||
      !isValidString(description, 1000)
    ) {
      return res.status(400).json({ error: "Invalid expense payload." });
    }
    const id = generateId("exp");
    const pool = getMariaDbPool();
    await pool.execute(
      "INSERT INTO edufin_expenses (id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)",
      [id, category, amount, date.trim(), description.trim()]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error("Error adding EduFin expense:", error);
    res.status(500).json({ error: "Failed to add expense record." });
  }
});

router.delete("/edufin/expenses/:id", requireMariaDb, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidString(id, 64)) return res.status(400).json({ error: "Invalid ID." });
    const pool = getMariaDbPool();
    await pool.execute("DELETE FROM edufin_expenses WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting EduFin expense:", error);
    res.status(500).json({ error: "Failed to delete expense record." });
  }
});

export default router;
