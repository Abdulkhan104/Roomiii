import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const NAV_LINKS = [
  { to: "/",        label: "Home",    icon: "🏠" },
  { to: "/search",  label: "Browse",  icon: "🔍" },
  { to: "/about",   label: "About",   icon: "✨" },
  { to: "/connect", label: "Connect", icon: "💬" },
];

export default function Navbar() {
  const { currentUser } = useSelector((s) => s.user);
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchVal,   setSearchVal]   = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef  = useRef(null);
  const profileRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location]);

  // Focus search on open
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    navigate(`/search?searchTerm=${encodeURIComponent(searchVal.trim())}`);
    setSearchOpen(false);
    setSearchVal("");
  };

  const isActive = (to) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --or: #F05A28;
          --or-dim: rgba(240,90,40,0.12);
          --sur: #141418;
          --sur2: #1C1C22;
          --bor: rgba(255,255,255,0.08);
          --tx: #F2EFE9;
          --mu: rgba(242,239,233,0.45);
        }

        /* ── Navbar shell ── */
        .nb {
          font-family: 'Outfit', sans-serif;
          position: sticky; top: 0; z-index: 1000;
          transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
          border-bottom: 1px solid transparent;
        }
        .nb.scrolled {
          background: rgba(10,10,13,0.92);
          backdrop-filter: blur(20px) saturate(1.6);
          -webkit-backdrop-filter: blur(20px) saturate(1.6);
          border-color: var(--bor);
          box-shadow: 0 4px 32px rgba(0,0,0,0.35);
        }
        .nb.flat { background: rgba(10,10,13,0.6); backdrop-filter: blur(10px); }

        .nb-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 clamp(16px,3vw,40px);
          height: 66px;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ── Logo ── */
        .nb-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; flex-shrink: 0;
          cursor: pointer;
        }
        .nb-logo-mark {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #F05A28, #FF8A5B);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 4px 14px rgba(240,90,40,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .nb-logo:hover .nb-logo-mark { transform: rotate(-6deg) scale(1.08); box-shadow: 0 8px 20px rgba(240,90,40,0.45); }
        .nb-logo-text {
          font-family: 'Fraunces', serif;
          font-size: 1.35rem; font-weight: 700;
          color: var(--tx); letter-spacing: -0.03em;
          line-height: 1;
        }
        .nb-logo-text em { color: var(--or); font-style: italic; }

        /* ── Nav links ── */
        .nb-links {
          display: none; list-style: none;
          align-items: center; gap: 2px;
          margin: 0; padding: 0;
        }
        @media (min-width: 768px) { .nb-links { display: flex; } }

        .nb-link {
          position: relative;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 0.88rem; font-weight: 600;
          color: var(--mu);
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
          display: flex; align-items: center; gap: 5px;
        }
        .nb-link:hover { color: var(--tx); background: rgba(255,255,255,0.05); }
        .nb-link.active { color: var(--tx); }

        .nb-link-bar {
          position: absolute; bottom: 4px; left: 14px; right: 14px;
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, var(--or), #FF8A5B);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.28s cubic-bezier(0.34,1.4,0.64,1);
        }
        .nb-link.active .nb-link-bar,
        .nb-link:hover .nb-link-bar { transform: scaleX(1); }

        /* ── Right side ── */
        .nb-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        /* Search icon button */
        .nb-icon-btn {
          width: 38px; height: 38px; border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--bor);
          display: flex; align-items: center; justify-content: center;
          color: var(--mu); cursor: pointer; font-size: 1rem;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .nb-icon-btn:hover { background: var(--or-dim); border-color: rgba(240,90,40,0.3); color: var(--or); }

        /* Post property CTA */
        .nb-cta {
          display: none; align-items: center; gap: 6px;
          padding: 9px 18px;
          background: var(--or); border: none; border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 700;
          color: #fff; cursor: pointer; white-space: nowrap;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(240,90,40,0.3);
          text-decoration: none;
        }
        @media (min-width: 900px) { .nb-cta { display: flex; } }
        .nb-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(240,90,40,0.42); }

        /* Profile area */
        .nb-profile { position: relative; }
        .nb-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer; padding: 0;
        }
        .nb-avatar-ring {
          width: 36px; height: 36px; border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, var(--or), #FF8A5B);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .nb-avatar-btn:hover .nb-avatar-ring { transform: scale(1.07); box-shadow: 0 4px 16px rgba(240,90,40,0.4); }
        .nb-avatar-img {
          width: 100%; height: 100%; border-radius: 50%;
          object-fit: cover; background: #0F0F12;
          display: block;
        }
        .nb-avatar-caret {
          font-size: 0.55rem; color: var(--mu);
          transition: transform 0.2s;
        }
        .nb-avatar-btn.open .nb-avatar-caret { transform: rotate(180deg); }

        /* Sign in button */
        .nb-signin {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 18px; background: transparent;
          border: 1.5px solid var(--bor); border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 700;
          color: var(--mu); cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          text-decoration: none; white-space: nowrap;
        }
        .nb-signin:hover { border-color: rgba(240,90,40,0.4); color: var(--tx); background: var(--or-dim); }

        /* Profile dropdown */
        .nb-dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          background: var(--sur); border: 1px solid var(--bor);
          border-radius: 18px; padding: 8px;
          min-width: 210px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: nb-drop-in 0.2s cubic-bezier(0.34,1.2,0.64,1);
          z-index: 100;
        }
        @keyframes nb-drop-in { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .nb-dd-header {
          padding: 12px 14px 10px;
          border-bottom: 1px solid var(--bor);
          margin-bottom: 6px;
        }
        .nb-dd-name { font-weight: 700; font-size: 0.9rem; color: var(--tx); }
        .nb-dd-email { font-size: 0.74rem; color: var(--mu); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
        .nb-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 12px;
          font-size: 0.85rem; font-weight: 500; color: var(--mu);
          text-decoration: none; cursor: pointer; background: none; border: none;
          width: 100%; text-align: left; font-family: 'Outfit', sans-serif;
          transition: background 0.18s, color 0.18s;
        }
        .nb-dd-item:hover { background: rgba(255,255,255,0.05); color: var(--tx); }
        .nb-dd-item.danger:hover { background: rgba(248,113,113,0.08); color: #FCA5A5; }
        .nb-dd-item .dd-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--bor); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0; }
        .nb-dd-divider { height: 1px; background: var(--bor); margin: 6px 0; }

        /* ── Search overlay ── */
        .nb-search-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(12px);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 80px; animation: nb-fade-in 0.2s ease;
        }
        @keyframes nb-fade-in { from{opacity:0} to{opacity:1} }
        .nb-search-box {
          width: 100%; max-width: 640px; margin: 0 20px;
          background: var(--sur); border: 1px solid var(--bor);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: nb-search-in 0.25s cubic-bezier(0.34,1.2,0.64,1);
        }
        @keyframes nb-search-in { from{opacity:0;transform:translateY(-20px) scale(0.96)} to{opacity:1;transform:none} }
        .nb-search-inner {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
        }
        .nb-search-icon { font-size: 1.1rem; color: var(--mu); flex-shrink: 0; }
        .nb-search-input {
          flex: 1; background: none; border: none; outline: none;
          font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 500;
          color: var(--tx);
        }
        .nb-search-input::placeholder { color: rgba(242,239,233,0.2); }
        .nb-search-close {
          padding: 6px 10px; background: rgba(255,255,255,0.06); border: 1px solid var(--bor);
          border-radius: 8px; font-size: 0.78rem; font-weight: 700; color: var(--mu);
          cursor: pointer; font-family: 'Outfit', sans-serif; flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
        }
        .nb-search-close:hover { background: rgba(255,255,255,0.1); color: var(--tx); }
        .nb-search-hint {
          padding: 0 20px 14px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: rgba(242,239,233,0.18);
          display: flex; gap: 16px;
        }
        .nb-search-hint span { display: flex; align-items: center; gap: 5px; }

        /* ── Mobile menu button ── */
        .nb-hamburger {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 5px; width: 38px; height: 38px;
          border-radius: 12px; background: rgba(255,255,255,0.05);
          border: 1px solid var(--bor); cursor: pointer;
          transition: background 0.2s;
        }
        @media (min-width: 768px) { .nb-hamburger { display: none; } }
        .nb-hamburger:hover { background: var(--or-dim); border-color: rgba(240,90,40,0.3); }
        .nb-ham-line {
          width: 16px; height: 1.5px; border-radius: 2px;
          background: var(--mu); transition: all 0.25s;
        }
        .nb-hamburger.open .nb-ham-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); background: var(--or); }
        .nb-hamburger.open .nb-ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nb-hamburger.open .nb-ham-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); background: var(--or); }

        /* ── Mobile drawer ── */
        .nb-mobile-drawer {
          position: fixed; top: 66px; left: 0; right: 0; z-index: 999;
          background: rgba(10,10,13,0.97); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--bor);
          padding: 16px clamp(16px,4vw,32px) 24px;
          animation: nb-drawer-in 0.25s cubic-bezier(0.34,1.15,0.64,1);
        }
        @keyframes nb-drawer-in { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:none} }

        .nb-mob-link {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 16px; border-radius: 14px;
          font-size: 0.95rem; font-weight: 600; color: var(--mu);
          text-decoration: none; margin-bottom: 4px;
          transition: background 0.18s, color 0.18s;
          position: relative; overflow: hidden;
        }
        .nb-mob-link:hover, .nb-mob-link.active { background: rgba(255,255,255,0.05); color: var(--tx); }
        .nb-mob-link.active::before {
          content: ''; position: absolute; left: 0; top: 8px; bottom: 8px;
          width: 3px; border-radius: 0 3px 3px 0; background: var(--or);
        }
        .nb-mob-icon { width: 32px; height: 32px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--bor); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .nb-mob-link.active .nb-mob-icon { background: var(--or-dim); border-color: rgba(240,90,40,0.3); }

        .nb-mob-cta {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; margin-top: 12px; padding: 14px;
          background: var(--or); border: none; border-radius: 14px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 800;
          color: #fff; cursor: pointer; text-decoration: none;
          box-shadow: 0 6px 20px rgba(240,90,40,0.3);
        }

        /* Online indicator */
        .nb-online { width: 8px; height: 8px; border-radius: 50%; background: #4ADE80; border: 2px solid var(--sur); position: absolute; bottom: 0; right: 0; animation: nb-blink 2.5s infinite; }
        @keyframes nb-blink { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className={`nb ${scrolled ? 'scrolled' : 'flat'}`}>
        <div className="nb-inner">

          {/* Logo */}
          <div className="nb-logo" onClick={() => navigate("/")}>
            <div className="nb-logo-mark">🏠</div>
            <span className="nb-logo-text">Roo<em>Moo</em></span>
          </div>

          {/* Desktop nav */}
          <ul className="nb-links">
            {NAV_LINKS.map(link => (
              <li key={link.to}>
                <Link to={link.to} className={`nb-link ${isActive(link.to) ? 'active' : ''}`}>
                  {link.label}
                  <div className="nb-link-bar" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="nb-right">
            {/* Search */}
            <button className="nb-icon-btn" onClick={() => setSearchOpen(true)} title="Search">
              🔍
            </button>

            {/* Post property */}
            <Link to="/create-listing" className="nb-cta">
              <span>＋</span> Post Property
            </Link>

            {/* Profile / Sign in */}
            {currentUser ? (
              <div className="nb-profile" ref={profileRef}>
                <button
                  className={`nb-avatar-btn ${profileOpen ? 'open' : ''}`}
                  onClick={() => setProfileOpen(p => !p)}
                >
                  <div className="nb-avatar-ring" style={{ position: 'relative' }}>
                    <img src={currentUser.avatar} alt={currentUser.username} className="nb-avatar-img" />
                    <div className="nb-online" />
                  </div>
                  <span className="nb-avatar-caret">▼</span>
                </button>

                {profileOpen && (
                  <div className="nb-dropdown">
                    <div className="nb-dd-header">
                      <div className="nb-dd-name">{currentUser.username}</div>
                      <div className="nb-dd-email">{currentUser.email}</div>
                    </div>
                    <Link to="/profile" className="nb-dd-item">
                      <div className="dd-icon">👤</div> My Profile
                    </Link>
                    <Link to="/create-listing" className="nb-dd-item">
                      <div className="dd-icon">🏠</div> Post Property
                    </Link>
                    <Link to="/search" className="nb-dd-item">
                      <div className="dd-icon">🔍</div> Browse Listings
                    </Link>
                    <div className="nb-dd-divider" />
                    <Link to="/connect" className="nb-dd-item">
                      <div className="dd-icon">💬</div> Support
                    </Link>
                    <div className="nb-dd-divider" />
                    <button className="nb-dd-item danger">
                      <div className="dd-icon">🚪</div> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in" className="nb-signin">Sign In →</Link>
            )}

            {/* Hamburger */}
            <button
              className={`nb-hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Menu"
            >
              <div className="nb-ham-line" />
              <div className="nb-ham-line" />
              <div className="nb-ham-line" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <div className="nb-mobile-drawer">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nb-mob-link ${isActive(link.to) ? 'active' : ''}`}
            >
              <div className="nb-mob-icon">{link.icon}</div>
              {link.label}
            </Link>
          ))}
          {!currentUser && (
            <Link to="/sign-in" className="nb-mob-link" style={{ marginTop: 8 }}>
              <div className="nb-mob-icon">🔑</div>
              Sign In
            </Link>
          )}
          <Link to="/create-listing" className="nb-mob-cta">
            🏠 Post a Property
          </Link>
        </div>
      )}

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div className="nb-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="nb-search-box" onClick={e => e.stopPropagation()}>
            <form className="nb-search-inner" onSubmit={handleSearch}>
              <span className="nb-search-icon">🔍</span>
              <input
                ref={searchRef}
                className="nb-search-input"
                type="text"
                placeholder="Search rooms, flats, areas in Hyderabad…"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
              <button type="button" className="nb-search-close" onClick={() => setSearchOpen(false)}>
                ESC
              </button>
            </form>
            <div className="nb-search-hint">
              <span>↵ <span style={{ color: 'rgba(242,239,232,0.4)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>to search</span></span>
              <span>ESC <span style={{ color: 'rgba(242,239,232,0.4)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>to close</span></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}