import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (['all', 'rent', 'sale'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    } else if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    } else if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked });
    } else if (e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_');
      setSidebardata({ ...sidebardata, sort: sort || 'created_at', order: order || 'desc' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([k, v]) => urlParams.set(k, v));
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', listings.length);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  const activeFilterCount = [
    sidebardata.type !== 'all',
    sidebardata.parking,
    sidebardata.furnished,
    sidebardata.offer,
  ].filter(Boolean).length;

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

        /* ── Top search bar ── */
        .search-hero {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 24px clamp(16px,4vw,48px);
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .search-input-wrap {
          flex: 1; min-width: 220px;
          position: relative;
        }
        .search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); font-size: 1rem; pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: var(--surface-2);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 13px 18px 13px 46px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem; color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: rgba(242,239,233,0.2); }
        .search-input:focus {
          border-color: rgba(240,90,40,0.45);
          box-shadow: 0 0 0 3px rgba(240,90,40,0.1);
        }
        .search-btn {
          padding: 13px 28px;
          background: var(--orange); border: none; border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700;
          color: #fff; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(240,90,40,0.28);
          white-space: nowrap;
        }
        .search-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(240,90,40,0.38); }

        .filter-toggle-btn {
          padding: 13px 20px;
          background: var(--surface-2);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600;
          color: var(--muted); cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .filter-toggle-btn.active { border-color: var(--orange); color: var(--text); }
        .filter-badge {
          background: var(--orange); color: #fff;
          width: 18px; height: 18px; border-radius: 6px;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Main layout ── */
        .main-layout {
          display: flex; align-items: flex-start;
          max-width: 1400px; margin: 0 auto;
        }

        /* ── Filter panel ── */
        .filter-panel {
          width: 280px; flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          min-height: calc(100vh - 72px);
          padding: 28px 24px;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        @media (max-width: 820px) {
          .filter-panel {
            position: fixed; left: 0; top: 72px; bottom: 0; z-index: 100;
            width: 300px; overflow-y: auto;
            transform: translateX(-100%);
            box-shadow: 4px 0 32px rgba(0,0,0,0.5);
          }
          .filter-panel.open { transform: translateX(0); }
          .filter-backdrop {
            position: fixed; inset: 0; z-index: 99;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
            display: none;
          }
          .filter-backdrop.open { display: block; }
        }

        .filter-section { margin-bottom: 28px; }
        .filter-section-title {
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 12px;
          display: block;
        }

        /* Chip toggles */
        .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 100px;
          border: 1.5px solid var(--border);
          background: var(--surface-2);
          font-size: 0.82rem; font-weight: 500; color: var(--muted);
          cursor: pointer; user-select: none;
          transition: all 0.18s;
        }
        .chip.active {
          background: var(--orange-dim);
          border-color: rgba(240,90,40,0.35);
          color: var(--text);
        }
        .chip:hover:not(.active) { border-color: rgba(255,255,255,0.18); color: var(--text); }
        .chip-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--orange); opacity: 0; transition: opacity 0.18s; flex-shrink: 0;
        }
        .chip.active .chip-dot { opacity: 1; }

        /* Toggle switch */
        .toggle-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer;
        }
        .toggle-row:last-child { border-bottom: none; }
        .toggle-label { font-size: 0.85rem; font-weight: 500; color: var(--muted); }
        .toggle-switch {
          width: 36px; height: 20px; border-radius: 100px;
          background: var(--surface-2); border: 1.5px solid var(--border);
          position: relative; transition: background 0.2s, border-color 0.2s; flex-shrink: 0;
        }
        .toggle-switch.on { background: var(--orange); border-color: var(--orange); }
        .toggle-knob {
          position: absolute; top: 2px; left: 2px;
          width: 12px; height: 12px; border-radius: 50%; background: #fff;
          transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .toggle-switch.on .toggle-knob { transform: translateX(16px); }

        /* Sort select */
        .sort-select {
          width: 100%;
          background: var(--surface-2); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 11px 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: var(--text);
          outline: none; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='rgba(242,239,233,0.35)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center; background-size: 18px;
          transition: border-color 0.2s;
        }
        .sort-select:focus { border-color: rgba(240,90,40,0.4); }
        .sort-select option { background: #1C1C22; }

        .apply-btn {
          width: 100%; padding: 13px;
          background: var(--orange); border: none; border-radius: 13px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700;
          color: #fff; cursor: pointer;
          box-shadow: 0 6px 20px rgba(240,90,40,0.28);
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 8px;
        }
        .apply-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(240,90,40,0.38); }

        /* ── Results panel ── */
        .results-panel { flex: 1; padding: clamp(20px,3vw,40px); }

        .results-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
        }
        .results-title {
          font-family: 'Fraunces', serif;
          font-size: 1.6rem; font-weight: 700; color: var(--text);
        }
        .results-count {
          font-size: 0.82rem; color: var(--muted); margin-top: 2px;
        }
        .view-toggle {
          display: flex; gap: 4px;
          background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
          padding: 4px;
        }
        .view-btn {
          padding: 7px 12px; border: none; background: none;
          border-radius: 9px; cursor: pointer; font-size: 0.85rem;
          color: var(--muted); transition: background 0.2s, color 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .view-btn.active { background: var(--surface-2); color: var(--text); }

        /* ── Grid / List ── */
        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .listings-list {
          display: flex; flex-direction: column; gap: 14px;
        }

        /* ── Active filter tags ── */
        .active-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .active-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--orange-dim); border: 1px solid rgba(240,90,40,0.25);
          color: var(--orange); padding: 5px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .tag-remove {
          background: none; border: none; color: var(--orange);
          cursor: pointer; font-size: 0.9rem; line-height: 1; padding: 0;
          display: flex; align-items: center;
        }

        /* ── Empty state ── */
        .empty-state {
          text-align: center; padding: 80px 20px;
        }
        .empty-icon { font-size: 3.5rem; margin-bottom: 16px; }
        .empty-title {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem; font-weight: 700; color: var(--text); margin-bottom: 8px;
        }
        .empty-sub { font-size: 0.88rem; color: var(--muted); }

        /* ── Loading skeleton ── */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .skeleton-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
        }
        .skeleton-img { height: 180px; background: var(--surface-2); animation: shimmer 1.5s infinite; }
        .skeleton-body { padding: 16px; }
        .skeleton-line {
          height: 12px; border-radius: 6px; background: var(--surface-2);
          animation: shimmer 1.5s infinite; margin-bottom: 10px;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* ── Show more ── */
        .show-more-btn {
          display: block; width: 100%; max-width: 280px; margin: 36px auto 0;
          padding: 14px;
          background: transparent; border: 1.5px solid var(--border);
          border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600;
          color: var(--muted); cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .show-more-btn:hover { border-color: var(--orange); color: var(--text); background: var(--orange-dim); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {/* ── TOP SEARCH BAR ── */}
      <form onSubmit={handleSubmit}>
        <div className="search-hero">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              id="searchTerm"
              placeholder="Search by name, location, or keyword…"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            className={`filter-toggle-btn ${filtersOpen ? "active" : ""}`}
            onClick={() => setFiltersOpen(p => !p)}
          >
            <span>⚙️</span> Filters
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>
          <button type="submit" className="search-btn">Search →</button>
        </div>
      </form>

      {/* Mobile backdrop */}
      <div
        className={`filter-backdrop ${filtersOpen ? "open" : ""}`}
        onClick={() => setFiltersOpen(false)}
      />

      <div className="main-layout">

        {/* ── FILTER SIDEBAR ── */}
        <form onSubmit={handleSubmit}>
          <aside className={`filter-panel ${filtersOpen ? "open" : ""}`}>

            <div className="filter-section">
              <span className="filter-section-title">Listing Type</span>
              <div className="chip-group">
                {[
                  { id: "all",  label: "🏘️ All" },
                  { id: "rent", label: "🏠 Rent" },
                  { id: "sale", label: "💰 Sale" },
                ].map(opt => (
                  <label key={opt.id} className={`chip ${sidebardata.type === opt.id ? "active" : ""}`}>
                    <input type="checkbox" id={opt.id} checked={sidebardata.type === opt.id} onChange={handleChange} style={{ display: "none" }} />
                    <div className="chip-dot" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <span className="filter-section-title">Amenities</span>
              {[
                { id: "parking",   label: "🅿️ Parking",     key: "parking"   },
                { id: "furnished", label: "🛋️ Furnished",    key: "furnished" },
                { id: "offer",     label: "🏷️ Has Offer",    key: "offer"     },
              ].map(opt => (
                <label key={opt.id} className="toggle-row" style={{ display: "flex" }}>
                  <span className="toggle-label">{opt.label}</span>
                  <div className={`toggle-switch ${sidebardata[opt.key] ? "on" : ""}`}>
                    <div className="toggle-knob" />
                    <input type="checkbox" id={opt.id} checked={sidebardata[opt.key]} onChange={handleChange} style={{ display: "none" }} />
                  </div>
                </label>
              ))}
            </div>

            <div className="filter-section">
              <span className="filter-section-title">Sort By</span>
              <select
                className="sort-select"
                id="sort_order"
                value={`${sidebardata.sort}_${sidebardata.order}`}
                onChange={handleChange}
              >
                <option value="regularPrice_desc">Price: High → Low</option>
                <option value="regularPrice_asc">Price: Low → High</option>
                <option value="createdAt_desc">Latest First</option>
                <option value="createdAt_asc">Oldest First</option>
              </select>
            </div>

            <button type="submit" className="apply-btn" onClick={() => setFiltersOpen(false)}>
              Apply Filters
            </button>
          </aside>
        </form>

        {/* ── RESULTS ── */}
        <div className="results-panel">
          <div className="results-header">
            <div>
              <h1 className="results-title">
                {sidebardata.searchTerm ? `"${sidebardata.searchTerm}"` : "All Listings"}
              </h1>
              {!loading && (
                <div className="results-count">
                  {listings.length} propert{listings.length !== 1 ? "ies" : "y"} found
                </div>
              )}
            </div>
            <div className="view-toggle">
              <button type="button" className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
                <span>⊞</span> Grid
              </button>
              <button type="button" className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
                <span>☰</span> List
              </button>
            </div>
          </div>

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="active-tags">
              {sidebardata.type !== "all" && (
                <span className="active-tag">
                  {sidebardata.type === "rent" ? "🏠 Rent" : "💰 Sale"}
                  <button className="tag-remove" onClick={() => setSidebardata(p => ({ ...p, type: "all" }))}>✕</button>
                </span>
              )}
              {sidebardata.parking && (
                <span className="active-tag">
                  🅿️ Parking
                  <button className="tag-remove" onClick={() => setSidebardata(p => ({ ...p, parking: false }))}>✕</button>
                </span>
              )}
              {sidebardata.furnished && (
                <span className="active-tag">
                  🛋️ Furnished
                  <button className="tag-remove" onClick={() => setSidebardata(p => ({ ...p, furnished: false }))}>✕</button>
                </span>
              )}
              {sidebardata.offer && (
                <span className="active-tag">
                  🏷️ Offer
                  <button className="tag-remove" onClick={() => setSidebardata(p => ({ ...p, offer: false }))}>✕</button>
                </span>
              )}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" style={{ animationDelay: `${i * 0.1}s` }} />
                  <div className="skeleton-body">
                    <div className="skeleton-line" style={{ width: "70%" }} />
                    <div className="skeleton-line" style={{ width: "50%" }} />
                    <div className="skeleton-line" style={{ width: "85%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && listings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏚️</div>
              <div className="empty-title">No properties found</div>
              <div className="empty-sub">Try adjusting your filters or search with a different keyword.</div>
            </div>
          )}

          {/* Listings */}
          {!loading && listings.length > 0 && (
            <div className={viewMode === "grid" ? "listings-grid" : "listings-list"}>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {showMore && (
            <button className="show-more-btn" onClick={onShowMoreClick}>
              Load more properties ↓
            </button>
          )}
        </div>

      </div>
    </div>
  );
}