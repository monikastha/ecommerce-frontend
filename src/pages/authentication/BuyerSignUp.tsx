import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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

  const handleNext = () => {
    const v = validate();

    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/confirmcode");
    }, 800);
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

        .navbar {
          padding: 14px 32px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

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
        }

        .brand-text {
          font-size: 22px;
          font-weight: 900;
          color: #1a3a6b;
        }

        .brand-sub {
          font-size: 13px;
          font-weight: 700;
          color: #2e86c1;
        }

        .main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 32px 48px;
        }

        .image-side {
          flex: 0 0 320px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 460px;
        }

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
          color: #2980b9;
          font-weight: 800;
        }

        .cartoon-placeholder .icon {
          font-size: 48px;
        }

        .card {
          background: rgba(255, 255, 255, 0.88);
          border-radius: 24px;
          padding: 40px 44px;
          width: 440px;
          box-shadow: 0 8px 40px rgba(30, 100, 160, 0.13);
        }

        .card-title {
          font-size: 34px;
          font-weight: 900;
          text-align: center;
          margin-bottom: 26px;
        }

        .field {
          margin-bottom: 14px;
        }

        .field-label {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
          display: block;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          background: #ebebeb;
          border-radius: 8px;
          padding: 0 14px;
        }

        .input-wrap:focus-within {
          border: 2px solid #27ae60;
        }

        .input-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 11px 0;
          outline: none;
        }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
        }

        .error-msg {
          font-size: 12px;
          color: red;
          margin-top: 4px;
        }

        .server-error {
          background: #fdecea;
          padding: 10px;
          border-radius: 8px;
          color: #c0392b;
          margin-bottom: 14px;
          text-align: center;
        }

        .next-btn {
          width: 100%;
          padding: 14px;
          background: #27ae60;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .next-btn:disabled {
          opacity: 0.7;
        }

        .signin-text {
          text-align: center;
          margin-top: 16px;
          font-size: 13px;
        }

        .signin-text a {
          color: #2980b9;
          font-weight: 800;
        }
      `}</style>

      <div className="page">
        <nav className="navbar">
          <div className="logo-box">LOGO</div>
          <div>
            <div className="brand-text">SAJILO MART</div>
            <div className="brand-sub">Shop Anytime Anywhere</div>
          </div>
        </nav>

        <div className="main">
          <div className="image-side">
            <div className="cartoon-placeholder">
              <span className="icon">🧒‍♀️</span>
              Cartoon Image
            </div>
          </div>

          <div className="card">
            <h1 className="card-title">Sign Up</h1>

            {errors.server && (
              <div className="server-error">{errors.server}</div>
            )}

            <div className="field">
              <label className="field-label">Full Name</label>
              <div className="input-wrap">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              {errors.fullName && <div className="error-msg">{errors.fullName}</div>}
            </div>

            <div className="field">
              <label className="field-label">Email</label>
              <div className="input-wrap">
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            <div className="field">
              <label className="field-label">Address</label>
              <div className="input-wrap">
                <input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              {errors.address && <div className="error-msg">{errors.address}</div>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  👁
                </button>
              </div>
              {errors.password && <div className="error-msg">{errors.password}</div>}
            </div>

            <div className="field">
              <label className="field-label">Confirm Password</label>
              <div className="input-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  👁
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="error-msg">{errors.confirmPassword}</div>
              )}
            </div>

            <button className="next-btn" onClick={handleNext} disabled={loading}>
              {loading ? "Loading..." : "Next"}
            </button>

            <p className="signin-text">
              Already have account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}