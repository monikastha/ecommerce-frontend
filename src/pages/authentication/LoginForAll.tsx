import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

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

const LoginForAll: React.FC = () => {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [selectedRole, setSelectedRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const selectedRoleObj = ROLES.find((r) => r.value === selectedRole);

  const handleSendOtp = async () => {
    if (!selectedRole || !email) {
      setError("Please select role and enter email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Replace with your actual API
      const res = await fetch("http://127.0.0.1:8000/api/users/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: selectedRole }),
      });

      if (res.ok) {
        setResendTimer(60);
        // Start countdown
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError("Failed to send OTP");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setError("");
    if (!selectedRole) return setError("Please select a role");

    setLoading(true);

    try {
      const endpoint = loginMethod === "password" 
        ? "/api/users/login/" 
        : "/api/users/verify-otp/";

      const body = loginMethod === "password" 
        ? { username, password, role: selectedRole }
        : { email, otp, role: selectedRole };

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token || data.access);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username || username || email);

        const routes: any = {
          admin: "/admin/dashboard",
          buyer: "/buyer/dashboard",
          seller: "/seller/dashboard",
          delivery: "/delivery/dashboard",
          warehousestaff: "/warehouse/dashboard",
          assistant: "/assistant/dashboard",
        };

        navigate(routes[data.role] || "/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl w-full">
        {/* Left Side - Logo */}
        <div className="hidden lg:block flex-1 text-center">
          <img src={logo} alt="Sajilo Mart" className="w-[480px] mx-auto drop-shadow-2xl" />
          <p className="mt-6 text-blue-700 font-semibold">Welcome Back to Sajilo Mart</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-[420px]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Login to continue</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Select Role</label>
            <div className="relative">
              <div
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl cursor-pointer flex justify-between items-center"
                onClick={() => {/* toggle dropdown logic */}}
              >
                {selectedRoleObj ? (
                  <span>{selectedRoleObj.icon} {selectedRoleObj.label}</span>
                ) : (
                  <span className="text-gray-500">Choose your role</span>
                )}
                <span>▼</span>
              </div>
              {/* Dropdown menu can be added here */}
            </div>
          </div>

          {/* Login Method Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setLoginMethod("password")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                loginMethod === "password" 
                  ? "bg-white shadow text-blue-600" 
                  : "text-gray-600"
              }`}
            >
              Password Login
            </button>
            <button
              onClick={() => setLoginMethod("otp")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                loginMethod === "otp" 
                  ? "bg-white shadow text-blue-600" 
                  : "text-gray-600"
              }`}
            >
              OTP Login
            </button>
          </div>

          {loginMethod === "password" ? (
            <>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">USERNAME</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-sm"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">ENTER OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                    placeholder="123456"
                  />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          <button
            onClick={loginMethod === "password" ? handleLogin : handleSendOtp}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-2xl mt-6 transition-all"
          >
            {loading 
              ? "Processing..." 
              : loginMethod === "password" 
                ? "Login" 
                : "Send OTP"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/seller-register")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForAll;