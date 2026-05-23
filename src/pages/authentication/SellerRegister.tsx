import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerOtpVerification from "./SellerOtpVerification";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const initialForm = {
  name: "",
  username: "",
  citizenship: "",
  pan_no: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  address: "",
};
  
const SellerRegister: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    const missingField = Object.entries(form).find(([, value]) => !value.trim());

    if (missingField) {
      setError("Please fill in all seller details.");
      return false;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return false;
    }

    if (!logo) {
      setError("Please upload a shop logo.");
      return false;
    }

    if (!document) {
      setError("Please upload a registration document.");
      return false;
    }

    return true;
  };

  const sendOtp = async () => {
    const response = await fetch(`${API_BASE}/api/users/send-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: form.email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send OTP");
    }
  };

  const handleSendOtp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendOtp();
      setShowOtpVerification(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      await sendOtp();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const buildRegistrationData = (otp: string) => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("otp", otp);

    if (logo) {
      formData.append("logo", logo);
    }

    if (document) {
      formData.append("business_certificate", document);
    }

    return formData;
  };

  const handleVerifyAndRegister = async (otp: string) => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/seller/register/`, {
        method: "POST",
        body: buildRegistrationData(otp),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Registration failed");
      }

      alert("Seller registered successfully. Please wait for admin approval.");
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (showOtpVerification) {
    return (
      <SellerOtpVerification
        email={form.email}
        loading={loading}
        error={error}
        onVerify={handleVerifyAndRegister}
        onResend={handleResendOtp}
        onBack={() => {
          setError("");
          setShowOtpVerification(false);
        }}
      />
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Seller Registration</h2>

        <div style={styles.grid}>
          <Field
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          <Field
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
          <Field
            label="Citizenship"
            name="citizenship"
            value={form.citizenship}
            onChange={handleChange}
            placeholder="Citizenship number"
          />
          <Field
            label="PAN No"
            name="pan_no"
            value={form.pan_no}
            onChange={handleChange}
            placeholder="PAN number"
          />
          <Field
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter email"
          />
          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Enter phone number"
          />
          <Field
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter password"
          />
          <Field
            label="Confirm Password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            type="password"
            placeholder="Confirm password"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Address</label>
          <textarea
            style={{ ...styles.input, minHeight: "84px", resize: "vertical" }}
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter business address"
          />
        </div>

        <div style={styles.grid}>
          <FileField
            label="Shop Logo"
            file={logo}
            accept="image/*"
            onChange={setLogo}
          />
          <FileField
            label="Registration Document"
            file={document}
            accept="image/*,.pdf"
            onChange={setDocument}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.button}
          type="button"
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Continue to OTP verification"}
        </button>
      </div>
    </div>
  );
};

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
};

const Field: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      style={styles.input}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  </div>
);

type FileFieldProps = {
  label: string;
  file: File | null;
  accept: string;
  onChange: (file: File | null) => void;
};

const FileField: React.FC<FileFieldProps> = ({
  label,
  file,
  accept,
  onChange,
}) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type="file"
      accept={accept}
      onChange={(event) => onChange(event.target.files?.[0] || null)}
    />
    {file && <p style={styles.preview}>Selected: {file.name}</p>}
  </div>
);

export default SellerRegister;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f7fb",
    padding: "24px",
    overflowY: "auto",
  },
  card: {
    width: "100%",
    maxWidth: "760px",
    background: "#fff",
    padding: "28px",
    borderRadius: "8px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  title: {
    color: "#0f172a",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: 800,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "#334155",
    fontWeight: 700,
    fontSize: "14px",
  },
  input: {
    padding: "11px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    color: "#0f172a",
    outline: "none",
    font: "inherit",
  },
  button: {
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  preview: {
    fontSize: "12px",
    color: "#15803d",
    margin: 0,
  },
  error: {
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: 700,
    margin: 0,
  },
};
