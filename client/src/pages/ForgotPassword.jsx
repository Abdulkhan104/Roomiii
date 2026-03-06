import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Qauth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setStatus("sent");
      setTimeout(() => navigate("/sign-in"), 3500);
    } catch (error) {
      setErrorMsg(
        error.code === "auth/user-not-found"
          ? "No account found with this email address."
          : error.code === "auth/invalid-email"
          ? "Please enter a valid email address."
          : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "#0B0B0E", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #F05A28;
          --orange-dim: rgba(240,90,40,0.14);
          --surface: #141418;
          --surface-2: #1C1C22;
          --border: rgba(255,255,255,0.08);
          --text: #F2EFE9;
          --muted: rgba(242,239,233,0.45);
          --green: #4ADE80;
          --red: #F87171;
        }

        /* ── Background ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .bg-glow-1 {
          position: fixed; top: -200px; right: -200px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(240,90,40,0.09) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .bg-glow-2 {
          position: fixed; bottom: -150px; left: -150px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(240,90,40,0.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* ── Layout ── */
        .page-wrap {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 72px;
          width: 100%; max-width: 960px; margin: 0 auto;
        }

        /* ── Left panel ── */
        .left-panel {
          flex: 1; display: none;
        }
        @media (min-width: 900px) { .left-panel { display: flex; flex-direction: column; gap: 24px; } }

        .brand-mark {
          font-family: 'Fraunces', serif;
          font-size: 2.4rem; font-weight: 700;
          color: var(--orange); letter-spacing: -0.03em; margin-bottom: 8px;
        }
        .brand-mark span { color: var(--text); font-style: italic; }

        .left-headline {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 700; line-height: 1.1;
          color: var(--text); letter-spacing: -0.02em;
        }
        .left-headline em { font-style: italic; color: var(--orange); }

        .left-sub {
          font-size: 0.9rem; color: var(--muted);
          line-height: 1.65; max-width: 340px;
        }

        .left-steps { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
        .left-step {
          display: flex; align-items: flex-start; gap: 14px;
        }
        .left-step-num {
          width: 32px; height: 32px; border-radius: 10px;
          background: var(--orange-dim); border: 1px solid rgba(240,90,40,0.25);
          color: var(--orange); font-size: 0.75rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
          letter-spacing: 0.05em;
        }
        .left-step-title {
          font-weight: 600; font-size: 0.88rem; color: var(--text); margin-bottom: 2px;
        }
        .left-step-desc {
          font-size: 0.78rem; color: var(--muted); line-height: 1.5;
        }

        /* ── Card ── */
        .card {
          flex: 0 0 420px; width: 100%; max-width: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          animation: cardIn 0.5s cubic-bezier(0.34,1.2,0.64,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-header {
          background: linear-gradient(135deg, var(--orange) 0%, #FF8A5B 100%);
          padding: 28px 32px 24px;
          position: relative; overflow: hidden;
        }
        .card-header::before {
          content: '🔑';
          position: absolute; right: 24px; top: 18px;
          font-size: 2.8rem; opacity: 0.18;
        }
        .card-header-eyebrow {
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.7); margin-bottom: 6px;
        }
        .card-header-title {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem; font-weight: 700;
          color: #fff; line-height: 1.1; letter-spacing: -0.02em;
        }
        .card-header-sub {
          font-size: 0.78rem; color: rgba(255,255,255,0.7);
          margin-top: 6px; line-height: 1.5;
        }

        .card-body { padding: 28px 32px 32px; }

        /* ── Input ── */
        .field-wrap { margin-bottom: 20px; }
        .field-label {
          display: block; font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 8px;
        }
        .field-input-wrap { position: relative; }
        .field-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); pointer-events: none; font-size: 1rem;
          transition: color 0.2s;
        }
        .field-input {
          width: 100%;
          background: var(--surface-2);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 14px 18px 14px 44px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem; color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .field-input::placeholder { color: rgba(242,239,233,0.2); }
        .field-input:focus {
          border-color: rgba(240,90,40,0.5);
          box-shadow: 0 0 0 3px rgba(240,90,40,0.1);
          background: #1e1e26;
        }
        .field-input:focus + .field-icon,
        .field-input-wrap:focus-within .field-icon { color: var(--orange); }

        /* ── Submit button ── */
        .btn-submit {
          width: 100%; padding: 15px;
          background: var(--orange);
          border: none; border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem; font-weight: 700;
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 8px 24px rgba(240,90,40,0.3);
          letter-spacing: 0.02em;
          margin-top: 4px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(240,90,40,0.42);
        }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        /* ── States ── */
        .spinner {
          width: 17px; height: 17px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 13px 16px; border-radius: 12px;
          font-size: 0.82rem; font-weight: 500;
          margin-bottom: 18px;
          animation: alertIn 0.3s ease;
          line-height: 1.5;
        }
        @keyframes alertIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .alert.error { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2); color: #FCA5A5; }

        /* ── Success state ── */
        .success-state {
          text-align: center; padding: 8px 0 12px;
          animation: fadeUp 0.4s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .success-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: rgba(74,222,128,0.12);
          border: 1px solid rgba(74,222,128,0.25);
          font-size: 1.8rem;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .success-title {
          font-family: 'Fraunces', serif;
          font-size: 1.4rem; font-weight: 700;
          color: var(--text); margin-bottom: 8px;
        }
        .success-sub {
          font-size: 0.82rem; color: var(--muted);
          line-height: 1.65; max-width: 300px; margin: 0 auto;
        }
        .success-email {
          display: inline-block;
          background: rgba(240,90,40,0.12);
          border: 1px solid rgba(240,90,40,0.2);
          color: var(--orange);
          padding: 4px 12px; border-radius: 100px;
          font-size: 0.82rem; font-weight: 600;
          margin: 10px 0 4px;
        }
        .redirect-bar-wrap {
          height: 3px; background: var(--border);
          border-radius: 3px; margin: 20px 0 0; overflow: hidden;
        }
        .redirect-bar {
          height: 100%; background: var(--orange);
          border-radius: 3px;
          animation: drain 3.5s linear forwards;
        }
        @keyframes drain { from { width: 100%; } to { width: 0%; } }

        /* ── Footer links ── */
        .card-footer {
          padding: 0 32px 28px;
          display: flex; justify-content: space-between;
          font-size: 0.8rem;
        }
        .footer-link {
          color: var(--muted); text-decoration: none;
          transition: color 0.2s; font-weight: 500;
        }
        .footer-link:hover { color: var(--text); }
        .footer-link.orange { color: var(--orange); }
        .footer-link.orange:hover { color: #ff8055; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(242,239,233,0.2);
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <div className="page-wrap">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <div>
            <div className="brand-mark">Roo<span>Moo</span></div>
            <h1 className="left-headline">
              Reset your<br /><em>password</em><br />in seconds
            </h1>
          </div>
          <p className="left-sub">
            Locked out? No worries. We'll send a secure reset link straight to your inbox.
          </p>
          <div className="left-steps">
            {[
              { n: "01", t: "Enter your email", d: "The one you used to create your RooMoo account." },
              { n: "02", t: "Check your inbox", d: "A password reset link arrives within a minute." },
              { n: "03", t: "Set a new password", d: "Click the link and choose a strong new password." },
            ].map((s) => (
              <div key={s.n} className="left-step">
                <div className="left-step-num">{s.n}</div>
                <div>
                  <div className="left-step-title">{s.t}</div>
                  <div className="left-step-desc">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARD ── */}
        <div className="card">

          <div className="card-header">
            <div className="card-header-eyebrow">Account Recovery</div>
            <div className="card-header-title">Forgot Password?</div>
            <div className="card-header-sub">We'll email you a secure link to reset it.</div>
          </div>

          <div className="card-body">
            {status === "sent" ? (
              <div className="success-state">
                <div className="success-icon">✉️</div>
                <div className="success-title">Check your inbox!</div>
                <div className="success-sub">
                  We sent a reset link to
                  <div className="success-email">{email}</div>
                  Redirecting you to sign in…
                </div>
                <div className="redirect-bar-wrap">
                  <div className="redirect-bar" />
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                {status === "error" && (
                  <div className="alert error">
                    <span>⚠️</span> {errorMsg}
                  </div>
                )}

                <div className="field-wrap">
                  <label className="field-label" htmlFor="email">Registered Email Address</label>
                  <div className="field-input-wrap">
                    <input
                      className="field-input"
                      type="email"
                      id="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                    <span className="field-icon">✉</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={status === "loading" || !email}
                >
                  {status === "loading" ? (
                    <><div className="spinner" /> Sending link…</>
                  ) : (
                    <>Send Reset Link <span>→</span></>
                  )}
                </button>

                <div className="divider">or continue with</div>
                <Qauth />
              </form>
            )}
          </div>

          <div className="card-footer">
            <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
              No account?{" "}
              <Link to="/sign-up" className="footer-link orange">Register</Link>
            </span>
            <Link to="/sign-in" className="footer-link">← Back to Sign In</Link>
          </div>
        </div>

      </div>
    </div>
  );
}