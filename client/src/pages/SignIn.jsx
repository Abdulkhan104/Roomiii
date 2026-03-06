import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const { loading, error } = useSelector((s) => s.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(signInFailure(data.message)); return; }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "#0B0B0E", display: "flex", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #F05A28;
          --orange-dim: rgba(240,90,40,0.12);
          --surface: #141418;
          --surface-2: #1C1C22;
          --border: rgba(255,255,255,0.08);
          --text: #F2EFE9;
          --muted: rgba(242,239,233,0.42);
        }

        /* ── Background decorations ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .bg-glow-tr {
          position: fixed; top: -220px; right: -220px; z-index: 0;
          width: 650px; height: 650px; border-radius: 50%;
          background: radial-gradient(circle, rgba(240,90,40,0.1) 0%, transparent 68%);
          pointer-events: none;
        }
        .bg-glow-bl {
          position: fixed; bottom: -180px; left: -180px; z-index: 0;
          width: 520px; height: 520px; border-radius: 50%;
          background: radial-gradient(circle, rgba(240,90,40,0.06) 0%, transparent 68%);
          pointer-events: none;
        }

        /* ── Split layout ── */
        .split-wrap {
          position: relative; z-index: 1;
          display: flex; width: 100%; min-height: 100vh;
        }

        /* ── Left decorative panel ── */
        .left-panel {
          flex: 0 0 48%;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: none;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(40px, 5vw, 72px);
          position: relative; overflow: hidden;
        }
        @media (min-width: 960px) { .left-panel { display: flex; } }

        .left-panel::before {
          content: '';
          position: absolute; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(240,90,40,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .brand-logo {
          font-family: 'Fraunces', serif;
          font-size: 2rem; font-weight: 700; color: var(--orange);
          letter-spacing: -0.03em;
        }
        .brand-logo span { color: var(--text); font-style: italic; }

        .left-headline {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.2rem, 4vw, 3.6rem);
          font-weight: 700; line-height: 1.08;
          color: var(--text); letter-spacing: -0.025em;
        }
        .left-headline em { font-style: italic; color: var(--orange); }

        .left-sub {
          font-size: 0.92rem; color: var(--muted);
          line-height: 1.7; max-width: 360px; margin-top: 16px;
        }

        /* Floating property cards */
        .prop-card {
          background: rgba(28,28,34,0.95);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 16px 20px;
          backdrop-filter: blur(12px);
          animation: floatUp 5s ease-in-out infinite;
        }
        .prop-card:nth-child(2) { animation-delay: 2.5s; }
        .prop-card-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--muted); margin-bottom: 6px;
        }
        .prop-card-val {
          font-weight: 700; font-size: 0.95rem; color: var(--text);
        }
        .prop-card-price { color: var(--orange); font-weight: 700; font-size: 0.88rem; margin-top: 4px; }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        /* Stats row */
        .stats-row { display: flex; gap: 28px; }
        .stat-item {}
        .stat-val {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem; font-weight: 700; color: var(--text); line-height: 1;
        }
        .stat-lbl {
          font-size: 0.75rem; color: var(--muted); margin-top: 3px;
          font-weight: 500; letter-spacing: 0.06em;
        }

        /* ── Right auth panel ── */
        .right-panel {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(24px, 5vw, 60px) clamp(16px, 4vw, 48px);
        }

        .auth-card {
          width: 100%; max-width: 440px;
          animation: cardIn 0.5s cubic-bezier(0.34,1.15,0.64,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }

        /* Card header */
        .auth-header { margin-bottom: 36px; }
        .auth-eyebrow {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--orange); margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        .auth-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 700; color: var(--text);
          line-height: 1.1; letter-spacing: -0.025em;
        }
        .auth-title em { font-style: italic; color: var(--orange); }
        .auth-sub {
          font-size: 0.88rem; color: var(--muted);
          margin-top: 8px; line-height: 1.55;
        }

        /* Fields */
        .field-group { margin-bottom: 18px; }
        .field-label {
          display: block;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 8px;
        }
        .field-wrap { position: relative; }
        .field-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); font-size: 1rem;
          color: var(--muted); pointer-events: none;
          transition: color 0.2s;
        }
        .field-wrap.focused .field-icon { color: var(--orange); }
        .field-action {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 0.85rem;
          transition: color 0.2s; padding: 4px;
        }
        .field-action:hover { color: var(--text); }
        .field-input {
          width: 100%;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 14px 18px 14px 46px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem; color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .field-input::placeholder { color: rgba(242,239,233,0.18); }
        .field-input:focus {
          border-color: rgba(240,90,40,0.45);
          box-shadow: 0 0 0 3px rgba(240,90,40,0.1);
          background: #18181f;
        }
        .field-input.pad-right { padding-right: 46px; }

        /* Error alert */
        .alert-error {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(248,113,113,0.09);
          border: 1px solid rgba(248,113,113,0.22);
          border-radius: 12px; padding: 12px 16px;
          font-size: 0.82rem; font-weight: 500; color: #FCA5A5;
          margin-bottom: 18px;
          animation: alertIn 0.3s ease;
        }
        @keyframes alertIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

        /* Submit btn */
        .btn-submit {
          width: 100%; padding: 15px;
          background: var(--orange); border: none; border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 700;
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 8px 24px rgba(240,90,40,0.3);
          letter-spacing: 0.02em; margin-top: 4px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(240,90,40,0.42);
        }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .spinner {
          width: 17px; height: 17px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(242,239,233,0.18);
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        /* Footer links */
        .auth-footer {
          display: flex; justify-content: space-between;
          align-items: center; margin-top: 22px;
          font-size: 0.8rem; flex-wrap: wrap; gap: 8px;
        }
        .footer-text { color: var(--muted); }
        .footer-link {
          color: var(--orange); text-decoration: none; font-weight: 600;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #ff8055; }
        .footer-link.dim {
          color: var(--muted); font-weight: 500;
        }
        .footer-link.dim:hover { color: var(--text); }

        /* Mobile brand */
        .mobile-brand {
          font-family: 'Fraunces', serif;
          font-size: 1.6rem; font-weight: 700;
          color: var(--orange); letter-spacing: -0.03em;
          margin-bottom: 28px; display: block;
        }
        .mobile-brand span { color: var(--text); font-style: italic; }
        @media (min-width: 960px) { .mobile-brand { display: none; } }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow-tr" />
      <div className="bg-glow-bl" />

      <div className="split-wrap">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <div className="brand-logo">Roo<span>Moo</span></div>

          <div>
            <h1 className="left-headline">
              Find your next<br />
              <em>home</em> in<br />
              Hyderabad
            </h1>
            <p className="left-sub">
              Thousands of verified rooms, flats, and houses — all in one place. Sign in and start exploring today.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
              <div className="prop-card" style={{ flex: "0 0 auto" }}>
                <div className="prop-card-label">New listing</div>
                <div className="prop-card-val">2BHK · Banjara Hills</div>
                <div className="prop-card-price">₹18,000 / month</div>
              </div>
              <div className="prop-card" style={{ flex: "0 0 auto", marginTop: 20 }}>
                <div className="prop-card-label">Just booked</div>
                <div className="prop-card-val">Studio · Madhapur</div>
                <div className="prop-card-price">₹9,500 / month</div>
              </div>
            </div>
          </div>

          <div className="stats-row">
            {[["5K+", "Active Listings"], ["12K+", "Happy Tenants"], ["98%", "Verified"]].map(([v, l]) => (
              <div key={l} className="stat-item">
                <div className="stat-val">{v}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <div className="auth-card">
            <span className="mobile-brand">Roo<span>Moo</span></span>

            <div className="auth-header">
              <div className="auth-eyebrow">
                <div className="eyebrow-dot" />
                Welcome back
              </div>
              <h1 className="auth-title">
                Sign in to<br /><em>RooMoo</em>
              </h1>
              <p className="auth-sub">Your perfect home is waiting. Let's find it.</p>
            </div>

            {error && (
              <div className="alert-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="field-group">
                <label className="field-label" htmlFor="email">Email Address</label>
                <div className={`field-wrap ${focused === "email" ? "focused" : ""}`}>
                  <span className="field-icon">✉</span>
                  <input
                    className="field-input"
                    type="email"
                    id="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label" htmlFor="password">Password</label>
                <div className={`field-wrap ${focused === "password" ? "focused" : ""}`}>
                  <span className="field-icon">🔒</span>
                  <input
                    className="field-input pad-right"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="field-action"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div style={{ textAlign: "right", marginBottom: 20, marginTop: -6 }}>
                <Link to="/forgot-password" className="footer-link" style={{ fontSize: "0.8rem" }}>
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading
                  ? <><div className="spinner" /> Signing in…</>
                  : <>Sign In <span>→</span></>
                }
              </button>
            </form>

            <div className="divider">or continue with</div>
            <OAuth />

            <div className="auth-footer">
              <span className="footer-text">
                New to RooMoo?{" "}
                <Link to="/sign-up" className="footer-link">Create account</Link>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}