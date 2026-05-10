import { useState } from "react";
import logo from "../../assets/logo.png";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div className="page-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

        body {
          margin: 0;
          font-family: 'Nunito', sans-serif;
        }

        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #6baee8, #5b9ee0, #7ec8e3);
        }

      
        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-title {
          font-weight: 800;
          font-size: 14px;
          color: #1e3a8a;
        }

        .logo-sub {
          font-size: 10px;
          color: gray;
        }

        /* MAIN */
        .main {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 80px;
        }

        /* LEFT */
        .branding {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .branding-logo img {
  width: 600px;
  max-width: 600%;
  height: auto;
  object-fit: contain;
}

        /* CARD */
        .card {
          background: white;
          padding: 70px;
          border-radius: 15px;
          width: 450px;
          height: 500px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card h2 {
          text-align: center;
          color: #1e3a8a;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 28px;
        }

        .subtitle {
          text-align: center;
          font-size: 17px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .input-group {
          position: relative;
        }

        .input {
          width: 100%;
          padding: 17px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: #f9fafb;
        }

        .input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .toggle-btn {
          position: absolute;
          right: 10px;
          top: 10px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .btn {
        margin-top: -07px;
        margin-bottom: 17px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(90deg, #1565c0, #1976d2);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .btn:active {
          transform: scale(0.95);
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255,255,255,0.4);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .main {
            flex-direction: column;
            gap: 40px;
            padding: 30px;
          }
        }
      `}</style>

      {/* NAVBAR */}
      

      {/* MAIN */}
      <div className="main">
        {/* LEFT LOGO */}
        <div className="branding">
          <div className="branding-logo">
            <img src={logo} alt="Logo" />
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="card">
          <div>
            <h2> Hello!</h2>
            <p className="subtitle">Login into your dashboard</p>

            <div className="form-content">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
                <button
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>
            </div>
          </div>

          <button className="btn" onClick={handleLogin} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Login "}
          </button>
        </div>
      </div>
    </div>
  );
}