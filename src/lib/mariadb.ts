import fs from "fs";
import mysql, { Pool, PoolOptions } from "mysql2/promise";

declare global {
  var _mariaDbPool: Pool | undefined;
}

export function isMariaDbEnabled(): boolean {
  return (process.env.DB_PROVIDER || "").trim().toLowerCase() === "mariadb";
}

export function getMariaDbPool(): Pool {
  if (!isMariaDbEnabled()) {
    throw new Error("MariaDB provider is not enabled.");
  }

  if (!global._mariaDbPool) {
    const socketPath = (process.env.MARIADB_SOCKET || "").trim();
    const useSocket = Boolean(socketPath && fs.existsSync(socketPath));

    const config: PoolOptions = {
      user: process.env.MARIADB_USER || "apj_user",
      password: process.env.MARIADB_PASSWORD || "",
      database: process.env.MARIADB_DATABASE || "apjeduhub",
      charset: "utf8mb4",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
      ...(useSocket
        ? { socketPath }
        : {
            host: process.env.MARIADB_HOST || "127.0.0.1",
            port: Number(process.env.MARIADB_PORT || 3306),
          }),
    };

    global._mariaDbPool = mysql.createPool(config);
  }

  return global._mariaDbPool;
}

export async function checkMariaDbHealth(): Promise<{
  provider: "mariadb" | "firebase";
  connected: boolean;
}> {
  if (!isMariaDbEnabled()) {
    return { provider: "firebase", connected: false };
  }

  try {
    const pool = getMariaDbPool();
    await pool.query("SELECT 1");
    return { provider: "mariadb", connected: true };
  } catch (err) {
    console.warn("MariaDB health check failed:", err instanceof Error ? err.message : err);
    return { provider: "mariadb", connected: false };
  }
}
