import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  { value: "delivery", label: "Delivery Man", icon: "🚚" },
  { value: "warehousestaff", label: "Warehouse Staff", icon: "🏭" },
  { value: "assistant", label: "Assistant", icon: "🤝" },
];

export default function LoginForAll() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedRoleObj = ROLES.find((r) => r.value === selectedRole);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }
    if (!username.trim()) {
      setError("Please enter username");
      return;
    }
    if (!password) {
      setError("Please enter password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Store user info
      localStorage.setItem("user_id", String(data.user_id || ""));
      localStorage.setItem("username", data.username);
      localStorage.setItem("name", data.name || data.username || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("profile_image", data.profile_image || "");
      localStorage.setItem("role", data.role);
      localStorage.setItem("isLoggedIn", "true");
      if (data.seller_id) {
        localStorage.setItem("seller_id", String(data.seller_id));
      } else {
        localStorage.removeItem("seller_id");
      }
      if (data.staff_id) {
        localStorage.setItem("staff_id", String(data.staff_id));
      } else {
        localStorage.removeItem("staff_id");
      }
      if (data.delivery_id) {
        localStorage.setItem("delivery_id", String(data.delivery_id));
      } else {
        localStorage.removeItem("delivery_id");
      }

      // Role-based navigation
      const roleRoutes: { [key: string]: string } = {
        admin: "/admin/dashboard",
        assistant: "/assistant/dashboard",
        buyer: (location.state as { from?: string } | null)?.from || "/allproducts",
        seller: "/seller/dashboard",
        delivery: "/delivery/dashboard",
        warehousestaff: "/warehouse/dashboard",
      };

      const redirectPath = roleRoutes[data.role];

      if (redirectPath) {
        navigate(redirectPath);
      } else {
        setError("Invalid role received from server");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT SIDE */}
      <div className="login-left">
        <img src={logoImg} alt="SajiloMart Logo" />
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <form className="login-card" onSubmit={handleLogin}>
        <h2>
          <b>Sajilo</b>Mart
        </h2>
        <p className="subtitle">Login to your account</p>

        {/* Role Selector */}
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

        {/* Username */}
        <div className="field">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="field">
          <label>Password</label>
          <div className="password">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Login Button */}
        <button className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="signup">
          Don’t have an account? <a href="/signupway">Sign up</a>
        </p>
      </form>

      <style>{`
        * { box-sizing: border-box; }
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
          width: 750px;
          max-width: 100%;
        }
        .login-card {
          width: 380px;
          background: white;
          padding: 35px;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        h2 {
          text-align: center;
          margin-bottom: 5px;
          color: #1e40af;
          font-size: 22px;
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
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }
        input {
          width: 100%;
          padding: 11px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-top: 5px;
          outline: none;
          font-size: 14px;
        }
        .dropdown-btn {
          width: 100%;
          padding: 11px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: white;
          font-size: 14px;
        }
        .dropdown-menu {
          position: absolute;
          width: 100%;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-top: 5px;
          z-index: 100;
          max-height: 250px;
          overflow-y: auto;
        }
        .dropdown-item {
          padding: 12px;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background: #f3f4f6;
        }
        .password {
          display: flex;
          gap: 8px;
        }
        .password button {
          border: none;
          background: #eee;
          padding: 0 14px;
          border-radius: 8px;
          cursor: pointer;
        }
        .login-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          font-size: 15px;
        }
        .login-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        .error {
          color: #ef4444;
          text-align: center;
          font-size: 13.5px;
          margin: 10px 0;
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
        .auth-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin: 12px 0 20px;
          font-size: 14px;
          color: #1e40af;
        }
        .nav-link {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
        }
        .nav-link:hover {
          text-decoration: underline;
        }
        .nav-separator {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
