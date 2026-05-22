import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    padding: 0,
  },

  mainWrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#eef0f3",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px", // smaller + balanced gap
    padding: "20px",
  },

  leftPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logoImg: {
    width: "420px",
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "28px 32px",
    width: "360px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
  },

  formTitle: {
    fontSize: "22px",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "18px",
  },

  formGroup: {
    marginBottom: "10px",
  },

  label: {
    display: "block",
    fontSize: "11.5px",
    fontWeight: 600,
    marginBottom: "3px",
  },

  input: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #d0d0d0",
    borderRadius: "5px",
    fontSize: "12px",
  },

  uploadRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },

  uploadBox: {
    flex: 1,
    background: "#d9d9d9",
    borderRadius: "6px",
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
  },

  pwWrapper: {
    position: "relative",
  },

  pwToggle: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
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
    marginTop: "10px",
    cursor: "pointer",
  },
};

/* PASSWORD FIELD */
const PasswordField = ({ placeholder }: { placeholder: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div style={styles.pwWrapper}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        style={styles.input}
      />
      <span style={styles.pwToggle} onClick={() => setShow(!show)}>
        {show ? "🙈" : "👁"}
      </span>
    </div>
  );
};

const SellerRegister: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.body}>
      <div style={styles.mainWrapper}>
        {/* LOGO */}
        <div style={styles.leftPanel}>
          <img src={logo} alt="SAJILO MART" style={styles.logoImg} />
        </div>

        {/* FORM */}
        <div style={styles.formCard}>
          <div style={styles.formTitle}>Sign Up</div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Citizenship</label>
            <input style={styles.input} />
          </div>

          <div style={styles.uploadRow}>
            <div style={styles.uploadBox}>Logo Upload</div>
            <div style={styles.uploadBox}>Document Upload</div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>PAN No</label>
            <input style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <PasswordField placeholder="Password" />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <PasswordField placeholder="Confirm Password" />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input style={styles.input} />
          </div>

          <button
            style={styles.btnNext}
            onClick={() => navigate("/confirmcode")}
          >
            Next
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              fontSize: "12px",
              color: "#777",
            }}
          >
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#1a5fbd",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;