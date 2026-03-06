import { useState, useEffect, useRef } from "react";

const features = [
  {
    number: "01",
    icon: "🏘️",
    title: "Extensive Listings",
    desc: "From single rooms to spacious flats and entire houses — every budget, every preference, all in one place.",
    color: "#FF6B35",
  },
  {
    number: "02",
    icon: "⚡",
    title: "Easy Navigation",
    desc: "Find your next home in seconds. Smart filters, instant results, zero friction.",
    color: "#FF9500",
  },
  {
    number: "03",
    icon: "📍",
    title: "Local Focus",
    desc: "Hyderabad-first. Deep community roots mean better listings, better insights, better matches.",
    color: "#FF6B35",
  },
  {
    number: "04",
    icon: "✅",
    title: "Verified Listings",
    desc: "Every property is checked. Browse with confidence — trust is built into every listing.",
    color: "#FF9500",
  },
  {
    number: "05",
    icon: "💬",
    title: "Transparent Communication",
    desc: "Open, secure landlord–tenant messaging. No surprises. No middlemen. Just clarity.",
    color: "#FF6B35",
  },
  {
    number: "06",
    icon: "🤝",
    title: "User Support",
    desc: "Real humans ready to help at every step. Questions about a property? We've got answers.",
    color: "#FF9500",
  },
];

