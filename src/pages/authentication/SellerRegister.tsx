import React, { useState } from "react";

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    fontFamily: "'Poppins', sans-serif",
    background: "#f0f2f5",
    margin: 0,
    padding: 0,
  },
  pageLabel: {
    background: "#f0f2f5",
    padding: "8px 16px",
    fontSize: "13px",
    color: "#333",
    fontWeight: 500,
  },
  navbar: {
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 24px",
    borderBottom: "1px solid #e0e0e0",
  },
  navbarLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  navbarLogoImg: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#d6e4f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  navLinks: {
    display: "flex",
    gap: "24px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "13px",
    fontWeight: 500,
  },
  mainWrapper: {
    display: "flex",
    minHeight: "calc(100vh - 90px)",
    background: "#1a3a6b",
    padding: "32px",
    gap: "32px",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  leftPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "60px",
  },
  logoCircle: {
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    background: "#e8f0f8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    border: "3px solid #c8d8ec",
  },
  logoText: {
    fontSize: "13px",
    fontWeight: 800,
    color: "#1a3a6b",
    letterSpacing: "1px",
    textAlign: "center",
    lineHeight: 1.2,
    marginTop: "4px",
  },
  logoTagline: {
    fontSize: "7px",
    color: "#1a3a6b",
    letterSpacing: "0.5px",
    marginTop: "2px",
  },
  formCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "28px 32px",
    width: "340px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
  },
  formTitle: {
    fontSize: "22px",
    fontWeight: 700,
    textAlign: "center",
    color: "#111",
    marginBottom: "18px",
  },
  formGroup: {
    marginBottom: "12px",
  },
  label: {
    display: "block",
    fontSize: "11.5px",
    fontWeight: 600,
    color: "#444",
    marginBottom: "3px",
  },
  input: {
    width: "100%",
    padding: "7px 10px",
    border: "1px solid #d0d0d0",
    borderRadius: "5px",
    fontSize: "11.5px",
    color: "#888",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },
  inputWithPadding: {
    width: "100%",
    padding: "7px 32px 7px 10px",
    border: "1px solid #d0d0d0",
    borderRadius: "5px",
    fontSize: "11.5px",
    color: "#888",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },
  uploadRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
  },
  uploadBox: {
    flex: 1,
    background: "#d9d9d9",
    borderRadius: "6px",
    height: "68px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: "#555",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "center",
    lineHeight: 1.4,
  },
  pwWrapper: {
    position: "relative",
  },
  pwToggle: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#aaa",
    fontSize: "13px",
    userSelect: "none",
  },
  btnNext: {
    width: "100%",
    padding: "10px",
    background: "#1a5fbd",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "6px",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: "0.5px",
  },
};

// Reusable SVG Logo (cart + wifi)
const SajiloLogo = ({ size = 110 }: { size?: number }) => (
  <svg
    viewBox="0 0 120 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={(size * 100) / 120}
    style={{ marginBottom: "-4px" }}
  >
    {/* Speckle dots */}
    <circle cx="10" cy="15" r="2" fill="#90b8d8" opacity="0.55" />
    <circle cx="108" cy="12" r="1.5" fill="#90b8d8" opacity="0.5" />
    <circle cx="8" cy="70" r="1.5" fill="#90b8d8" opacity="0.45" />
    <circle cx="112" cy="72" r="2" fill="#90b8d8" opacity="0.5" />
    <circle cx="18" cy="88" r="1.2" fill="#90b8d8" opacity="0.4" />
    <circle cx="100" cy="85" r="1.2" fill="#90b8d8" opacity="0.4" />
    <circle cx="25" cy="30" r="1" fill="#90b8d8" opacity="0.35" />
    <circle cx="95" cy="28" r="1" fill="#90b8d8" opacity="0.35" />
    <circle cx="55" cy="8" r="1.5" fill="#90b8d8" opacity="0.4" />
    {/* Cart handle */}
    <line x1="14" y1="28" x2="26" y2="44" stroke="#00bcd4" strokeWidth="4" strokeLinecap="round" />
    {/* Cart filled body */}
    <path d="M26 44 L96 44 L90 70 L32 70 Z" fill="#00bcd4" />
    {/* WiFi arcs - white */}
    <path d="M46 56 Q61 44 76 56" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M51 61 Q61 53 71 61" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="61" cy="65.5" r="3.5" fill="white" />
    {/* Left wheel */}
    <circle cx="42" cy="82" r="9" fill="#00bcd4" />
    <circle cx="42" cy="82" r="3.5" fill="white" />
    {/* Right wheel */}
    <circle cx="80" cy="82" r="9" fill="#00bcd4" />
    <circle cx="80" cy="82" r="3.5" fill="white" />
  </svg>
);

