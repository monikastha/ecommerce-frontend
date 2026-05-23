import { useRef, useState } from "react";
import type React from "react";

type SellerOtpVerificationProps = {
  email: string;
  loading: boolean;
  error: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
};

const SellerOtpVerification: React.FC<SellerOtpVerificationProps> = ({
  email,
  loading,
  error,
  onVerify,
  onResend,
  onBack,
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const nextCode = ["", "", "", "", "", ""];
    pasted.split("").forEach((digit, index) => {
      nextCode[index] = digit;
    });
    setCode(nextCode);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const fullCode = code.join("");

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button type="button" style={styles.backButton} onClick={onBack}>
          Back
        </button>

        <h2 style={styles.title}>Verify seller email</h2>
        <p style={styles.copy}>Enter the 6-digit code sent to {email}.</p>

        <div style={styles.otpRow} onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              style={styles.otpInput}
              value={digit}
              inputMode="numeric"
              maxLength={1}
              onChange={(event) => handleDigitChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
            />
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="button"
          style={styles.primaryButton}
          onClick={() => onVerify(fullCode)}
          disabled={loading || fullCode.length !== 6}
        >
          {loading ? "Verifying..." : "Verify and register"}
        </button>

        <button
          type="button"
          style={styles.secondaryButton}
          onClick={onResend}
          disabled={loading}
        >
          Resend code
        </button>
      </div>
    </div>
  );
};

export default SellerOtpVerification;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f7fb",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "28px",
  },
  backButton: {
    alignSelf: "flex-start",
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: 700,
    padding: 0,
  },
  title: {
    color: "#0f172a",
    fontSize: "24px",
    margin: 0,
  },
  copy: {
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.5,
    margin: 0,
  },
  otpRow: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "10px",
  },
  otpInput: {
    width: "100%",
    aspectRatio: "1 / 1",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: 800,
    textAlign: "center",
    outline: "none",
  },
  primaryButton: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryButton: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#fff",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 700,
  },
  error: {
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: 700,
    margin: 0,
  },
};
