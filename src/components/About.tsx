"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";


const skills = ["DaVinci Resolve", "Adobe Premiere Pro", "After Effects", "Camera", "Licht", "Geluid"];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="relative py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: "var(--bg)" }}>

      {/* Bokeh */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none bokeh-b"
        style={{ background: "rgba(255,255,255,0.03)" }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none bokeh-c"
        style={{ background: "rgba(255,255,255,0.02)" }} aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden="true" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="section-label mb-6">De Maker</p>
          <h2 className="text-white font-black uppercase" style={{ fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>
            Over Mij
          </h2>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: portrait */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden" style={{ background: "#111" }}>
              <Image
                src="/about-photo.jpg"
                alt="Farachmond"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              {/* Subtle gradient at bottom */}
              <div className="absolute bottom-0 inset-x-0 h-1/3" style={{
                background: "linear-gradient(to top, rgba(8,8,8,0.6), transparent)"
              }} />
            </div>
            {/* Offset border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border pointer-events-none"
              style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          </motion.div>

          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <h3 className="text-white font-black text-5xl md:text-6xl uppercase mb-8" style={{ lineHeight: 0.9, letterSpacing: "-0.02em" }}>
              Creëren<br />
              <span style={{ color: "rgba(255,255,255,0.2)" }}>Visuele</span><br />
              Verhalen
            </h3>

            <p className="leading-relaxed mb-4 text-lg" style={{ color: "var(--text-muted)" }}>
              Ik ben een creatieve student en fotograaf/videograaf met een passie voor storytelling, design en content creatie.
            </p>
            <p className="leading-relaxed mb-4 text-sm" style={{ color: "rgba(161,161,170,0.6)" }}>
              Met FCPRODUCTION werk ik aan moderne visuals en projecten waarin sfeer, emotie en creativiteit samenkomen.
              Ik hou ervan om nieuwe ideeën uit te werken en mezelf steeds verder te ontwikkelen binnen video en design.
            </p>
            <p className="leading-relaxed mb-12 text-sm" style={{ color: "rgba(161,161,170,0.6)" }}>
              Mijn doel is om content te maken die professioneel, uniek en impactvol aanvoelt.
            </p>


            {/* Skills */}
            <div>
              <p className="section-label mb-4">Programma's & Software</p>
              <div className="flex flex-col gap-2">
                {skills.map((skill, i) => (
                  <motion.div key={skill}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-4 h-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }} />
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-10"
            >
              <a href="#contact"
                className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 border"
                style={{ background: "#fff", color: "#000", borderColor: "#fff" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "#fff"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "#fff"; el.style.color = "#000"; }}
              >Werk Met Mij</a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
