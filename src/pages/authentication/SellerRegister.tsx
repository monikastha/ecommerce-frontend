import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const SellerRegister: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    citizenship: "",
    panNo: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Logo size should be less than 5MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Document size should be less than 10MB");
        return;
      }
      setDocumentFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return alert("Full Name is required!");
    if (!formData.username.trim()) return alert("Username is required!");
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");
    if (!logoFile || !documentFile) return alert("Please upload both Logo and Document");

    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Seller Registration Data:", { ...formData, logoFile, documentFile });
      alert("Registration successful! Redirecting to OTP verification...");
      navigate("/confirmcode");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .seller-register-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc, #dbeafe);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Poppins', system-ui, sans-serif;
        }

        .seller-container {
          display: flex;
          flex-wrap: wrap;
          gap: 60px;
          max-width: 1100px;
          width: 100%;
          align-items: center;
        }

        .seller-left {
          flex: 1;
          text-align: center;
          display: none;
        }

        @media (min-width: 1024px) {
          .seller-left { display: block; }
        }

        .seller-left img {
          width: 420px;
          max-width: 100%;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
        }

        .seller-card {
          background: white;
          width: 100%;
          max-width: 420px;
          padding: 40px 35px;
          border-radius: 24px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
        }

        .seller-title {
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          color: #1e2937;
          margin-bottom: 8px;
        }

        .seller-subtitle {
          text-align: center;
          color: #64748b;
          font-size: 15px;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #d1d5db;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }

        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .upload-box {
          height: 115px;
          border: 2px dashed #9ca3af;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .upload-box:hover {
          border-color: #3b82f6;
          background: #f0f9ff;
        }

        .upload-box img {
          max-height: 85px;
          object-fit: contain;
        }

        .password-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          cursor: pointer;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          background: #1d4ed8;
        }

        .submit-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          font-size: 14.5px;
          color: #64748b;
        }

        .login-link span {
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      <div className="seller-register-wrapper">
        <div className="seller-container">
          {/* Left Panel - Logo */}
          <div className="seller-left">
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={logo} alt="SAJILO MART" />
              <div style={{
                position: "absolute",
                bottom: "-20px",
                right: "-20px",
                background: "white",
                padding: "8px 16px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1e40af"
              }}>
                🇳🇵 Trusted by Nepali Sellers
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="seller-card">
            <h1 className="seller-title">Become a Seller</h1>
            <p className="seller-subtitle">Join Sajilo Mart and grow your business</p>

            <div className="form-group">
              <label className="label">FULL NAME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="Ram Kumar Shrestha"
              />
            </div>

            <div className="form-group">
              <label className="label">USERNAME</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input"
                placeholder="ram_shrestha"
              />
              <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                This will be used for login
              </p>
            </div>

            <div className="form-group">
              <label className="label">CITIZENSHIP NUMBER</label>
              <input
                type="text"
                name="citizenship"
                value={formData.citizenship}
                onChange={handleInputChange}
                className="input"
                placeholder="12-34-56789"
              />
            </div>

            {/* Upload Section */}
            <div className="form-group">
              <div className="upload-grid">
                <div>
                  <label className="label">BUSINESS LOGO</label>
                  <label className="upload-box">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" />
                    ) : (
                      <>
                        <div style={{ fontSize: "28px", marginBottom: "6px" }}>📸</div>
                        <p style={{ fontSize: "13px", color: "#6b7280" }}>Upload Logo</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af" }}>PNG, JPG • Max 5MB</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="label">PAN / DOCUMENT</label>
                  <label className="upload-box">
                    {documentFile ? (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "32px", marginBottom: "6px" }}>✅</div>
                        <p style={{ fontSize: "12px", color: "#16a34a", wordBreak: "break-all" }}>
                          {documentFile.name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: "28px", marginBottom: "6px" }}>📄</div>
                        <p style={{ fontSize: "13px", color: "#6b7280" }}>Upload Document</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af" }}>PDF, JPG • Max 10MB</p>
                      </>
                    )}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="label">PAN NUMBER</label>
              <input
                type="text"
                name="panNo"
                value={formData.panNo}
                onChange={handleInputChange}
                className="input"
                placeholder="123456789"
              />
            </div>

            <div className="form-group">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="label">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="label">PHONE</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="label">BUSINESS ADDRESS</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input"
                placeholder="Pokhara-17, Lakeside"
              />
            </div>

            {/* Password Fields */}
            <div className="form-group">
              <label className="label">PASSWORD</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Create strong password"
                />
                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="label">CONFIRM PASSWORD</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Confirm password"
                />
                <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Next →"}
            </button>

            <div className="login-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login here</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerRegister;