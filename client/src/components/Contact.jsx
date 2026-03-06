import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaWhatsapp, FaPhoneAlt, FaUser, FaCheckCircle, FaPaperPlane, FaClock, FaShieldAlt } from 'react-icons/fa';
import { MdOutlineVerified } from 'react-icons/md';
import { BsLightningChargeFill } from 'react-icons/bs';

const MESSAGE_TEMPLATES = [
  "Hi, I'm interested in this property. Is it still available?",
  "Can I schedule a site visit this weekend?",
  "What are the lease terms and advance deposit required?",
  "Are utilities included in the rent?",
];

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    setMessage(e.target.value);
    setCharCount(e.target.value.length);
    setSelectedTemplate(null);
  };

  const applyTemplate = (tpl, idx) => {
    setMessage(tpl);
    setCharCount(tpl.length);
    setSelectedTemplate(idx);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;800&family=Syne:wght@500;600;700&family=Lato:wght@300;400;700&display=swap');
        :root{--brand:#dc4a11;--brand-light:#ff7b45;--dark:#0e0b08;--card:#1a1510;--border:rgba(255,255,255,.09);--text:#f0ebe5;--muted:#8a8078;--green:#22c55e;}

        .ct-root *{box-sizing:border-box;}
        .ct-fd{font-family:'Cormorant Garamond',serif;}
        .ct-fu{font-family:'Syne',sans-serif;}
        .ct-fb{font-family:'Lato',sans-serif;}

        /* Card wrapper */
        .ct-card{background:var(--card);border:1px solid var(--border);border-radius:18px;overflow:hidden;transition:border-color .3s;}
        .ct-card:hover{border-color:rgba(220,74,17,.22);}

        /* Header stripe */
        .ct-header{background:linear-gradient(135deg,#1c1208 0%,#140f08 60%,#1e1309 100%);border-bottom:1px solid var(--border);padding:20px 22px;}

        /* Avatar ring */
        .ct-avatar-ring{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--brand-light));padding:2px;flex-shrink:0;}
        .ct-avatar-inner{width:100%;height:100%;border-radius:50%;background:var(--dark);display:flex;align-items:center;justify-content:center;overflow:hidden;}

        /* Templates */
        .ct-tpl{cursor:pointer;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:'Lato',sans-serif;font-size:12px;color:var(--muted);transition:all .2s;text-align:left;line-height:1.5;}
        .ct-tpl:hover{border-color:rgba(220,74,17,.35);color:var(--text);background:rgba(220,74,17,.07);}
        .ct-tpl.sel{border-color:rgba(220,74,17,.5);color:var(--brand-light);background:rgba(220,74,17,.1);}

        /* Textarea */
        .ct-area{font-family:'Lato',sans-serif;font-size:14px;background:rgba(255,255,255,.04);border:1.5px solid var(--border);border-radius:12px;padding:14px 16px;color:var(--text);width:100%;resize:none;transition:border-color .25s,box-shadow .25s;line-height:1.7;}
        .ct-area:focus{outline:none;border-color:rgba(220,74,17,.5);box-shadow:0 0 0 3px rgba(220,74,17,.1);}
        .ct-area::placeholder{color:var(--muted);}

        /* Buttons */
        .ct-btn-primary{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;letter-spacing:.05em;background:var(--brand);color:#fff;border:none;border-radius:10px;padding:13px 20px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;transition:background .2s,transform .15s,box-shadow .2s;box-shadow:0 5px 20px rgba(220,74,17,.3);}
        .ct-btn-primary:hover:not(:disabled){background:#b83a0c;transform:translateY(-1px);box-shadow:0 8px 28px rgba(220,74,17,.4);}
        .ct-btn-primary:disabled{opacity:.55;cursor:not-allowed;transform:none;}

        .ct-btn-wa{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;letter-spacing:.04em;background:rgba(37,211,102,.12);color:#4ade80;border:1px solid rgba(37,211,102,.3);border-radius:10px;padding:12px 20px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;transition:all .2s;text-decoration:none;}
        .ct-btn-wa:hover{background:rgba(37,211,102,.2);border-color:rgba(37,211,102,.5);}

        .ct-btn-call{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;letter-spacing:.04em;background:rgba(255,255,255,.05);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:12px 20px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;transition:all .2s;}
        .ct-btn-call:hover{border-color:rgba(220,74,17,.35);color:var(--brand-light);background:rgba(220,74,17,.06);}

        /* Trust badges */
        .ct-trust{display:flex;align-items:center;gap:6px;font-family:'Lato',sans-serif;font-size:11px;color:var(--muted);}

        /* Sent state */
        @keyframes ct-pop{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        .ct-sent{animation:ct-pop .45s ease forwards;}

        /* Spin */
        @keyframes ct-spin{to{transform:rotate(360deg)}}
        .ct-spin{animation:ct-spin .8s linear infinite;display:inline-block;}

        /* Response time badge */
        .ct-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:999px;padding:3px 10px;}
      `}</style>

      {landlord && (
        <div className="ct-root">
          <div className="ct-card">

            {/* ── Header: Landlord profile ── */}
            <div className="ct-header">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div className="ct-avatar-ring">
                  <div className="ct-avatar-inner">
                    {landlord.avatar
                      ? <img src={landlord.avatar} alt={landlord.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <FaUser style={{ color: "var(--muted)", fontSize: 22 }} />
                    }
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span className="ct-fu" style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{landlord.username}</span>
                    <MdOutlineVerified style={{ color: "#60a5fa", fontSize: 15 }} />
                  </div>
                  <div className="ct-fb" style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Property Owner · Verified Landlord</div>
                </div>
                <div className="ct-badge">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                  <span className="ct-fu" style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", letterSpacing: ".06em" }}>ONLINE</span>
                </div>
              </div>

              {/* Property snippet */}
              <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <BsLightningChargeFill style={{ color: "var(--brand)", fontSize: 14, flexShrink: 0 }} />
                <span className="ct-fb" style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                  Enquiring about <span style={{ color: "var(--text)", fontWeight: 700 }}>{listing.name}</span>
                </span>
              </div>

              {/* Meta row */}
              <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                <div className="ct-trust">
                  <FaClock style={{ color: "var(--brand)", fontSize: 11 }} />
                  Responds within 1 hour
                </div>
                <div className="ct-trust">
                  <FaShieldAlt style={{ color: "var(--brand)", fontSize: 11 }} />
                  Verified identity
                </div>
                <div className="ct-trust">
                  <FaCheckCircle style={{ color: "var(--green)", fontSize: 11 }} />
                  Zero brokerage
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Sent success state */}
              {sent ? (
                <div className="ct-sent" style={{ textAlign: "center", padding: "24px 16px" }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
                  <div className="ct-fd" style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>Message Sent!</div>
                  <div className="ct-fb" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
                    Your enquiry has been sent to <span style={{ color: "var(--text)", fontWeight: 700 }}>{landlord.username}</span>.<br />Expect a reply within 1 hour.
                  </div>
                  <button onClick={() => { setSent(false); setMessage(""); setCharCount(0); }}
                    className="ct-btn-call" style={{ width: "auto", margin: "16px auto 0", padding: "10px 24px" }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  {/* Quick templates */}
                  <div>
                    <div className="ct-fu" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--muted)", marginBottom: 8, fontWeight: 700 }}>Quick Messages</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {MESSAGE_TEMPLATES.map((tpl, i) => (
                        <button key={i} className={`ct-tpl ${selectedTemplate === i ? "sel" : ""}`} onClick={() => applyTemplate(tpl, i)}>
                          {tpl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
                    <span className="ct-fu" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em" }}>OR WRITE YOUR OWN</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
                  </div>

                  {/* Textarea */}
                  <div style={{ position: "relative" }}>
                    <textarea
                      name="message" id="message" rows={4}
                      value={message} onChange={onChange}
                      placeholder="Write your message to the landlord…"
                      className="ct-area"
                      maxLength={500}
                    />
                    <span className="ct-fb" style={{ position: "absolute", bottom: 10, right: 14, fontSize: 11, color: charCount > 400 ? "var(--brand)" : "var(--muted)" }}>
                      {charCount}/500
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Primary: mailto */}
                    <Link
                      to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                      onClick={handleSend}
                      style={{ textDecoration: "none" }}
                    >
                      <button className="ct-btn-primary" disabled={!message.trim()}>
                        {sending
                          ? <><span className="ct-spin">⏳</span> Sending…</>
                          : <><FaPaperPlane style={{ fontSize: 13 }} /> Send via Email</>
                        }
                      </button>
                    </Link>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in "${listing.name}". ${message}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="ct-btn-wa"
                    >
                      <FaWhatsapp style={{ fontSize: 16 }} /> WhatsApp Landlord
                    </a>

                    {/* Call */}
                    <button className="ct-btn-call">
                      <FaPhoneAlt style={{ fontSize: 12 }} /> Request a Callback
                    </button>
                  </div>

                  {/* Footer trust note */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", background: "rgba(255,255,255,.03)", borderRadius: 10, border: "1px solid var(--border)" }}>
                    <FaShieldAlt style={{ color: "var(--brand)", fontSize: 14, marginTop: 1, flexShrink: 0 }} />
                    <p className="ct-fb" style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.65 }}>
                      Your contact info is <span style={{ color: "var(--text)" }}>never shared</span> without your consent. Roomiii verifies all landlords before listing.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}