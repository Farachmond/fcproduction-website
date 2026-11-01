import { NextResponse } from "next/server";
import { dbConfigured } from "@/lib/db";
import {
  ADMIN_COOKIE,
  clientIpHash,
  createSessionValue,
  isAdmin,
  passwordMatches,
  rateLimited,
  sessionMaxAge,
} from "@/lib/security";

export const dynamic = "force-dynamic";

/** Ben ik ingelogd? */
export async function GET(req: Request) {
  return NextResponse.json({ admin: isAdmin(req) }, { headers: { "Cache-Control": "no-store" } });
}

/** Inloggen met het admin-wachtwoord. Max. 5 pogingen per 15 minuten. */
export async function POST(req: Request) {
  if (!dbConfigured() || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Beheer is nog niet geconfigureerd." }, { status: 503 });
  }
  if (await rateLimited("login", clientIpHash(req), 5, 15)) {
    return NextResponse.json({ error: "Te veel pogingen. Probeer het over 15 minuten opnieuw." }, { status: 429 });
  }
  let password = "";
  try {
    const data = await req.json();
    password = typeof data.password === "string" ? data.password : "";
  } catch {}
  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "Onjuist wachtwoord." }, { status: 401 });
  }
  const res = NextResponse.json({ admin: true });
  res.cookies.set(ADMIN_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: sessionMaxAge,
  });
  return res;
}

/** Uitloggen. */
export async function DELETE() {
  const res = NextResponse.json({ admin: false });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
