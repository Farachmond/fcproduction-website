import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/security";
import { stats, type AdminReview, type ReviewStatus } from "@/lib/reviews";

export const dynamic = "force-dynamic";

const STATUSES: ReviewStatus[] = ["published", "pending", "hidden", "rejected"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function unauthorized() {
  return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
}

/** Alle reviews + statistieken. */
export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const reviews = await db<AdminReview[]>(
    "reviews?select=id,name,company,rating,body,created_at,updated_at,status,spam_reasons&order=created_at.desc&limit=1000"
  );
  const published = reviews.filter((r) => r.status === "published");
  return NextResponse.json(
    {
      reviews,
      published: stats(published),
      counts: Object.fromEntries(STATUSES.map((s) => [s, reviews.filter((r) => r.status === s).length])),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** Status wijzigen: { id, status } */
export async function PATCH(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const { id, status } = (await req.json().catch(() => ({}))) as { id?: string; status?: ReviewStatus };
  if (!id || !UUID_RE.test(id) || !status || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }
  await db(`reviews?id=eq.${id}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { status, updated_at: new Date().toISOString() },
  });
  return NextResponse.json({ ok: true });
}

/** Definitief verwijderen: { id } */
export async function DELETE(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id || !UUID_RE.test(id)) return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  await db(`reviews?id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" });
  return NextResponse.json({ ok: true });
}
