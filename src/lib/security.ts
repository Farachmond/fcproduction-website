// Server-only hulpfuncties: hashing, IP, rate limiting en Turnstile.
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { db } from "./db";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SALT = SESSION_SECRET || "fc-reviews";

export function turnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

/** IP-adres wordt nooit leesbaar opgeslagen, alleen als gezouten hash. */
export function clientIpHash(req: Request) {
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return sha256(`${SALT}:${ip}`);
}

/** Telt recente pogingen en registreert deze poging. Geeft true als de limiet is bereikt. */
export async function rateLimited(kind: "review" | "login", ipHash: string, max: number, windowMinutes: number) {
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  const recent = await db<{ id: number }[]>(
    `rate_events?select=id&kind=eq.${kind}&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}&limit=${max}`
  );
  await db("rate_events", { method: "POST", body: { kind, ip_hash: ipHash } });
  return recent.length >= max;
}

export async function verifyTurnstile(token: string | undefined, ipHeader: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false, reason: "turnstile-niet-geconfigureerd" };
  if (!token) return { ok: false, reason: "geen-turnstile-token" };
  const form = new URLSearchParams({ secret, response: token });
  if (ipHeader) form.set("remoteip", ipHeader.split(",")[0].trim());
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      cache: "no-store",
    });
    const data = (await res.json()) as { success: boolean };
    return { ok: data.success === true, reason: data.success ? "" : "turnstile-mislukt" };
  } catch {
    return { ok: false, reason: "turnstile-onbereikbaar" };
  }
}

/* ---------- Admin-sessie ---------- */

export const ADMIN_COOKIE = "fc_admin";
const SESSION_DAYS = 7;

function sign(value: string) {
  const secret = SESSION_SECRET;
  if (!secret) throw new Error("Sessie-geheim ontbreekt");
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) return false;
  return safeEqual(sha256(input), sha256(expected));
}

export function createSessionValue() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60_000;
  return `${exp}.${sign(String(exp))}`;
}

export const sessionMaxAge = SESSION_DAYS * 24 * 60 * 60;

export function isAdmin(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.split(/;\s*/).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  if (!match) return false;
  const value = decodeURIComponent(match.slice(ADMIN_COOKIE.length + 1));
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  try {
    return safeEqual(sig, sign(exp));
  } catch {
    return false;
  }
}
