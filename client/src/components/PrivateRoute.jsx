import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser, loading } = useSelector((s) => s.user);
  const location = useLocation();
  const [showBlock, setShowBlock] = useState(false);

  // Small delay before showing the "access denied" UI — avoids flash on fast loads
  useEffect(() => {
    if (!currentUser && !loading) {
      const t = setTimeout(() => setShowBlock(true), 180);
      return () => clearTimeout(t);
    }
  }, [currentUser, loading]);

  // Still hydrating Redux / checking auth
  if (loading) return <LoadingScreen />;

  // Authenticated — render the protected page
  if (currentUser) return <Outlet />;

  // Not authenticated — show brief block screen then redirect
  if (!showBlock) return null;
  return <BlockScreen from={location.pathname} />;
}

/* ─────────────────────────────────────────
   Loading screen (Redux hydrating)
───────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={styles.shell}>
      <style>{css}</style>
      <div style={styles.card}>
        <div className="pr-logo">Roo<em>Moo</em></div>
        <div className="pr-spinner-wrap">
          <div className="pr-spinner" />
          <div className="pr-spinner-ring" />
        </div>
        <p className="pr-loading-text">Checking your session…</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Block / redirect screen
───────────────────────────────────────── */
function BlockScreen({ from }) {
  const [countdown, setCountdown] = useState(3);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (countdown <= 0) { setRedirecting(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  if (redirecting) {
    return <Navigate to="/sign-in" state={{ from }} replace />;
  }

  return (
    <div style={styles.shell}>
      <style>{css}</style>

      {/* Background elements */}
      <div className="pr-bg-grid" />
      <div className="pr-bg-glow" />

      <div className="pr-block-card">
        {/* Lock icon */}
        <div className="pr-lock-ring">
          <div className="pr-lock-icon">🔒</div>
        </div>

        {/* Eyebrow */}
        <div className="pr-eyebrow">
          <div className="pr-eyebrow-dot" />
          Protected Page
        </div>

        {/* Heading */}
        <h1 className="pr-title">
          Sign in to<br /><em>continue</em>
        </h1>
        <p className="pr-sub">
          This page requires you to be signed in.<br />
          You'll be redirected to sign in shortly.
        </p>

        {/* Countdown ring */}
        <div className="pr-countdown-wrap">
          <svg className="pr-countdown-svg" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" className="pr-ring-bg" />
            <circle
              cx="22" cy="22" r="18"
              className="pr-ring-fill"
              style={{
                strokeDashoffset: `${113 - (113 * (3 - countdown)) / 3}`,
              }}
            />
          </svg>
          <span className="pr-countdown-num">{countdown}</span>
        </div>
        <p className="pr-redirect-hint">Redirecting in {countdown}s…</p>

        {/* CTA */}
        <div className="pr-actions">
          <Navigate to="/sign-in" state={{ from }} replace>
            {/* Rendered as anchor for UX, actual redirect handled above */}
          </Navigate>
          <a href="/sign-in" className="pr-btn-primary">
            Sign In Now →
          </a>
          <a href="/" className="pr-btn-ghost">
            ← Back to Home
          </a>
        </div>

        {/* What you're missing */}
        <div className="pr-perks">
          {[
            { icon: "🏠", text: "Browse verified listings" },
            { icon: "💬", text: "Contact landlords directly" },
            { icon: "❤️",  text: "Save your favourite homes"  },
          ].map(p => (
            <div key={p.text} className="pr-perk">
              <span className="pr-perk-icon">{p.icon}</span>
              <span className="pr-perk-text">{p.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Styles
───────────────────────────────────────── */
const styles = {
  shell: {
    fontFamily: "'Outfit', sans-serif",
    minHeight: "100vh",
    background: "#0B0B0E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --or: #F05A28;
    --or-dim: rgba(240,90,40,0.12);
    --sur: #141418;
    --bor: rgba(255,255,255,0.08);
    --tx: #F2EFE9;
    --mu: rgba(242,239,233,0.42);
  }

  /* ── Background ── */
  .pr-bg-grid {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
    background-size: 56px 56px;
  }
  .pr-bg-glow {
    position: fixed; top: -180px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 700px; border-radius: 50%; z-index: 0; pointer-events: none;
    background: radial-gradient(circle, rgba(240,90,40,0.08) 0%, transparent 65%);
  }

  /* ── Logo ── */
  .pr-logo {
    font-family: 'Fraunces', serif;
    font-size: 1.8rem; font-weight: 700;
    color: rgba(242,239,233,0.6); letter-spacing: -0.03em;
  }
  .pr-logo em { color: var(--or); font-style: italic; }

  /* ── Loading spinner ── */
  .pr-spinner-wrap { position: relative; width: 56px; height: 56px; }
  .pr-spinner {
    width: 56px; height: 56px; border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.06);
    border-top-color: var(--or);
    animation: pr-spin 0.9s linear infinite;
  }
  .pr-spinner-ring {
    position: absolute; inset: 6px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.04);
    border-bottom-color: rgba(240,90,40,0.4);
    animation: pr-spin 1.4s linear infinite reverse;
  }
  @keyframes pr-spin { to { transform: rotate(360deg); } }
  .pr-loading-text {
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem; font-weight: 500;
    color: var(--mu); letter-spacing: 0.06em;
    animation: pr-pulse 1.8s ease-in-out infinite;
  }
  @keyframes pr-pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  /* ── Block card ── */
  .pr-block-card {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
    padding: clamp(32px,6vw,52px) clamp(24px,5vw,48px);
    max-width: 460px; width: 100%;
    background: rgba(20,20,24,0.7);
    border: 1px solid var(--bor);
    border-radius: 28px;
    backdrop-filter: blur(20px);
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    animation: pr-card-in 0.5s cubic-bezier(0.34,1.15,0.64,1) both;
  }
  @keyframes pr-card-in {
    from { opacity:0; transform: translateY(28px) scale(0.96); }
    to   { opacity:1; transform: translateY(0)   scale(1);    }
  }

  /* Lock icon */
  .pr-lock-ring {
    width: 72px; height: 72px; border-radius: 22px;
    background: var(--or-dim);
    border: 1.5px solid rgba(240,90,40,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; margin-bottom: 20px;
    animation: pr-lock-in 0.6s cubic-bezier(0.34,1.5,0.64,1) 0.1s both;
    box-shadow: 0 8px 32px rgba(240,90,40,0.15);
  }
  @keyframes pr-lock-in {
    from { transform: scale(0) rotate(-20deg); opacity: 0; }
    to   { transform: scale(1) rotate(0deg);  opacity: 1; }
  }
  .pr-lock-icon { line-height: 1; }

  /* Eyebrow */
  .pr-eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--or);
    display: flex; align-items: center; gap: 7px;
    margin-bottom: 10px;
  }
  .pr-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--or); animation: pr-blink 2s infinite;
  }
  @keyframes pr-blink { 0%,100%{opacity:1} 50%{opacity:.35} }

  /* Title */
  .pr-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(2rem,5vw,2.8rem); font-weight: 700;
    color: var(--tx); line-height: 1.1; letter-spacing: -0.025em;
    margin-bottom: 12px;
  }
  .pr-title em { font-style: italic; color: var(--or); }

  /* Sub */
  .pr-sub {
    font-size: 0.86rem; color: var(--mu);
    line-height: 1.65; max-width: 320px; margin-bottom: 28px;
  }

  /* Countdown ring */
  .pr-countdown-wrap {
    position: relative; width: 64px; height: 64px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
  }
  .pr-countdown-svg {
    position: absolute; inset: 0; width: 100%; height: 100%;
    transform: rotate(-90deg);
  }
  .pr-ring-bg {
    fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 3;
  }
  .pr-ring-fill {
    fill: none; stroke: var(--or); stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 113;
    transition: stroke-dashoffset 0.9s linear;
  }
  .pr-countdown-num {
    font-family: 'Fraunces', serif;
    font-size: 1.6rem; font-weight: 700; color: var(--tx);
    position: relative; z-index: 1;
  }
  .pr-redirect-hint {
    font-size: 0.75rem; color: var(--mu); font-weight: 500;
    margin-bottom: 24px; letter-spacing: 0.04em;
  }

  /* Action buttons */
  .pr-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 24px; }
  .pr-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 14px;
    background: var(--or); border: none; border-radius: 14px;
    font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700;
    color: #fff; text-decoration: none; cursor: pointer;
    box-shadow: 0 8px 28px rgba(240,90,40,0.32);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .pr-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(240,90,40,0.45); }

  .pr-btn-ghost {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 13px;
    background: transparent; border: 1.5px solid var(--bor); border-radius: 14px;
    font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600;
    color: var(--mu); text-decoration: none;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .pr-btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: var(--tx); background: rgba(255,255,255,0.03); }

  /* Perks */
  .pr-perks {
    display: flex; flex-direction: column; gap: 10px; width: 100%;
    border-top: 1px solid var(--bor); padding-top: 20px;
  }
  .pr-perk {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--bor); border-radius: 12px;
    text-align: left;
  }
  .pr-perk-icon { font-size: 1.1rem; flex-shrink: 0; }
  .pr-perk-text { font-size: 0.82rem; color: var(--mu); font-weight: 500; }
`;