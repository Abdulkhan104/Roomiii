import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const STEPS = [
  { id: 1, icon: "🏠", label: "Basics",  desc: "Name, description & address" },
  { id: 2, icon: "📋", label: "Details", desc: "Type, amenities & pricing"   },
  { id: 3, icon: "📸", label: "Photos",  desc: "Manage your images"          },
];

export default function EditListing() {
  const { currentUser } = useSelector((s) => s.user);
  const navigate = useNavigate();
  const params = useParams();

  const [step, setStep] = useState(1);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [], name: "", description: "", address: "",
    type: "rent", bedrooms: 1, bathrooms: 1,
    regularPrice: 1000, discountPrice: 0,
    offer: false, parking: false, furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [savedFields, setSavedFields] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) { console.error(data.message); return; }
        setFormData(data);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchListing();
  }, []);

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (id === "sale" || id === "rent") setFormData(p => ({ ...p, type: id }));
    else if (type === "checkbox") setFormData(p => ({ ...p, [id]: checked }));
    else setFormData(p => ({ ...p, [id]: value }));
  };

  const markSaved = (field) => {
    setSavedFields(p => [...new Set([...p, field])]);
    setTimeout(() => setSavedFields(p => p.filter(f => f !== field)), 2000);
  };

  const storeImage = (file) =>
    new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = Date.now() + file.name;
      const storageRef = ref(storage, fileName);
      const task = uploadBytesResumable(storageRef, file);
      task.on("state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setUploadProgress(p => ({ ...p, [fileName]: pct }));
        },
        reject,
        () => getDownloadURL(task.snapshot.ref).then(resolve)
      );
    });

  const handleImageSubmit = () => {
    if (!files.length) return;
    if (files.length + formData.imageUrls.length > 6) {
      return setImageUploadError("Maximum 6 images allowed.");
    }
    setUploading(true);
    setImageUploadError("");
    Promise.all(Array.from(files).map(storeImage))
      .then(urls => {
        setFormData(p => ({ ...p, imageUrls: [...p.imageUrls, ...urls] }));
        setUploading(false);
        setUploadProgress({});
      })
      .catch(() => {
        setImageUploadError("Upload failed — max 2 MB per image.");
        setUploading(false);
      });
  };

  const handleRemoveImage = (i) =>
    setFormData(p => ({ ...p, imageUrls: p.imageUrls.filter((_, idx) => idx !== i) }));

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
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
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

  if (fetchLoading) {
    return (
      <div style={{ fontFamily: "'Outfit',sans-serif", background: "#0F0F12", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "#F0EDE8" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap'); @keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 44, height: 44, border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#F05A28", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <div style={{ fontSize: "0.9rem", color: "rgba(240,237,232,0.45)" }}>Loading property details…</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0F0F12", minHeight: "100vh", color: "#F0EDE8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --orange: #F05A28;
          --orange-glow: rgba(240,90,40,0.14);
          --surface: #16161A;
          --surface-2: #1E1E24;
          --border: rgba(255,255,255,0.08);
          --border-focus: rgba(240,90,40,0.5);
          --text: #F0EDE8;
          --muted: rgba(240,237,232,0.42);
          --green: #4ADE80;
          --red: #F87171;
          --amber: #FBBF24;
        }

        .page-shell { min-height: 100vh; display: grid; grid-template-columns: 290px 1fr; }
        @media (max-width: 900px) { .page-shell { grid-template-columns: 1fr; } .sidebar { display: none !important; } }

        /* ── Sidebar ── */
        .sidebar {
          background: #0A0A0D; border-right: 1px solid var(--border);
          padding: 44px 28px; display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh; overflow: hidden;
        }
        .sidebar-logo { font-family: 'Fraunces', serif; font-size: 1.7rem; font-weight: 700; color: var(--orange); margin-bottom: 6px; letter-spacing: -0.02em; }
        .sidebar-logo span { color: var(--text); font-style: italic; }
        .sidebar-subtitle { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 32px; }

        .step-item { display: flex; align-items: center; gap: 14px; padding: 14px 12px; border-radius: 14px; margin-bottom: 4px; cursor: pointer; transition: background 0.2s; position: relative; }
        .step-item.active { background: var(--orange-glow); }
        .step-item.done { opacity: 0.65; }
        .step-item:not(.active):hover { background: rgba(255,255,255,0.04); }
        .step-circle { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1rem; border: 1.5px solid var(--border); background: var(--surface); flex-shrink: 0; transition: border-color 0.2s, background 0.2s; }
        .step-item.active .step-circle { border-color: var(--orange); background: var(--orange-glow); }
        .step-item.done .step-circle { background: rgba(74,222,128,0.1); border-color: rgba(74,222,128,0.3); }
        .step-label { font-weight: 600; font-size: 0.88rem; color: var(--text); }
        .step-desc { font-size: 0.72rem; color: var(--muted); margin-top: 1px; }
        .step-connector { width: 1.5px; height: 18px; background: var(--border); margin: 0 0 4px 31px; }

        /* Edit banner in sidebar */
        .edit-banner {
          margin-top: auto;
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 16px; padding: 18px;
        }
        .edit-banner-icon { font-size: 1.4rem; margin-bottom: 8px; }
        .edit-banner-title { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .edit-banner-text { font-size: 0.74rem; color: var(--muted); line-height: 1.55; }

        /* ── Main content ── */
        .main-content { padding: clamp(28px, 4vw, 56px); max-width: 760px; }

        /* Mobile progress */
        .mobile-progress { display: none; gap: 6px; margin-bottom: 28px; }
        @media (max-width: 900px) { .mobile-progress { display: flex; } }
        .mobile-seg { flex: 1; height: 4px; border-radius: 4px; background: var(--border); transition: background 0.3s; }
        .mobile-seg.on { background: var(--orange); }

        .step-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--orange); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        .step-heading { font-family: 'Fraunces', serif; font-size: clamp(1.9rem, 4vw, 2.8rem); font-weight: 700; color: var(--text); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 6px; }
        .step-heading em { font-style: italic; color: var(--orange); }
        .step-sub { font-size: 0.88rem; color: var(--muted); margin-bottom: 32px; line-height: 1.55; }

        /* Fields */
        .field-wrap { margin-bottom: 20px; }
        .field-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
        .field-row { position: relative; }
        .field-input { width: 100%; background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px; padding: 13px 18px; font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: var(--text); outline: none; resize: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
        .field-input::placeholder { color: rgba(240,237,232,0.18); }
        .field-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(240,90,40,0.1); background: #1A1A20; }
        .saved-tick { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 0.85rem; color: var(--green); animation: fadeIn 0.2s ease; pointer-events: none; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-50%) scale(0.7)} to{opacity:1;transform:translateY(-50%) scale(1)} }
        .char-count { text-align: right; font-size: 11px; color: var(--muted); margin-top: 4px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 560px) { .two-col { grid-template-columns: 1fr; } }

        /* Section divider */
        .sec-div { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 10px; margin: 24px 0 16px; }
        .sec-div::after { content:''; flex:1; height:1px; background: var(--border); }

        /* Chips */
        .chip-group { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .chip { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 100px; border: 1.5px solid var(--border); background: var(--surface); font-size: 0.82rem; font-weight: 500; color: var(--muted); cursor: pointer; user-select: none; transition: all 0.18s; }
        .chip.active { background: var(--orange-glow); border-color: rgba(240,90,40,0.35); color: var(--text); }
        .chip:hover:not(.active) { border-color: rgba(255,255,255,0.18); color: var(--text); }
        .chip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); opacity: 0; transition: opacity 0.18s; flex-shrink: 0; }
        .chip.active .chip-dot { opacity: 1; }

        /* Steppers */
        .stepper { display: flex; align-items: center; background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px; overflow: hidden; width: fit-content; }
        .stepper-btn { width: 44px; height: 50px; background: transparent; border: none; color: var(--muted); font-size: 1.3rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; }
        .stepper-btn:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .stepper-val { min-width: 44px; text-align: center; font-size: 1rem; font-weight: 700; color: var(--text); border-left: 1px solid var(--border); border-right: 1px solid var(--border); height: 50px; display: flex; align-items: center; justify-content: center; }
        .stepper-lbl { font-size: 0.8rem; color: var(--muted); margin-bottom: 6px; }

        /* Price */
        .price-wrap { position: relative; }
        .price-pre { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--orange); font-weight: 700; font-size: 1rem; pointer-events: none; }
        .price-wrap .field-input { padding-left: 34px; }

        /* Drop zone */
        .drop-zone { border: 2px dashed var(--border); border-radius: 20px; padding: 36px 24px; text-align: center; cursor: pointer; transition: border-color 0.25s, background 0.25s; position: relative; background: var(--surface); }
        .drop-zone.dov { border-color: var(--orange); background: var(--orange-glow); }
        .drop-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .dz-icon { font-size: 2.2rem; margin-bottom: 10px; }
        .dz-title { font-weight: 600; font-size: 0.92rem; color: var(--text); margin-bottom: 4px; }
        .dz-sub { font-size: 0.76rem; color: var(--muted); }
        .upload-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 26px; background: transparent; border: 1.5px solid var(--orange); color: var(--orange); border-radius: 100px; font-family: 'Outfit', sans-serif; font-size: 0.84rem; font-weight: 700; cursor: pointer; transition: background 0.2s, color 0.2s; margin-top: 14px; letter-spacing: 0.04em; }
        .upload-btn:hover { background: var(--orange); color: #fff; }
        .upload-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .pb-wrap { height: 3px; background: var(--border); border-radius: 3px; margin-top: 6px; overflow: hidden; }
        .pb-fill { height: 100%; background: var(--orange); border-radius: 3px; transition: width 0.3s; }

        /* Image grid */
        .img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-top: 18px; }
        .img-item { position: relative; aspect-ratio: 1; border-radius: 14px; overflow: hidden; background: var(--surface); border: 1.5px solid var(--border); animation: popIn 0.3s ease; }
        @keyframes popIn { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        .img-item img { width: 100%; height: 100%; object-fit: cover; }
        .img-cover-badge { position: absolute; top: 7px; left: 7px; background: var(--orange); color: #fff; font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 7px; border-radius: 100px; }
        .img-del { position: absolute; top: 7px; right: 7px; width: 27px; height: 27px; background: rgba(15,15,18,0.85); border: 1px solid rgba(248,113,113,0.4); border-radius: 8px; color: var(--red); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; backdrop-filter: blur(4px); }
        .img-del:hover { background: rgba(248,113,113,0.2); }

        /* Alerts */
        .alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-radius: 13px; font-size: 0.82rem; font-weight: 500; margin-bottom: 18px; animation: alertIn 0.3s ease; line-height: 1.5; }
        @keyframes alertIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .alert.error { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.22); color: #FCA5A5; }
        .alert.warn  { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); color: #FCD34D; }

        /* Nav */
        .nav-row { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; gap: 10px; }
        .btn-back { display: inline-flex; align-items: center; gap: 7px; padding: 13px 24px; background: transparent; border: 1.5px solid var(--border); color: var(--muted); border-radius: 14px; font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .btn-back:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
        .btn-next { display: inline-flex; align-items: center; gap: 8px; padding: 13px 32px; background: var(--orange); border: none; color: #fff; border-radius: 14px; font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; box-shadow: 0 8px 24px rgba(240,90,40,0.28); }
        .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(240,90,40,0.4); }
        .btn-next:disabled { opacity: 0.42; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-save { background: linear-gradient(135deg, var(--orange), #FF8A5B); box-shadow: 0 8px 32px rgba(240,90,40,0.38); }
        .spinner { width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* View listing btn */
        .view-btn { display: inline-flex; align-items: center; gap: 7px; padding: 10px 18px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 600; color: var(--muted); cursor: pointer; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .view-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
      `}</style>

      <div className="page-shell">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div>
            <div className="sidebar-logo">Roo<span>Moo</span></div>
            <div className="sidebar-subtitle">Edit Listing</div>
          </div>

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

          <div className="edit-banner">
            <div className="edit-banner-icon">✏️</div>
            <div className="edit-banner-title">Editing Mode</div>
            <div className="edit-banner-text">Changes are saved when you click "Save Changes" on the final step.</div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main-content">
          {/* Mobile progress */}
          <div className="mobile-progress">
            {STEPS.map(s => <div key={s.id} className={`mobile-seg ${step >= s.id ? "on" : ""}`} />)}
          </div>

          <form onSubmit={handleSubmit}>

            {/* ══════════ STEP 1 ══════════ */}
            {step === 1 && (
              <div>
                <div className="step-eyebrow"><div className="eyebrow-dot" /> Step 1 of 3</div>
                <h1 className="step-heading">Edit property <em>details</em></h1>
                <p className="step-sub">Update your listing's name, description, and address.</p>

                <div className="field-wrap">
                  <label className="field-label">Property Name *</label>
                  <div className="field-row">
                    <input className="field-input" type="text" id="name" placeholder="e.g. Spacious 2BHK in Banjara Hills" maxLength={62} minLength={10} value={formData.name} onChange={handleChange} onBlur={() => markSaved("name")} />
                    {savedFields.includes("name") && <span className="saved-tick">✓ Saved</span>}
                  </div>
                  <div className="char-count">{formData.name.length} / 62</div>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Description *</label>
                  <div className="field-row">
                    <textarea className="field-input" id="description" rows={5} placeholder="Describe the property…" value={formData.description} onChange={handleChange} onBlur={() => markSaved("description")} />
                    {savedFields.includes("description") && <span className="saved-tick" style={{ top: 16, transform: "none" }}>✓ Saved</span>}
                  </div>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Address *</label>
                  <div className="field-row">
                    <input className="field-input" type="text" id="address" placeholder="Full address including area and city" value={formData.address} onChange={handleChange} onBlur={() => markSaved("address")} />
                    {savedFields.includes("address") && <span className="saved-tick">✓ Saved</span>}
                  </div>
                </div>

                <div className="nav-row">
                  <div />
                  <button type="button" className="btn-next" disabled={!canNext1} onClick={() => setStep(2)}>
                    Next: Details →
                  </button>
                </div>
              </div>
            )}

            {/* ══════════ STEP 2 ══════════ */}
            {step === 2 && (
              <div>
                <div className="step-eyebrow"><div className="eyebrow-dot" /> Step 2 of 3</div>
                <h1 className="step-heading">Update <em>pricing</em><br />& amenities</h1>
                <p className="step-sub">Adjust type, features, and rental pricing.</p>

                <div className="sec-div">Listing Type</div>
                <div className="chip-group">
                  {[{ id:"rent", label:"🏠 Rent" }, { id:"sale", label:"💰 Sale" }].map(o => (
                    <label key={o.id} className={`chip ${formData.type === o.id ? "active" : ""}`}>
                      <input type="checkbox" id={o.id} checked={formData.type === o.id} onChange={handleChange} style={{ display:"none" }} />
                      <div className="chip-dot" />{o.label}
                    </label>
                  ))}
                </div>

                <div className="sec-div">Amenities</div>
                <div className="chip-group">
                  {[{ id:"parking", label:"🅿️ Parking" }, { id:"furnished", label:"🛋️ Furnished" }, { id:"offer", label:"🏷️ Has Offer" }].map(o => (
                    <label key={o.id} className={`chip ${formData[o.id] ? "active" : ""}`}>
                      <input type="checkbox" id={o.id} checked={formData[o.id]} onChange={handleChange} style={{ display:"none" }} />
                      <div className="chip-dot" />{o.label}
                    </label>
                  ))}
                </div>

                <div className="sec-div">Rooms</div>
                <div style={{ display:"flex", gap:28, flexWrap:"wrap", marginBottom:20 }}>
                  {[{ id:"bedrooms",label:"Bedrooms",min:1,max:10 }, { id:"bathrooms",label:"Bathrooms",min:1,max:10 }].map(r => (
                    <div key={r.id}>
                      <div className="stepper-lbl">{r.label}</div>
                      <div className="stepper">
                        <button type="button" className="stepper-btn" onClick={() => setFormData(p => ({ ...p, [r.id]: Math.max(r.min, p[r.id]-1) }))}>−</button>
                        <div className="stepper-val">{formData[r.id]}</div>
                        <button type="button" className="stepper-btn" onClick={() => setFormData(p => ({ ...p, [r.id]: Math.min(r.max, p[r.id]+1) }))}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sec-div">Pricing</div>
                <div className="two-col">
                  <div className="field-wrap">
                    <label className="field-label">Regular Price {formData.type === "rent" && <span style={{ color:"var(--orange)", fontWeight:400 }}>/ month</span>}</label>
                    <div className="price-wrap">
                      <span className="price-pre">₹</span>
                      <input className="field-input" type="number" id="regularPrice" min={1000} max={10000000} value={formData.regularPrice} onChange={handleChange} />
                    </div>
                  </div>
                  {formData.offer && (
                    <div className="field-wrap">
                      <label className="field-label">Discounted Price {formData.type === "rent" && <span style={{ color:"var(--orange)", fontWeight:400 }}>/ month</span>}</label>
                      <div className="price-wrap">
                        <span className="price-pre">₹</span>
                        <input className="field-input" type="number" id="discountPrice" min={0} max={10000000} value={formData.discountPrice} onChange={handleChange} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="nav-row">
                  <button type="button" className="btn-back" onClick={() => setStep(1)}>← Back</button>
                  <button type="button" className="btn-next" disabled={!canNext2} onClick={() => setStep(3)}>Next: Photos →</button>
                </div>
              </div>
            )}

            {/* ══════════ STEP 3 ══════════ */}
            {step === 3 && (
              <div>
                <div className="step-eyebrow"><div className="eyebrow-dot" /> Step 3 of 3</div>
                <h1 className="step-heading">Manage your <em>photos</em></h1>
                <p className="step-sub">Add new images or remove existing ones. First image is the cover.</p>

                {error && <div className="alert error"><span>⚠️</span>{error}</div>}
                {imageUploadError && <div className="alert warn"><span>⚠️</span>{imageUploadError}</div>}

                {/* Existing images */}
                {formData.imageUrls.length > 0 && (
                  <>
                    <div style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--muted)", marginBottom:10 }}>
                      Current Images ({formData.imageUrls.length}/6)
                    </div>
                    <div className="img-grid">
                      {formData.imageUrls.map((url, i) => (
                        <div key={url} className="img-item">
                          <img src={url} alt={`listing-${i}`} />
                          {i === 0 && <div className="img-cover-badge">Cover</div>}
                          <button type="button" className="img-del" onClick={() => handleRemoveImage(i)} title="Remove">✕</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Upload new */}
                {formData.imageUrls.length < 6 && (
                  <div style={{ marginTop: formData.imageUrls.length ? 24 : 0 }}>
                    <div style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--muted)", marginBottom:10 }}>
                      Add More Images ({6 - formData.imageUrls.length} remaining)
                    </div>
                    <div
                      className={`drop-zone ${dragOver ? "dov" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); setFiles(e.dataTransfer.files); }}
                    >
                      <input type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} />
                      <div className="dz-icon">📸</div>
                      <div className="dz-title">Drop new images here or click to browse</div>
                      <div className="dz-sub">PNG, JPG, WEBP · max 2 MB each</div>
                      {files.length > 0 && (
                        <div style={{ marginTop:10, fontSize:"0.8rem", color:"var(--orange)", fontWeight:600 }}>
                          {files.length} file{files.length > 1 ? "s" : ""} selected
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <button type="button" className="upload-btn" disabled={uploading || !files.length} onClick={handleImageSubmit}>
                        {uploading ? <><div className="spinner" /> Uploading…</> : <>⬆ Upload Images</>}
                      </button>
                    </div>
                    {Object.entries(uploadProgress).map(([name, pct]) => (
                      <div key={name} style={{ marginTop:10 }}>
                        <div style={{ fontSize:"0.74rem", color:"var(--muted)", marginBottom:3 }}>{name.slice(13)} — {pct}%</div>
                        <div className="pb-wrap"><div className="pb-fill" style={{ width:`${pct}%` }} /></div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop:12, fontSize:"0.78rem", color:"var(--muted)" }}>
                  {formData.imageUrls.length} / 6 images
                </div>

                <div className="nav-row">
                  <button type="button" className="btn-back" onClick={() => setStep(2)}>← Back</button>
                  <button
                    type="submit"
                    className="btn-next btn-save"
                    disabled={loading || uploading || !formData.imageUrls.length}
                  >
                    {loading ? <><div className="spinner" /> Saving…</> : <>💾 Save Changes</>}
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