const stats = [
  { value: "5,000+", label: "Active Listings" },
  { value: "12K+", label: "Happy Tenants" },
  { value: "98%", label: "Verified Properties" },
  { value: "4.9★", label: "Average Rating" },
];

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref);
  const numTarget = parseFloat(target.replace(/[^0-9.]/g, ""));

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, numTarget]);

  const display = target.includes("K")
    ? count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count
    : target.includes("★")
    ? `${(count / 10).toFixed(1)}★`
    : count.toLocaleString();

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export default function About() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef);
  const statsInView = useInView(statsRef);
  const ctaInView = useInView(ctaRef);

  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0C0C0F", color: "#F5F0E8", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .glow-orb {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: left 0.8s ease, top 0.8s ease;
          z-index: 0;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,107,53,0.12);
          border: 1px solid rgba(255,107,53,0.3);
          color: #FF6B35;
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation: fadeSlideUp 0.6s ease both;
        }

        .pulse-dot {
          width: 8px; height: 8px;
          background: #FF6B35;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 6.5rem);
          line-height: 1.08;
          font-weight: 700;
          animation: fadeSlideUp 0.7s 0.1s ease both;
        }

        .hero-title .accent {
          color: #FF6B35;
          font-style: italic;
        }

        .hero-sub {
          font-size: clamp(1rem, 1.8vw, 1.2rem);
          color: rgba(245,240,232,0.6);
          max-width: 580px;
          line-height: 1.7;
          font-weight: 300;
          animation: fadeSlideUp 0.7s 0.2s ease both;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          animation: fadeSlideUp 0.7s 0.3s ease both;
        }

        .btn-primary {
          background: #FF6B35;
          color: #fff;
          border: none;
          padding: 16px 36px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 32px rgba(255,107,53,0.35);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(255,107,53,0.45); }

        .btn-ghost {
          background: transparent;
          color: #F5F0E8;
          border: 1px solid rgba(245,240,232,0.25);
          padding: 16px 36px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(245,240,232,0.6); background: rgba(245,240,232,0.05); }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FF6B35;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 700;
          line-height: 1.15;
        }

        .feature-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 36px 30px;
          cursor: default;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, background 0.3s;
          overflow: hidden;
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: rgba(255,107,53,0.35);
          background: rgba(255,107,53,0.05);
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,107,53,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 20px;
        }
        .feature-card:hover::before { opacity: 1; }

        .feature-number {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: rgba(255,107,53,0.5);
          margin-bottom: 20px;
        }

        .feature-icon {
          font-size: 2.4rem;
          margin-bottom: 16px;
          display: block;
          transition: transform 0.3s;
        }
        .feature-card:hover .feature-icon { transform: scale(1.15) rotate(-5deg); }

        .feature-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #F5F0E8;
        }

        .feature-desc {
          font-size: 0.875rem;
          color: rgba(245,240,232,0.55);
          line-height: 1.65;
          font-weight: 300;
        }

        .stat-card {
          text-align: center;
          padding: 40px 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .stat-card:hover {
          border-color: rgba(255,107,53,0.3);
          transform: translateY(-4px);
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: #FF6B35;
          display: block;
          line-height: 1;
          margin-bottom: 12px;
        }

        .stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.45);
        }

        .divider-line {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #FF6B35, #FF9500);
          border-radius: 2px;
          margin: 20px 0 32px;
        }

        .cta-section {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,149,0,0.06) 100%);
          border: 1px solid rgba(255,107,53,0.2);
          border-radius: 32px;
          padding: clamp(60px, 8vw, 100px) clamp(32px, 6vw, 80px);
          text-align: center;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-section::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -100px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(255,149,0,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .cityscape {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          opacity: 0.04;
          pointer-events: none;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-up:nth-child(2) { transition-delay: 0.1s; }
        .fade-up:nth-child(3) { transition-delay: 0.2s; }
        .fade-up:nth-child(4) { transition-delay: 0.3s; }
        .fade-up:nth-child(5) { transition-delay: 0.4s; }
        .fade-up:nth-child(6) { transition-delay: 0.5s; }

        .scroll-indicator {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        .tag-row {
          display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;
        }
        .tag {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(245,240,232,0.6);
        }

        .grid-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .grid-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 20px;
        }

        .hero-visual {
          position: relative;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
        }

        .floating-card {
          background: rgba(20,20,28,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 16px 20px;
          font-size: 13px;
          position: absolute;
          animation: floatCard 4s ease-in-out infinite;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .floating-card.card-1 {
          top: 12%; left: -12%;
          animation-delay: 0s;
        }
        .floating-card.card-2 {
          bottom: 18%; right: -10%;
          animation-delay: 2s;
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .map-blob {
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,149,0,0.08) 50%, rgba(255,107,53,0.05) 100%);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          border: 1px solid rgba(255,107,53,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          animation: morph 8s ease-in-out infinite;
        }
        @keyframes morph {
          0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          33% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          66% { border-radius: 40% 60% 60% 40% / 70% 50% 50% 30%; }
        }

        @media (max-width: 768px) {
          .hero-layout { flex-direction: column !important; }
          .hero-visual { max-width: 300px; }
          .floating-card { display: none; }
        }
      `}</style>

      {/* Cursor glow */}
      <div
        className="glow-orb"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px clamp(24px, 6vw, 100px) 80px" }}>
        {/* bg grid */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,107,53,0.08) 0%, transparent 70%)" }} />

        <div className="hero-layout" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 64 }}>
          {/* Left */}
          <div style={{ flex: "1 1 480px" }}>
            <div className="hero-badge">
              <div className="pulse-dot" />
              Now in Hyderabad
            </div>
            <h1 className="hero-title" style={{ marginTop: 28, marginBottom: 24 }}>
              Find Your<br />
              Perfect <span className="accent">Home</span><br />
              in Hyderabad
            </h1>
            <p className="hero-sub" style={{ marginBottom: 36 }}>
              RooMoo connects tenants with verified landlords — making the search for rooms, flats, and houses simple, transparent, and human.
            </p>
            <div className="hero-cta">
              <button className="btn-primary">Explore Listings →</button>
              <button className="btn-ghost">List a Property</button>
            </div>
            <div className="tag-row">
              {["Rooms", "Flats", "Houses", "PG", "Co-living"].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="hero-visual" style={{ flex: "0 0 420px" }}>
            <div className="map-blob">🏙️</div>
            <div className="floating-card card-1">
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4 }}>NEW LISTING</div>
              <div style={{ fontWeight: 700, color: "#F5F0E8" }}>2BHK in Banjara Hills</div>
              <div style={{ color: "#FF6B35", fontWeight: 600, marginTop: 4 }}>₹18,000/mo</div>
            </div>
            <div className="floating-card card-2">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: "rgba(255,107,53,0.2)", borderRadius: 8, padding: 8, fontSize: "1.2rem" }}>✅</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#F5F0E8", fontSize: 13 }}>Verified Property</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>Inspected & approved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator" style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.3)", fontSize: 13, letterSpacing: "0.1em", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em" }}>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ padding: "80px clamp(24px, 6vw, 100px)", maxWidth: 1280, margin: "0 auto" }}>
        <div className="grid-stats">
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="stat-value">
                {statsInView ? <AnimatedCounter target={s.value} /> : "—"}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: "80px clamp(24px, 6vw, 100px)", maxWidth: 1280, margin: "0 auto", display: "flex", gap: 80, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 380px" }}>
          <div className="section-label">Our Mission</div>
          <div className="divider-line" />
          <h2 className="section-title">
            Where Comfort<br />Meets <span style={{ color: "#FF6B35", fontStyle: "italic" }}>Convenience</span>
          </h2>
        </div>
        <div style={{ flex: "2 1 420px" }}>
          <p style={{ fontSize: "1.1rem", color: "rgba(245,240,232,0.7)", lineHeight: 1.8, marginBottom: 24, fontWeight: 300 }}>
            At RooMoo, we believe finding a home should feel as natural as living in one. We've built a platform that cuts through the noise — no fake listings, no surprise costs, no wasted weekends.
          </p>
          <p style={{ fontSize: "1rem", color: "rgba(245,240,232,0.5)", lineHeight: 1.8, fontWeight: 300 }}>
            Whether you're a student arriving in Hyderabad for the first time, a professional relocating for work, or a family looking for a forever home — RooMoo is built for you.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[["Students", "Affordable PGs & rooms"], ["Professionals", "Ready-to-move flats"], ["Families", "Spacious homes"]].map(([t, d]) => (
              <div key={t}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#FF6B35", marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.45)" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} style={{ padding: "80px clamp(24px, 6vw, 100px)", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="section-label">Why RooMoo</div>
          <div className="divider-line" style={{ margin: "16px auto 0" }} />
          <h2 className="section-title" style={{ marginTop: 16 }}>Everything You Need<br />to Find Home</h2>
        </div>
        <div className="grid-features">
          {features.map((f, i) => (
            <div
              key={i}
              className={`feature-card fade-up ${featuresInView ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="feature-number">{f.number}</div>
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${f.color}, transparent)`,
                borderRadius: "0 0 20px 20px",
                opacity: hoveredFeature === i ? 1 : 0,
                transition: "opacity 0.3s"
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} style={{ padding: "80px clamp(24px, 6vw, 100px)", maxWidth: 1280, margin: "0 auto" }}>
        <div className={`cta-section fade-up ${ctaInView ? "visible" : ""}`}>
          <div className="section-label" style={{ marginBottom: 12 }}>Get Started Today</div>
          <h2 className="section-title" style={{ marginBottom: 20 }}>
            Your Next Home is<br />
            <span style={{ color: "#FF6B35", fontStyle: "italic" }}>One Click Away</span>
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(245,240,232,0.55)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 300 }}>
            Join thousands of happy tenants who found their perfect space through RooMoo. Verified, transparent, and truly local.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "18px 44px" }}>Browse Listings →</button>
            <button className="btn-ghost" style={{ fontSize: 16, padding: "18px 44px" }}>List Your Property</button>
          </div>
          <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
            {["No brokerage", "Verified listings", "24/7 support"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(245,240,232,0.5)", fontSize: 13 }}>
                <span style={{ color: "#FF6B35", fontWeight: 800 }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div style={{ textAlign: "center", padding: "40px 24px 60px", color: "rgba(245,240,232,0.25)", fontSize: 13 }}>
        RooMoo — Where Comfort Meets Convenience in Hyderabad
      </div>
    </div>
  );
}