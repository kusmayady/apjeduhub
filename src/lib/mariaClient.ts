// Client-side helper for communicating with the local MariaDB backend (/api/db/*)
// Keeps auth session tokens strictly in JS memory (never localStorage/sessionStorage).

let adminSessionToken: string | null = null;
let statusCachePromise: Promise<{ provider: "mariadb" | "firebase"; connected: boolean }> | null = null;

export function setMariaAdminToken(token: string | null) {
  adminSessionToken = token;
}

export function getMariaAdminToken(): string | null {
  return adminSessionToken;
}

export function clearMariaAdminToken() {
  adminSessionToken = null;
}

export async function getBackendDbStatus(forceRefresh = false): Promise<{
  provider: "mariadb" | "firebase";
  connected: boolean;
}> {
  if (!statusCachePromise || forceRefresh) {
    statusCachePromise = fetch("/api/db/status")
      .then(async (res) => {
        if (!res.ok) return { provider: "firebase" as const, connected: false };
        const data = await res.json();
        return {
          provider: data?.provider === "mariadb" ? ("mariadb" as const) : ("firebase" as const),
          connected: Boolean(data?.connected),
        };
      })
      .catch(() => ({ provider: "firebase" as const, connected: false }));
  }
  return statusCachePromise;
}

export async function isMariaDbActive(): Promise<boolean> {
  const status = await getBackendDbStatus();
  return status.provider === "mariadb" && status.connected;
}

export async function mariaFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (adminSessionToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${adminSessionToken}`);
  }

  const res = await fetch(`/api/db${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Database API error (${res.status})`);
  }
  return data as T;
}

export async function getMariaAdminStatus(): Promise<{
  initialized: boolean;
  envPasscodeConfigured: boolean;
}> {
  return mariaFetch("/admin/status");
}

export async function setupMariaAdmin(email: string, password: string): Promise<string> {
  const res = await mariaFetch<{ token: string; email: string }>("/admin/setup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setMariaAdminToken(res.token);
  return res.token;
}

export async function loginMariaAdmin(email: string, password: string): Promise<string> {
  const res = await mariaFetch<{ token: string; email: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setMariaAdminToken(res.token);
  return res.token;
}
