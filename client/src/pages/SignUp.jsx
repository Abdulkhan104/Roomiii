import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase",     pass: /[A-Z]/.test(password) },
    { label: "Number",        pass: /[0-9]/.test(password) },
    { label: "Symbol",        pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["#F87171", "#FB923C", "#FACC15", "#4ADE80"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: i < score ? colors[score - 1] : "rgba(255,255,255,0.08)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {checks.map(c => (
            <span key={c.label} style={{
              fontSize: "10px", fontWeight: 600,
              color: c.pass ? "#4ADE80" : "rgba(242,239,233,0.25)",
              display: "flex", alignItems: "center", gap: 3,
              transition: "color 0.2s",
            }}>
              <span>{c.pass ? "✓" : "○"}</span>{c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span style={{ fontSize: "10px", fontWeight: 800, color: colors[score - 1], letterSpacing: "0.08em" }}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SignUp() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError("Please accept the terms to continue."); return; }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { setLoading(false); setError(data.message); return; }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const perks = [
    { icon: "🏠", text: "Access thousands of verified listings" },
    { icon: "⚡", text: "Book properties instantly" },
    { icon: "🔒", text: "Secure & transparent transactions" },
  ];

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

        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .bg-glow-tl { position:fixed; top:-200px; left:-200px; z-index:0; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(240,90,40,0.09) 0%,transparent 68%); pointer-events:none; }
        .bg-glow-br { position:fixed; bottom:-180px; right:-180px; z-index:0; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(240,90,40,0.06) 0%,transparent 68%); pointer-events:none; }

        .split-wrap { position:relative; z-index:1; display:flex; width:100%; min-height:100vh; }

        /* ── Left panel ── */
        .left-panel {
          flex: 0 0 46%; background: var(--surface);
          border-right: 1px solid var(--border);
          display: none; flex-direction: column;
          justify-content: space-between;
          padding: clamp(40px,5vw,72px);
          position: relative; overflow: hidden;
        }
        @media (min-width: 980px) { .left-panel { display: flex; } }
        .left-panel::after {
          content:''; position:absolute; bottom:-120px; right:-120px;
          width:400px; height:400px; border-radius:50%;
          background:radial-gradient(circle,rgba(240,90,40,0.08) 0%,transparent 70%);
          pointer-events:none;
        }

        .brand-logo { font-family:'Fraunces',serif; font-size:2rem; font-weight:700; color:var(--orange); letter-spacing:-0.03em; }
        .brand-logo em { color:var(--text); font-style:italic; }

        .left-headline { font-family:'Fraunces',serif; font-size:clamp(2rem,3.8vw,3.4rem); font-weight:700; line-height:1.08; color:var(--text); letter-spacing:-0.025em; }
        .left-headline em { font-style:italic; color:var(--orange); }
        .left-sub { font-size:0.9rem; color:var(--muted); line-height:1.7; max-width:340px; margin-top:14px; }

        .perk-list { display:flex; flex-direction:column; gap:14px; margin-top:8px; }
        .perk-item { display:flex; align-items:center; gap:14px; }
        .perk-icon { width:38px; height:38px; border-radius:12px; background:var(--orange-dim); border:1px solid rgba(240,90,40,0.2); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
        .perk-text { font-size:0.88rem; color:rgba(242,239,233,0.7); font-weight:500; }

        /* Testimonial card */
        .testimonial {
          background:rgba(28,28,34,0.9); border:1px solid var(--border);
          border-radius:18px; padding:20px 22px;
          animation: floatCard 5s ease-in-out infinite;
        }
        @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .test-text { font-size:0.85rem; color:rgba(242,239,233,0.65); line-height:1.6; font-style:italic; margin-bottom:12px; }
        .test-author { display:flex; align-items:center; gap:10px; }
        .test-avatar { width:32px; height:32px; border-radius:10px; background:var(--orange-dim); border:1px solid rgba(240,90,40,0.25); display:flex; align-items:center; justify-content:center; font-size:0.9rem; }
        .test-name { font-size:0.82rem; font-weight:700; color:var(--text); }
        .test-role { font-size:0.72rem; color:var(--muted); }

        /* ── Right panel ── */
        .right-panel { flex:1; display:flex; align-items:center; justify-content:center; padding:clamp(24px,5vw,56px) clamp(16px,4vw,44px); }
        .auth-card { width:100%; max-width:440px; animation:cardIn 0.5s cubic-bezier(0.34,1.15,0.64,1) both; }
        @keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .mobile-brand { font-family:'Fraunces',serif; font-size:1.6rem; font-weight:700; color:var(--orange); letter-spacing:-0.03em; margin-bottom:24px; display:block; }
        .mobile-brand em { color:var(--text); font-style:italic; }
        @media (min-width:980px) { .mobile-brand { display:none; } }

        .auth-eyebrow { font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--orange); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
        .eyebrow-dot { width:6px; height:6px; border-radius:50%; background:var(--orange); animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        .auth-title { font-family:'Fraunces',serif; font-size:clamp(1.9rem,4vw,2.7rem); font-weight:700; color:var(--text); line-height:1.1; letter-spacing:-0.025em; }
        .auth-title em { font-style:italic; color:var(--orange); }
        .auth-sub { font-size:0.87rem; color:var(--muted); margin-top:8px; line-height:1.55; margin-bottom:28px; }

        .field-group { margin-bottom:16px; }
        .field-label { display:block; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); margin-bottom:7px; }
        .field-wrap { position:relative; }
        .field-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:1rem; color:var(--muted); pointer-events:none; transition:color 0.2s; }
        .field-wrap.focused .field-icon { color:var(--orange); }
        .field-action { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--muted); font-size:0.85rem; transition:color 0.2s; padding:4px; }
        .field-action:hover { color:var(--text); }
        .field-input { width:100%; background:var(--surface); border:1.5px solid var(--border); border-radius:14px; padding:13px 18px 13px 46px; font-family:'Outfit',sans-serif; font-size:0.9rem; color:var(--text); outline:none; transition:border-color 0.2s,box-shadow 0.2s,background 0.2s; }
        .field-input::placeholder { color:rgba(242,239,233,0.18); }
        .field-input:focus { border-color:rgba(240,90,40,0.45); box-shadow:0 0 0 3px rgba(240,90,40,0.1); background:#18181f; }
        .field-input.pad-r { padding-right:46px; }

        .alert-error { display:flex; align-items:flex-start; gap:10px; background:rgba(248,113,113,0.09); border:1px solid rgba(248,113,113,0.22); border-radius:12px; padding:12px 16px; font-size:0.82rem; font-weight:500; color:#FCA5A5; margin-bottom:16px; animation:alertIn 0.3s ease; }
        @keyframes alertIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

        /* Terms checkbox */
        .terms-row { display:flex; align-items:flex-start; gap:12px; margin:16px 0 20px; cursor:pointer; }
        .custom-check { width:20px; height:20px; border-radius:7px; border:1.5px solid var(--border); background:var(--surface); flex-shrink:0; display:flex; align-items:center; justify-content:center; margin-top:1px; transition:border-color 0.2s,background 0.2s; }
        .custom-check.checked { background:var(--orange); border-color:var(--orange); }
        .terms-text { font-size:0.8rem; color:var(--muted); line-height:1.55; }
        .terms-link { color:var(--orange); text-decoration:none; font-weight:600; }
        .terms-link:hover { color:#ff8055; }

        .btn-submit { width:100%; padding:15px; background:var(--orange); border:none; border-radius:14px; font-family:'Outfit',sans-serif; font-size:0.95rem; font-weight:700; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:transform 0.2s,box-shadow 0.2s,opacity 0.2s; box-shadow:0 8px 24px rgba(240,90,40,0.3); }
        .btn-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 16px 40px rgba(240,90,40,0.42); }
        .btn-submit:disabled { opacity:0.45; cursor:not-allowed; transform:none; box-shadow:none; }

        .spinner { width:17px; height:17px; border:2.5px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .divider { display:flex; align-items:center; gap:12px; margin:20px 0; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:rgba(242,239,233,0.18); }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:var(--border); }

        .auth-footer { display:flex; justify-content:center; align-items:center; margin-top:20px; font-size:0.8rem; gap:6px; }
        .footer-muted { color:var(--muted); }
        .footer-link { color:var(--orange); text-decoration:none; font-weight:600; transition:color 0.2s; }
        .footer-link:hover { color:#ff8055; }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow-tl" />
      <div className="bg-glow-br" />

      <div className="split-wrap">

        {/* ── LEFT ── */}
        <div className="left-panel">
          <div className="brand-logo">Roo<em>Moo</em></div>

          <div>
            <h1 className="left-headline">
              Join <em>thousands</em><br />
              finding homes<br />
              in Hyderabad
            </h1>
            <p className="left-sub">
              Create your free account and get instant access to verified listings across the city.
            </p>
            <div className="perk-list" style={{ marginTop: 28 }}>
              {perks.map((p) => (
                <div key={p.text} className="perk-item">
                  <div className="perk-icon">{p.icon}</div>
                  <div className="perk-text">{p.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="testimonial">
            <div className="test-text">
              "Found my perfect 2BHK in Banjara Hills within a week. RooMoo made the whole process effortless!"
            </div>
            <div className="test-author">
              <div className="test-avatar">👤</div>
              <div>
                <div className="test-name">Priya Sharma</div>
                <div className="test-role">Tenant · Hyderabad</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#F05A28", fontSize: "0.85rem", fontWeight: 800 }}>★★★★★</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="right-panel">
          <div className="auth-card">
            <span className="mobile-brand">Roo<em>Moo</em></span>

            <div className="auth-eyebrow">
              <div className="eyebrow-dot" /> Create Account
            </div>
            <h1 className="auth-title">
              Start your<br /><em>home search</em>
            </h1>
            <p className="auth-sub">It's free and takes less than a minute.</p>

            {error && (
              <div className="alert-error">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="field-group">
                <label className="field-label" htmlFor="username">Full Name</label>
                <div className={`field-wrap ${focused === "username" ? "focused" : ""}`}>
                  <span className="field-icon">👤</span>
                  <input
                    className="field-input"
                    type="text"
                    id="username"
                    placeholder="Your full name"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocused("username")}
                    onBlur={() => setFocused(null)}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

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
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label" htmlFor="password">Password</label>
                <div className={`field-wrap ${focused === "password" ? "focused" : ""}`}>
                  <span className="field-icon">🔒</span>
                  <input
                    className={`field-input pad-r`}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="field-action"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
              </div>

              {/* Terms */}
              <label className="terms-row" onClick={() => setAgreed(p => !p)}>
                <div className={`custom-check ${agreed ? "checked" : ""}`}>
                  {agreed && <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 900 }}>✓</span>}
                </div>
                <span className="terms-text">
                  I agree to RooMoo's{" "}
                  <a href="#" className="terms-link" onClick={e => e.stopPropagation()}>Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="terms-link" onClick={e => e.stopPropagation()}>Privacy Policy</a>
                </span>
              </label>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading || !agreed}
              >
                {loading
                  ? <><div className="spinner" /> Creating account…</>
                  : <>Create Account <span>→</span></>
                }
              </button>
            </form>

            <div className="divider">or sign up with</div>
            <OAuth />

            <div className="auth-footer">
              <span className="footer-muted">Already have an account?</span>
              <Link to="/sign-in" className="footer-link">Sign In →</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}