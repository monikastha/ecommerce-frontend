import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo.png";

// --- Types & Constants ---
type Role = {
  value: string;
  label: string;
  icon: string;
};

interface LoginResponse {
  role: string;
  username: string;
  error?: string;
  token?: string; 
}

const ROLES: Role[] = [
  { value: "admin", label: "Admin", icon: "🛡️" },
  { value: "buyer", label: "Buyer", icon: "🛒" },
  { value: "seller", label: "Seller", icon: "🏪" },
  { value: "delivery", label: "Delivery Man", icon: "🚚" },
  { value: "warehousestaff", label: "Warehouse Staff", icon: "🏭" },
  { value: "assistant", label: "Assistant", icon: "🤝" },
];

const ROLE_ROUTES: Record<string, string> = {
  admin: "/admin/dashboard",
  assistant: "/assistant/dashboard",
  buyer: "/buyer/dashboard",
  seller: "/seller/dashboard",
  delivery: "/delivery/dashboard",
  warehousestaff: "/warehouse/dashboard",
};

export default function LoginPage() {
  const navigate = useNavigate();

  // --- State ---
  const [selectedRole, setSelectedRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedRoleObj = ROLES.find((r) => r.value === selectedRole);

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) return setError("Select a role");
    if (!username) return setError("Enter username");
    if (!password) return setError("Enter password");

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          role: selectedRole,
        }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store User Data
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      if (data.token) localStorage.setItem("token", data.token);

      // Redirect based on role mapping
      const targetPath = ROLE_ROUTES[data.role];
      if (targetPath) {
        navigate(targetPath);
      } else {
        setError("User role not recognized.");
      }
    } catch (err) {
      // FIX: Check instance to safely access .message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Network Error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT SIDE - BRANDING */}
      <div className="login-left">
        <img src={logoImg} alt="SajiloMart Logo" />
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <form className="login-card" onSubmit={handleLogin}>
        <h2>
          <b>Sajilo</b>Mart
        </h2>

        <p className="subtitle">Login to your account</p>

        {/* ROLE SELECTION */}
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
              <span style={{ fontSize: "10px" }}>▼</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {ROLES.map((role) => (
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
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="field">
          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && <p className="error-text">{error}</p>}

        {/* SUBMIT BUTTON */}
        <button className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="signup">
          Don’t have an account? <a href="/signupway">Sign up</a>
        </p>
      </form>

      <style>{`
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

        .login-wrapper {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          background: linear-gradient(135deg, #dbeafe, #93c5fd);
          padding: 40px;
        }

        .login-left img {
          width: 600px;
          max-width: 100%;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }

        .login-card {
          width: 380px;
          background: white;
          padding: 35px;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        h2 {
          text-align: center;
          margin-bottom: 5px;
          color: #2563eb;
          font-size: 24px;
        }

        .subtitle {
          text-align: center;
          font-size: 13px;
          color: #666;
          margin-bottom: 25px;
        }

        .field {
          margin-bottom: 18px;
          position: relative;
        }

        label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: #2563eb;
        }

        .dropdown-btn {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: white;
        }

        .dropdown-menu {
          position: absolute;
          width: 100%;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-top: 4px;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .dropdown-item {
          padding: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .dropdown-item:hover {
          background: #f8fafc;
        }

        .password-container {
          display: flex;
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
        }

        .login-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.2s;
        }

        .login-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .login-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .error-text {
          color: #ef4444;
          text-align: center;
          font-size: 13px;
          margin-bottom: 10px;
        }

        .signup {
          text-align: center;
          margin-top: 15px;
          font-size: 13px;
        }

        .signup a {
          color: #2563eb;
          font-weight: bold;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}