"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const projects = [
  {
    id: 1, title: "Feel Good Aftermovie", category: "Camera & montage · Feel Good Charity", year: "2026",
    description: "Aftermovie voor het Feel Good Charity event.",
    tags: ["Aftermovie", "Event Film"], duration: "",
    gradient: "from-zinc-900 via-neutral-800 to-stone-900",
    video: "/feel-good-aftermovie.mp4",
    poster: "/feel-good-poster.png", posterFit: "cover" as const,
  },
  {
    // TikTok-video (fallback zonder eigen MP4).
    id: 7, title: "The Hunt Promo", category: "Camera & montage · Jeugdwerk", year: "2026",
    description: "Promovideo voor De Hunt van Jeugdwerk Kaag & Braassem.",
    tags: ["TikTok"], duration: "",
    gradient: "from-zinc-900 via-neutral-800 to-stone-900",
    video: undefined, poster: "/poster-de-hunt.webp", posterFit: "cover" as const,
    tiktok: "7683104923969408288",
  },
  {
    id: 12, title: "Skills The Final 2026", category: "Camera · ROC Mondriaan", year: "2026",
    description: "Video van Skills The Final 2026 voor ROC Mondriaan. Camera.",
    tags: ["Event", "Camera"], duration: "",
    gradient: "from-stone-900 via-neutral-800 to-zinc-900",
    video: undefined, poster: "/poster-skills-the-final.webp", posterFit: "cover" as const,
    instagram: "DWGdYyyDT7W",
  },
  {
    id: 10, title: "Aftermovie Nacht van de Rechtspraak", category: "Camera & assistent montage · Rechtbank Rotterdam", year: "2026",
    description: "Aftermovie van de Rotterdamse Nacht van de Rechtspraak voor Rechtbank Rotterdam. Camera en assistentie bij de montage.",
    tags: ["Aftermovie", "Camera"], duration: "",
    gradient: "from-zinc-900 via-stone-800 to-neutral-900",
    video: undefined, poster: "/poster-aftermovie-nacht.webp", posterFit: "cover" as const,
    instagram: "DeJd3l0srVE",
  },
  {
    id: 13, title: "Open Dag Promo", category: "Edit · ROC Mondriaan", year: "2026",
    description: "Promovideo voor de Open Dag van ROC Mondriaan. Edit.",
    tags: ["Promo", "Edit"], duration: "",
    gradient: "from-zinc-900 via-neutral-800 to-stone-900",
    video: undefined, poster: "/poster-open-dag.webp", posterFit: "cover" as const,
    instagram: "DVLlz76DQhe",
  },
  {
    id: 9, title: "Maak Kennis: Jurjen", category: "Camera & montage · Jeugdwerk", year: "2026",
    description: "Kennismakingsvideo met jongerenwerker Jurjen.",
    tags: ["Reel"], duration: "",
    gradient: "from-stone-900 via-zinc-800 to-neutral-900",
    video: undefined, poster: "/poster-jurjen.webp", posterFit: "cover" as const,
    instagram: "De_zOypMzNZ",
  },
  {
    id: 3, title: "Intro Symposium", category: "Montage · ROC Mondriaan", year: "2026",
    description: "Intro video voor het ROC Mondriaan Symposium.",
    tags: ["Motion Graphics", "Event"], duration: "",
    gradient: "from-stone-900 via-zinc-800 to-neutral-900",
    video: "/intro-symposium.mov", poster: "/poster-intro-symposium.jpg", posterFit: "cover" as const,
  },
  {
    // Instagram Reel (fallback zonder eigen MP4). Zet hier later `video: "/bestand.mp4"` neer,
    // dan werkt deze kaart precies zoals de andere films.
    id: 6, title: "Nacht van de Rechtspraak", category: "Reel · Rechtbank Rotterdam", year: "2026",
    description: "Reel voor de Rotterdamse Nacht van de Rechtspraak.",
    tags: ["Reel"], duration: "",
    gradient: "from-stone-900 via-neutral-800 to-zinc-900",
    video: undefined, poster: "/poster-nacht-rechtspraak.webp", posterFit: "cover" as const,
    instagram: "DdRZU32MByB",
  },
  {
    id: 11, title: "YOUR Evening 2026", category: "Camera · ROC Mondriaan", year: "2026",
    description: "Aftermovie van YOUR Evening 2026 voor ROC Mondriaan. Camera.",
    tags: ["Aftermovie", "Camera"], duration: "",
    gradient: "from-neutral-900 via-stone-800 to-zinc-900",
    video: undefined, poster: "/poster-your-evening.webp", posterFit: "cover" as const,
    instagram: "DaQQxTHD_Hd",
  },
  {
    id: 8, title: "The Hunt Aftermovie", category: "Camera & montage · Jeugdwerk", year: "2026",
    description: "Reel van De Hunt 2026 voor Jeugdwerk Kaag & Braassem.",
    tags: ["Reel"], duration: "",
    gradient: "from-neutral-900 via-zinc-800 to-stone-900",
    video: undefined, poster: "/poster-de-hunt-2026.webp", posterFit: "cover" as const,
    instagram: "DeR1XNUskHs",
  },
];

