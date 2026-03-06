import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import payimg from "../assets/NavBar/Pay.png";
import { useSelector } from "react-redux";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import Contact from "../components/Contact";

SwiperCore.use([Navigation, Autoplay, Pagination]);

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: "2px",
            fontSize: "1.8rem", lineHeight: 1,
            color: star <= (hovered || value) ? "#F05A28" : "rgba(255,255,255,0.12)",
            transition: "color 0.15s, transform 0.15s",
            transform: star <= (hovered || value) ? "scale(1.15)" : "scale(1)",
          }}
        >★</button>
      ))}
    </div>
  );
}

function AmenityBadge({ icon, label, active }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 18px",
      background: active ? "rgba(240,90,40,0.1)" : "rgba(255,255,255,0.04)",
      border: `1.5px solid ${active ? "rgba(240,90,40,0.3)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 14,
      color: active ? "#F2EFE9" : "rgba(242,239,233,0.35)",
      fontSize: "0.85rem", fontWeight: 600,
      transition: "all 0.2s",
    }}>
      <span style={{ fontSize: "1rem" }}>{icon}</span>
      {label}
    </div>
  );
}

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const params = useParams();
  const { currentUser } = useSelector((s) => s.user);
  const isOwner = currentUser && listing && listing.userRef === currentUser._id;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) { setError(true); setLoading(false); return; }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch { setError(true); setLoading(false); }
    };
    fetchListing();
  }, [params.listingId]);

  const formattedPrice = listing
    ? (listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString("en-IN")
    : "";

  const checkoutHandler = async () => {
    try {
      const keyRes = await fetch("/api/getkey");
      const { key } = await keyRes.json();
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: params.listingId,
          price: listing.offer ? listing.discountPrice : listing.regularPrice,
          userId: currentUser.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) return;
      const options = {
        key, amount: data.amount, currency: "INR",
        name: "RooMoo Official", description: "Property Booking",
        image: payimg, order_id: data.order_id,
        prefill: { name: currentUser.username, email: currentUser.email },
        theme: { color: "#F05A28" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/payment/paymentverification", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              listingId: params.listingId,
              userId: currentUser.id,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) console.log("Payment verified");
        },
      };
      new Razorpay(options).open();
    } catch (err) { console.error(err); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    setReviewSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0B0B0E", minHeight: "100vh", color: "#F2EFE9" }}>
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
          --muted: rgba(242,239,233,0.45);
        }

        /* ── Gallery ── */
        .gallery-wrap { position: relative; width: 100%; height: clamp(320px, 55vw, 600px); background: #0B0B0E; }
        .gallery-overlay {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(to bottom, rgba(11,11,14,0.3) 0%, transparent 30%, transparent 60%, rgba(11,11,14,0.9) 100%);
        }
        .swiper { height: 100% !important; }
        .swiper-slide { height: 100% !important; }
        .gallery-count {
          position: absolute; bottom: 24px; right: 24px; z-index: 10;
          background: rgba(11,11,14,0.75); backdrop-filter: blur(8px);
          border: 1px solid var(--border); border-radius: 100px;
          padding: 6px 14px; font-size: 12px; font-weight: 600;
          color: var(--muted);
        }

        /* ── Share btn ── */
        .share-btn {
          position: fixed; top: 80px; right: 20px; z-index: 50;
          width: 44px; height: 44px; border-radius: 14px;
          background: rgba(20,20,24,0.9); backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s, transform 0.2s;
          color: var(--muted);
        }
        .share-btn:hover { border-color: rgba(255,255,255,0.2); transform: scale(1.05); color: var(--text); }
        .copied-toast {
          position: fixed; top: 132px; right: 20px; z-index: 50;
          background: rgba(20,20,24,0.95); backdrop-filter: blur(12px);
          border: 1px solid rgba(74,222,128,0.25); border-radius: 10px;
          padding: 8px 14px; font-size: 12px; font-weight: 600; color: #4ADE80;
          animation: toastIn 0.25s ease;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Page layout ── */
        .page-body {
          max-width: 1200px; margin: 0 auto;
          padding: clamp(28px, 4vw, 52px) clamp(16px, 4vw, 48px);
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 36px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .page-body { grid-template-columns: 1fr; }
          .sidebar-col { order: -1; }
        }

        /* ── Price tag ── */
        .price-tag {
          display: inline-flex; align-items: baseline; gap: 6px;
          margin-bottom: 14px;
        }
        .price-amount {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700; color: var(--text); letter-spacing: -0.02em;
        }
        .price-unit { font-size: 0.9rem; color: var(--muted); font-weight: 400; }
        .price-original {
          font-size: 1.1rem; color: var(--muted);
          text-decoration: line-through; margin-left: 4px;
        }

        /* ── Badges ── */
        .badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .badge {
          padding: 6px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .badge-rent  { background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.25); color: #93C5FD; }
        .badge-sale  { background: rgba(74,222,128,0.1);  border: 1px solid rgba(74,222,128,0.25); color: #86EFAC; }
        .badge-offer { background: rgba(240,90,40,0.12);  border: 1px solid rgba(240,90,40,0.3);   color: var(--orange); }

        /* ── Title ── */
        .listing-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(1.6rem, 3.5vw, 2.5rem);
          font-weight: 700; line-height: 1.15; letter-spacing: -0.02em;
          color: var(--text); margin-bottom: 12px;
        }
        .listing-address {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.88rem; color: var(--muted); margin-bottom: 28px;
        }

        /* ── Tabs ── */
        .tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
        .tab-btn {
          padding: 10px 20px;
          background: none; border: none; border-bottom: 2.5px solid transparent;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem; font-weight: 600;
          color: var(--muted); cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          margin-bottom: -1px;
        }
        .tab-btn.active { color: var(--text); border-bottom-color: var(--orange); }
        .tab-btn:hover:not(.active) { color: var(--text); }

        /* ── Description ── */
        .desc-text {
          font-size: 0.92rem; color: var(--muted);
          line-height: 1.75; font-weight: 300;
        }

        /* ── Amenities grid ── */
        .amenities-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 10px; margin-top: 8px;
        }

        /* ── Rating section ── */
        .review-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 28px; margin-top: 8px;
        }
        .review-title {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem; font-weight: 700; color: var(--text);
          margin-bottom: 6px;
        }
        .review-sub { font-size: 0.8rem; color: var(--muted); margin-bottom: 20px; }
        .review-textarea {
          width: 100%; background: var(--surface-2);
          border: 1.5px solid var(--border); border-radius: 12px;
          padding: 12px 16px; font-family: 'Outfit', sans-serif;
          font-size: 0.88rem; color: var(--text); resize: none;
          outline: none; margin-top: 16px;
          transition: border-color 0.2s;
        }
        .review-textarea::placeholder { color: rgba(242,239,233,0.2); }
        .review-textarea:focus { border-color: rgba(240,90,40,0.4); }
        .review-submit {
          margin-top: 16px; padding: 12px 28px;
          background: var(--orange); border: none; border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 700;
          color: #fff; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(240,90,40,0.3);
        }
        .review-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(240,90,40,0.4); }
        .review-submit:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        /* ── Sidebar ── */
        .sidebar-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          position: sticky; top: 24px;
        }
        .sidebar-price-bar {
          background: linear-gradient(135deg, #1A1A1F, #1E1E26);
          padding: 24px 24px 20px;
          border-bottom: 1px solid var(--border);
        }
        .sidebar-price-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--muted); margin-bottom: 6px;
        }
        .sidebar-price {
          font-family: 'Fraunces', serif;
          font-size: 2rem; font-weight: 700; color: var(--text);
        }
        .sidebar-price-unit { font-size: 0.85rem; color: var(--muted); margin-left: 4px; }
        .sidebar-discount {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(240,90,40,0.12); border: 1px solid rgba(240,90,40,0.2);
          border-radius: 8px; padding: 4px 10px;
          font-size: 11px; font-weight: 700; color: var(--orange);
          margin-top: 8px;
        }
        .sidebar-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
        .sidebar-stat {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 0.85rem;
        }
        .sidebar-stat:last-of-type { border-bottom: none; }
        .sidebar-stat-label { color: var(--muted); }
        .sidebar-stat-val { font-weight: 600; color: var(--text); }

        .btn-contact {
          width: 100%; padding: 15px;
          background: var(--surface-2);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 700;
          color: var(--text); cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-contact:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }

        .btn-book {
          width: 100%; padding: 15px;
          background: var(--orange);
          border: none; border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 700;
          color: #fff; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 24px rgba(240,90,40,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-book:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(240,90,40,0.42); }

        .owner-badge {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-radius: 12px;
          background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2);
          font-size: 0.82rem; font-weight: 600; color: #86EFAC;
        }

        /* ── Loading / Error ── */
        .state-screen {
          min-height: 60vh; display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 16px;
        }
        .loader-ring {
          width: 48px; height: 48px;
          border: 3px solid var(--border); border-top-color: var(--orange);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--orange);
          margin-bottom: 14px; display: block;
        }

        /* Swiper overrides */
        .swiper-button-next, .swiper-button-prev {
          color: #fff !important;
          background: rgba(11,11,14,0.6) !important;
          width: 40px !important; height: 40px !important;
          border-radius: 12px !important;
          backdrop-filter: blur(8px);
        }
        .swiper-button-next::after, .swiper-button-prev::after {
          font-size: 14px !important; font-weight: 900 !important;
        }
        .swiper-pagination-bullet { background: rgba(255,255,255,0.4) !important; }
        .swiper-pagination-bullet-active { background: var(--orange) !important; }
      `}</style>

      {/* ── LOADING ── */}
      {loading && (
        <div className="state-screen">
          <div className="loader-ring" />
          <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Fetching property details…</div>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && (
        <div className="state-screen">
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</div>
          <div style={{ fontSize: "0.88rem", color: "var(--muted)" }}>Could not load this listing. Please try again.</div>
        </div>
      )}

      {/* ── CONTENT ── */}
      {listing && !loading && !error && (
        <>
          {/* Share button */}
          <button className="share-btn" onClick={handleCopy} title="Copy link">
            <FaShare size={15} />
          </button>
          {copied && <div className="copied-toast">✓ Link copied!</div>}

          {/* Gallery */}
          <div className="gallery-wrap">
            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              navigation
              pagination={{ clickable: true }}
              loop={listing.imageUrls.length > 1}
              onSlideChange={(s) => setImgIndex(s.realIndex)}
              style={{ height: "100%" }}
            >
              {listing.imageUrls.map((url, i) => (
                <SwiperSlide key={url}>
                  <div style={{
                    width: "100%", height: "100%",
                    background: `url(${url}) center/cover no-repeat`,
                  }} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="gallery-overlay" />
            <div className="gallery-count">
              {imgIndex + 1} / {listing.imageUrls.length}
            </div>
          </div>

          {/* Body */}
          <div className="page-body">

            {/* ── LEFT ── */}
            <div>
              {/* Price */}
              <div className="price-tag">
                <span className="price-amount">₹{formattedPrice}</span>
                {listing.type === "rent" && <span className="price-unit">/ month</span>}
                {listing.offer && (
                  <span className="price-original">
                    ₹{listing.regularPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Badges */}
              <div className="badge-row">
                <span className={`badge ${listing.type === "rent" ? "badge-rent" : "badge-sale"}`}>
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </span>
                {listing.offer && (
                  <span className="badge badge-offer">
                    Save ₹{(+listing.regularPrice - +listing.discountPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="listing-title">{listing.name}</h1>
              <div className="listing-address">
                <FaMapMarkerAlt color="#F05A28" size={13} />
                {listing.address}
              </div>

              {/* Tabs */}
              <div className="tabs">
                {["overview", "amenities", "review"].map((t) => (
                  <button
                    key={t}
                    className={`tab-btn ${activeTab === t ? "active" : ""}`}
                    onClick={() => setActiveTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab: Overview */}
              {activeTab === "overview" && (
                <div style={{ animation: "fadeTab 0.25s ease" }}>
                  <style>{`@keyframes fadeTab { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
                  <span className="section-label">About this property</span>
                  <p className="desc-text">{listing.description}</p>

                  <div style={{ marginTop: 28 }}>
                    <span className="section-label">Quick Facts</span>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { icon: "🛏️", label: "Bedrooms",  val: listing.bedrooms  },
                        { icon: "🚿", label: "Bathrooms", val: listing.bathrooms },
                        { icon: "🅿️", label: "Parking",   val: listing.parking ? "Available" : "Not Available" },
                        { icon: "🛋️", label: "Furnished",  val: listing.furnished ? "Yes" : "No" },
                      ].map((fact) => (
                        <div key={fact.label} style={{
                          background: "var(--surface)", border: "1px solid var(--border)",
                          borderRadius: 14, padding: "14px 18px",
                          display: "flex", alignItems: "center", gap: 12,
                        }}>
                          <span style={{ fontSize: "1.4rem" }}>{fact.icon}</span>
                          <div>
                            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 2 }}>{fact.label}</div>
                            <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text)" }}>{fact.val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Amenities */}
              {activeTab === "amenities" && (
                <div style={{ animation: "fadeTab 0.25s ease" }}>
                  <span className="section-label">What's included</span>
                  <div className="amenities-grid">
                    <AmenityBadge icon="🛏️" label={`${listing.bedrooms} Bed${listing.bedrooms > 1 ? "s" : ""}`} active />
                    <AmenityBadge icon="🚿" label={`${listing.bathrooms} Bath${listing.bathrooms > 1 ? "s" : ""}`} active />
                    <AmenityBadge icon="🅿️" label="Parking"   active={listing.parking}   />
                    <AmenityBadge icon="🛋️" label="Furnished"  active={listing.furnished}  />
                    <AmenityBadge icon="💰" label="Special Offer" active={listing.offer} />
                    <AmenityBadge icon="✅" label="Verified"  active />
                  </div>
                </div>
              )}

              {/* Tab: Review */}
              {activeTab === "review" && (
                <div style={{ animation: "fadeTab 0.25s ease" }}>
                  <div className="review-card">
                    {reviewSubmitted ? (
                      <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🎉</div>
                        <div className="review-title">Thank you for your review!</div>
                        <p className="review-sub" style={{ margin: "8px auto 0" }}>Your feedback helps others find great homes.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit}>
                        <div className="review-title">Rate This Property</div>
                        <p className="review-sub">Share your experience to help other renters.</p>
                        <StarRating value={rating} onChange={setRating} />
                        <textarea
                          className="review-textarea"
                          rows={3}
                          placeholder="What did you think about this property? (optional)"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                        />
                        <button type="submit" className="review-submit" disabled={!rating}>
                          Submit Review
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* Contact component (expanded inline) */}
              {contact && (
                <div style={{ marginTop: 28 }}>
                  <Contact listing={listing} />
                </div>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div className="sidebar-col">
              <div className="sidebar-card">
                <div className="sidebar-price-bar">
                  <div className="sidebar-price-label">
                    {listing.type === "rent" ? "Monthly Rent" : "Sale Price"}
                  </div>
                  <div>
                    <span className="sidebar-price">₹{formattedPrice}</span>
                    {listing.type === "rent" && <span className="sidebar-price-unit">/mo</span>}
                  </div>
                  {listing.offer && (
                    <div className="sidebar-discount">
                      🏷️ Save ₹{(+listing.regularPrice - +listing.discountPrice).toLocaleString("en-IN")}
                    </div>
                  )}
                </div>

                <div className="sidebar-body">
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Type</span>
                    <span className="sidebar-stat-val" style={{ textTransform: "capitalize" }}>{listing.type}</span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Bedrooms</span>
                    <span className="sidebar-stat-val">{listing.bedrooms}</span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Bathrooms</span>
                    <span className="sidebar-stat-val">{listing.bathrooms}</span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Parking</span>
                    <span className="sidebar-stat-val">{listing.parking ? "✓ Yes" : "✕ No"}</span>
                  </div>
                  <div className="sidebar-stat">
                    <span className="sidebar-stat-label">Furnished</span>
                    <span className="sidebar-stat-val">{listing.furnished ? "✓ Yes" : "✕ No"}</span>
                  </div>

                  {isOwner ? (
                    <div className="owner-badge">
                      <span>🏠</span> You own this listing
                    </div>
                  ) : currentUser ? (
                    <>
                      {!contact && (
                        <button className="btn-contact" onClick={() => setContact(true)}>
                          📩 Contact Landlord
                        </button>
                      )}
                      <button className="btn-book" onClick={checkoutHandler}>
                        <span>⚡</span> Book Now
                      </button>
                    </>
                  ) : (
                    <div style={{ fontSize: "0.82rem", color: "var(--muted)", textAlign: "center", padding: "8px 0" }}>
                      Sign in to contact or book this property.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}