// Small navbar SVG logo
const NavLogo = () => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <circle cx="22" cy="22" r="22" fill="#e8f0f8" />
    <circle cx="8" cy="10" r="1" fill="#a0b8d0" opacity="0.6" />
    <circle cx="36" cy="8" r="0.8" fill="#a0b8d0" opacity="0.5" />
    <circle cx="6" cy="32" r="0.8" fill="#a0b8d0" opacity="0.5" />
    <circle cx="38" cy="34" r="1" fill="#a0b8d0" opacity="0.5" />
    {/* Handle */}
    <line x1="7" y1="13" x2="12" y2="19" stroke="#00bcd4" strokeWidth="2" strokeLinecap="round" />
    {/* Cart body */}
    <path d="M12 19 L33 19 L31 29 L14 29 Z" fill="#00bcd4" />
    {/* WiFi arcs - white */}
    <path d="M17.5 23.5 Q22 19.5 26.5 23.5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M19.5 25.5 Q22 23 24.5 25.5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <circle cx="22" cy="27" r="1.3" fill="white" />
    {/* Left wheel */}
    <circle cx="17" cy="33" r="3" fill="#00bcd4" />
    <circle cx="17" cy="33" r="1.2" fill="white" />
    {/* Right wheel */}
    <circle cx="28" cy="33" r="3" fill="#00bcd4" />
    <circle cx="28" cy="33" r="1.2" fill="white" />
  </svg>
);

// Password field with toggle
const PasswordField = ({
  placeholder,
  id,
}: {
  placeholder: string;
  id: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div style={styles.pwWrapper}>
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        style={styles.inputWithPadding}
      />
      <span style={styles.pwToggle} onClick={() => setShow(!show)}>
        {show ? "🙈" : "👁"}
      </span>
    </div>
  );
};

const SellerRegister: React.FC = () => {
  return (
    <div style={styles.body}>
      {/* Page Label */}
      <div style={styles.pageLabel}>Seller Register 1</div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navbarLogo}>
          <div style={styles.navbarLogoImg}>
            <NavLogo />
          </div>
        </div>
        <ul style={styles.navLinks}>
          <li><a href="#" style={styles.navLink}>Home</a></li>
          <li><a href="#" style={styles.navLink}>About</a></li>
          <li><a href="#" style={styles.navLink}>Login</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div style={styles.mainWrapper}>

        {/* Left: Logo */}
        <div style={styles.leftPanel}>
          <div style={styles.logoCircle}>
            <SajiloLogo size={110} />
            <div style={styles.logoText}>SAJILO MART</div>
            <div style={styles.logoTagline}>SHOP ANYTIME ANYWHERE</div>
          </div>
        </div>

        {/* Right: Sign Up Form */}
        <div style={styles.formCard}>
          <div style={styles.formTitle}>Sign Up</div>

          {/* Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input type="text" placeholder="Enter your name" style={styles.input} />
          </div>

          {/* Citizenship */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Citizenship</label>
            <input type="text" placeholder="Enter your citizenship barcode" style={styles.input} />
          </div>

          {/* Upload Boxes */}
          <div style={styles.uploadRow}>
            <div style={styles.uploadBox}>
              Logo<br />Here
            </div>
            <div style={styles.uploadBox}>
              Registration<br />Document
            </div>
          </div>

          {/* Pan No */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Pan No</label>
            <input type="text" placeholder="Enter your PAN No" style={styles.input} />
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="Enter your email" style={styles.input} />
          </div>

          {/* Phone */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input type="tel" placeholder="Enter your phone number here" style={styles.input} />
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <PasswordField placeholder="Enter your Password" id="pw1" />
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <PasswordField placeholder="Enter your Confirm password" id="pw2" />
          </div>

          {/* Address */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input type="text" placeholder="Enter your Address" style={styles.input} />
          </div>

          {/* Next Button */}
          <button
            style={styles.btnNext}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#1448a0")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#1a5fbd")
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;