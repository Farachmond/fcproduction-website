"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Stars from "./Stars";
import type { PublicReview } from "@/lib/reviews";

type Data = { reviews: PublicReview[]; count: number; average: number };

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

export default function Reviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [data, setData] = useState<Data | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(() => {
    fetch("/api/reviews", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Data) => setData(d))
      .catch(() => setData({ reviews: [], count: 0, average: 0 }));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <section id="reviews" ref={ref} className="relative py-24 md:py-32 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden="true" />

      <div className="px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <p className="section-label mb-3 md:mb-6">Wat Klanten Zeggen</p>
        <h2 className="text-white font-black uppercase mb-8 md:mb-10" style={{ fontSize: "clamp(2rem, 6vw, 5rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>
          Reviews
        </h2>

        {data && data.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3 mb-10 md:mb-14"
          >
            <div className="flex items-center gap-4">
              <span className="text-white font-black" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1 }}>
                {data.average.toFixed(1).replace(".", ",")}
              </span>
              <div className="text-left">
                <Stars value={data.average} size={18} />
                <p className="section-label mt-2">{data.count} {data.count === 1 ? "review" : "reviews"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {data === null ? (
        <div className="h-48" aria-hidden="true" />
      ) : data.count === 0 ? (
        <p className="text-center text-sm px-6 mb-10" style={{ color: "var(--text-muted)" }}>
          Nog geen reviews. Werkte je met mij samen? Laat als eerste een review achter.
        </p>
      ) : (
        <ReviewRow reviews={data.reviews} />
      )}

      <div className="text-center mt-10 px-6">
        <button
          onClick={() => setFormOpen((o) => !o)}
          aria-expanded={formOpen}
          className="inline-flex items-center px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-all duration-300 border"
          style={{ color: formOpen ? "#fff" : "rgba(255,255,255,0.5)", borderColor: formOpen ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { if (!formOpen) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; } }}
        >
          {formOpen ? "Sluiten" : "Schrijf Een Review"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ReviewForm onPublished={load} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Horizontaal schuivende kaarten ---------- */

function ReviewRow({ reviews }: { reviews: PublicReview[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 680), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory py-3 px-6 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
        tabIndex={0}
        aria-label="Reviews"
      >
        {reviews.map((r, i) => (
          <motion.article
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06 }}
            className="glass-card rounded-sm flex-shrink-0 snap-start flex flex-col p-6 md:p-7 w-[280px] md:w-[340px]"
          >
            <Stars value={r.rating} />
            <p className="text-sm leading-relaxed text-white/80 mt-4 mb-6 flex-1 whitespace-pre-line">&ldquo;{r.body}&rdquo;</p>
            <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-white font-bold text-sm">{r.name}</p>
              {r.company && <p className="section-label mt-1" style={{ fontSize: "0.55rem" }}>{r.company}</p>}
              <p className="text-xs mt-2" style={{ color: "rgba(161,161,170,0.6)" }}>{fmtDate(r.created_at)}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {reviews.length > 1 && (
        <div className="hidden md:flex justify-center gap-2 mt-6">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              onClick={() => scrollBy(dir)}
              aria-label={dir < 0 ? "Vorige reviews" : "Volgende reviews"}
              className="w-10 h-10 border flex items-center justify-center transition-colors duration-300 text-white/50 hover:text-white"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ transform: dir < 0 ? "rotate(180deg)" : undefined }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Formulier ---------- */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const inputClass =
  "w-full bg-transparent text-white/80 px-5 py-4 text-sm focus:outline-none transition-all duration-300 placeholder:text-white/20 glass-card";

function ReviewForm({ onPublished }: { onPublished: () => void }) {
  const [form, setForm] = useState({ name: "", company: "", body: "", website: "" });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "published" | "pending">("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(Date.now());
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!SITE_KEY) return;
    const render = () => {
      if (!window.turnstile || !widgetEl.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetEl.current, {
        sitekey: SITE_KEY,
        theme: "dark",
        language: "nl",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };
    if (window.turnstile) render();
    else {
      let script = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      if (!script) {
        script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.dataset.turnstile = "1";
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
    }
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.body.trim()) return setError("Vul je naam en review in.");
    if (!rating) return setError("Kies een sterrenbeoordeling.");
    if (!consent) return setError("Geef toestemming voor publicatie.");
    if (SITE_KEY && !token) return setError("Wacht even tot de beveiligingscontrole klaar is.");
    setState("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating, consent, turnstileToken: token, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Er ging iets mis. Probeer het opnieuw.");
        setState("idle");
        setToken("");
        if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
        return;
      }
      setState(data.status === "published" ? "published" : "pending");
      if (data.status === "published") onPublished();
    } catch {
      setError("Geen verbinding. Probeer het opnieuw.");
      setState("idle");
    }
  };

  if (state === "published" || state === "pending") {
    return (
      <div className="max-w-xl mx-auto px-6 pt-12 pb-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 border border-white/20 flex items-center justify-center mb-6">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black uppercase text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Bedankt!</h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {state === "published"
            ? "Je review staat nu online."
            : "Je review is ontvangen en wordt eerst gecontroleerd voordat hij online komt."}
        </p>
      </div>
    );
  }

  const shown = hover || rating;
  return (
    <form onSubmit={submit} className="max-w-xl mx-auto px-6 pt-10 space-y-4 text-left" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input className={inputClass} placeholder="Naam *" aria-label="Naam" required maxLength={80} autoComplete="name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={inputClass} placeholder="Bedrijfsnaam (optioneel)" aria-label="Bedrijfsnaam" maxLength={100} autoComplete="organization"
          value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      </div>

      {/* Honeypot: onzichtbaar voor bezoekers */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></label>
      </div>

      <div className="glass-card px-5 py-4 flex items-center justify-between gap-4">
        <span className="text-sm text-white/40">Beoordeling *</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Sterrenbeoordeling" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} ${n === 1 ? "ster" : "sterren"}`}
              onClick={() => setRating(n)} onMouseEnter={() => setHover(n)}
              className="p-1 transition-transform duration-200 hover:scale-110">
              <svg viewBox="0 0 24 24" width={22} height={22} fill={n <= shown ? "#fff" : "rgba(255,255,255,0.15)"} style={{ transition: "fill 0.2s" }}>
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <textarea className={`${inputClass} resize-none`} rows={5} placeholder="Jouw ervaring *" aria-label="Review" required maxLength={1500}
        value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-white w-4 h-4 flex-shrink-0" />
        <span className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Ik geef toestemming om mijn naam, bedrijfsnaam en review openbaar te tonen op fcproduction.nl.
        </span>
      </label>

      {SITE_KEY && <div ref={widgetEl} className="min-h-[65px]" />}

      {error && <p className="text-sm" role="alert" style={{ color: "#fca5a5" }}>{error}</p>}

      <button type="submit" disabled={state === "sending"}
        className="w-full flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 border"
        style={{ background: state === "sending" ? "transparent" : "#fff", color: state === "sending" ? "rgba(255,255,255,0.5)" : "#000", borderColor: "#fff", cursor: state === "sending" ? "not-allowed" : "pointer" }}>
        {state === "sending" ? "Versturen..." : "Review Plaatsen"}
      </button>
    </form>
  );
}
