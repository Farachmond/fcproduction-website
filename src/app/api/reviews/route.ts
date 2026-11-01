import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { clientIpHash, rateLimited, sha256, turnstileConfigured, verifyTurnstile } from "@/lib/security";
import { normalize, spamReasons } from "@/lib/spam";
import { stats, type PublicReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/** Openbare lijst: alleen gepubliceerde reviews, met gemiddelde. */
export async function GET() {
  if (!dbConfigured()) return NextResponse.json({ reviews: [], count: 0, average: 0 }, { headers: NO_STORE });
  try {
    const reviews = await db<PublicReview[]>(
      "reviews?select=id,name,company,rating,body,created_at&status=eq.published&order=created_at.desc&limit=200"
    );
    return NextResponse.json({ reviews, ...stats(reviews) }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ reviews: [], count: 0, average: 0 }, { status: 200, headers: NO_STORE });
  }
}

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\s+\n/g, "\n").trim().slice(0, max + 1);
}

/** Nieuwe review insturen. */
export async function POST(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "Reviews zijn tijdelijk niet beschikbaar." }, { status: 503 });

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  // Honeypot: echte bezoekers zien dit veld niet. Doe alsof het gelukt is.
  if (clean(payload.website, 200)) return NextResponse.json({ status: "pending" });

  const name = clean(payload.name, 80);
  const companyRaw = clean(payload.company, 100);
  const company = companyRaw || null;
  const body = clean(payload.body, 1500);
  const rating = Number(payload.rating);
  const consent = payload.consent === true;
  const startedAt = Number(payload.startedAt);
  const elapsedMs = Number.isFinite(startedAt) ? Date.now() - startedAt : 0;

  const errors: string[] = [];
  if (name.length < 2 || name.length > 80) errors.push("Vul je naam in (2–80 tekens).");
  if (company && company.length > 100) errors.push("Bedrijfsnaam is te lang.");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.push("Kies 1 tot 5 sterren.");
  if (body.length < 10 || body.length > 1500) errors.push("Je review moet tussen 10 en 1500 tekens zijn.");
  if (!consent) errors.push("Geef toestemming voor publicatie.");
  if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

  // Met Turnstile: bots worden geweigerd en goede reviews komen direct online.
  // Zonder Turnstile: alle reviews gaan eerst naar de wachtrij in het beheerpaneel.
  const captcha = turnstileConfigured();
  if (captcha) {
    const turnstile = await verifyTurnstile(
      typeof payload.turnstileToken === "string" ? payload.turnstileToken : undefined,
      req.headers.get("x-forwarded-for")
    );
    if (!turnstile.ok) {
      return NextResponse.json({ error: "De beveiligingscontrole is mislukt. Probeer het opnieuw." }, { status: 400 });
    }
  }

  const ipHash = clientIpHash(req);
  try {
    if (await rateLimited("review", ipHash, 3, 60)) {
      return NextResponse.json({ error: "Je hebt net al een review gestuurd. Probeer het later opnieuw." }, { status: 429 });
    }

    const contentHash = sha256(normalize(body));
    const duplicate = await db<{ id: string }[]>(`reviews?select=id&content_hash=eq.${contentHash}&limit=1`);
    if (duplicate.length) {
      return NextResponse.json({ error: "Deze review is al ingestuurd." }, { status: 409 });
    }

    const reasons = spamReasons({ name, company, body, elapsedMs });
    const sameIp = await db<{ id: string }[]>(
      `reviews?select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(new Date(Date.now() - 30 * 86_400_000).toISOString())}&limit=1`
    );
    if (sameIp.length) reasons.push("eerder-review-van-zelfde-adres");
    if (!captcha) reasons.push("handmatige-controle");

    const status = reasons.length ? "pending" : "published";
    await db("reviews", {
      method: "POST",
      prefer: "return=minimal",
      body: { name, company, rating, body, consent, status, spam_reasons: reasons, content_hash: contentHash, ip_hash: ipHash },
    });

    return NextResponse.json({ status });
  } catch {
    return NextResponse.json({ error: "Er ging iets mis bij het opslaan. Probeer het later opnieuw." }, { status: 500 });
  }
}
