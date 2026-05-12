import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmRegistration() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1);
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    setError("");

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\s/g, "").slice(0, 6);

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }

    setCode(newCode);

    const nextEmpty = newCode.findIndex((c) => !c);
    const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIdx]?.focus();
  };

  const fullCode = code.join("");

  const handleConfirm = () => {
    if (fullCode.length < 6) {
      setError("Please enter the complete 6-digit confirmation code.");
      return;
    }

    setError("");
    setLoading(true);

    // ✅ fake delay (no API)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/emailverified"); // 👉 success page route
      }, 1200);
    }, 1000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Nunito', sans-serif;
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

        .title {
          font-size: 42px;
          font-weight: 900;
          color: #111;
          line-height: 1.18;
          margin-bottom: 28px;
        }

        .subtitle-1 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .subtitle-2 {
          font-size: 15px;
          color: #444;
          margin-bottom: 42px;
        }

        .code-label {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .otp-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 14px;
        }

        .otp-box {
          width: 50px;
          height: 52px;
          border: none;
          border-radius: 8px;
          background: #e74c3c;
          color: white;
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          outline: none;
        }

        .otp-box:focus {
          background: #c0392b;
        }

        .error-msg {
          color: #c0392b;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .success-msg {
          color: #1e8449;
          font-weight: 800;
          margin-bottom: 14px;
        }

        .confirm-btn {
          width: 360px;
          padding: 16px;
          background: linear-gradient(135deg, #27ae60, #1e8449);
          color: white;
          font-size: 20px;
          font-weight: 800;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }

        .confirm-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .resend-row {
          margin-top: 20px;
          font-size: 13px;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #2980b9;
          cursor: pointer;
          font-weight: 800;
        }
      `}</style>

      <div className="page">
        <div className="card">
          <h1 className="title">Confirmation of<br />Registration</h1>

          <p className="subtitle-1">Code has been sent to your email</p>
          <p className="subtitle-2">
            Enter the 6-digit confirmation code to continue.
          </p>

          <div className="otp-row" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className="otp-box"
                value={digit}
                maxLength={1}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">Verified! Redirecting...</div>}

          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>

          <div className="resend-row">
            Didn't receive code?
            <button className="resend-btn" onClick={() => alert("Mock resend")}>
              Resend
            </button>
          </div>
        </div>
      </div>
    </>
  );
}