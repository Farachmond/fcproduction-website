"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Stars from "@/components/Stars";
import type { AdminReview, ReviewStatus } from "@/lib/reviews";

type AdminData = {
  reviews: AdminReview[];
  published: { count: number; average: number };
  counts: Record<ReviewStatus, number>;
};

const TABS: { key: ReviewStatus | "all"; label: string }[] = [
  { key: "pending", label: "Wachtrij" },
  { key: "published", label: "Online" },
  { key: "hidden", label: "Verborgen" },
  { key: "rejected", label: "Afgewezen" },
  { key: "all", label: "Alles" },
];

const STATUS_LABEL: Record<ReviewStatus, string> = {
  published: "Online",
  pending: "Wachtrij",
  hidden: "Verborgen",
  rejected: "Afgewezen",
};

const REASON_LABEL: Record<string, string> = {
  "bevat-link-of-e-mail": "bevat link of e-mail",
  "bevat-telefoonnummer": "bevat telefoonnummer",
  "bevat-html": "bevat code/HTML",
  "ongewenste-woorden": "ongewenste woorden",
  "veel-hoofdletters": "veel hoofdletters",
  "herhaalde-tekens": "herhaalde tekens",
  "weinig-inhoud": "weinig inhoud",
  "te-snel-ingevuld": "extreem snel ingevuld",
  "eerder-review-van-zelfde-adres": "al eerder een review vanaf hetzelfde adres",
  "handmatige-controle": "wacht op jouw goedkeuring (spamcontrole Turnstile nog niet ingesteld)",
};

const btn = "px-4 py-2 text-[0.65rem] font-semibold tracking-widest uppercase border transition-colors duration-200";

export default function AdminReviewsPage() {
  const [admin, setAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAdmin(Boolean(d.admin)))
      .catch(() => setAdmin(false));
  }, []);

  return (
    <main className="min-h-screen px-6 lg:px-12 py-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto">
        <p className="section-label mb-4">FCPRODUCTION · Beheer</p>
        <h1 className="text-white font-black uppercase mb-10" style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>
          Reviews
        </h1>
        {admin === null ? null : admin ? <Dashboard onLogout={() => setAdmin(false)} /> : <Login onLogin={() => setAdmin(true)} />}
      </div>
    </main>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) onLogin();
    else setError(data.error || "Inloggen mislukt.");
  };

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <input
        type="password" autoComplete="current-password" placeholder="Wachtwoord" aria-label="Wachtwoord" autoFocus
        value={password} onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-transparent text-white/80 px-5 py-4 text-sm focus:outline-none placeholder:text-white/20 glass-card"
      />
      {error && <p className="text-sm" role="alert" style={{ color: "#fca5a5" }}>{error}</p>}
      <button type="submit" disabled={busy || !password}
        className="w-full px-8 py-4 text-xs font-bold tracking-widest uppercase border"
        style={{ background: "#fff", color: "#000", borderColor: "#fff", opacity: busy || !password ? 0.5 : 1 }}>
        {busy ? "Bezig..." : "Inloggen"}
      </button>
    </form>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<ReviewStatus | "all">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/reviews", { cache: "no-store" });
    if (res.status === 401) return onLogout();
    if (!res.ok) return setError("Kon de reviews niet laden.");
    setData(await res.json());
  }, [onLogout]);

  useEffect(() => { load(); }, [load]);

  const act = async (id: string, method: "PATCH" | "DELETE", status?: ReviewStatus) => {
    if (method === "DELETE" && !confirm("Deze review definitief verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;
    setBusyId(id);
    setError("");
    const res = await fetch("/api/admin/reviews", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBusyId(null);
    if (res.status === 401) return onLogout();
    if (!res.ok) return setError("Actie mislukt. Probeer het opnieuw.");
    load();
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    onLogout();
  };

  const list = useMemo(
    () => (data ? data.reviews.filter((r) => tab === "all" || r.status === tab) : []),
    [data, tab]
  );

  if (!data) return <p className="text-sm" style={{ color: "var(--text-muted)" }}>{error || "Laden..."}</p>;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat label="Gemiddelde" value={data.published.count ? data.published.average.toFixed(1).replace(".", ",") : "–"}>
          {data.published.count > 0 && <Stars value={data.published.average} />}
        </Stat>
        <Stat label="Online" value={String(data.counts.published)} />
        <Stat label="In wachtrij" value={String(data.counts.pending)} />
        <Stat label="Totaal" value={String(data.reviews.length)} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={btn}
            style={{ borderColor: tab === t.key ? "#fff" : "rgba(255,255,255,0.15)", color: tab === t.key ? "#fff" : "rgba(255,255,255,0.5)" }}>
            {t.label}{t.key !== "all" ? ` (${data.counts[t.key]})` : ""}
          </button>
        ))}
        <button onClick={logout} className={`${btn} ml-auto`} style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>
          Uitloggen
        </button>
      </div>

      {error && <p className="text-sm mb-4" role="alert" style={{ color: "#fca5a5" }}>{error}</p>}

      {list.length === 0 ? (
        <p className="text-sm py-10" style={{ color: "var(--text-muted)" }}>Geen reviews in deze lijst.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((r) => (
            <li key={r.id} className="glass-card rounded-sm p-5 md:p-6" style={{ opacity: busyId === r.id ? 0.5 : 1 }}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                <Stars value={r.rating} />
                <span className="text-white font-bold text-sm">{r.name}</span>
                {r.company && <span className="section-label" style={{ fontSize: "0.55rem" }}>{r.company}</span>}
                <span className="text-xs ml-auto" style={{ color: "rgba(161,161,170,0.6)" }}>
                  {new Date(r.created_at).toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short" })}
                </span>
                <span className="text-[0.6rem] tracking-widest uppercase px-2 py-1 border" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>
                  {STATUS_LABEL[r.status]}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line break-words">{r.body}</p>
              {r.spam_reasons.length > 0 && (
                <p className="text-xs mt-3" style={{ color: "#fcd34d" }}>
                  Verdacht: {r.spam_reasons.map((x) => REASON_LABEL[x] || x).join(", ")}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {r.status !== "published" && (
                  <button disabled={busyId === r.id} onClick={() => act(r.id, "PATCH", "published")} className={btn}
                    style={{ background: "#fff", color: "#000", borderColor: "#fff" }}>Goedkeuren</button>
                )}
                {r.status === "published" && (
                  <button disabled={busyId === r.id} onClick={() => act(r.id, "PATCH", "hidden")} className={btn}
                    style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>Verbergen</button>
                )}
                {r.status !== "rejected" && (
                  <button disabled={busyId === r.id} onClick={() => act(r.id, "PATCH", "rejected")} className={btn}
                    style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>Afwijzen</button>
                )}
                <button disabled={busyId === r.id} onClick={() => act(r.id, "DELETE")} className={btn}
                  style={{ borderColor: "rgba(252,165,165,0.4)", color: "#fca5a5" }}>Verwijderen</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="glass-card rounded-sm p-5">
      <p className="section-label mb-2">{label}</p>
      <p className="text-white font-black text-3xl">{value}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
