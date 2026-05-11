import { useState } from "react";

export default function BuyerSignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleNext = async () => {
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          address,
          password,
          password2: confirmPassword,
          role: "buyer",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ server: data.error || "Registration failed." });
      } else {
        window.location.href = "/buyer/dashboard";
      }
    } catch {
      setErrors({ server: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Nunito', sans-serif;
          background: #c9edf7;
        }

        .page {
          min-height: 100vh;
          background: linear-gradient(160deg, #b8e8f5 0%, #d4f0fa 40%, #c0ebf6 100%);
          display: flex;
          flex-direction: column;
        }

        /* ── Navbar ── */
        .navbar {
          padding: 14px 32px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        /* LOGO PLACEHOLDER — replace the div.logo-box with your <img> */
        .logo-box {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px dashed #1a5276;
          background: rgba(255,255,255,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          color: #1a5276;
          text-align: center;
          letter-spacing: 0.3px;
          line-height: 1.3;
          flex-shrink: 0;
          cursor: pointer;
        }

        .brand-text {
          font-size: 22px;
          font-weight: 900;
          color: #1a3a6b;
          letter-spacing: 0.3px;
          line-height: 1.15;
        }

        .brand-sub {
          font-size: 13px;
          font-weight: 700;
          color: #2e86c1;
          letter-spacing: 0.5px;
        }

        /* ── Main layout ── */
        .main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 32px 48px;
          gap: 0;
          position: relative;
        }

        /* ── Cartoon image area ── */
        .image-side {
          flex: 0 0 320px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 460px;
          position: relative;
          z-index: 1;
        }

        /* IMAGE PLACEHOLDER — replace .cartoon-placeholder with your <img> */
        .cartoon-placeholder {
          width: 280px;
          height: 380px;
          border: 2.5px dashed #2980b9;
          border-radius: 16px;
          background: rgba(255,255,255,0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #2980b9;
          font-weight: 800;
          font-size: 13px;
          text-align: center;
          letter-spacing: 0.3px;
        }

        .cartoon-placeholder .icon {
          font-size: 48px;
          opacity: 0.6;
        }

        /* ── Card ── */
        .card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 40px 44px 36px;
          width: 440px;
          box-shadow:
            0 8px 40px rgba(30, 100, 160, 0.13),
            0 1.5px 6px rgba(0,0,0,0.07);
          position: relative;
          z-index: 2;
        }

        .card-title {
          font-size: 34px;
          font-weight: 900;
          color: #111;
          text-align: center;
          margin-bottom: 26px;
          letter-spacing: -0.5px;
        }

        /* ── Fields ── */
        .field {
          margin-bottom: 14px;
        }

        .field-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #222;
          margin-bottom: 6px;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          background: #ebebeb;
          border-radius: 8px;
          padding: 0 14px;
          border: 1.5px solid transparent;
          transition: border-color 0.18s, box-shadow 0.18s;
        }

        .input-wrap:focus-within {
          border-color: #27ae60;
          box-shadow: 0 0 0 3px rgba(39,174,96,0.13);
          background: #f5f5f5;
        }

        .input-wrap.error-wrap {
          border-color: #e74c3c;
        }

        .input-icon {
          font-size: 15px;
          color: #888;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .input-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 11px 0;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          color: #333;
          outline: none;
        }

        .input-wrap input::placeholder {
          color: #aaa;
          font-weight: 600;
        }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #999;
          padding: 0;
          line-height: 1;
          flex-shrink: 0;
        }

        .error-msg {
          font-size: 12px;
          color: #e74c3c;
          font-weight: 700;
          margin-top: 4px;
          padding-left: 2px;
        }

        .server-error {
          background: #fdecea;
          border: 1.5px solid #e74c3c;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #c0392b;
          font-weight: 700;
          margin-bottom: 14px;
          text-align: center;
        }

        /* ── Next button ── */
        .next-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
          color: white;
          font-size: 17px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 8px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 16px rgba(39,174,96,0.35);
          transition: opacity 0.15s, transform 0.12s, box-shadow 0.15s;
        }

        .next-btn:hover:not(:disabled) {
          opacity: 0.93;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(39,174,96,0.42);
        }

        .next-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .next-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ── Sign in link ── */
        .signin-text {
          text-align: center;
          margin-top: 16px;
          font-size: 13.5px;
          color: #888;
          font-weight: 600;
        }

        .signin-text a {
          color: #2980b9;
          font-weight: 800;
          text-decoration: none;
          margin-left: 4px;
        }

        .signin-text a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="page">
        {/* ── Navbar ── */}
        <nav className="navbar">
          {/* LOGO: Replace the div below with <img src="your-logo.png" alt="Sajilo Mart" style={{width:80,height:80,objectFit:'contain'}} /> */}
          <div className="logo-box">YOUR<br />LOGO<br />HERE</div>
          <div>
            <div className="brand-text">SAJILO MART</div>
            <div className="brand-sub">Shop Anytime Anywhere</div>
          </div>
        </nav>

        {/* ── Main ── */}
        <div className="main">
          {/* Left: cartoon image */}
          <div className="image-side">
            {/* IMAGE: Replace the div below with:
                <img src="your-cartoon-girl.png" alt="mascot"
                     style={{width:280,height:380,objectFit:'contain',objectPosition:'bottom'}} /> */}
            <div className="cartoon-placeholder">
              <span className="icon">🧒‍♀️</span>
              <span>Insert your<br />cartoon girl<br />image here</span>
            </div>
          </div>

          {/* Right: form card */}
          <div className="card">
            <h1 className="card-title">Sign Up</h1>

            {errors.server && <div className="server-error">{errors.server}</div>}

            {/* Full Name */}
            <div className="field">
              <label className="field-label">Full Name</label>
              <div className={`input-wrap ${errors.fullName ? "error-wrap" : ""}`}>
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              {errors.fullName && <p className="error-msg">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="field">
              <label className="field-label">Email</label>
              <div className={`input-wrap ${errors.email ? "error-wrap" : ""}`}>
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="example@something.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>

            {/* Address */}
            <div className="field">
              <label className="field-label">Address</label>
              <div className={`input-wrap ${errors.address ? "error-wrap" : ""}`}>
                <span className="input-icon">📍</span>
                <input
                  type="text"
                  placeholder="kathmandu, pokhara, damauli, etc."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                />
              </div>
              {errors.address && <p className="error-msg">{errors.address}</p>}
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">Password</label>
              <div className={`input-wrap ${errors.password ? "error-wrap" : ""}`}>
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="field">
              <label className="field-label">Confirm Password</label>
              <div className={`input-wrap ${errors.confirmPassword ? "error-wrap" : ""}`}>
                <span className="input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-msg">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Next button */}
            <button
              className="next-btn"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Next"}
            </button>

            {/* Login link */}
            <p className="signin-text">
              Already Have An Account?
              <a href="/login">Log In</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}