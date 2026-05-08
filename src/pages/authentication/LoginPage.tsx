import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefaul
    const res = await API.post("login/", {
      username,
      password,
    });

    if (res.data.status === "success") {
      localStorage.setItem("admin", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="p-6 shadow rounded w-80">
        <input
          className="border w-full p-2 mb-3"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="border w-full p-2 mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white w-full p-2">
          Login
        </button>
      </form>
    </div>
  );
}