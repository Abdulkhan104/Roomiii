import { useState, useRef, useEffect } from "react";

const socialLinks = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    label: "YouTube",
    handle: "@RooMoo",
    href: "https://youtube.com/@roomoo",
    color: "#FF0000",
    bg: "rgba(255,0,0,0.08)",
    border: "rgba(255,0,0,0.2)",
    desc: "Watch property tours & tips",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    label: "Instagram",
    handle: "@roomoo",
    href: "https://instagram.com/roomoo",
    color: "#E1306C",
    bg: "rgba(225,48,108,0.08)",
    border: "rgba(225,48,108,0.2)",
    desc: "Daily listings & city life",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    ),
    label: "Phone",
    handle: "8000-4564-1298",
    href: "tel:800045641298",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
    desc: "Mon–Sat, 9am to 7pm",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    label: "Email",
    handle: "officialroomoo@gmail.com",
    href: "mailto:officialroomoo@gmail.com",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    desc: "Reply within 24 hours",
  },
];

const roles = [
  "Property Relationship Manager",
  "Frontend Developer",
  "Content Creator",
  "Customer Support",
  "Field Verification Agent",
  "Other",
];

export default function Connect() {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "", resume: null });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [fileName, setFileName] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredContact, setHoveredContact] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm(p => ({ ...p, [name]: files[0] }));
      setFileName(files[0]?.name || "");
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
    setStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.resume) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", role: "", message: "", resume: null });
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1600);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F4EF", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #F05A28;
          --orange-light: #FF8A5B;
          --dark: #1A1814;
          --sand: #F7F4EF;
          --sand-2: #EDE9E2;
          --muted: #8A8178;
          --card-bg: #FFFFFF;
        }

        .page-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(80px, 10vw, 120px) clamp(20px, 5vw, 60px);
        }

        /* Header */
        .page-header {
          margin-bottom: 72px;
          position: relative;
        }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--orange);
          margin-bottom: 20px;
        }
        .eyebrow-line {
          width: 32px; height: 2px;
          background: var(--orange); border-radius: 2px;
        }
        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 700;
          color: var(--dark);
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .page-title em {
          font-style: italic;
          color: var(--orange);
        }
        .page-subtitle {
          margin-top: 20px;
          font-size: 1.05rem;
          color: var(--muted);
          font-weight: 400;
          line-height: 1.65;
          max-width: 500px;
        }

        /* Two-column layout */
        .grid-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 820px) {
          .grid-main { grid-template-columns: 1fr; }
        }

        /* Form card */
        .form-card {
          background: var(--dark);
          border-radius: 28px;
          padding: clamp(32px, 5vw, 52px);
          position: relative;
          overflow: hidden;
        }
        .form-card::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(240,90,40,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .form-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #F7F4EF;
          margin-bottom: 8px;
        }
        .form-card-sub {
          font-size: 0.85rem;
          color: rgba(247,244,239,0.45);
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .field-group {
          margin-bottom: 20px;
          position: relative;
        }
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(247,244,239,0.5);
          margin-bottom: 8px;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #F7F4EF;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .field-input::placeholder { color: rgba(247,244,239,0.25); }
        .field-input:focus {
          border-color: var(--orange);
          background: rgba(240,90,40,0.07);
          box-shadow: 0 0 0 3px rgba(240,90,40,0.12);
        }
        .field-input option { background: #1A1814; color: #F7F4EF; }

        .row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 500px) {
          .row-2 { grid-template-columns: 1fr; }
        }

        /* File upload */
        .file-zone {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px dashed rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 24px 18px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
          position: relative;
        }
        .file-zone:hover, .file-zone.has-file {
          border-color: var(--orange);
          background: rgba(240,90,40,0.06);
        }
        .file-zone input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .file-zone-icon { font-size: 1.8rem; margin-bottom: 8px; }
        .file-zone-label {
          font-size: 0.8rem;
          color: rgba(247,244,239,0.4);
          line-height: 1.5;
        }
        .file-zone-label strong {
          color: var(--orange-light);
          display: block;
          font-size: 0.85rem;
          margin-bottom: 2px;
        }

        /* Submit btn */
        .submit-btn {
          width: 100%;
          background: var(--orange);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 17px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-top: 24px;
          letter-spacing: 0.02em;
          box-shadow: 0 8px 24px rgba(240,90,40,0.35);
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(240,90,40,0.45);
          background: #d94f22;
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .toast {
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 24px;
          display: flex; align-items: flex-start; gap: 12px;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toast.success {
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.25);
          color: #86EFAC;
        }
        .toast.error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.25);
          color: #FCA5A5;
        }

        /* Right panel */
        .right-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Contact cards */
        .contact-card {
          background: var(--card-bg);
          border: 1px solid var(--sand-2);
          border-radius: 20px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          text-decoration: none;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.25s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .contact-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 20px;
        }
        .contact-card:hover {
          transform: translateX(6px) translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .contact-card:hover::before { opacity: 1; }

        .contact-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .contact-card:hover .contact-icon-wrap {
          transform: scale(1.1) rotate(-5deg);
        }

        .contact-info { flex: 1; min-width: 0; }
        .contact-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 3px;
        }
        .contact-handle {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--dark);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .contact-desc {
          font-size: 0.75rem;
          color: var(--muted);
          margin-top: 2px;
        }

        .contact-arrow {
          color: var(--muted);
          transition: transform 0.25s, color 0.25s;
          flex-shrink: 0;
        }
        .contact-card:hover .contact-arrow {
          transform: translateX(4px);
          color: var(--dark);
        }

        /* Business card */
        .biz-card {
          background: linear-gradient(135deg, var(--orange) 0%, #FF8A5B 100%);
          border-radius: 20px;
          padding: 28px 32px;
          color: #fff;
          position: relative;
          overflow: hidden;
          margin-top: 4px;
        }
        .biz-card::before {
          content: '🏠';
          position: absolute;
          right: 24px; top: 20px;
          font-size: 3rem;
          opacity: 0.2;
        }
        .biz-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .biz-card-text {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.6;
          max-width: 280px;
        }
        .biz-badges {
          display: flex; gap: 8px; flex-wrap: wrap; margin-top: 18px;
        }
        .biz-badge {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
        }

        /* Decorative bg */
        .bg-decoration {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none; z-index: 0; overflow: hidden;
        }
        .bg-decoration::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(240,90,40,0.06) 0%, transparent 65%);
        }
        .bg-decoration::after {
          content: '';
          position: absolute;
          bottom: -150px; left: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(240,90,40,0.04) 0%, transparent 65%);
        }
      `}</style>

      <div className="bg-decoration" />

      <div className="page-wrap" style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="page-header">
          <div className="eyebrow">
            <div className="eyebrow-line" />
            Connect with RooMoo
          </div>
          <h1 className="page-title">
            Let's Build<br />
            Something <em>Great</em>
          </h1>
          <p className="page-subtitle">
            Join our growing team or reach out for business partnerships. We're always looking for passionate people who love Hyderabad.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid-main">

          {/* LEFT — Job Application Form */}
          <div className="form-card">
            <h2 className="form-card-title">Join Our Team</h2>
            <p className="form-card-sub">
              Submit your application below and our team will get back to you within 48 hours.
            </p>

            {status === "success" && (
              <div className="toast success">
                <span style={{ fontSize: "1.1rem" }}>🎉</span>
                <div>
                  <strong style={{ display: "block", marginBottom: 2 }}>Application received!</strong>
                  We'll review your profile and reach out within 48 hours. Thanks for your interest in RooMoo!
                </div>
              </div>
            )}
            {status === "error" && (
              <div className="toast error">
                <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                <div>Please fill in your name, email and attach your resume to continue.</div>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="row-2">
                <div className="field-group">
                  <label className="field-label">Full Name *</label>
                  <input
                    className="field-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Email *</label>
                  <input
                    className="field-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Applying For</label>
                <select
                  className="field-input"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={{ appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='rgba(247,244,239,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", backgroundSize: "18px" }}
                >
                  <option value="">Select a role…</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Message (optional)</label>
                <textarea
                  className="field-input"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself and why you want to join RooMoo…"
                  rows={3}
                  style={{ resize: "none" }}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Resume * <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "rgba(247,244,239,0.25)", fontSize: "10px" }}>PDF or Word — max 5MB</span></label>
                <div className={`file-zone ${fileName ? "has-file" : ""}`}>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    ref={fileInputRef}
                    onChange={handleChange}
                  />
                  {fileName ? (
                    <>
                      <div className="file-zone-icon">📄</div>
                      <div className="file-zone-label">
                        <strong style={{ color: "#86EFAC" }}>{fileName}</strong>
                        Click to replace
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="file-zone-icon">📎</div>
                      <div className="file-zone-label">
                        <strong>Click to upload your resume</strong>
                        PDF, DOC, or DOCX
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <><div className="spinner" /> Submitting…</>
                ) : (
                  <>Submit Application <span>→</span></>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT — Contact + social */}
          <div className="right-panel">

            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="contact-card"
                style={{ "--hover-bg": s.bg }}
                onMouseEnter={() => setHoveredContact(i)}
                onMouseLeave={() => setHoveredContact(null)}
              >
                <style>{`.contact-card:nth-child(${i + 1})::before { background: ${s.bg}; }`}</style>
                <div
                  className="contact-icon-wrap"
                  style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                >
                  {s.icon}
                </div>
                <div className="contact-info">
                  <div className="contact-label">{s.label}</div>
                  <div className="contact-handle">{s.handle}</div>
                  <div className="contact-desc">{s.desc}</div>
                </div>
                <div className="contact-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}

            {/* Business inquiries CTA */}
            <div className="biz-card">
              <div className="biz-card-title">Partnership & Business</div>
              <p className="biz-card-text">
                Looking to list properties at scale, integrate our platform, or explore co-marketing? Let's talk.
              </p>
              <div className="biz-badges">
                <span className="biz-badge">Property Owners</span>
                <span className="biz-badge">Builders</span>
                <span className="biz-badge">Agencies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}