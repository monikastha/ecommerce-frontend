import { useState } from "react";
import logoImg from "../../assets/logo.png";

type Role = {
  value: string;
  label: string;
  icon: string;
};

const ROLES: Role[] = [
  { value: "admin", label: "Admin", icon: "🛡️" },
  { value: "buyer", label: "Buyer", icon: "🛒" },
  { value: "seller", label: "Seller", icon: "🏪" },
  { value: "delivery_man", label: "Delivery Man", icon: "🚚" },
  { value: "warehouse_staff", label: "Warehouse Staff", icon: "🏭" },
  { value: "assistant", label: "Assistant", icon: "🤝" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedRoleObj = ROLES.find(r => r.value === selectedRole);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) return setError("Select role");
    if (!username) return setError("Username required");
    if (!password) return setError("Password required");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role: selectedRole })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("token", data.access);
        window.location.href = `/${data.role}/dashboard`;
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">

        {/* LEFT LOGO */}
        <div className="login-left">
          <img src={logoImg} className="login-logo" />
        </div>

        {/* LOGIN CARD */}
        <div className="login-card">

          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue</p>

          {/* ROLE */}
          <div className="field">
            <label>Role</label>

            <div className="dropdown">
              <div
                className="dropdown-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedRoleObj
                  ? `${selectedRoleObj.icon} ${selectedRoleObj.label}`
                  : "Select Role"}
                <span>▼</span>
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  {ROLES.map(role => (
                    <div
                      key={role.value}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedRole(role.value);
                        setDropdownOpen(false);
                      }}
                    >
                      {role.icon} {role.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* USERNAME */}
          <div className="field">
            <label>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          {/* PASSWORD */}
          <div className="field">
            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && <p className="error">{error}</p>}

          {/* LOGIN BUTTON */}
          <button onClick={handleLogin} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* SIGNUP */}
          <p className="signup-text">
            Don’t have an account?{" "}
            <a href="/register">Sign up</a>
          </p>

        </div>
      </div>

      {/* CSS */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 60px;
          background: linear-gradient(135deg,#dbeafe,#93c5fd);
        }

        .login-left {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .login-logo {
          width: 520px;
          max-width: 100%;
          object-fit: contain;
          filter: drop-shadow(0 10px 25px rgba(0,0,0,0.2));
        }

        /* ✅ FIXED CARD */
        .login-card {
          width: 400px;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        h2 {
          text-align: center;
          color: #111;
          font-size: 28px;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 20px;
        }

        .field {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
        }

        input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-btn {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          background: #f9fafb;
        }

        .dropdown-menu {
          position: absolute;
          top: 45px;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 10px;
          z-index: 10;
        }

        .dropdown-item {
          padding: 10px;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: #eff6ff;
        }

        .password-box {
          display: flex;
          align-items: center;
          border: 1px solid #ccc;
          border-radius: 10px;
          padding-right: 10px;
        }

        .error {
          color: red;
          font-size: 13px;
          text-align: center;
          margin-top: 10px;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
        }

        .signup-text {
          text-align: center;
          margin-top: 15px;
          font-size: 14px;
        }

        .signup-text a {
          color: #2563eb;
          font-weight: bold;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}