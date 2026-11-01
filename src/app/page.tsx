import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main role="main">
      <Nav />
      <Hero />
      <Projects />
      {/* Reviews verschijnen zodra de spamcontrole (Turnstile) is geconfigureerd in Vercel */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.SUPABASE_URL ? <Reviews /> : null}
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
