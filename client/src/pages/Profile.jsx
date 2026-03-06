import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL, getStorage, ref, uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart,
} from "../redux/user/userSlice";
import {
  FaUser, FaEnvelope, FaLock, FaCamera, FaSignOutAlt, FaTrashAlt,
  FaPlus, FaEdit, FaHome, FaBed, FaBath, FaMapMarkerAlt, FaEye,
  FaCheckCircle, FaShieldAlt, FaStar, FaBuilding
} from "react-icons/fa";
import { MdOutlineVerified, MdDashboard } from "react-icons/md";
import { BsHouseDoor, BsLightningChargeFill } from "react-icons/bs";
import { HiOutlineClipboardList } from "react-icons/hi";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => { if (file) handleFileUpload(file); }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_changed",
      (snapshot) => setFilePerc(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      () => setFileUploadError(true),
      () => getDownloadURL(uploadTask.snapshot.ref).then((url) => setFormData({ ...formData, avatar: url }))
    );
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) { dispatch(updateUserFailure(data.message)); return; }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) { dispatch(updateUserFailure(error.message)); }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      dispatch(deleteUserSuccess(data));
    } catch (error) { dispatch(deleteUserFailure(error.message)); }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      dispatch(deleteUserSuccess(data));
    } catch (error) { dispatch(deleteUserFailure(error.message)); }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) { setShowListingsError(true); return; }
      setUserListings(data);
      setActiveTab("listings");
    } catch { setShowListingsError(true); }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success === false) { console.log(data.message); return; }
      setUserListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (error) { console.log(error.message); }
  };

  const avatarSrc = formData.avatar || currentUser.avatar;

  return (
    <section style={{ background: "#0c0906", minHeight: "100vh", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;800&family=Syne:wght@500;600;700;800&family=Lato:wght@300;400;700&display=swap');
        *{box-sizing:border-box;}
        :root{
          --brand:#dc4a11;--brand-light:#ff7b45;
          --dark:#0c0906;--dark2:#131009;--card:#1a1510;--card2:#201a13;
          --border:rgba(255,255,255,.08);--text:#f0ebe5;--muted:#8a8078;
          --green:#22c55e;--red:#ef4444;
        }
        .pf-fd{font-family:'Cormorant Garamond',serif;}
        .pf-fu{font-family:'Syne',sans-serif;}
        .pf-fb{font-family:'Lato',sans-serif;}

        /* Layout */
        .pf-wrap{max-width:1100px;margin:0 auto;padding:0 20px;}
        .pf-grid{display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:start;}
        @media(max-width:800px){.pf-grid{grid-template-columns:1fr;}}

        /* Header banner */
        .pf-banner{background:linear-gradient(135deg,#1a0e06 0%,#0e0a06 50%,#1c1108 100%);border-bottom:1px solid rgba(220,74,17,.2);padding:32px 20px 60px;}
        .pf-banner-inner{max-width:1100px;margin:0 auto;padding:0 20px;}

        /* Card */
        .pf-card{background:var(--card);border:1px solid var(--border);border-radius:18px;overflow:hidden;transition:border-color .3s;}
        .pf-card:hover{border-color:rgba(220,74,17,.18);}
        .pf-card-header{background:linear-gradient(135deg,#1e1610 0%,#160f0a 100%);border-bottom:1px solid var(--border);padding:18px 22px;display:flex;align-items:center;gap:10px;}
        .pf-card-body{padding:22px;}

        /* Avatar */
        .pf-avatar-wrap{position:relative;width:100px;height:100px;margin:0 auto 8px;}
        .pf-avatar-ring{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--brand-light));padding:3px;}
        .pf-avatar-inner{width:100%;height:100%;border-radius:50%;overflow:hidden;background:var(--dark2);}
        .pf-avatar-btn{position:absolute;bottom:0;right:0;width:30px;height:30px;border-radius:50%;background:var(--brand);border:2px solid var(--dark);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s,transform .15s;}
        .pf-avatar-btn:hover{background:#b83a0c;transform:scale(1.1);}

        /* Tabs */
        .pf-tabs{display:flex;gap:4px;padding:6px;background:rgba(255,255,255,.04);border-radius:12px;border:1px solid var(--border);margin-bottom:22px;}
        .pf-tab{flex:1;font-family:'Syne',sans-serif;font-weight:600;font-size:12px;letter-spacing:.04em;text-transform:uppercase;background:none;border:none;border-radius:8px;padding:9px 8px;cursor:pointer;transition:all .2s;color:var(--muted);display:flex;align-items:center;justify-content:center;gap:6px;}
        .pf-tab.on{background:rgba(220,74,17,.15);color:var(--brand);border:1px solid rgba(220,74,17,.3);}
        .pf-tab:hover:not(.on){color:var(--text);}

        /* Input */
        .pf-label{font-family:'Syne',sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);font-weight:700;display:block;margin-bottom:7px;}
        .pf-input{font-family:'Lato',sans-serif;font-size:14px;background:rgba(255,255,255,.05);border:1.5px solid var(--border);border-radius:10px;padding:12px 14px 12px 40px;color:var(--text);width:100%;transition:border-color .25s,box-shadow .25s;}
        .pf-input:focus{outline:none;border-color:rgba(220,74,17,.5);box-shadow:0 0 0 3px rgba(220,74,17,.1);}
        .pf-input::placeholder{color:var(--muted);}
        .pf-field{position:relative;margin-bottom:16px;}
        .pf-field-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--brand);font-size:14px;pointer-events:none;}

        /* Buttons */
        .pf-btn-primary{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;letter-spacing:.05em;background:var(--brand);color:#fff;border:none;border-radius:10px;padding:13px 20px;cursor:pointer;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .2s,transform .15s,box-shadow .2s;box-shadow:0 5px 22px rgba(220,74,17,.3);}
        .pf-btn-primary:hover:not(:disabled){background:#b83a0c;transform:translateY(-1px);box-shadow:0 8px 30px rgba(220,74,17,.4);}
        .pf-btn-primary:disabled{opacity:.55;cursor:not-allowed;transform:none;}

        .pf-btn-blue{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;letter-spacing:.05em;background:rgba(59,130,246,.15);color:#60a5fa;border:1px solid rgba(59,130,246,.3);border-radius:10px;padding:13px 20px;cursor:pointer;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;transition:all .2s;}
        .pf-btn-blue:hover{background:rgba(59,130,246,.25);border-color:rgba(59,130,246,.5);}

        .pf-btn-ghost{font-family:'Syne',sans-serif;font-weight:600;font-size:12px;letter-spacing:.04em;background:rgba(255,255,255,.04);color:var(--muted);border:1px solid var(--border);border-radius:8px;padding:10px 16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;width:100%;}
        .pf-btn-ghost:hover{color:var(--text);border-color:rgba(255,255,255,.18);}

        .pf-btn-danger{font-family:'Syne',sans-serif;font-weight:600;font-size:12px;letter-spacing:.04em;background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.25);border-radius:8px;padding:10px 16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;width:100%;}
        .pf-btn-danger:hover{background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.45);}

        /* Stat mini */
        .pf-stat{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:10px;padding:14px 16px;text-align:center;flex:1;}

        /* Upload progress */
        .pf-prog-bg{background:rgba(255,255,255,.08);border-radius:999px;height:4px;margin-top:6px;}
        .pf-prog-fill{height:4px;border-radius:999px;background:linear-gradient(90deg,var(--brand),var(--brand-light));transition:width .3s;}

        /* Listing card */
        .pf-listing-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:14px;overflow:hidden;display:flex;gap:0;transition:border-color .25s,transform .25s;}
        .pf-listing-card:hover{border-color:rgba(220,74,17,.28);transform:translateY(-2px);}

        /* Badge */
        .pf-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(220,74,17,.12);border:1px solid rgba(220,74,17,.28);color:var(--brand-light);font-family:'Syne',sans-serif;font-weight:700;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:3px 9px;border-radius:999px;}
        .pf-badge-green{background:rgba(34,197,94,.1);border-color:rgba(34,197,94,.25);color:#4ade80;}
        .pf-badge-blue{background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.25);color:#60a5fa;}

        /* Divider */
        .pf-divider{width:100%;height:1px;background:linear-gradient(90deg,rgba(220,74,17,.25),transparent);margin:18px 0;}

        /* Confirm modal */
        .pf-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
        .pf-modal{background:var(--card2);border:1px solid rgba(239,68,68,.3);border-radius:18px;padding:28px;max-width:360px;width:100%;}

        /* Toast */
        @keyframes pf-toast-in{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        .pf-toast{animation:pf-toast-in .3s ease;}

        /* Scroll */
        @keyframes pf-fadeup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .pf-fade{animation:pf-fadeup .5s ease;}

        /* Sidebar profile float */
        .pf-sidebar-avatar{margin-top:-52px;position:relative;z-index:2;}
      `}</style>

      {/* ── Banner ── */}
      <div className="pf-banner">
        <div className="pf-banner-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MdDashboard style={{ color: "var(--brand)", fontSize: 20 }} />
            <span className="pf-fu" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(255,255,255,.5)", fontWeight: 700 }}>My Account</span>
          </div>
          <h1 className="pf-fd" style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, color: "var(--text)", marginTop: 8, lineHeight: 1.1 }}>
            Welcome back,{" "}
            <span style={{ color: "var(--brand)" }}>{currentUser.username}</span>
          </h1>
          <p className="pf-fb" style={{ fontSize: 15, color: "var(--muted)", marginTop: 6, fontWeight: 300 }}>
            Manage your profile, properties, and account settings from one place.
          </p>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="pf-wrap" style={{ marginTop: 50 }}>
        <div className="pf-grid pf-fade">

          {/* ══ LEFT SIDEBAR ══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Profile summary card */}
            <div className="pf-card" style={{ margin: "10px" }}>
              <div style={{ background: "linear-gradient(135deg,rgba(220,74,17,.18) 0%,transparent 60%)", padding: "24px 22px 0", textAlign: "center" }}>
                {/* Avatar */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 90, height: 90 }}>
                    <div className="pf-avatar-ring" style={{ width: 90, height: 90 }}>
                      <div className="pf-avatar-inner">
                        <img src={avatarSrc} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    </div>
                    <button className="pf-avatar-btn" onClick={() => fileRef.current.click()} title="Change photo">
                      <FaCamera style={{ color: "#fff", fontSize: 12 }} />
                    </button>
                  </div>
                </div>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />

                {/* Upload status */}
                {fileUploadError && (
                  <p className="pf-fb" style={{ fontSize: 11, color: "#f87171", marginTop: 6 }}>Image must be under 2 MB</p>
                )}
                {filePerc > 0 && filePerc < 100 && (
                  <div style={{ padding: "4px 16px" }}>
                    <div className="pf-fb" style={{ fontSize: 11, color: "var(--brand)", marginBottom: 4 }}>Uploading {filePerc}%</div>
                    <div className="pf-prog-bg"><div className="pf-prog-fill" style={{ width: `${filePerc}%` }} /></div>
                  </div>
                )}
                {filePerc === 100 && (
                  <p className="pf-fb" style={{ fontSize: 11, color: "#4ade80", marginTop: 6 }}>✓ Photo updated</p>
                )}

                <h2 className="pf-fu" style={{ fontWeight: 700, fontSize: 18, color: "var(--text)", marginTop: 10 }}>{currentUser.username}</h2>
                <p className="pf-fb" style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>{currentUser.email}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
                  <span className="pf-badge pf-badge-blue"><MdOutlineVerified /> Verified</span>
                  <span className="pf-badge pf-badge-green">🏠 Landlord</span>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 8, padding: "0 16px 18px" }}>
                <div className="pf-stat">
                  <div className="pf-fu" style={{ fontSize: 20, fontWeight: 800, color: "var(--brand)" }}>{userListings.length || "—"}</div>
                  <div className="pf-fb" style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 3 }}>Properties</div>
                </div>
                <div className="pf-stat">
                  <div className="pf-fu" style={{ fontSize: 20, fontWeight: 800, color: "var(--brand)" }}>4.8★</div>
                  <div className="pf-fb" style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 3 }}>Rating</div>
                </div>
                <div className="pf-stat">
                  <div className="pf-fu" style={{ fontSize: 20, fontWeight: 800, color: "var(--brand)" }}>12</div>
                  <div className="pf-fb" style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 3 }}>Reviews</div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="pf-card">
              <div className="pf-card-header">
                <BsLightningChargeFill style={{ color: "var(--brand)", fontSize: 15 }} />
                <span className="pf-fu" style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text)" }}>Quick Actions</span>
              </div>
              <div className="pf-card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link to="/create-listing" style={{ textDecoration: "none" }}>
                  <div className="pf-btn-blue">
                    <FaPlus style={{ fontSize: 12 }} /> Upload New Property
                  </div>
                </Link>
                <button className="pf-btn-ghost" onClick={handleShowListings}>
                  <HiOutlineClipboardList style={{ fontSize: 15 }} /> View My Properties
                </button>
                <button className="pf-btn-ghost" onClick={() => setActiveTab("profile")}>
                  <FaUser style={{ fontSize: 12 }} /> Edit Profile
                </button>
              </div>
            </div>

            {/* Trust & Safety */}
            <div className="pf-card">
              <div className="pf-card-header">
                <FaShieldAlt style={{ color: "var(--brand)", fontSize: 14 }} />
                <span className="pf-fu" style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text)" }}>Account Status</span>
              </div>
              <div className="pf-card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: <FaCheckCircle />, label: "Email Verified", ok: true },
                  { icon: <MdOutlineVerified />, label: "Identity Verified", ok: true },
                  { icon: <FaShieldAlt />, label: "Trusted Landlord", ok: true },
                  { icon: <FaStar />, label: "Top Rated Host", ok: false },
                ].map(({ icon, label, ok }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: ok ? "var(--green)" : "var(--muted)", fontSize: 14 }}>{icon}</span>
                    <span className="pf-fb" style={{ fontSize: 13, color: ok ? "var(--text)" : "var(--muted)" }}>{label}</span>
                    {ok
                      ? <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--green)", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>✓</span>
                      : <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>Pending</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ RIGHT PANEL ══ */}
          <div>
            {/* Tab bar */}
            <div className="pf-tabs">
              {[
                { id: "profile", label: "Profile", icon: <FaUser style={{ fontSize: 11 }} /> },
                { id: "listings", label: "Properties", icon: <FaBuilding style={{ fontSize: 11 }} /> },
                { id: "settings", label: "Settings", icon: <FaShieldAlt style={{ fontSize: 11 }} /> },
              ].map(({ id, label, icon }) => (
                <button key={id} className={`pf-tab ${activeTab === id ? "on" : ""}`} onClick={() => { setActiveTab(id); if (id === "listings" && userListings.length === 0) handleShowListings(); }}>
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <div className="pf-card pf-fade">
                <div className="pf-card-header">
                  <FaUser style={{ color: "var(--brand)", fontSize: 14 }} />
                  <span className="pf-fu" style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text)" }}>Edit Profile</span>
                  <span className="pf-badge" style={{ marginLeft: "auto" }}>Personal Info</span>
                </div>
                <div className="pf-card-body">
                  {/* Success / Error toasts */}
                  {updateSuccess && (
                    <div className="pf-toast" style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.28)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                      <FaCheckCircle style={{ color: "#4ade80", fontSize: 16 }} />
                      <span className="pf-fu" style={{ fontSize: 13, color: "#4ade80", fontWeight: 600 }}>Profile updated successfully!</span>
                    </div>
                  )}
                  {error && (
                    <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.28)", borderRadius: 10, padding: "12px 16px", marginBottom: 18 }}>
                      <span className="pf-fu" style={{ fontSize: 13, color: "#f87171", fontWeight: 600 }}>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 16 }}>
                      {/* Username */}
                      <div>
                        <label className="pf-label">Username</label>
                        <div className="pf-field">
                          <FaUser className="pf-field-icon" />
                          <input type="text" id="username" placeholder="Username" defaultValue={currentUser.username}
                            className="pf-input" onChange={handleChange} />
                        </div>
                      </div>
                      {/* Email */}
                      <div>
                        <label className="pf-label">Email Address</label>
                        <div className="pf-field">
                          <FaEnvelope className="pf-field-icon" />
                          <input type="email" id="email" placeholder="Email" defaultValue={currentUser.email}
                            className="pf-input" onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 24 }}>
                      <label className="pf-label">New Password</label>
                      <div className="pf-field" style={{ marginBottom: 0 }}>
                        <FaLock className="pf-field-icon" />
                        <input type={showPassword ? "text" : "password"} id="password" placeholder="Leave blank to keep current password"
                          className="pf-input" style={{ paddingRight: 44 }} onChange={handleChange} />
                        <button type="button" onClick={() => setShowPassword(v => !v)}
                          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>
                          {showPassword ? "HIDE" : "SHOW"}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="pf-btn-primary" disabled={loading}>
                      {loading ? <><span style={{ animation: "pf-spin .8s linear infinite", display: "inline-block" }}>⏳</span> Saving…</> : <><FaCheckCircle style={{ fontSize: 13 }} /> Save Changes</>}
                    </button>
                    <style>{`@keyframes pf-spin{to{transform:rotate(360deg)}}`}</style>
                  </form>

                  <div className="pf-divider" />

                  {/* Bio / About section */}
                  <div>
                    <div className="pf-label" style={{ marginBottom: 10 }}>About You</div>
                    <p className="pf-fb" style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75 }}>
                      As a verified landlord on Roomiii, your profile helps build trust with potential tenants. Keep your details up to date to get more enquiries.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 10, marginTop: 14 }}>
                      {[
                        { icon: <MdOutlineVerified />, label: "Verified Landlord" },
                        { icon: <FaShieldAlt />, label: "Background Checked" },
                        { icon: <BsHouseDoor />, label: "Active Since 2023" },
                        { icon: <FaStar />, label: "4.8 Avg. Rating" },
                      ].map(({ icon, label }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(255,255,255,.03)", border: "1px solid var(--border)", borderRadius: 10 }}>
                          <span style={{ color: "var(--brand)", fontSize: 14 }}>{icon}</span>
                          <span className="pf-fb" style={{ fontSize: 12, color: "var(--text)" }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── LISTINGS TAB ── */}
            {activeTab === "listings" && (
              <div className="pf-fade">
                <div className="pf-card" style={{ marginBottom: 18 }}>
                  <div className="pf-card-header" style={{ justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <FaBuilding style={{ color: "var(--brand)", fontSize: 14 }} />
                      <span className="pf-fu" style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text)" }}>My Properties</span>
                    </div>
                    <span className="pf-badge">{userListings.length} Listed</span>
                  </div>
                  <div className="pf-card-body" style={{ paddingBottom: 10 }}>
                    {showListingsError && (
                      <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
                        <span className="pf-fu" style={{ fontSize: 13, color: "#f87171" }}>Failed to load listings. Please try again.</span>
                      </div>
                    )}

                    {userListings.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "32px 16px" }}>
                        <span style={{ fontSize: 44 }}>🏚️</span>
                        <div className="pf-fd" style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginTop: 10 }}>No Properties Yet</div>
                        <p className="pf-fb" style={{ fontSize: 14, color: "var(--muted)", marginTop: 6, marginBottom: 20 }}>Start by uploading your first property listing.</p>
                        <Link to="/create-listing" style={{ textDecoration: "none" }}>
                          <button className="pf-btn-blue" style={{ width: "auto", margin: "0 auto", padding: "12px 28px" }}>
                            <FaPlus /> Upload Property
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {userListings.map((listing) => (
                          <div key={listing._id} className="pf-listing-card">
                            {/* Image */}
                            <Link to={`/listing/${listing._id}`} style={{ flexShrink: 0 }}>
                              <div style={{ width: 100, height: "100%", minHeight: 90, background: `url(${listing.imageUrls[0]}) center/cover no-repeat`, position: "relative" }}>
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(26,21,16,1) 100%)" }} />
                              </div>
                            </Link>

                            {/* Info */}
                            <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
                              <Link to={`/listing/${listing._id}`} style={{ textDecoration: "none" }}>
                                <h3 className="pf-fu" style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {listing.name}
                                </h3>
                              </Link>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                <FaMapMarkerAlt style={{ color: "var(--brand)", fontSize: 11, flexShrink: 0 }} />
                                <span className="pf-fb" style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{listing.address}</span>
                              </div>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <span className="pf-badge" style={{ fontSize: 10 }}>{listing.type === "rent" ? "For Rent" : "For Sale"}</span>
                                {listing.bedrooms && (
                                  <span className="pf-badge pf-badge-blue" style={{ fontSize: 10 }}>
                                    <FaBed style={{ fontSize: 9 }} /> {listing.bedrooms} bed
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "14px 14px 14px 0", flexShrink: 0 }}>
                              <Link to={`/update-listing/${listing._id}`} style={{ textDecoration: "none" }}>
                                <button style={{ background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.25)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#60a5fa", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".04em", transition: "all .2s", whiteSpace: "nowrap" }}>
                                  <FaEdit style={{ fontSize: 10 }} /> Edit
                                </button>
                              </Link>
                              <Link to={`/listing/${listing._id}`} style={{ textDecoration: "none" }}>
                                <button style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".04em", transition: "all .2s", whiteSpace: "nowrap" }}>
                                  <FaEye style={{ fontSize: 10 }} /> View
                                </button>
                              </Link>
                              <button onClick={() => handleListingDelete(listing._id)}
                                style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.22)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#f87171", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".04em", transition: "all .2s", whiteSpace: "nowrap" }}>
                                <FaTrashAlt style={{ fontSize: 10 }} /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload prompt */}
                <div className="pf-card">
                  <div className="pf-card-body" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div className="pf-fu" style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>Have a new property?</div>
                      <div className="pf-fb" style={{ fontSize: 13, color: "var(--muted)" }}>List it on Roomiii and reach thousands of verified tenants in Hyderabad.</div>
                    </div>
                    <Link to="/create-listing" style={{ textDecoration: "none", flexShrink: 0 }}>
                      <button className="pf-btn-primary" style={{ width: "auto", padding: "12px 24px" }}>
                        <FaPlus style={{ fontSize: 12 }} /> Upload Property
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === "settings" && (
              <div className="pf-card pf-fade">
                <div className="pf-card-header">
                  <FaShieldAlt style={{ color: "var(--brand)", fontSize: 14 }} />
                  <span className="pf-fu" style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text)" }}>Account Settings</span>
                </div>
                <div className="pf-card-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Sign out */}
                  <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
                    <div className="pf-fu" style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Sign Out</div>
                    <div className="pf-fb" style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>You'll need to sign back in to access your account.</div>
                    <button className="pf-btn-ghost" style={{ width: "auto" }} onClick={handleSignOut}>
                      <FaSignOutAlt style={{ fontSize: 13 }} /> Sign Out of Account
                    </button>
                  </div>

                  <div className="pf-divider" style={{ margin: "0" }} />

                  {/* Danger zone */}
                  <div style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.18)", borderRadius: 12, padding: "18px 20px" }}>
                    <div className="pf-fu" style={{ fontWeight: 700, fontSize: 14, color: "#f87171", marginBottom: 4 }}>Danger Zone</div>
                    <div className="pf-fb" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 14 }}>
                      Permanently delete your account and all associated listings. This action <strong style={{ color: "#f87171" }}>cannot be undone</strong>.
                    </div>
                    <button className="pf-btn-danger" style={{ width: "auto" }} onClick={() => setShowDeleteConfirm(true)}>
                      <FaTrashAlt style={{ fontSize: 11 }} /> Delete My Account
                    </button>
                  </div>

                  {/* Privacy note */}
                  <div style={{ display: "flex", gap: 10, padding: "14px 16px", background: "rgba(255,255,255,.03)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <FaShieldAlt style={{ color: "var(--brand)", fontSize: 16, flexShrink: 0, marginTop: 1 }} />
                    <p className="pf-fb" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
                      Roomiii never sells your personal data. Your account is protected with industry-standard encryption and verified identity checks.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Delete Confirm Modal ── */}
      {showDeleteConfirm && (
        <div className="pf-modal-bg" onClick={() => setShowDeleteConfirm(false)}>
          <div className="pf-modal pf-fade" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 40 }}>⚠️</span>
              <h2 className="pf-fd" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", marginTop: 10 }}>Delete Account?</h2>
              <p className="pf-fb" style={{ fontSize: 14, color: "var(--muted)", marginTop: 8, lineHeight: 1.7 }}>
                This will permanently remove your account and all {userListings.length} listed properties. This cannot be reversed.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="pf-btn-ghost" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="pf-btn-danger" style={{ flex: 1 }} onClick={() => { handleDeleteUser(); setShowDeleteConfirm(false); }}>
                <FaTrashAlt style={{ fontSize: 11 }} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}