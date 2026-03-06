import { useState } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_IMG = 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg';

export default function ListingItem({ listing }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveAnim, setSaveAnim] = useState(false);

  const price = listing.offer
    ? listing.discountPrice.toLocaleString('en-IN')
    : listing.regularPrice.toLocaleString('en-IN');

  const savings = listing.offer
    ? (listing.regularPrice - listing.discountPrice).toLocaleString('en-IN')
    : null;

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(p => !p);
    setSaveAnim(true);
    setTimeout(() => setSaveAnim(false), 400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,500&display=swap');

        .li-card {
          font-family: 'Outfit', sans-serif;
          background: #141418;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          width: 100%;
          max-width: 340px;
          transition: transform 0.3s cubic-bezier(0.34,1.2,0.64,1), border-color 0.3s, box-shadow 0.3s;
          cursor: pointer;
          position: relative;
        }
        .li-card:hover {
          transform: translateY(-6px) scale(1.01);
          border-color: rgba(240,90,40,0.25);
          box-shadow: 0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(240,90,40,0.08);
        }
        .li-card a { text-decoration: none; display: block; }

        /* ── Image ── */
        .li-img-wrap {
          position: relative;
          height: 210px;
          overflow: hidden;
          background: #1C1C22;
        }
        .li-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s;
          opacity: 0;
        }
        .li-img.loaded { opacity: 1; }
        .li-card:hover .li-img { transform: scale(1.07); }

        /* Image skeleton */
        .li-img-skeleton {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, #1C1C22 25%, #222228 50%, #1C1C22 75%);
          background-size: 200% 100%;
          animation: li-shimmer 1.5s infinite;
        }
        @keyframes li-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Image overlay */
        .li-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(11,11,14,0.75) 0%, rgba(11,11,14,0.15) 45%, transparent 70%);
          pointer-events: none;
        }

        /* Top badges */
        .li-badges {
          position: absolute; top: 12px; left: 12px;
          display: flex; gap: 6px; z-index: 2;
        }
        .li-badge {
          padding: 4px 10px; border-radius: 100px;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          backdrop-filter: blur(8px);
        }
        .li-badge-rent  { background: rgba(59,130,246,0.85); color: #fff; }
        .li-badge-sale  { background: rgba(74,222,128,0.85); color: #0B0B0E; }
        .li-badge-offer { background: rgba(240,90,40,0.9); color: #fff; }

        /* Save button */
        .li-save {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(14,14,18,0.7); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .li-save:hover { background: rgba(240,90,40,0.2); border-color: rgba(240,90,40,0.4); }
        .li-save.saved { background: rgba(240,90,40,0.15); border-color: rgba(240,90,40,0.35); }
        .li-save.anim { animation: li-heartbeat 0.4s cubic-bezier(0.34,1.8,0.64,1); }
        @keyframes li-heartbeat { 0%{transform:scale(1)} 40%{transform:scale(1.4)} 100%{transform:scale(1)} }

        /* Image count */
        .li-img-count {
          position: absolute; bottom: 10px; right: 12px; z-index: 2;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 3px 8px;
          font-size: 10px; font-weight: 600; color: rgba(242,239,233,0.7);
        }

        /* ── Body ── */
        .li-body { padding: 16px 18px 18px; }

        /* Price row */
        .li-price-row {
          display: flex; align-items: baseline; gap: 8px;
          margin-bottom: 8px; flex-wrap: wrap;
        }
        .li-price {
          font-family: 'Fraunces', serif;
          font-size: 1.45rem; font-weight: 700;
          color: #F2EFE9; line-height: 1; letter-spacing: -0.02em;
        }
        .li-price-unit { font-size: 0.75rem; color: rgba(242,239,233,0.4); font-weight: 400; }
        .li-price-original {
          font-size: 0.8rem; color: rgba(242,239,233,0.3);
          text-decoration: line-through;
        }
        .li-save-tag {
          font-size: 10px; font-weight: 800;
          background: rgba(240,90,40,0.12); border: 1px solid rgba(240,90,40,0.25);
          color: #F05A28; padding: 2px 8px; border-radius: 6px;
          letter-spacing: 0.06em;
        }

        /* Title */
        .li-title {
          font-size: 0.95rem; font-weight: 700;
          color: #F2EFE9;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 6px; line-height: 1.3;
        }

        /* Address */
        .li-address {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.78rem; color: rgba(242,239,233,0.4);
          margin-bottom: 10px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .li-address-icon { color: #F05A28; font-size: 0.85rem; flex-shrink: 0; }

        /* Description */
        .li-desc {
          font-size: 0.78rem; color: rgba(242,239,233,0.38);
          line-height: 1.6; font-weight: 300;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; margin-bottom: 14px;
        }

        /* Divider */
        .li-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 12px; }

        /* Stats row */
        .li-stats {
          display: flex; gap: 0; align-items: center;
        }
        .li-stat {
          flex: 1; display: flex; align-items: center; gap: 6px;
          font-size: 0.78rem; font-weight: 600;
          color: rgba(242,239,233,0.5);
          padding-right: 12px;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .li-stat:last-child { border-right: none; padding-right: 0; padding-left: 12px; flex: 0 0 auto; }
        .li-stat:first-child { padding-left: 0; }
        .li-stat-icon { font-size: 0.9rem; flex-shrink: 0; }

        /* Amenity dots */
        .li-amenities { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
        .li-amenity {
          display: flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 6px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          font-size: 10px; font-weight: 600; color: rgba(242,239,233,0.45);
        }
        .li-amenity.on { background: rgba(240,90,40,0.08); border-color: rgba(240,90,40,0.2); color: rgba(240,90,40,0.8); }

        /* Hover CTA */
        .li-cta {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 14px 18px;
          background: linear-gradient(to top, rgba(11,11,14,0.98) 0%, transparent 100%);
          display: flex; justify-content: center;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.25s, transform 0.25s;
          pointer-events: none;
        }
        .li-card:hover .li-cta { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .li-cta-btn {
          padding: 9px 24px;
          background: #F05A28; border: none; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 800;
          color: #fff; cursor: pointer; letter-spacing: 0.04em;
          box-shadow: 0 4px 16px rgba(240,90,40,0.4);
          transition: transform 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .li-cta-btn:hover { transform: scale(1.04); }

        /* Verified tick */
        .li-verified {
          position: absolute; bottom: 12px; left: 12px; z-index: 2;
          display: flex; align-items: center; gap: 4px;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
          border: 1px solid rgba(74,222,128,0.25);
          border-radius: 8px; padding: 3px 8px;
          font-size: 10px; font-weight: 700; color: #4ADE80;
        }
      `}</style>

      <div className="li-card">
        <Link to={`/listing/${listing._id}`}>

          {/* ── IMAGE ── */}
          <div className="li-img-wrap">
            {!imgLoaded && <div className="li-img-skeleton" />}
            <img
              src={listing.imageUrls[0] || FALLBACK_IMG}
              alt={listing.name}
              className={`li-img ${imgLoaded ? 'loaded' : ''}`}
              onLoad={() => setImgLoaded(true)}
            />
            <div className="li-img-overlay" />

            {/* Top-left badges */}
            <div className="li-badges">
              <span className={`li-badge ${listing.type === 'rent' ? 'li-badge-rent' : 'li-badge-sale'}`}>
                {listing.type === 'rent' ? '🏠 Rent' : '💰 Sale'}
              </span>
              {listing.offer && <span className="li-badge li-badge-offer">🏷️ Offer</span>}
            </div>

            {/* Save button */}
            <button
              className={`li-save ${saved ? 'saved' : ''} ${saveAnim ? 'anim' : ''}`}
              onClick={handleSave}
              title={saved ? 'Unsave' : 'Save'}
            >
              {saved ? '❤️' : '🤍'}
            </button>

            {/* Verified */}
            <div className="li-verified">✓ Verified</div>

            {/* Image count */}
            {listing.imageUrls.length > 1 && (
              <div className="li-img-count">📷 {listing.imageUrls.length}</div>
            )}
          </div>

          {/* ── BODY ── */}
          <div className="li-body">

            {/* Price */}
            <div className="li-price-row">
              <span className="li-price">₹{price}</span>
              {listing.type === 'rent' && <span className="li-price-unit">/mo</span>}
              {listing.offer && (
                <>
                  <span className="li-price-original">₹{listing.regularPrice.toLocaleString('en-IN')}</span>
                  <span className="li-save-tag">Save ₹{savings}</span>
                </>
              )}
            </div>

            {/* Name */}
            <div className="li-title" title={listing.name}>{listing.name}</div>

            {/* Address */}
            <div className="li-address">
              <span className="li-address-icon">📍</span>
              <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {listing.address}
              </span>
            </div>

            {/* Description */}
            <p className="li-desc">{listing.description}</p>

            <div className="li-divider" />

            {/* Stats */}
            <div className="li-stats">
              <div className="li-stat">
                <span className="li-stat-icon">🛏️</span>
                {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
              </div>
              <div className="li-stat" style={{ paddingLeft:12 }}>
                <span className="li-stat-icon">🚿</span>
                {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
              </div>
              <div className="li-stat" style={{ flex:0, paddingLeft:12, paddingRight:0, borderRight:'none' }}>
                <span className="li-stat-icon">{listing.furnished ? '🛋️' : '📦'}</span>
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </div>
            </div>

            {/* Amenity chips */}
            <div className="li-amenities">
              <span className={`li-amenity ${listing.parking ? 'on' : ''}`}>
                🅿️ Parking
              </span>
              <span className={`li-amenity ${listing.furnished ? 'on' : ''}`}>
                🛋️ Furnished
              </span>
              <span className={`li-amenity ${listing.offer ? 'on' : ''}`}>
                🏷️ Offer
              </span>
            </div>
          </div>

          {/* Hover CTA */}
          <div className="li-cta">
            <button className="li-cta-btn">
              View Property →
            </button>
          </div>

        </Link>
      </div>
    </>
  );
}