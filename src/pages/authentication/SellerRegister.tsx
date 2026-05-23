import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const SellerRegister: React.FC = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setLogo(e.target.files[0]);
  };

  const handleDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setDocument(e.target.files[0]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Seller Registration</h2>

        {/* NAME */}
        <div style={styles.field}>
          <label style={styles.label}>Name:</label>
          <input style={styles.input} type="text" placeholder="Enter your name" />
        </div>
        
{/* USERNAME */}
<div style={styles.field}>
  <label style={styles.label}>Username:</label>
  <input style={styles.input} type="text" placeholder="Enter username" />
</div>

        {/* CITIZENSHIP */}
        <div style={styles.field}>
          <label style={styles.label}>Citizenship:</label>
          <input style={styles.input} type="text" placeholder="Citizenship number" />
        </div>

        {/* UPLOAD LOGO */}
        <div style={styles.field}>
          <label style={styles.label}>Shop Logo:</label>
          <input type="file" accept="image/*" onChange={handleLogo} />
          {logo && <p style={styles.preview}>Selected: {logo.name}</p>}
        </div>

        {/* UPLOAD DOCUMENT */}
        <div style={styles.field}>
          <label style={styles.label}>Registration Document:</label>
          <input type="file" accept="image/*,.pdf" onChange={handleDoc} />
          {document && <p style={styles.preview}>Selected: {document.name}</p>}
        </div>

        {/* EMAIL */}
        <div style={styles.field}>
          <label style={styles.label}>Email:</label>
          <input style={styles.input} type="email" placeholder="Enter email" />
        </div>

        {/* PHONE */}
        <div style={styles.field}>
          <label style={styles.label}>Phone:</label>
          <input style={styles.input} type="tel" placeholder="Enter phone number" />
        </div>

        {/* PASSWORD */}
        <div style={styles.field}>
          <label style={styles.label}>Password:</label>
          <input style={styles.input} type="password" />
        </div>

        {/* CONFIRM PASSWORD */}
        <div style={styles.field}>
          <label style={styles.label}>Confirm Password:</label>
          <input style={styles.input} type="password" />
        </div>

        {/* ADDRESS */}
        <div style={styles.field}>
          <label style={styles.label}>Address:</label>
          <input style={styles.input} type="text" />
        </div>

        {/* BUTTON */}
        <button style={styles.button} onClick={() => navigate("/confirmcode")}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SellerRegister;

/* ================= STYLES ================= */
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#e0f2fe,#dbeafe)",
    padding: "20px",
    overflowY: "auto",   // ✅ FIX SCROLL ISSUE
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  title: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "10px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontWeight: 600,
    fontSize: "14px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },

  preview: {
    fontSize: "12px",
    color: "green",
  },
};