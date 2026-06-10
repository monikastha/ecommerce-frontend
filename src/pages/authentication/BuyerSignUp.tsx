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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters.";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email.";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\+?[0-9\s]{10,15}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Enter a valid phone number.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSignUp = async () => {
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
        headers: { "Content-Type": "application/json" },
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

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "10px 0",
    outline: "none",
    fontSize: 14,
    fontFamily: "'Nunito', sans-serif",
    color: "#2c3e50",
  };

  const wrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    background: "#f0f4f8",
    borderRadius: 8,
    padding: "0 12px",
    border: "1.5px solid #e2e8f0",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#2c3e50",
    marginBottom: 5,
  };

  const fieldStyle: React.CSSProperties = { marginBottom: 12 };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #c8eaf6 0%, #daf2fb 50%, #c0ebf6 100%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #b0bec5; }
        .field-wrap:focus-within {
          background: #ffffff !important;
          border-color: #27ae60 !important;
          box-shadow: 0 0 0 3px rgba(39,174,96,0.12);
        }
        .next-btn:hover:not(:disabled) { background: #219a52 !important; transform: translateY(-1px); }
        .next-btn:active:not(:disabled) { transform: translateY(0px); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        padding: "12px 36px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 10px rgba(30,100,160,0.1)",
        flexShrink: 0,
      }}>
        <img src={logoImg} alt="Logo" style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover" }} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#1a3a6b", letterSpacing: 0.5 }}>SAJILO MART</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#2e86c1" }}>Shop Anytime Anywhere</div>
        </div>
      </nav>

      {/* Main Content - Side by Side */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 40px",
        gap: 60,
        overflow: "hidden",
      }}>

        {/* LEFT — Girl Image */}
        <div style={{
          flex: "1 1 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
        }}>
          <img
            src={cartoonImg}
            alt="Cartoon"
            style={{
              width: "100%",
              maxWidth: 420,
              maxHeight: "calc(100vh - 130px)",
              objectFit: "contain",
              filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.15))",
            }}
          />
        </div>

        {/* RIGHT — Wider Form Card */}
        <div style={{
          flex: "1 1 0",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "100%",
            maxWidth: 480,           // ← Increased width
            background: "rgba(255,255,255,0.97)",
            borderRadius: 20,
            padding: "32px 32px",    // Slightly more padding
            boxShadow: "0 10px 40px rgba(30,100,160,0.15)",
          }}>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 900, 
              textAlign: "center", 
              color: "#1a3a6b", 
              marginBottom: 6 
            }}>
              Sign Up
            </h1>
            <p style={{ 
              textAlign: "center", 
              fontSize: 14.5, 
              color: "#2e86c1", 
              fontWeight: 600, 
              marginBottom: 24 
            }}>
              Create your buyer account
            </p>

            {/* Username */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Username</label>
              <div className="field-wrap" style={wrapStyle}>
                <input style={inputStyle} type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe123" />
              </div>
              {errors.username && <div style={{ fontSize: 12, color: "#e74c3c", marginTop: 3 }}>{errors.username}</div>}
            </div>

            {/* Full Name */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Full Name</label>
              <div className="field-wrap" style={wrapStyle}>
                <input style={inputStyle} type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
              </div>
              {errors.fullName && <div style={{ fontSize: 12, color: "#e74c3c", marginTop: 3 }}>{errors.fullName}</div>}
            </div>

            {/* Email */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Email</label>
              <div className="field-wrap" style={wrapStyle}>
                <input style={inputStyle} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" />
              </div>
              {errors.email && <div style={{ fontSize: 12, color: "#e74c3c", marginTop: 3 }}>{errors.email}</div>}
            </div>

            {/* Phone */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Phone Number</label>
              <div className="field-wrap" style={wrapStyle}>
                <input style={inputStyle} type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+977 98xxxxxxxx" />
              </div>
              {errors.phoneNumber && <div style={{ fontSize: 12, color: "#e74c3c", marginTop: 3 }}>{errors.phoneNumber}</div>}
            </div>

            {/* Address */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Address</label>
              <div className="field-wrap" style={wrapStyle}>
                <input style={inputStyle} type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Kathmandu, Pokhara, Damauli, etc." />
              </div>
              {errors.address && <div style={{ fontSize: 12, color: "#e74c3c", marginTop: 3 }}>{errors.address}</div>}
            </div>

            {/* Password */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Password</label>
              <div className="field-wrap" style={wrapStyle}>
                <input style={inputStyle} type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create your password" />
                <button onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, color: "#7f8c8d", lineHeight: 1 }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <div style={{ fontSize: 12, color: "#e74c3c", marginTop: 3 }}>{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <div className="field-wrap" style={wrapStyle}>
                <input style={inputStyle} type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" />
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, color: "#7f8c8d", lineHeight: 1 }}>
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.confirmPassword && <div style={{ fontSize: 12, color: "#e74c3c", marginTop: 3 }}>{errors.confirmPassword}</div>}
            </div>

            {/* Submit Button */}
            <button
              className="next-btn"
              onClick={handleSignUp}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 15.5,
                fontFamily: "'Nunito', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 10,
                opacity: loading ? 0.75 : 1,
                transition: "background 0.2s, transform 0.15s",
                letterSpacing: 0.3,
              }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {errors.form && <div style={{ fontSize: 12, color: "#e74c3c", textAlign: "center", marginTop: 10 }}>{errors.form}</div>}

            <p style={{ textAlign: "center", marginTop: 18, fontSize: 13.5, color: "#2c3e50" }}>
              Already Have An Account?{" "}
              <Link to="/login" style={{ color: "#2980b9", fontWeight: 700, textDecoration: "none" }}>Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}