import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Dagelijkse aanroep door Vercel Cron (zie vercel.json), zodat de gratis
 * Supabase-database niet in slaapstand gaat. Ruimt ook oude rate-limit-regels op.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const allowed = secret
    ? req.headers.get("authorization") === `Bearer ${secret}`
    : (req.headers.get("user-agent") || "").startsWith("vercel-cron/");
  if (!allowed) {
    return NextResponse.json({ error: "Niet toegestaan." }, { status: 401 });
  }
  if (!dbConfigured()) return NextResponse.json({ ok: false });
  await db("reviews?select=id&limit=1");
  const cutoff = new Date(Date.now() - 2 * 86_400_000).toISOString();
  await db(`rate_events?created_at=lt.${encodeURIComponent(cutoff)}`, { method: "DELETE", prefer: "return=minimal" });
  return NextResponse.json({ ok: true });
}
