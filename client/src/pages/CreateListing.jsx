import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// ─── Step config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basics",    icon: "🏠", desc: "Name, description & address" },
  { id: 2, label: "Details",   icon: "📋", desc: "Type, amenities & pricing"   },
  { id: 3, label: "Photos",    icon: "📸", desc: "Upload up to 6 images"       },
];

export default function CreateListing() {
  const { currentUser } = useSelector((s) => s.user);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 10000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (id === "sale" || id === "rent") {
      setFormData((p) => ({ ...p, type: id }));
    } else if (type === "checkbox") {
      setFormData((p) => ({ ...p, [id]: checked }));
    } else {
      setFormData((p) => ({ ...p, [id]: value }));
    }
  };

  const storeImage = (file) =>
    new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = Date.now() + file.name;
      const storageRef = ref(storage, fileName);
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setUploadProgress((p) => ({ ...p, [fileName]: pct }));
        },
        reject,
        () => getDownloadURL(task.snapshot.ref).then(resolve)
      );
    });

  const handleImageSubmit = () => {
    if (!files.length) return;
    if (files.length + formData.imageUrls.length > 6) {
      return setImageUploadError("Maximum 6 images allowed per listing.");
    }
    setUploading(true);
    setImageUploadError("");
    Promise.all(Array.from(files).map(storeImage))
      .then((urls) => {
        setFormData((p) => ({ ...p, imageUrls: [...p.imageUrls, ...urls] }));
        setUploading(false);
        setUploadProgress({});
      })
      .catch(() => {
        setImageUploadError("Upload failed — max 2 MB per image.");
        setUploading(false);
      });
  };

  const handleRemoveImage = (i) =>
    setFormData((p) => ({ ...p, imageUrls: p.imageUrls.filter((_, idx) => idx !== i) }));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrls.length) return setError("Upload at least one image.");
    if (+formData.regularPrice < +formData.discountPrice)
      return setError("Discount price must be lower than regular price.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) return setError(data.message);
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const canNext1 = formData.name.length >= 10 && formData.description && formData.address;
  const canNext2 = formData.regularPrice >= 1000;

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0F0F12", minHeight: "100vh", color: "#F0EDE8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #F05A28;
          --orange-glow: rgba(240,90,40,0.18);
          --surface: #16161A;
          --surface-2: #1E1E24;
          --border: rgba(255,255,255,0.08);
          --border-focus: rgba(240,90,40,0.5);
          --text: #F0EDE8;
          --muted: rgba(240,237,232,0.45);
          --green: #4ADE80;
          --red: #F87171;
        }

        .page-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 300px 1fr;
        }
        @media (max-width: 900px) {
          .page-shell { grid-template-columns: 1fr; }
          .sidebar { display: none !important; }
        }

        /* ── Sidebar ── */
        .sidebar {
          background: #0A0A0D;
          border-right: 1px solid var(--border);
          padding: 48px 32px;
          display: flex;
          flex-direction: column;
          gap: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--orange);
          margin-bottom: 48px;
          letter-spacing: -0.02em;
        }
        .sidebar-logo span { color: var(--text); font-style: italic; }
        .sidebar-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 14px;
          border-radius: 14px;
          margin-bottom: 6px;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }
        .step-item.active { background: var(--orange-glow); }
        .step-item.done { opacity: 0.7; }
        .step-item:not(.active):hover { background: rgba(255,255,255,0.04); }

        .step-circle {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          border: 1.5px solid var(--border);
          background: var(--surface);
          flex-shrink: 0;
          transition: border-color 0.2s, background 0.2s;
        }
        .step-item.active .step-circle {
          border-color: var(--orange);
          background: var(--orange-glow);
        }
        .step-item.done .step-circle {
          background: rgba(74,222,128,0.12);
          border-color: rgba(74,222,128,0.3);
        }
        .step-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
        }
        .step-desc {
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 1px;
        }
        .step-connector {
          width: 1.5px; height: 20px;
          background: var(--border);
          margin: 0 0 6px 33px;
        }

        .sidebar-bottom {
          margin-top: auto;
          background: var(--orange-glow);
          border: 1px solid rgba(240,90,40,0.2);
          border-radius: 16px;
          padding: 20px;
        }
        .sidebar-bottom-title {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
        }
        .sidebar-bottom-text {
          font-size: 0.75rem;
          color: var(--muted);
          line-height: 1.55;
        }

        /* ── Main content ── */
        .main-content {
          padding: clamp(32px, 5vw, 64px);
          max-width: 780px;
        }

        .step-header { margin-bottom: 40px; }
        .step-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 12px;
        }
        .step-heading {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: var(--text);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .step-heading em { font-style: italic; color: var(--orange); }
        .step-sub {
          font-size: 0.9rem;
          color: var(--muted);
          margin-top: 10px;
          line-height: 1.6;
        }

        /* ── Field styles ── */
        .field-wrap { margin-bottom: 22px; }
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .field-input {
          width: 100%;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 14px 18px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          resize: none;
        }
        .field-input::placeholder { color: rgba(240,237,232,0.2); }
        .field-input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(240,90,40,0.1);
          background: #1A1A20;
        }
        .char-count {
          text-align: right;
          font-size: 11px;
          color: var(--muted);
          margin-top: 4px;
        }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 560px) { .two-col { grid-template-columns: 1fr; } }

        /* ── Toggle chips ── */
        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }
        .chip {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          border-radius: 100px;
          border: 1.5px solid var(--border);
          background: var(--surface);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
        }
        .chip.active {
          background: var(--orange-glow);
          border-color: var(--orange);
          color: var(--text);
        }
        .chip:hover:not(.active) { border-color: rgba(255,255,255,0.2); color: var(--text); }
        .chip-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--orange);
          opacity: 0;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .chip.active .chip-dot { opacity: 1; }

        /* ── Section divider ── */
        .section-divider {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0 20px;
        }
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* ── Number stepper ── */
        .stepper {
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          width: fit-content;
        }
        .stepper-btn {
          width: 44px; height: 50px;
          background: transparent;
          border: none;
          color: var(--muted);
          font-size: 1.3rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .stepper-btn:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .stepper-val {
          min-width: 44px;
          text-align: center;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          height: 50px;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Price field ── */
        .price-wrap {
          position: relative;
        }
        .price-prefix {
          position: absolute;
          left: 18px; top: 50%;
          transform: translateY(-50%);
          color: var(--orange);
          font-weight: 700;
          font-size: 1rem;
          pointer-events: none;
        }
        .price-wrap .field-input { padding-left: 36px; }

        /* ── Photo upload ── */
        .drop-zone {
          border: 2px dashed var(--border);
          border-radius: 20px;
          padding: 40px 28px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
          position: relative;
          background: var(--surface);
        }
        .drop-zone.drag-over {
          border-color: var(--orange);
          background: var(--orange-glow);
        }
        .drop-zone input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .drop-zone-icon { font-size: 2.5rem; margin-bottom: 12px; }
        .drop-zone-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text);
          margin-bottom: 4px;
        }
        .drop-zone-sub {
          font-size: 0.78rem;
          color: var(--muted);
        }

        .upload-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px;
          background: transparent;
          border: 1.5px solid var(--orange);
          color: var(--orange);
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          margin-top: 16px;
          letter-spacing: 0.04em;
        }
        .upload-btn:hover { background: var(--orange); color: #fff; }
        .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Image grid ── */
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
          margin-top: 20px;
        }
        .image-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 14px;
          overflow: hidden;
          background: var(--surface);
          border: 1.5px solid var(--border);
          animation: popIn 0.3s ease;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88); }
          to { opacity: 1; transform: scale(1); }
        }
        .image-item img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .image-badge {
          position: absolute;
          top: 8px; left: 8px;
          background: var(--orange);
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 100px;
        }
        .image-del {
          position: absolute;
          top: 8px; right: 8px;
          width: 28px; height: 28px;
          background: rgba(15,15,18,0.85);
          border: 1px solid rgba(248,113,113,0.4);
          border-radius: 8px;
          color: var(--red);
          font-size: 0.9rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          backdrop-filter: blur(4px);
        }
        .image-del:hover { background: rgba(248,113,113,0.2); }

        /* ── Progress bar ── */
        .progress-bar-wrap {
          height: 4px;
          background: var(--border);
          border-radius: 4px;
          margin-top: 8px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--orange);
          border-radius: 4px;
          transition: width 0.3s;
        }

        /* ── Error / alert ── */
        .alert {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; } }
        .alert.error { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #FCA5A5; }
        .alert.warn  { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); color: #FCD34D; }

        /* ── Nav buttons ── */
        .nav-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 36px;
          gap: 12px;
        }
        .btn-back {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          background: transparent;
          border: 1.5px solid var(--border);
          color: var(--muted);
          border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-back:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }

        .btn-next {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 36px;
          background: var(--orange);
          border: none;
          color: #fff;
          border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 8px 24px rgba(240,90,40,0.3);
        }
        .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(240,90,40,0.4); }
        .btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

        .btn-submit {
          background: linear-gradient(135deg, var(--orange), #FF8A5B);
          box-shadow: 0 8px 32px rgba(240,90,40,0.4);
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Mobile step bar ── */
        .mobile-steps {
          display: none;
          gap: 8px;
          margin-bottom: 32px;
        }
        @media (max-width: 900px) {
          .mobile-steps { display: flex; }
        }
        .mobile-step {
          flex: 1;
          height: 4px;
          border-radius: 4px;
          background: var(--border);
          transition: background 0.3s;
        }
        .mobile-step.done, .mobile-step.active { background: var(--orange); }

        .stepper-label {
          font-size: 0.8rem;
          color: var(--muted);
          margin-bottom: 6px;
        }
      `}</style>

      <div className="page-shell">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">Roo<span>Moo</span></div>
          <div className="sidebar-title">New Listing</div>

          {STEPS.map((s, i) => (
            <div key={s.id}>
              <div
                className={`step-item ${step === s.id ? "active" : ""} ${step > s.id ? "done" : ""}`}
                onClick={() => step > s.id && setStep(s.id)}
              >
                <div className="step-circle">
                  {step > s.id ? "✓" : s.icon}
                </div>
                <div>
                  <div className="step-label">{s.label}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}

          <div style={{ flex: 1 }} />

          <div className="sidebar-bottom">
            <div className="sidebar-bottom-title">Need help?</div>
            <div className="sidebar-bottom-text">
              Our team reviews every listing within 24 hours. Verified listings get 3× more enquiries.
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main-content">

          {/* Mobile progress bar */}
          <div className="mobile-steps">
            {STEPS.map((s) => (
              <div key={s.id} className={`mobile-step ${step >= s.id ? "active" : ""}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit}>

            {/* ══════════════════ STEP 1 ══════════════════ */}
            {step === 1 && (
              <div>
                <div className="step-header">
                  <div className="step-eyebrow">Step 1 of 3</div>
                  <h1 className="step-heading">Tell us about<br />your <em>property</em></h1>
                  <p className="step-sub">A great title and description attract 5× more views.</p>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Property Name *</label>
                  <input
                    className="field-input"
                    type="text"
                    id="name"
                    placeholder="e.g. Spacious 2BHK in Banjara Hills"
                    maxLength={62}
                    minLength={10}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <div className="char-count">{formData.name.length} / 62</div>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Description *</label>
                  <textarea
                    className="field-input"
                    id="description"
                    rows={5}
                    placeholder="Describe the property — amenities, neighbourhood, nearby landmarks…"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">Address *</label>
                  <input
                    className="field-input"
                    type="text"
                    id="address"
                    placeholder="Full address including area and city"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="nav-row">
                  <div />
                  <button
                    type="button"
                    className="btn-next"
                    disabled={!canNext1}
                    onClick={() => setStep(2)}
                  >
                    Next: Details <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════ STEP 2 ══════════════════ */}
            {step === 2 && (
              <div>
                <div className="step-header">
                  <div className="step-eyebrow">Step 2 of 3</div>
                  <h1 className="step-heading">Property <em>details</em><br />& pricing</h1>
                  <p className="step-sub">Accurate details help tenants find the right match.</p>
                </div>

                {/* Listing type */}
                <div className="section-divider">Listing Type</div>
                <div className="chip-group">
                  {[
                    { id: "rent", label: "🏠 Rent", val: "rent" },
                    { id: "sale", label: "💰 Sale", val: "sale" },
                  ].map((opt) => (
                    <label key={opt.id} className={`chip ${formData.type === opt.val ? "active" : ""}`}>
                      <input type="checkbox" id={opt.id} checked={formData.type === opt.val} onChange={handleChange} style={{ display: "none" }} />
                      <div className="chip-dot" />
                      {opt.label}
                    </label>
                  ))}
                </div>

                {/* Amenities */}
                <div className="section-divider">Amenities</div>
                <div className="chip-group">
                  {[
                    { id: "parking",   label: "🅿️ Parking"   },
                    { id: "furnished", label: "🛋️ Furnished"  },
                    { id: "offer",     label: "🏷️ Has Offer"  },
                  ].map((opt) => (
                    <label key={opt.id} className={`chip ${formData[opt.id] ? "active" : ""}`}>
                      <input type="checkbox" id={opt.id} checked={formData[opt.id]} onChange={handleChange} style={{ display: "none" }} />
                      <div className="chip-dot" />
                      {opt.label}
                    </label>
                  ))}
                </div>

                {/* Rooms */}
                <div className="section-divider">Rooms</div>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 22 }}>
                  {[
                    { id: "bedrooms",  label: "Bedrooms",  min: 1, max: 10 },
                    { id: "bathrooms", label: "Bathrooms", min: 1, max: 10 },
                  ].map((room) => (
                    <div key={room.id}>
                      <div className="stepper-label">{room.label}</div>
                      <div className="stepper">
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => setFormData(p => ({ ...p, [room.id]: Math.max(room.min, p[room.id] - 1) }))}
                        >−</button>
                        <div className="stepper-val">{formData[room.id]}</div>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => setFormData(p => ({ ...p, [room.id]: Math.min(room.max, p[room.id] + 1) }))}
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="section-divider">Pricing</div>
                <div className="two-col">
                  <div className="field-wrap">
                    <label className="field-label">
                      Regular Price {formData.type === "rent" && <span style={{ color: "var(--orange)", fontWeight: 400 }}>/ month</span>}
                    </label>
                    <div className="price-wrap">
                      <span className="price-prefix">₹</span>
                      <input
                        className="field-input"
                        type="number"
                        id="regularPrice"
                        min={1000}
                        max={10000000}
                        value={formData.regularPrice}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {formData.offer && (
                    <div className="field-wrap">
                      <label className="field-label">
                        Discounted Price {formData.type === "rent" && <span style={{ color: "var(--orange)", fontWeight: 400 }}>/ month</span>}
                      </label>
                      <div className="price-wrap">
                        <span className="price-prefix">₹</span>
                        <input
                          className="field-input"
                          type="number"
                          id="discountPrice"
                          min={0}
                          max={10000000}
                          value={formData.discountPrice}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="nav-row">
                  <button type="button" className="btn-back" onClick={() => setStep(1)}>← Back</button>
                  <button type="button" className="btn-next" disabled={!canNext2} onClick={() => setStep(3)}>
                    Next: Photos <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════ STEP 3 ══════════════════ */}
            {step === 3 && (
              <div>
                <div className="step-header">
                  <div className="step-eyebrow">Step 3 of 3</div>
                  <h1 className="step-heading">Add your<br /><em>photos</em></h1>
                  <p className="step-sub">Listings with 4+ photos get 80% more enquiries. First image = cover.</p>
                </div>

                {error && (
                  <div className="alert error">
                    <span>⚠️</span> {error}
                  </div>
                )}
                {imageUploadError && (
                  <div className="alert warn">
                    <span>⚠️</span> {imageUploadError}
                  </div>
                )}

                {/* Drop zone */}
                <div
                  className={`drop-zone ${dragOver ? "drag-over" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <div className="drop-zone-icon">📸</div>
                  <div className="drop-zone-title">Drop images here or click to browse</div>
                  <div className="drop-zone-sub">PNG, JPG, WEBP — max 2 MB each · up to {6 - formData.imageUrls.length} more</div>
                  {files.length > 0 && (
                    <div style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--orange)", fontWeight: 600 }}>
                      {files.length} file{files.length > 1 ? "s" : ""} selected
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    className="upload-btn"
                    disabled={uploading || !files.length}
                    onClick={handleImageSubmit}
                  >
                    {uploading ? <><div className="spinner" /> Uploading…</> : <><span>⬆</span> Upload Images</>}
                  </button>
                </div>

                {/* Upload progress bars */}
                {Object.entries(uploadProgress).map(([name, pct]) => (
                  <div key={name} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 4 }}>
                      {name.slice(13)} — {pct}%
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}

                {/* Image thumbnails */}
                {formData.imageUrls.length > 0 && (
                  <div className="image-grid">
                    {formData.imageUrls.map((url, i) => (
                      <div key={url} className="image-item">
                        <img src={url} alt={`listing-${i}`} />
                        {i === 0 && <div className="image-badge">Cover</div>}
                        <button
                          type="button"
                          className="image-del"
                          onClick={() => handleRemoveImage(i)}
                          title="Remove"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--muted)" }}>
                  {formData.imageUrls.length} / 6 images uploaded
                </div>

                <div className="nav-row">
                  <button type="button" className="btn-back" onClick={() => setStep(2)}>← Back</button>
                  <button
                    type="submit"
                    className="btn-next btn-submit"
                    disabled={loading || uploading || formData.imageUrls.length < 1}
                  >
                    {loading
                      ? <><div className="spinner" /> Publishing…</>
                      : <><span>🚀</span> Publish Listing</>
                    }
                  </button>
                </div>
              </div>
            )}

          </form>
        </main>
      </div>
    </div>
  );
}