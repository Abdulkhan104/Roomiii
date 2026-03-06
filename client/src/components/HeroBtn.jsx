import React, { useState, useRef } from 'react';

/**
 * HeroBtn — Advanced navigation button with animated underline,
 * magnetic hover effect, and optional badge/icon support.
 *
 * Props:
 *   title      {string}   — button label
 *   underline  {string}   — extra className for the underline (legacy compat)
 *   active     {boolean}  — marks the current active route
 *   badge      {string|number} — optional notification badge
 *   icon       {ReactNode} — optional leading icon
 *   onClick    {function}  — click handler
 *   variant    {string}   — 'default' | 'pill' | 'ghost'
 */
const HeroBtn = ({
  title,
  underline = '',
  active = false,
  badge,
  icon,
  onClick,
  variant = 'default',
}) => {
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const btnRef = useRef(null);

  const addRipple = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  };

  if (variant === 'pill') {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&display=swap');
          .hb-pill {
            font-family: 'Outfit', sans-serif;
            display: inline-flex; align-items: center; gap: 7px;
            padding: 9px 20px;
            background: rgba(240,90,40,0.1);
            border: 1.5px solid rgba(240,90,40,0.3);
            border-radius: 100px;
            font-size: 0.85rem; font-weight: 700; color: #F05A28;
            cursor: pointer; position: relative; overflow: hidden;
            transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
            letter-spacing: 0.03em;
          }
          .hb-pill:hover {
            background: #F05A28; color: #fff;
            border-color: #F05A28;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(240,90,40,0.35);
          }
          .hb-pill-ripple {
            position: absolute; border-radius: 50%;
            background: rgba(255,255,255,0.25);
            width: 8px; height: 8px;
            transform: translate(-50%, -50%) scale(0);
            animation: hb-ripple 0.6s ease-out forwards;
            pointer-events: none;
          }
          @keyframes hb-ripple {
            to { transform: translate(-50%,-50%) scale(18); opacity: 0; }
          }
        `}</style>
        <button
          ref={btnRef}
          className="hb-pill"
          onClick={(e) => { addRipple(e); onClick?.(); }}
        >
          {icon && <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{icon}</span>}
          {title}
          {badge != null && (
            <span style={{
              background: '#F05A28', color: '#fff',
              fontSize: '9px', fontWeight: 800,
              width: 16, height: 16, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: 2, flexShrink: 0,
            }}>{badge}</span>
          )}
          {ripples.map(r => (
            <span key={r.id} className="hb-pill-ripple" style={{ left: r.x, top: r.y }} />
          ))}
        </button>
      </>
    );
  }

  if (variant === 'ghost') {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&display=swap');
          .hb-ghost {
            font-family: 'Outfit', sans-serif;
            display: inline-flex; align-items: center; gap: 7px;
            padding: 8px 18px;
            background: transparent;
            border: 1.5px solid rgba(255,255,255,0.12);
            border-radius: 12px;
            font-size: 0.85rem; font-weight: 600; color: rgba(242,239,233,0.6);
            cursor: pointer; position: relative; overflow: hidden;
            transition: border-color 0.2s, color 0.2s, background 0.2s;
          }
          .hb-ghost:hover {
            border-color: rgba(240,90,40,0.4);
            color: #F2EFE9;
            background: rgba(240,90,40,0.06);
          }
        `}</style>
        <button
          className="hb-ghost"
          onClick={onClick}
        >
          {icon && <span style={{ fontSize: '0.9rem' }}>{icon}</span>}
          {title}
          {badge != null && (
            <span style={{
              background: '#F05A28', color: '#fff',
              fontSize: '9px', fontWeight: 800,
              padding: '1px 5px', borderRadius: 4,
              marginLeft: 2,
            }}>{badge}</span>
          )}
        </button>
      </>
    );
  }

  // ── DEFAULT variant (nav underline style) ──
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

        .hb-root {
          font-family: 'Outfit', sans-serif;
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
        }

        .hb-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem; font-weight: 600;
          color: rgba(242,239,233,0.65);
          padding: 6px 4px;
          transition: color 0.2s;
          letter-spacing: 0.02em;
          position: relative; z-index: 1;
        }
        .hb-btn:hover, .hb-btn.active { color: #F2EFE9; }

        /* Animated underline */
        .hb-line-wrap {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px; overflow: hidden;
        }
        .hb-line {
          height: 100%;
          background: linear-gradient(90deg, #F05A28, #FF8A5B);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.28s cubic-bezier(0.34,1.4,0.64,1);
        }
        .hb-root:hover .hb-line,
        .hb-line.active {
          transform: scaleX(1);
        }

        /* Dot indicator for active */
        .hb-active-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #F05A28;
          position: absolute; bottom: -8px; left: 50%;
          transform: translateX(-50%);
          animation: hb-dot-in 0.25s ease;
        }
        @keyframes hb-dot-in { from{opacity:0;transform:translateX(-50%) scale(0)} to{opacity:1;transform:translateX(-50%) scale(1)} }

        /* Badge */
        .hb-badge {
          background: #F05A28; color: #fff;
          font-size: 9px; font-weight: 800;
          min-width: 16px; height: 16px;
          border-radius: 6px; padding: 0 4px;
          display: flex; align-items: center; justify-content: center;
          animation: hb-badge-in 0.3s cubic-bezier(0.34,1.5,0.64,1);
        }
        @keyframes hb-badge-in { from{transform:scale(0)} to{transform:scale(1)} }

        /* Glow bg on hover */
        .hb-glow {
          position: absolute; inset: -4px -6px;
          border-radius: 10px;
          background: rgba(240,90,40,0.08);
          opacity: 0; pointer-events: none;
          transition: opacity 0.2s;
        }
        .hb-root:hover .hb-glow { opacity: 1; }
      `}</style>

      <div
        className="hb-root"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <div className="hb-glow" />

        <button className={`hb-btn ${active ? 'active' : ''}`}>
          {icon && <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{icon}</span>}
          {title}
          {badge != null && <span className="hb-badge">{badge}</span>}
        </button>

        <div className="hb-line-wrap">
          <div className={`hb-line ${active ? 'active' : ''} ${underline}`} />
        </div>

        {active && <div className="hb-active-dot" />}
      </div>
    </>
  );
};

export default HeroBtn;