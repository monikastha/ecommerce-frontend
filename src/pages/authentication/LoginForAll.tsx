import { useState } from "react";

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
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const selectedRoleObj = ROLES.find((r) => r.value === selectedRole);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
      } else {
        // Store token and redirect based on role
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("role", data.role);
        // Redirect to role-specific dashboard
        window.location.href = `/${data.role}/dashboard`;
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Top nav bar */}
      <div style={styles.navbar}>
        <div style={styles.navLogoArea}>
          {/* LOGO PLACEHOLDER — Replace the <div> below with your <img> tag */}
          <div style={styles.logoPlaceholder}>
            <span style={styles.logoPlaceholderText}>YOUR LOGO</span>
          </div>
        </div>
      </div>

      {/* Main body */}
      <div style={styles.body}>
        {/* Left branding panel */}
        <div style={styles.leftPanel}>
          <div style={styles.brandLogoWrapper}>
            {/* BRAND LOGO PLACEHOLDER — Replace with your brand image */}
            <div style={styles.brandCircle}>
              <span style={styles.brandCircleText}>🛒</span>
            </div>
          </div>
          <h1 style={styles.brandName}>SAJILO MART</h1>
          <p style={styles.brandTagline}>SHOP ANYTIME ANYWHERE</p>
        </div>

        {/* Right login card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Login to your account</h2>

          {/* Role selector */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Select Role</label>
            <div style={styles.dropdownWrapper}>
              <button
                type="button"
                style={styles.dropdownButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span style={styles.dropdownValue}>
                  {selectedRoleObj
                    ? `${selectedRoleObj.icon}  ${selectedRoleObj.label}`
                    : "Select your role"}
                </span>
                <span
                  style={{
                    ...styles.dropdownChevron,
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </button>

              {dropdownOpen && (
                <ul style={styles.dropdownMenu}>
                  {ROLES.map((role) => (
                    <li
                      key={role.value}
                      style={{
                        ...styles.dropdownItem,
                        backgroundColor:
                          selectedRole === role.value ? "#e8f0fe" : "white",
                      }}
                      onClick={() => {
                        setSelectedRole(role.value);
                        setDropdownOpen(false);
                      }}
                    >
                      <span style={styles.roleIcon}>{role.icon}</span>
                      {role.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Username */}
          <div style={styles.fieldGroup}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && <p style={styles.errorText}>{error}</p>}

          {/* Login button */}
          <button
            type="button"
            style={{
              ...styles.loginButton,
              opacity: loading ? 0.75 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login now"}
          </button>

          {/* Sign up link */}
          <p style={styles.signupText}>
            Don't Have An Account?{" "}
            <a href="/register" style={styles.signupLink}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#1a1a2e",
  },

  /* Navbar */
  navbar: {
    backgroundColor: "#f0f4ff",
    padding: "10px 24px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  },
  navLogoArea: {
    display: "flex",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 60,
    height: 40,
    backgroundColor: "#dce8ff",
    border: "2px dashed #4a80f0",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholderText: {
    fontSize: 9,
    color: "#4a80f0",
    fontWeight: 700,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  /* Body */
  body: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6b9fe8",
    gap: 60,
    padding: "40px 24px",
  },

  /* Left panel */
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  brandLogoWrapper: {
    marginBottom: 8,
  },
  brandCircle: {
    width: 160,
    height: 160,
    borderRadius: "50%",
    backgroundColor: "#c8e6b0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    border: "4px solid #2d6a1e",
  },
  brandCircleText: {
    fontSize: 72,
  },
  brandName: {
    fontSize: 36,
    fontWeight: 900,
    color: "#1a3a6b",
    letterSpacing: 3,
    margin: 0,
    textShadow: "1px 1px 0 #fff",
  },
  brandTagline: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a3a6b",
    letterSpacing: 4,
    margin: 0,
  },

  /* Card */
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: "36px 40px",
    width: 360,
    boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1a1a2e",
    textAlign: "center",
    margin: 0,
  },

  /* Fields */
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#333",
    marginBottom: 6,
    display: "block",
    textAlign: "center",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },

  /* Dropdown */
  dropdownWrapper: {
    position: "relative",
  },
  dropdownButton: {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "#f5f7ff",
    border: "1.5px solid #d0d8f0",
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 14,
    color: "#333",
    outline: "none",
  },
  dropdownValue: {
    color: "#444",
  },
  dropdownChevron: {
    fontSize: 18,
    color: "#666",
    transition: "transform 0.2s ease",
    display: "inline-block",
  },
  dropdownMenu: {
    position: "absolute",
    top: "110%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    border: "1.5px solid #d0d8f0",
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    listStyle: "none",
    margin: 0,
    padding: "4px 0",
    zIndex: 999,
    maxHeight: 260,
    overflowY: "auto",
  },
  dropdownItem: {
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: 14,
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "background 0.15s",
  },
  roleIcon: {
    fontSize: 18,
  },

  /* Input */
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid #d0d8f0",
    borderRadius: 8,
    padding: "0 12px",
    backgroundColor: "#f5f7ff",
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    border: "none",
    backgroundColor: "transparent",
    padding: "10px 0",
    fontSize: 14,
    color: "#333",
    outline: "none",
  },
  eyeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: 0,
    opacity: 0.7,
  },

  /* Error */
  errorText: {
    color: "#e53935",
    fontSize: 13,
    margin: 0,
    textAlign: "center",
  },

  /* Login button */
  loginButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2962ff",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.2s ease",
    letterSpacing: 0.5,
    marginTop: 4,
  },

  /* Sign up */
  signupText: {
    textAlign: "center",
    fontSize: 13,
    color: "#888",
    margin: 0,
  },
  signupLink: {
    color: "#2962ff",
    fontWeight: 700,
    textDecoration: "none",
  },
};