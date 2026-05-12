import { useState, useRef } from "react";

export default function ConfirmRegistration() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit/character
    const char = value.slice(-1);
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    setError("");

    // Auto-advance to next input
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
    // Focus last filled or next empty
    const nextEmpty = newCode.findIndex((c) => !c);
    const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIdx]?.focus();
  };

  const fullCode = code.join("");

  const handleConfirm = async () => {
    if (fullCode.length < 6) {
      setError("Please enter the complete 6-digit confirmation code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid or expired code. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch {
      setError("Network error. Please check your connection.");
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

        /* Bottom-right decorative white curve — exact from Figma */
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

        /* Card */
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

        /* Title */
        .title {
          font-size: 42px;
          font-weight: 900;
          color: #111;
          line-height: 1.18;
          letter-spacing: -0.5px;
          margin-bottom: 28px;
        }

        /* Subtitle lines */
        .subtitle-1 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .subtitle-2 {
          font-size: 15px;
          font-weight: 500;
          color: #444;
          margin-bottom: 42px;
          line-height: 1.5;
        }

        /* Code label */
        .code-label {
          font-size: 20px;
          font-weight: 800;
          color: #111;
          margin-bottom: 16px;
          align-self: flex-start;
          width: 100%;
          max-width: 360px;
        }

        /* OTP boxes */
        .otp-row {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
          justify-content: center;
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
          font-family: 'Nunito', sans-serif;
          text-align: center;
          outline: none;
          caret-color: white;
          transition: background 0.15s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(231,76,60,0.25);
        }

        .otp-box::placeholder {
          color: rgba(255,255,255,0.6);
          font-size: 14px;
        }

        .otp-box:focus {
          background: #c0392b;
          box-shadow: 0 0 0 3px rgba(231,76,60,0.35), 0 2px 8px rgba(231,76,60,0.3);
        }

        .otp-box.filled {
          background: #e74c3c;
        }

        /* Single text input fallback (visible on mobile) */
        .code-input-single {
          width: 360px;
          max-width: 100%;
          padding: 14px 18px;
          background: #e74c3c;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          color: white;
          outline: none;
          margin-bottom: 14px;
          text-align: center;
          letter-spacing: 2px;
          box-shadow: 0 2px 12px rgba(231,76,60,0.28);
        }

        .code-input-single::placeholder {
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.5px;
          font-size: 14px;
        }

        /* Error */
        .error-msg {
          font-size: 13px;
          color: #c0392b;
          font-weight: 700;
          margin-bottom: 14px;
          background: rgba(231,76,60,0.1);
          padding: 8px 16px;
          border-radius: 8px;
          width: 360px;
          max-width: 100%;
        }

        /* Success */
        .success-msg {
          font-size: 15px;
          color: #1e8449;
          font-weight: 800;
          margin-bottom: 14px;
          background: rgba(39,174,96,0.12);
          padding: 10px 20px;
          border-radius: 8px;
          width: 360px;
          max-width: 100%;
        }

        /* Confirm button */
        .confirm-btn {
          width: 360px;
          max-width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
          color: white;
          font-size: 20px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 18px rgba(39,174,96,0.38);
          transition: opacity 0.15s, transform 0.12s, box-shadow 0.15s;
        }

        .confirm-btn:hover:not(:disabled) {
          opacity: 0.93;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(39,174,96,0.45);
        }

        .confirm-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .confirm-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Resend */
        .resend-row {
          margin-top: 20px;
          font-size: 13.5px;
          color: #666;
          font-weight: 600;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #2980b9;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          font-size: 13.5px;
          cursor: pointer;
          margin-left: 4px;
          padding: 0;
          text-decoration: underline;
        }

        .resend-btn:hover {
          color: #1a5276;
        }
      `}</style>

      <div className="page">
        <div className="card">
          <h1 className="title">
            Confirmation of<br />Registration
          </h1>

          <p className="subtitle-1">Code has been sent to your email</p>
          <p className="subtitle-2">
            To complete the registration enter the Confirmation code sent by E-mail.
          </p>

          <p className="code-label" style={{ textAlign: "center" }}>Confirmation Code</p>

          {/* OTP digit boxes */}
          <div className="otp-row" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                className={`otp-box ${digit ? "filled" : ""}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                placeholder="·"
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && (
            <div className="success-msg">✅ Verified! Redirecting to login...</div>
          )}

          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={loading || success}
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>

          <div className="resend-row">
            Didn't receive a code?
            <button
              className="resend-btn"
              onClick={async () => {
                await fetch("/api/auth/resend-code/", { method: "POST" });
                alert("A new code has been sent to your email.");
              }}
            >
              Resend
            </button>
          </div>
        </div>
      </div>
    </>
  );
}