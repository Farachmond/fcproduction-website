"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "2c0ecfde-f9ee-4e69-9309-e5d8adf1e2ea",
          name: form.name,
          email: form.email,
          subject: `Samenwerking: ${form.project || "Nieuw project"}`,
          message: `Project: ${form.project}\n\n${form.message}`,
        }),
      });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const handleQuickConnect = async () => {
    if (!email) return;
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "2c0ecfde-f9ee-4e69-9309-e5d8adf1e2ea",
        email,
        subject: "Quick connect via FCProduction",
        message: `E-mail: ${email}`,
      }),
    });
    setEmail("");
  };

  return (
    <section id="contact" ref={ref} className="relative py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: "var(--bg)" }}>

      {/* Bokeh */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none bokeh-a"
        style={{ background: "rgba(255,255,255,0.03)" }} aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden="true" />

      <div className="max-w-3xl mx-auto text-center">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-6"
        >
          <p className="section-label mb-6">Neem Contact Op</p>
          <h2 className="text-white font-black uppercase mb-6" style={{ fontSize: "clamp(2.5rem, 9vw, 7rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>
            Contact
          </h2>
          <p className="text-sm leading-relaxed mx-auto max-w-md" style={{ color: "var(--text-muted)" }}>
            Heb je een project in gedachten of wil je gewoon praten over visueel verhalen vertellen?
            Ik hoor graag van je.
          </p>
        </motion.div>

        {/* Quick email bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex gap-2 mb-16 mt-10"
        >
          <input
            type="email"
            placeholder="Vul je e-mail in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 glass-card"
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          <button
            type="button"
            onClick={handleQuickConnect}
            className="whitespace-nowrap px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 border"
            style={{ background: "#fff", color: "#000", borderColor: "#fff" }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "#fff"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "#fff"; el.style.color = "#000"; }}
          >Connect</button>
        </motion.div>

        {/* Full form */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 flex flex-col items-center"
          >
            <div className="w-16 h-16 border border-white/20 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-2xl font-black uppercase text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Bericht Verstuurd</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Je bericht is direct verstuurd. Ik kom zo snel mogelijk bij je terug!
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4 text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Naam" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label="E-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            </div>
            <Field label="Type Project" value={form.project} onChange={(v) => setForm({ ...form, project: v })} placeholder="Animatie, Film, Motion Graphics..." />
            <textarea
              rows={5}
              required
              placeholder="Vertel me over je project..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-transparent text-white/80 px-5 py-4 text-sm resize-none focus:outline-none transition-all duration-300 placeholder:text-white/20 glass-card"
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
            <button type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 border"
              style={{ background: sending ? "transparent" : "#fff", color: sending ? "rgba(255,255,255,0.5)" : "#000", borderColor: "#fff", cursor: sending ? "not-allowed" : "pointer" }}
              onMouseEnter={(e) => { if (!sending) { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "#fff"; } }}
              onMouseLeave={(e) => { if (!sending) { const el = e.currentTarget; el.style.background = "#fff"; el.style.color = "#000"; } }}
            >
              {sending ? "Versturen..." : "Verstuur Bericht"}
              {!sending && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </motion.form>
        )}

        {/* Contact details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          {[
            { label: "Adres", value: "Den Haag, NL" },
            { label: "E-mail", value: "Farachmond@gmail.com", href: "mailto:farachmond@gmail.com" },
            { label: "Telefoon", value: "+31 6 16 05 72 28", href: "tel:+31616057228" },
            { label: "WhatsApp", value: "Stuur een bericht", href: "https://wa.me/31616057228" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="section-label mb-1">{item.label}</p>
              {item.href ? (
                <a href={item.href} {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300">{item.value}</a>
              ) : (
                <p className="text-sm text-white/60">{item.value}</p>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
          <span className="text-sm" style={{ color: "rgba(161,161,170,0.5)" }}>Beschikbaar voor freelance — 2026</span>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)}
      required={required} placeholder={placeholder ?? label}
      className="w-full bg-transparent text-white/80 px-5 py-4 text-sm focus:outline-none transition-all duration-300 placeholder:text-white/20 glass-card"
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
    />
  );
}
