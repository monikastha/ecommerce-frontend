import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoImg from "../../assets/logo.png";
import cartoonImg from "../../assets/cartoon1.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function BuyerSignUp() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = "Username is required.";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters.";

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email.";

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\+?[0-9\s]{10,15}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Enter a valid phone number.";

    if (!formData.address.trim()) newErrors.address = "Address is required.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleNext = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/buyer/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ form: data.error || data.detail || "Registration failed." });
        return;
      }

      navigate("/login");
    } catch {
      setErrors({ form: "Network error. Please check your connection." });
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

        .navbar {
          padding: 14px 32px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
        .brand-text { font-size: 22px; font-weight: 900; color: #1a3a6b; }
        .brand-sub { font-size: 13px; font-weight: 700; color: #2e86c1; }

        .main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(1120px, 100%);
          margin: 0 auto;
          padding: 32px 48px 48px;
          gap: 56px;
        }

        .image-side {
          flex: 1 1 440px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: 280px;
          order: 1;
        }

        .cartoon {
          width: min(380px, 100%);
          height: auto;
          max-height: 560px;
          object-fit: contain;
          filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.18));
        }

        .card {
          background: rgba(255, 255, 255, 0.93);
          border-radius: 24px;
          padding: 42px 48px;
          width: 460px;
          flex: 0 0 460px;
          order: 2;
          box-shadow: 0 12px 50px rgba(30, 100, 160, 0.16);
        }

        .card-title {
          font-size: 36px;
          font-weight: 900;
          text-align: center;
          margin-bottom: 30px;
          color: #1a3a6b;
        }

        .field { margin-bottom: 16px; }

        .field-label {
          font-size: 14.5px;
          font-weight: 700;
          margin-bottom: 7px;
          display: block;
          color: #2c3e50;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          background: #f4f4f4;
          border-radius: 10px;
          padding: 0 16px;
        }

        .input-wrap:focus-within {
          background: white;
          border: 2px solid #27ae60;
        }

        .input-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 13px 0;
          outline: none;
          font-size: 15.5px;
        }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
        }

        .error-msg {
          font-size: 13px;
          color: #e74c3c;
          margin-top: 4px;
        }

        .next-btn {
          width: 100%;
          padding: 15px;
          background: #27ae60;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 16.5px;
          cursor: pointer;
          margin-top: 12px;
        }

        .next-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .signin-text {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
        }

        .signin-text a {
          color: #2980b9;
          font-weight: 800;
          text-decoration: none;
        }

        .auth-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #1a3a6b;
        }

        .nav-link {
          background: none;
          border: none;
          color: #2980b9;
          cursor: pointer;
          font-weight: 800;
          text-decoration: none;
          padding: 0;
        }

        .nav-link:hover {
          text-decoration: underline;
        }

        .nav-separator {
          color: #7f8c8d;
        }

        @media (max-width: 900px) {
          .main {
            flex-direction: column;
            justify-content: flex-start;
            padding: 20px 20px 36px;
            gap: 24px;
          }

          .image-side {
            flex: none;
            min-width: 0;
            justify-content: center;
            width: 100%;
          }

          .cartoon {
            width: min(260px, 72vw);
            max-height: 300px;
          }

          .card {
            width: min(460px, 100%);
            flex: none;
            padding: 32px 24px;
          }
        }
      `}</style>

      <div className="page">
        <nav className="navbar">
          <img src={logoImg} alt="Logo" className="logo" />
          <div>
            <div className="brand-text">SAJILO MART</div>
            <div className="brand-sub">Shop Anytime Anywhere</div>
          </div>
        </nav>

        <div className="main">
          {/* Girl Image - Left Side (Perfectly Centered) */}
          <div className="image-side">
            <img src={cartoonImg} alt="Cartoon Girl" className="cartoon" />
          </div>

          {/* Signup Form */}
          <div className="card">
            <h1 className="card-title">Create Buyer Account</h1>

            <div className="auth-links">
              <button type="button" className="nav-link" onClick={() => navigate("/")}>Home</button>
              <span className="nav-separator">|</span>
              <Link to="/login" className="nav-link">Login</Link>
            </div>

            <div className="field">
              <label className="field-label">Username</label>
              <div className="input-wrap">
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe123" />
              </div>
              {errors.username && <div className="error-msg">{errors.username}</div>}
            </div>

            <div className="field">
              <label className="field-label">Full Name</label>
              <div className="input-wrap">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
              </div>
              {errors.fullName && <div className="error-msg">{errors.fullName}</div>}
            </div>

            <div className="field">
              <label className="field-label">Email</label>
              <div className="input-wrap">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" />
              </div>
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            <div className="field">
              <label className="field-label">Phone Number</label>
              <div className="input-wrap">
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+977 98xxxxxxxx" />
              </div>
              {errors.phoneNumber && <div className="error-msg">{errors.phoneNumber}</div>}
            </div>

            <div className="field">
              <label className="field-label">Address</label>
              <div className="input-wrap">
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Pokhara, Nepal" />
              </div>
              {errors.address && <div className="error-msg">{errors.address}</div>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <div className="input-wrap">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <div className="error-msg">{errors.password}</div>}
            </div>

            <div className="field">
              <label className="field-label">Confirm Password</label>
              <div className="input-wrap">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                <button className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
            </div>

            <button className="next-btn" onClick={handleNext} disabled={loading}>
              {loading ? "Creating Account..." : "Next"}
            </button>
            {errors.form && <div className="error-msg">{errors.form}</div>}

            <p className="signin-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
