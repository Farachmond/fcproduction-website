import type { Metadata } from "next";
import Image from "next/image";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Links & contact — FCPRODUCTION",
  description: "Alle links en contactgegevens van FCPRODUCTION.",
};

const links = [
  { label: "Website", href: "https://www.fcproduction.nl/", icon: "website" },
  { label: "Instagram", href: "https://www.instagram.com/fcproduction_/", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@fcproduction_?is_from_webapp=1&sender_device=pc", icon: "tiktok" },
  { label: "LinkedIn", href: "https://linkedin.com/company/fcproduction", icon: "linkedin" },
  { label: "Email", href: "mailto:info@fcproduction.nl", icon: "email" },
  { label: "WhatsApp", href: "https://wa.me/31616057228", icon: "whatsapp" },
] as const;

export default function ContactLinksPage() {
  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true">
        <Image
          src="/contact/fcproduction-background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.backgroundImage}
        />
      </div>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.shell}>
        <header className={styles.profile} aria-label="FCproduction">
          <div className={styles.logoCrop}>
            <Image
              src="/contact/fcproduction-logo.png"
              alt="FCproduction logo"
              width={500}
              height={500}
              priority
              className={styles.logo}
            />
          </div>
        </header>

        <nav className={styles.linkList} aria-label="FCproduction links">
          {links.map((link) => (
            <a
              className={styles.linkButton}
              href={link.href}
              key={link.label}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              target={link.href.startsWith("http") ? "_blank" : undefined}
            >
              <span className={styles.linkIcon} aria-hidden="true">
                <PlatformIcon name={link.icon} />
              </span>
              <span className={styles.linkLabel}>{link.label}</span>
              <span className={styles.linkArrow} aria-hidden="true"><ArrowIcon /></span>
            </a>
          ))}
        </nav>

        <footer>© FCPRODUCTION 2026 — DEN HAAG</footer>
      </div>
    </main>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>;
}

function PlatformIcon({ name }: { name: (typeof links)[number]["icon"] }) {
  switch (name) {
    case "website":
      return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></svg>;
    case "instagram":
      return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle className={styles.iconFill} cx="17.4" cy="6.7" r="1"/></svg>;
    case "tiktok":
      return <svg viewBox="0 0 24 24"><path className={styles.iconSolid} d="M15.5 4c.6 2 1.8 3.2 3.8 3.8v3.3a9 9 0 0 1-3.8-1.2v5.2a5.2 5.2 0 1 1-4.6-5.2v3.4a2 2 0 1 0 1.4 1.9V4h3.2Z"/></svg>;
    case "linkedin":
      return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.2M12 17v-7m0 3c.7-2 5-2.2 5 1.2V17"/></svg>;
    case "email":
      return <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>;
    case "whatsapp":
      return <svg viewBox="0 0 24 24"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1Z"/><path d="M8.2 8.1c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 2c.1.3 0 .5-.2.7l-.6.8c-.2.2-.2.4 0 .7.6 1.1 1.6 2 2.8 2.6.3.2.5.1.7-.1l.8-1c.2-.2.4-.3.7-.2l2.1 1c.3.1.4.3.4.5 0 .4-.2 1.4-.9 1.9-.5.5-1.4.8-2.5.5-1.1-.3-2.6-.9-4.4-2.5-1.5-1.3-2.5-3-2.8-4.1-.3-1-.1-2 .3-2.7Z"/></svg>;
  }
}
