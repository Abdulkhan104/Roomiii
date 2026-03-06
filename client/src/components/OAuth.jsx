import { useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function OAuth() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleGoogleClick = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const auth     = getAuth(app);
      const result   = await signInWithPopup(auth, provider);

      const res  = await fetch("/api/auth/google", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:  result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log("could not sign in with google", err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&display=swap');

        .oauth-btn {
          font-family: 'Outfit', sans-serif;
          position: relative;
          width: 100%;
          display: flex; align-items: center; justify-content: center;
          gap: 10px;
          padding: 13px 20px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          font-size: 0.9rem; font-weight: 600;
          color: #F2EFE9;
          cursor: pointer;
          overflow: hidden;
          transition: background 0.22s, border-color 0.22s, transform 0.18s, box-shadow 0.22s;
          letter-spacing: 0.01em;
        }
        .oauth-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.3);
        }
        .oauth-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
          box-shadow: none;
        }
        .oauth-btn:disabled {
          opacity: 0.55; cursor: not-allowed;
        }

        /* Shimmer sweep on hover */
        .oauth-btn::before {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transition: left 0.5s ease;
          pointer-events: none;
        }
        .oauth-btn:hover::before { left: 150%; }

        /* Google icon pill */
        .oauth-icon-wrap {
          width: 28px; height: 28px; border-radius: 8px;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* Spinner */
        .oauth-spinner {
          width: 17px; height: 17px;
          border: 2px solid rgba(242,239,233,0.2);
          border-top-color: #F2EFE9;
          border-radius: 50%;
          animation: oauth-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes oauth-spin { to { transform: rotate(360deg); } }

        /* Error */
        .oauth-error {
          margin-top: 10px;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem; font-weight: 500;
          color: #FCA5A5;
          animation: oauth-err-in 0.25s ease;
        }
        @keyframes oauth-err-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Divider — exported separately so parent pages can use it */
        .oauth-divider {
          display: flex; align-items: center; gap: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(242,239,233,0.18);
          margin: 18px 0;
        }
        .oauth-divider::before,
        .oauth-divider::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(255,255,255,0.07);
        }
      `}</style>

      <button
        type="button"
        className="oauth-btn"
        onClick={handleGoogleClick}
        disabled={loading}
        aria-label="Continue with Google"
      >
        {loading ? (
          <>
            <div className="oauth-spinner" />
            Signing in…
          </>
        ) : (
          <>
            <div className="oauth-icon-wrap">
              <GoogleIcon />
            </div>
            Continue with Google
          </>
        )}
      </button>

      {error && (
        <div className="oauth-error">
          <span>⚠️</span>
          {error}
        </div>
      )}
    </>
  );
}