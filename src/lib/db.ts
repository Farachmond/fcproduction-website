// Alleen importeren vanuit server-code (API-routes). Kleine server-only client voor de Supabase REST API (PostgREST).
// Gebruikt de service_role-sleutel; die komt nooit in de browser terecht.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function dbConfigured() {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export async function db<T = unknown>(
  path: string,
  { method = "GET", body, prefer }: { method?: Method; body?: unknown; prefer?: string } = {}
): Promise<T> {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Database is niet geconfigureerd");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Database-fout ${res.status}: ${text.slice(0, 200)}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
