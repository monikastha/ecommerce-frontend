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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }

        .page {
          min-height: 100vh;
          background: linear-gradient(160deg, #b8eaf5 0%, #cef0f8 50%, #c5ecf7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        .page::after {
          content: '';
          position: absolute;
          bottom: -80px;
          right: -80px;
          width: 380px;
          height: 380px;
          background: rgba(255, 255, 255, 0.55);
          border-radius: 50%;
          pointer-events: none;
        }

        .card {
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .back-button {
          align-self: flex-start;
          margin-bottom: 20px;
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
        }

        .title {
          font-size: 42px;
          font-weight: 900;
          color: #111;
          line-height: 1.18;
          margin-bottom: 24px;
        }

        .subtitle-1 {
          font-size: 17px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
        }

        .subtitle-2 {
          font-size: 15.5px;
          color: #444;
          margin-bottom: 38px;
        }

        .code-label {
          font-size: 19px;
          font-weight: 800;
          margin-bottom: 14px;
          color: #222;
        }

        .otp-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .otp-box {
          width: 52px;
          height: 58px;
          border: none;
          border-radius: 10px;
          background: #e74c3c;
          color: white;
          font-size: 24px;
          font-weight: 800;
          text-align: center;
          outline: none;
        }

        .otp-box:focus {
          background: #c0392b;
          transform: scale(1.05);
        }

        .error-msg {
          color: #c0392b;
          font-weight: 700;
          margin-bottom: 16px;
          min-height: 24px;
        }

        .primary-button {
          width: 360px;
          padding: 16px;
          background: linear-gradient(135deg, #27ae60, #1e8449);
          color: white;
          font-size: 19px;
          font-weight: 800;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          margin-bottom: 12px;
        }

        .primary-button:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .resend-row {
          margin-top: 18px;
          font-size: 14px;
          color: #555;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #2980b9;
          font-weight: 800;
          cursor: pointer;
          margin-left: 4px;
        }
      `}</style>

      <div className="page">
        <div className="card">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>

          <h1 className="title">Confirmation of<br />Registration</h1>

          <p className="subtitle-1">Code has been sent to your email</p>
          <p className="subtitle-2">
            Enter the 6-digit confirmation code sent to <strong>{email}</strong>
          </p>

          <div className="code-label">Enter Verification Code</div>

          <div className="otp-row" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                className="otp-box"
                value={digit}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            className="primary-button"
            onClick={() => onVerify(fullCode)}
            disabled={loading || fullCode.length !== 6}
          >
            {loading ? "Verifying..." : "Confirm & Register"}
          </button>

          <div className="resend-row">
            Didn't receive the code?
            <button className="resend-btn" onClick={onResend} disabled={loading}>
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerOtpVerification;