import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { to: "/",         label: "Home"        },
  { to: "/search",   label: "Browse Rooms" },
  { to: "/about",    label: "About Us"    },
  { to: "/connect",  label: "Contact"     },
  { to: "/faq",      label: "FAQ"         },
];

const LEGAL_LINKS = [
  { to: "/terms",      label: "Terms of Service"      },
  { to: "/privacy",    label: "Privacy Policy"        },
  { to: "/guidelines", label: "Renting Guidelines"    },
  { to: "/community",  label: "Community Guidelines"  },
];

const SOCIALS = [
  {
    href: "https://youtube.com/@roomoo",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:18, height:18 }}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    href: "https://instagram.com/roomoo",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:18, height:18 }}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    href: "mailto:officialroomoo@gmail.com",
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:18, height:18 }}>
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
  },
  {
    href: "tel:800045641298",
    label: "Phone",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:18, height:18 }}>
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    ),
  },
];

const STATS = [
  { value: "5,000+", label: "Active Listings" },
  { value: "12K+",   label: "Happy Tenants"   },
  { value: "98%",    label: "Verified Homes"  },
  { value: "4.9★",   label: "Avg. Rating"     },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer style={{ fontFamily: "'Outfit', sans-serif", background: "#0A0A0D", color: "#F2EFE9", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --or: #F05A28;
          --or-dim: rgba(240,90,40,0.12);
          --sur: #141418;
          --bor: rgba(255,255,255,0.07);
          --tx: #F2EFE9;
          --mu: rgba(242,239,233,0.42);
        }

        .ft-bg-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size: 56px 56px;
        }
        .ft-bg-glow {
          position: absolute; top: -120px; right: -120px; z-index: 0;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle,rgba(240,90,40,0.07) 0%,transparent 68%);
          pointer-events: none;
        }

        .ft-inner { position: relative; z-index: 1; max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px,5vw,60px); }

        /* ── Top CTA band ── */
        .ft-cta-band {
          border-bottom: 1px solid var(--bor);
          padding: clamp(36px,5vw,56px) 0;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 28px;
        }
        .ft-cta-left {}
        .ft-cta-eyebrow { font-size:10px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:var(--or); margin-bottom:8px; }
        .ft-cta-title { font-family:'Fraunces',serif; font-size:clamp(1.5rem,3vw,2.4rem); font-weight:700; color:var(--tx); line-height:1.1; letter-spacing:-0.02em; }
        .ft-cta-title em { font-style:italic; color:var(--or); }
        .ft-cta-sub { font-size:0.84rem; color:var(--mu); margin-top:6px; line-height:1.55; max-width:380px; }

        .ft-subscribe { display:flex; gap:8px; flex-wrap:wrap; }
        .ft-subscribe-input {
          flex:1; min-width:200px;
          background:rgba(255,255,255,0.05); border:1.5px solid var(--bor);
          border-radius:12px; padding:12px 18px;
          font-family:'Outfit',sans-serif; font-size:0.88rem; color:var(--tx);
          outline:none; transition:border-color .2s,box-shadow .2s;
        }
        .ft-subscribe-input::placeholder { color:rgba(242,239,233,0.2); }
        .ft-subscribe-input:focus { border-color:rgba(240,90,40,0.45); box-shadow:0 0 0 3px rgba(240,90,40,0.1); }
        .ft-subscribe-btn {
          padding:12px 24px; background:var(--or); border:none; border-radius:12px;
          font-family:'Outfit',sans-serif; font-size:0.88rem; font-weight:700; color:#fff;
          cursor:pointer; transition:transform .2s,box-shadow .2s; white-space:nowrap;
          box-shadow:0 6px 20px rgba(240,90,40,0.28);
        }
        .ft-subscribe-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(240,90,40,0.38); }
        .ft-subscribed { display:flex; align-items:center; gap:8px; font-size:0.84rem; color:#4ADE80; font-weight:600; padding:12px 0; }

        /* ── Stats bar ── */
        .ft-stats {
          display:grid; grid-template-columns:repeat(4,1fr);
          border-bottom:1px solid var(--bor);
          padding: 28px 0;
          gap: 0;
        }
        @media (max-width:640px) { .ft-stats { grid-template-columns:repeat(2,1fr); gap:20px; } }
        .ft-stat {
          text-align:center; padding:0 16px;
          border-right:1px solid var(--bor);
        }
        .ft-stat:last-child { border-right:none; }
        @media (max-width:640px) { .ft-stat { border-right:none; } }
        .ft-stat-val { font-family:'Fraunces',serif; font-size:clamp(1.5rem,3vw,2.2rem); font-weight:700; color:var(--or); line-height:1; }
        .ft-stat-lbl { font-size:0.72rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--mu); margin-top:4px; }

        /* ── Main columns ── */
        .ft-cols {
          display:grid;
          grid-template-columns:2fr 1fr 1fr 1fr;
          gap:40px; padding:48px 0 40px;
          border-bottom:1px solid var(--bor);
        }
        @media (max-width:900px) { .ft-cols { grid-template-columns:1fr 1fr; } }
        @media (max-width:520px) { .ft-cols { grid-template-columns:1fr; } }

        .ft-col-title { font-size:10px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:var(--mu); margin-bottom:18px; }

        /* Brand col */
        .ft-brand { font-family:'Fraunces',serif; font-size:1.9rem; font-weight:700; color:var(--or); letter-spacing:-0.03em; margin-bottom:10px; }
        .ft-brand em { color:var(--tx); font-style:italic; }
        .ft-brand-desc { font-size:0.84rem; color:var(--mu); line-height:1.7; max-width:280px; margin-bottom:20px; }

        /* Social icons */
        .ft-socials { display:flex; gap:10px; flex-wrap:wrap; }
        .ft-social {
          width:38px; height:38px; border-radius:11px;
          background:rgba(255,255,255,0.05); border:1px solid var(--bor);
          display:flex; align-items:center; justify-content:center;
          color:var(--mu); text-decoration:none;
          transition:background .2s,border-color .2s,color .2s,transform .2s;
        }
        .ft-social:hover { background:var(--or-dim); border-color:rgba(240,90,40,0.3); color:var(--or); transform:translateY(-2px); }

        /* Links */
        .ft-link {
          display:block; font-size:0.84rem; color:var(--mu);
          text-decoration:none; margin-bottom:10px;
          transition:color .18s,padding-left .18s;
        }
        .ft-link:hover { color:var(--tx); padding-left:4px; }

        /* Contact col */
        .ft-contact-item { display:flex; align-items:flex-start; gap:10px; margin-bottom:12px; }
        .ft-contact-icon { width:28px; height:28px; border-radius:8px; background:var(--or-dim); border:1px solid rgba(240,90,40,0.2); display:flex; align-items:center; justify-content:center; font-size:0.78rem; color:var(--or); flex-shrink:0; }
        .ft-contact-text { font-size:0.82rem; color:var(--mu); line-height:1.5; }
        .ft-contact-text a { color:var(--mu); text-decoration:none; transition:color .2s; }
        .ft-contact-text a:hover { color:var(--tx); }

        /* ── Bottom bar ── */
        .ft-bottom {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 0; flex-wrap:wrap; gap:12px;
        }
        .ft-copy { font-size:0.78rem; color:var(--mu); line-height:1.6; }
        .ft-copy strong { color:var(--tx); }
        .ft-bottom-links { display:flex; gap:18px; flex-wrap:wrap; }
        .ft-bottom-link { font-size:0.76rem; color:var(--mu); text-decoration:none; transition:color .2s; }
        .ft-bottom-link:hover { color:var(--tx); }

        /* Hyderabad badge */
        .ft-city-badge {
          display:inline-flex; align-items:center; gap:6px;
          background:var(--or-dim); border:1px solid rgba(240,90,40,0.2);
          border-radius:100px; padding:5px 12px;
          font-size:11px; font-weight:700; color:var(--or);
          letter-spacing:.06em; margin-top:14px;
        }
        .ft-city-dot { width:6px; height:6px; border-radius:50%; background:var(--or); animation:blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }

        /* Back to top */
        .ft-top-btn {
          width:36px; height:36px; border-radius:10px;
          background:rgba(255,255,255,0.05); border:1px solid var(--bor);
          display:flex; align-items:center; justify-content:center;
          color:var(--mu); cursor:pointer;
          transition:background .2s,border-color .2s,color .2s;
          font-size:0.9rem;
        }
        .ft-top-btn:hover { background:var(--or-dim); border-color:rgba(240,90,40,0.3); color:var(--or); }
      `}</style>

      <div className="ft-bg-grid" />
      <div className="ft-bg-glow" />

      <div className="ft-inner">

        {/* ── TOP CTA BAND ── */}
        <div className="ft-cta-band">
          <div className="ft-cta-left">
            <div className="ft-cta-eyebrow">Stay Updated</div>
            <div className="ft-cta-title">
              New listings, <em>daily</em>
            </div>
            <div className="ft-cta-sub">
              Get the freshest Hyderabad rental listings delivered straight to your inbox. No spam, ever.
            </div>
          </div>
          <div>
            {subscribed ? (
              <div className="ft-subscribed">
                <span style={{ fontSize:"1.2rem" }}>🎉</span>
                You're subscribed! Check your inbox.
              </div>
            ) : (
              <form className="ft-subscribe" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="ft-subscribe-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="ft-subscribe-btn">
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="ft-stats">
          {STATS.map(s => (
            <div key={s.label} className="ft-stat">
              <div className="ft-stat-val">{s.value}</div>
              <div className="ft-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MAIN COLUMNS ── */}
        <div className="ft-cols">

          {/* Brand col */}
          <div>
            <div className="ft-brand">Roo<em>Moo</em></div>
            <p className="ft-brand-desc">
              Hyderabad's most trusted platform for finding verified rooms, flats, and houses. Comfortable living, made simple.
            </p>
            <div className="ft-socials">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} className="ft-social" title={s.label} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="ft-city-badge">
              <div className="ft-city-dot" />
              Live in Hyderabad
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="ft-col-title">Explore</div>
            {QUICK_LINKS.map(l => (
              <Link key={l.to} to={l.to} className="ft-link">{l.label}</Link>
            ))}
          </div>

          {/* Legal links */}
          <div>
            <div className="ft-col-title">Legal</div>
            {LEGAL_LINKS.map(l => (
              <Link key={l.to} to={l.to} className="ft-link">{l.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div className="ft-col-title">Contact</div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon">📍</div>
              <div className="ft-contact-text">Kukatpally, Hyderabad,<br />Telangana, India</div>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon">✉</div>
              <div className="ft-contact-text">
                <a href="mailto:officialroomoo@gmail.com">officialroomoo@gmail.com</a>
              </div>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon">📞</div>
              <div className="ft-contact-text">
                <a href="tel:800045641298">8000-4564-1298</a>
              </div>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon">🕐</div>
              <div className="ft-contact-text">Mon – Sat, 9am to 7pm IST</div>
            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="ft-bottom">
          <div className="ft-copy">
            © 2026 <strong>RooMoo.com</strong> · Developed by <strong>Abdul Khan</strong> · All rights reserved.
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div className="ft-bottom-links">
              <Link to="/terms"   className="ft-bottom-link">Terms</Link>
              <Link to="/privacy" className="ft-bottom-link">Privacy</Link>
              <Link to="/connect" className="ft-bottom-link">Support</Link>
            </div>
            <button
              className="ft-top-btn"
              onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
              title="Back to top"
            >
              ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}