const photos: { src: string; alt: string }[] = [
  { src: "/photos/img_0557.jpg", alt: "Foto" },
  { src: "/photos/398a9854.jpg", alt: "Foto" },
  { src: "/photos/facu-2025-09-17-066.jpg", alt: "Foto" },
  { src: "/photos/398a9840.jpg", alt: "Foto" },
  { src: "/photos/img_0633.jpg", alt: "Foto" },
  { src: "/photos/398a9865.jpg", alt: "Foto" },
  { src: "/photos/facu-2025-09-17-055.jpg", alt: "Foto" },
  { src: "/photos/398a9850.jpg", alt: "Foto" },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeEmbed, setActiveEmbed] = useState<{ src: string; title: string } | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const isMobile = useIsMobile();

  return (
    <section id="projects" ref={ref} className="relative py-24 md:py-32 overflow-hidden" style={{ background: "var(--bg)" }}>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="section-label mb-6">Geselecteerd Werk</p>
          <h2 className="text-white font-black uppercase" style={{ fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>
            Projecten
          </h2>
        </div>
      </div>

      {/* Photo marquee */}
      <div className="mb-16 md:mb-20">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="section-label mb-3 md:mb-6 text-center">Fotografie</p>
          <h3 className="text-white font-black uppercase text-center mb-8 md:mb-12" style={{ fontSize: "clamp(2rem, 6vw, 5rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>Foto's</h3>
        </div>
        <Marquee3D speed={isMobile ? 20 : 25} isMobile={isMobile}>
          {[...photos, ...photos].map((photo, i) => (
            <div key={i} className="flex-shrink-0 aspect-square overflow-hidden rounded-sm relative"
              style={{ width: isMobile ? "160px" : "288px" }}>
              <Image src={photo.src} alt={photo.alt} width={400} height={400} className="w-full h-full object-cover" draggable={false} />
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={() => setActivePhoto(photo.src)}
                onContextMenu={(e) => e.preventDefault()}
                style={{ WebkitTouchCallout: "none", userSelect: "none" } as React.CSSProperties}
              />
            </div>
          ))}
        </Marquee3D>
      </div>

      {/* Video marquee */}
      <div className="mb-12">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="section-label mb-3 md:mb-6 text-center">Video</p>
          <h3 className="text-white font-black uppercase text-center mb-8 md:mb-12" style={{ fontSize: "clamp(2rem, 6vw, 5rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>Films</h3>
        </div>
        <Marquee3D speed={isMobile ? 30 : 40} reverse isMobile={isMobile} no3dOnMobile>
          {[...projects, ...projects].map((project, i) => (
            <div
              key={i}
              className={`flex-shrink-0 aspect-[3/4] relative overflow-hidden rounded-sm ${project.video || project.instagram || project.tiktok ? "cursor-pointer" : "cursor-default"}`}
              style={{ width: isMobile ? "130px" : "256px" }}
              onClick={() => {
                if (project.video) setActiveVideo(project.video);
                else if (project.instagram) setActiveEmbed({ src: `https://www.instagram.com/reel/${project.instagram}/embed`, title: "Instagram Reel" });
                else if (project.tiktok) setActiveEmbed({ src: `https://www.tiktok.com/player/v1/${project.tiktok}?autoplay=1&music_info=0&description=0&rel=0`, title: "TikTok-video" });
              }}
            >
              <ProjectCardInner project={project} isMobile={isMobile} />
            </div>
          ))}
        </Marquee3D>
      </div>

      {/* CTA */}
      <div className="text-center mt-4 px-6">
        <a href="#contact"
          className="inline-flex items-center px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-all duration-300 border"
          style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.15)" }}
          onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.5)"; el.style.color = "#fff"; }}
          onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.5)"; }}
        >Neem Contact Op</a>
      </div>

      {/* Video lightbox */}
      <AnimatePresence>
        {activeVideo && <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />}
      </AnimatePresence>

      {/* Instagram / TikTok lightbox */}
      <AnimatePresence>
        {activeEmbed && <EmbedModal src={activeEmbed.src} title={activeEmbed.title} onClose={() => setActiveEmbed(null)} />}
      </AnimatePresence>

      {/* Photo lightbox */}
      <AnimatePresence>
        {activePhoto && <PhotoModal src={activePhoto} onClose={() => setActivePhoto(null)} />}
      </AnimatePresence>
    </section>
  );
}

function Marquee3D({ children, speed = 30, reverse = false, isMobile = false, no3dOnMobile = false }: {
  children: React.ReactNode; speed?: number; reverse?: boolean; isMobile?: boolean; no3dOnMobile?: boolean;
}) {
  const flat = isMobile && no3dOnMobile;
  return (
    <div style={{
      overflow: "hidden",
      perspective: flat ? undefined : "800px",
      maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
    }}>
      <div style={flat ? {} : { transform: "rotateX(8deg)", transformOrigin: "center center" }}>
        <div
          className="flex gap-3 w-max py-3"
          style={{
            animation: `marquee ${speed}s linear infinite ${reverse ? "reverse" : ""}`,
            willChange: "transform",
          }}
          onMouseEnter={(e) => { if (!isMobile) e.currentTarget.style.animationPlayState = "paused"; }}
          onMouseLeave={(e) => { if (!isMobile) e.currentTarget.style.animationPlayState = "running"; }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function ProjectCardInner({ project, isMobile }: { project: typeof projects[0]; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playable = !!(project.video || project.instagram || project.tiktok);

  const handleMouseEnter = () => {
    if (isMobile) return;
    setHovered(true);
    if (project.video && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };
  const handleMouseLeave = () => {
    if (isMobile) return;
    setHovered(false);
    if (project.video && videoRef.current) videoRef.current.pause();
  };

  return (
    <div className="w-full h-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={`absolute inset-0 bg-gradient-to-b ${project.gradient}`} />
      {project.poster && (
        <Image
          src={project.poster} alt="" fill
          sizes="(max-width: 768px) 130px, 256px"
          style={{ objectFit: project.posterFit ?? "cover", opacity: hovered ? 0 : 1, transition: "opacity 0.5s" }}
        />
      )}
      {project.video && !isMobile && (
        <video
          ref={videoRef} src={project.video} muted playsInline loop preload="none"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        />
      )}
      {!playable && (
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
      )}
      {(project as any).comingSoon && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 border z-10" style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(8,8,8,0.6)" }}>
          <span className="section-label" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.55rem" }}>Coming Soon</span>
        </div>
      )}
      {/* Embed zonder poster: subtiel play-icoon zodat de kaart niet leeg oogt */}
      {(project.instagram || project.tiktok) && !project.poster && !isMobile && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.3s" }}>
          <div className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      )}
      {/* Info overlay */}
      <div className="absolute bottom-0 inset-x-0 p-3 md:p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.3s" }}>
        <p className="section-label mb-0.5" style={{ fontSize: "0.55rem" }}>{project.category}</p>
        <h3 className="text-white font-bold" style={{ fontSize: isMobile ? "0.75rem" : "1.125rem" }}>{project.title}</h3>
      </div>
      {/* Hover overlay — desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 flex flex-col justify-end p-5"
          style={{
            opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
            background: playable ? "linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 60%)" : "rgba(8,8,8,0.88)"
          }}>
          {playable ? (
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 border border-white/40 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Klik om af te spelen</span>
              </div>
              <p className="section-label mb-1">{project.category}</p>
              <h3 className="text-white font-bold text-lg">{project.title}</h3>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-4">
                <svg className="w-4 h-4 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2 text-center">{project.title}</h3>
            </div>
          )}
        </div>
      )}
      {/* Mobile tap indicator for videos */}
      {isMobile && playable && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
            <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(0,0,0,0.96)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-10 right-0 flex items-center gap-2 text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
          Sluiten <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative bg-black rounded-sm overflow-hidden" style={{ maxHeight: "80vh" }}>
          <video
            ref={videoRef} src={src} autoPlay playsInline
            onContextMenu={(e) => e.preventDefault()}
            onTimeUpdate={() => { const v = videoRef.current; if (v) setProgress(v.currentTime / v.duration * 100); }}
            onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
            onEnded={() => setPlaying(false)}
            className="w-full" style={{ maxHeight: "calc(80vh - 56px)", display: "block" }}
          />
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "rgba(0,0,0,0.9)" }}>
            <button onClick={togglePlay} className="text-white flex-shrink-0">
              {playing
                ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              }
            </button>
            <span className="text-xs font-mono flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)" }}>{fmt(duration * progress / 100)} / {fmt(duration)}</span>
            <input type="range" min={0} max={100} value={progress}
              onChange={(e) => { const v = videoRef.current; if (v) { v.currentTime = v.duration * Number(e.target.value) / 100; setProgress(Number(e.target.value)); } }}
              className="flex-1 h-1 cursor-pointer accent-white"
            />
            <button onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(!muted); } }} className="text-white flex-shrink-0">
              {muted
                ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l2 2L21 18.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              }
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EmbedModal({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(0,0,0,0.96)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full flex flex-col items-center"
        style={{ maxWidth: "420px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="self-end mb-3 flex items-center gap-2 text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
          Sluiten <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative w-full bg-black rounded-sm overflow-hidden">
          <iframe
            src={src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            scrolling="no"
            className="w-full block"
            style={{ height: "min(80vh, 760px)", border: 0 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function PhotoModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(0,0,0,0.96)" }}
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
      >
        <button onClick={onClose} className="self-end mb-3 flex items-center gap-2 text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
          Sluiten <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative w-full overflow-hidden rounded-sm"
          style={{ maxHeight: "85vh", userSelect: "none", WebkitUserSelect: "none" } as React.CSSProperties}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img
            src={src} alt="" draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{ width: "100%", maxHeight: "85vh", objectFit: "contain", display: "block", pointerEvents: "none", userSelect: "none", WebkitUserSelect: "none" } as React.CSSProperties}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
