import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TEMPLATES = [
  { icon: "🏠", label: "Availability",  text: "Hi, I'm interested in this property. Is it still available?" },
  { icon: "📅", label: "Site Visit",    text: "Can I schedule a site visit this weekend?" },
  { icon: "📄", label: "Lease Terms",   text: "What are the lease terms and advance deposit required?" },
  { icon: "💡", label: "Utilities",     text: "Are utilities included in the rent?" },
];

const TRUST_BADGES = [
  { icon: "⚡", label: "Responds in ~1 hr", color: "#F05A28" },
  { icon: "✅", label: "Verified identity",  color: "#4ADE80" },
  { icon: "🔒", label: "Zero brokerage",    color: "#60A5FA" },
];

export default function Contact({ listing }) {
  const [landlord, setLandlord]           = useState(null);
  const [message, setMessage]             = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sending, setSending]             = useState(false);
  const [sent, setSent]                   = useState(false);
  const [activeChannel, setActiveChannel] = useState('email'); // email | whatsapp | call
  const [callRequested, setCallRequested] = useState(false);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res  = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (e) { console.error(e); }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const applyTemplate = (tpl, idx) => {
    setMessage(tpl.text);
    setSelectedTemplate(idx);
  };

  const handleSend = (e) => {
    if (!message.trim()) { e.preventDefault(); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1300);
  };

  const handleCallRequest = () => {
    setCallRequested(true);
    setTimeout(() => setCallRequested(false), 3000);
  };

  const reset = () => { setSent(false); setMessage(''); setSelectedTemplate(null); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,500&display=swap');

        .ct * { box-sizing: border-box; }

        :root {
          --or: #F05A28;
          --or-dim: rgba(240,90,40,0.12);
          --sur: #141418;
          --sur2: #1C1C22;
          --bor: rgba(255,255,255,0.08);
          --tx: #F2EFE9;
          --mu: rgba(242,239,233,0.42);
          --gr: #4ADE80;
          --bl: #60A5FA;
        }

        /* ── Shell ── */
        .ct { font-family: 'Outfit', sans-serif; }
        .ct-shell {
          background: #0F0F12;
          border: 1px solid var(--bor);
          border-radius: 24px;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .ct-shell:hover { border-color: rgba(240,90,40,0.2); }

        /* ── Header ── */
        .ct-head {
          background: linear-gradient(135deg, #141418 0%, #1A1A20 100%);
          border-bottom: 1px solid var(--bor);
          padding: 22px 24px 18px;
          position: relative; overflow: hidden;
        }
        .ct-head::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(240,90,40,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Avatar */
        .ct-av-ring {
          width: 50px; height: 50px; border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, var(--or), #FF8A5B);
          flex-shrink: 0;
        }
        .ct-av-inner {
          width: 100%; height: 100%; border-radius: 50%;
          background: #0F0F12;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; font-size: 1.3rem;
        }
        .ct-av-inner img { width: 100%; height: 100%; object-fit: cover; }

        .ct-name {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem; font-weight: 700; color: var(--tx);
          display: flex; align-items: center; gap: 6px;
        }
        .ct-verified { color: var(--bl); font-size: 0.85rem; }
        .ct-role { font-size: 0.74rem; color: var(--mu); margin-top: 2px; letter-spacing: 0.04em; }

        .ct-online {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.22);
          border-radius: 100px; padding: 4px 10px;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.1em; color: var(--gr);
        }
        .ct-online-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gr);
          animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* Property snippet */
        .ct-snippet {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--bor);
          border-radius: 12px; padding: 10px 14px;
          display: flex; align-items: center; gap: 10px;
          margin-top: 14px;
        }
        .ct-snippet-icon { font-size: 1rem; flex-shrink: 0; }
        .ct-snippet-text { font-size: 0.8rem; color: var(--mu); line-height: 1.45; }
        .ct-snippet-text strong { color: var(--tx); }

        /* Trust row */
        .ct-trust-row { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 14px; }
        .ct-trust-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--mu); }

        /* ── Channel tabs ── */
        .ct-tabs {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 8px; padding: 18px 24px 0;
        }
        .ct-tab {
          padding: 10px 8px;
          background: var(--sur);
          border: 1.5px solid var(--bor);
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          color: var(--mu); cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .ct-tab .tab-icon { font-size: 1.2rem; }
        .ct-tab.active {
          border-color: var(--or);
          background: var(--or-dim);
          color: var(--tx);
        }
        .ct-tab:hover:not(.active) { border-color: rgba(255,255,255,0.16); color: var(--tx); }

        /* ── Body ── */
        .ct-body { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 16px; }

        /* Templates */
        .ct-tpl-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--mu); margin-bottom: 8px;
        }
        .ct-tpl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        @media (max-width: 460px) { .ct-tpl-grid { grid-template-columns: 1fr; } }
        .ct-tpl {
          background: var(--sur);
          border: 1.5px solid var(--bor);
          border-radius: 10px; padding: 10px 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem; color: var(--mu);
          cursor: pointer; text-align: left;
          transition: all 0.18s; line-height: 1.5;
          display: flex; align-items: flex-start; gap: 8px;
        }
        .ct-tpl .tpl-icon { font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }
        .ct-tpl:hover { border-color: rgba(240,90,40,0.3); color: var(--tx); background: var(--or-dim); }
        .ct-tpl.sel { border-color: rgba(240,90,40,0.5); color: var(--tx); background: var(--or-dim); }

        /* Divider */
        .ct-div {
          display: flex; align-items: center; gap: 10px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(242,239,233,0.18);
        }
        .ct-div::before, .ct-div::after { content:''; flex:1; height:1px; background: var(--bor); }

        /* Textarea */
        .ct-area-wrap { position: relative; }
        .ct-area {
          width: 100%;
          background: var(--sur);
          border: 1.5px solid var(--bor);
          border-radius: 14px;
          padding: 13px 16px 32px 16px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem; color: var(--tx);
          resize: none; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          line-height: 1.65;
        }
        .ct-area::placeholder { color: rgba(242,239,233,0.18); }
        .ct-area:focus { border-color: rgba(240,90,40,0.45); box-shadow: 0 0 0 3px rgba(240,90,40,0.1); }
        .ct-char {
          position: absolute; bottom: 10px; right: 14px;
          font-size: 10px; font-weight: 600;
          transition: color 0.2s;
        }

        /* Action buttons */
        .ct-btn-email {
          width: 100%; padding: 14px;
          background: var(--or); border: none; border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700;
          color: #fff; cursor: pointer; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 24px rgba(240,90,40,0.3);
        }
        .ct-btn-email:hover:not([disabled]) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(240,90,40,0.42); }
        .ct-btn-email[disabled] { opacity: 0.45; pointer-events: none; }

        .ct-btn-wa {
          width: 100%; padding: 13px;
          background: rgba(37,211,102,0.1);
          border: 1.5px solid rgba(37,211,102,0.25);
          border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 700;
          color: var(--gr); cursor: pointer; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, border-color 0.2s;
        }
        .ct-btn-wa:hover { background: rgba(37,211,102,0.18); border-color: rgba(37,211,102,0.45); }

        .ct-btn-call {
          width: 100%; padding: 13px;
          background: var(--sur);
          border: 1.5px solid var(--bor);
          border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 700;
          color: var(--mu); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .ct-btn-call:hover { border-color: rgba(240,90,40,0.35); color: var(--tx); background: var(--or-dim); }
        .ct-btn-call.done { border-color: rgba(74,222,128,0.3); color: var(--gr); background: rgba(74,222,128,0.08); }

        /* Spinner */
        .ct-spin { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* Footer note */
        .ct-note {
          display: flex; align-items: flex-start; gap: 10px;
          background: var(--sur);
          border: 1px solid var(--bor);
          border-radius: 12px; padding: 12px 14px;
          font-size: 0.78rem; color: var(--mu); line-height: 1.6;
        }

        /* ── Sent state ── */
        .ct-sent-state { text-align: center; padding: 28px 12px; animation: popIn 0.4s ease; }
        @keyframes popIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        .ct-sent-icon { font-size: 3rem; margin-bottom: 14px; }
        .ct-sent-title { font-family: 'Fraunces', serif; font-size: 1.5rem; font-weight: 700; color: var(--tx); margin-bottom: 8px; }
        .ct-sent-sub { font-size: 0.84rem; color: var(--mu); line-height: 1.65; max-width: 280px; margin: 0 auto; }
        .ct-sent-again { display: inline-flex; align-items: center; gap: 7px; margin-top: 18px; padding: 10px 22px; background: var(--sur); border: 1.5px solid var(--bor); border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 700; color: var(--mu); cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .ct-sent-again:hover { border-color: rgba(255,255,255,0.2); color: var(--tx); }

        /* WhatsApp panel */
        .ct-wa-panel { background: rgba(37,211,102,0.05); border: 1px solid rgba(37,211,102,0.15); border-radius: 14px; padding: 18px; text-align: center; }
        .ct-wa-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .ct-wa-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700; color: var(--tx); margin-bottom: 6px; }
        .ct-wa-sub { font-size: 0.8rem; color: var(--mu); margin-bottom: 16px; line-height: 1.55; }

        /* Call panel */
        .ct-call-panel { background: var(--sur); border: 1px solid var(--bor); border-radius: 14px; padding: 18px; text-align: center; }
        .ct-call-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .ct-call-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700; color: var(--tx); margin-bottom: 6px; }
        .ct-call-sub { font-size: 0.8rem; color: var(--mu); margin-bottom: 16px; line-height: 1.55; }
      `}</style>

      {landlord && (
        <div className="ct">
          <div className="ct-shell">

            {/* ── HEADER ── */}
            <div className="ct-head">
              {/* Landlord row */}
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div className="ct-av-ring">
                  <div className="ct-av-inner">
                    {landlord.avatar
                      ? <img src={landlord.avatar} alt={landlord.username} />
                      : "👤"
                    }
                  </div>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="ct-name">
                    {landlord.username}
                    <span className="ct-verified">✓</span>
                  </div>
                  <div className="ct-role">Property Owner · Verified Landlord</div>
                </div>
                <div className="ct-online">
                  <div className="ct-online-dot" />
                  ONLINE
                </div>
              </div>

              {/* Property snippet */}
              <div className="ct-snippet">
                <span className="ct-snippet-icon">⚡</span>
                <span className="ct-snippet-text">
                  Enquiring about <strong>{listing.name}</strong>
                </span>
              </div>

              {/* Trust badges */}
              <div className="ct-trust-row">
                {TRUST_BADGES.map(b => (
                  <div key={b.label} className="ct-trust-item">
                    <span style={{ fontSize:"0.8rem" }}>{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── CHANNEL TABS ── */}
            {!sent && (
              <div className="ct-tabs">
                {[
                  { id:"email",    icon:"✉️",  label:"Email"    },
                  { id:"whatsapp", icon:"💬",  label:"WhatsApp" },
                  { id:"call",     icon:"📞",  label:"Callback" },
                ].map(ch => (
                  <button
                    key={ch.id}
                    className={`ct-tab ${activeChannel === ch.id ? "active" : ""}`}
                    onClick={() => setActiveChannel(ch.id)}
                  >
                    <span className="tab-icon">{ch.icon}</span>
                    {ch.label}
                  </button>
                ))}
              </div>
            )}

            {/* ── BODY ── */}
            <div className="ct-body">

              {/* ─ SUCCESS STATE ─ */}
              {sent ? (
                <div className="ct-sent-state">
                  <div className="ct-sent-icon">🎉</div>
                  <div className="ct-sent-title">Message Sent!</div>
                  <div className="ct-sent-sub">
                    Your enquiry reached <strong style={{ color:"var(--tx)" }}>{landlord.username}</strong>. Expect a reply within 1 hour.
                  </div>
                  <button className="ct-sent-again" onClick={reset}>
                    ← Send another message
                  </button>
                </div>
              ) : (

                /* ─ EMAIL CHANNEL ─ */
                activeChannel === "email" ? (
                  <>
                    <div>
                      <div className="ct-tpl-label">Quick messages</div>
                      <div className="ct-tpl-grid">
                        {TEMPLATES.map((tpl, i) => (
                          <button
                            key={i}
                            className={`ct-tpl ${selectedTemplate === i ? "sel" : ""}`}
                            onClick={() => applyTemplate(tpl, i)}
                          >
                            <span className="tpl-icon">{tpl.icon}</span>
                            {tpl.text}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="ct-div">or write your own</div>

                    <div className="ct-area-wrap">
                      <textarea
                        className="ct-area"
                        rows={4}
                        maxLength={500}
                        placeholder="Write your message to the landlord…"
                        value={message}
                        onChange={e => { setMessage(e.target.value); setSelectedTemplate(null); }}
                      />
                      <span className="ct-char" style={{ color: message.length > 400 ? "#F05A28" : "rgba(242,239,233,0.28)" }}>
                        {message.length}/500
                      </span>
                    </div>

                    <Link
                      to={`mailto:${landlord.email}?subject=Regarding ${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}
                      onClick={handleSend}
                      style={{ textDecoration:"none" }}
                    >
                      <button
                        className="ct-btn-email"
                        disabled={!message.trim() || sending}
                      >
                        {sending
                          ? <><div className="ct-spin" /> Sending…</>
                          : <>✉️ Send via Email</>
                        }
                      </button>
                    </Link>

                    <div className="ct-note">
                      <span style={{ fontSize:"1rem", flexShrink:0 }}>🔒</span>
                      <span>Your contact info is <strong style={{ color:"var(--tx)" }}>never shared</strong> without consent. RooMoo verifies all landlords before listing.</span>
                    </div>
                  </>
                )

                /* ─ WHATSAPP CHANNEL ─ */
                : activeChannel === "whatsapp" ? (
                  <>
                    <div className="ct-wa-panel">
                      <div className="ct-wa-icon">💬</div>
                      <div className="ct-wa-title">Chat on WhatsApp</div>
                      <div className="ct-wa-sub">Message {landlord.username} directly on WhatsApp — usually replied to in minutes.</div>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in "${listing.name}". Is it still available?`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="ct-btn-wa"
                        style={{ display:"inline-flex", width:"auto", padding:"12px 28px" }}
                      >
                        💬 Open WhatsApp Chat
                      </a>
                    </div>

                    <div className="ct-div">or include a custom message</div>

                    <div className="ct-area-wrap">
                      <textarea
                        className="ct-area"
                        rows={3}
                        maxLength={500}
                        placeholder="Add a custom note (optional)…"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                      />
                      <span className="ct-char" style={{ color:"rgba(242,239,233,0.28)" }}>{message.length}/500</span>
                    </div>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in "${listing.name}". ${message}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="ct-btn-wa"
                    >
                      💬 Send WhatsApp Message
                    </a>
                  </>
                )

                /* ─ CALLBACK CHANNEL ─ */
                : (
                  <>
                    <div className="ct-call-panel">
                      <div className="ct-call-icon">📞</div>
                      <div className="ct-call-title">Request a Callback</div>
                      <div className="ct-call-sub">Leave your number and {landlord.username} will call you back within 1 hour during business hours (9am–7pm).</div>
                      <button
                        className={`ct-btn-call ${callRequested ? "done" : ""}`}
                        style={{ width:"auto", padding:"12px 28px", display:"inline-flex" }}
                        onClick={handleCallRequest}
                      >
                        {callRequested ? <>✓ Request Sent!</> : <>📞 Request Callback</>}
                      </button>
                    </div>

                    <div className="ct-note">
                      <span style={{ fontSize:"1rem", flexShrink:0 }}>🕐</span>
                      <span>Callback hours: <strong style={{ color:"var(--tx)" }}>Mon – Sat, 9am to 7pm IST.</strong> We'll confirm your request via email.</span>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}