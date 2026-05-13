import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function LoginPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedRoleObj = ROLES.find(
    (r) => r.value === selectedRole
  );

  const handleLogin = async (e: any) => {
    e.preventDefault();

    setError("");

    if (!selectedRole) {
      setError("Select role");
      return;
    }

    if (!username) {
      setError("Enter username");
      return;
    }

    if (!password) {
      setError("Enter password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/users/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            role: selectedRole,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // STORE USER DATA
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      // ROLE BASED REDIRECT
      switch (data.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "assistant":
          navigate("/assistant/dashboard");
          break;

        case "buyer":
          navigate("/buyer/dashboard");
          break;

        case "seller":
          navigate("/seller/dashboard");
          break;

        case "delivery":
          navigate("/delivery/dashboard");
          break;

        case "warehousestaff":
          navigate("/warehouse/dashboard");
          break;

        default:
          setError("Invalid role");
      }

    } catch (err) {
      setError("Network Error");
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper">

      {/* LEFT */}
      <div className="login-left">
        <img src={logoImg} alt="logo" />
      </div>

      {/* RIGHT */}
      <form className="login-card" onSubmit={handleLogin}>

        <h2>
          <b>Sajilo</b>Mart
        </h2>

        <p className="subtitle">
          Login to your account
        </p>

        {/* ROLE */}
        <div className="field">
          <label>Role</label>

          <div className="dropdown">

            <div
              className="dropdown-btn"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
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

        {/* USERNAME */}
        <div className="field">
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />
        </div>

        {/* PASSWORD */}
        <div className="field">

          <label>Password</label>

          <div className="password">

            <input
              type={
                showPassword ? "text" : "password"
              }
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {/* LOGIN BUTTON */}
        <button
          className="login-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="signup">
          Don’t have an account?
          <a href="/signupway"> Sign up</a>
        </p>

      </form>

      <style>{`
        *{
          box-sizing:border-box;
        }

        .login-wrapper{
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:60px;
          background:linear-gradient(135deg,#dbeafe,#93c5fd);
          padding:40px;
        }

        .login-left img{
          width:750px;
          max-width:100%;
        }

        .login-card{
          width:380px;
          background:white;
          padding:35px;
          border-radius:18px;
          box-shadow:0 10px 30px rgba(0,0,0,0.15);
        }

        h2{
          text-align:center;
          margin-bottom:5px;
          color:blue;
          font-size:20px;
        }

        .subtitle{
          text-align:center;
          font-size:13px;
          color:#666;
          margin-bottom:20px;
        }

        .field{
          margin-bottom:15px;
          position:relative;
        }

        label{
          font-size:13px;
          font-weight:600;
        }

        input{
          width:100%;
          padding:10px;
          border:1px solid #ccc;
          border-radius:8px;
          margin-top:5px;
          outline:none;
        }

        .dropdown-btn{
          width:100%;
          padding:10px;
          border:1px solid #ccc;
          border-radius:8px;
          margin-top:5px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          cursor:pointer;
          background:white;
        }

        .dropdown-menu{
          position:absolute;
          width:100%;
          background:white;
          border:1px solid #ddd;
          border-radius:8px;
          margin-top:5px;
          z-index:100;
          overflow:hidden;
        }

        .dropdown-item{
          padding:10px;
          cursor:pointer;
        }

        .dropdown-item:hover{
          background:#f3f4f6;
        }

        .password{
          display:flex;
          gap:5px;
        }

        .password button{
          border:none;
          background:#eee;
          padding:0 12px;
          border-radius:8px;
          cursor:pointer;
        }

        .login-btn{
          width:100%;
          padding:11px;
          border:none;
          border-radius:8px;
          background:#2563eb;
          color:white;
          font-weight:600;
          cursor:pointer;
          margin-top:10px;
        }

        .login-btn:disabled{
          background:#93c5fd;
        }

        .error{
          color:red;
          text-align:center;
          font-size:13px;
        }

        .signup{
          text-align:center;
          margin-top:12px;
          font-size:13px;
        }

        .signup a{
          color:#2563eb;
          font-weight:bold;
          text-decoration:none;
        }
      `}</style>

    </div>
  );
} 