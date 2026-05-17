import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const apiUrl = import.meta.env.VITE_API_URL;

interface FormState {
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "assistant" | "warehousestaff";
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const AdminAddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "assistant",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Fixed: Ensure phone is not empty AND fits the regex format
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 7–15 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      // Ensure the endpoint matches your backend routing configuration
      await axios.post(`${apiUrl}/api/staff/`, formData);
      alert("Staff Added Successfully!");
      navigate("/admin/staff");
    } catch (error: any) {
      console.error("Backend Error Response:", error.response?.data);
      
      // Better error message tracking
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      alert(serverMessage || "Failed to add staff! Check your server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .wrapper { display: flex; }
        .sidebar { width: 260px; position: fixed; height: 100vh; background: #1e293b; }
        .main { margin-left: 260px; width: 100%; background: #f5f7fa; min-height: 100vh; }
        .card { max-width: 600px; margin: 40px auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { margin-bottom: 15px; }
        .field { margin-bottom: 12px; display: flex; flex-direction: column; }
        label { font-weight: 500; margin-bottom: 6px; font-size: 14px; color: #334155; }
        input, select { padding: 10px; border: 1px solid #ccc; border-radius: 6px; outline: none; font-size: 14px; }
        input:focus, select:focus { border-color: #16a34a; }
        .error { color: #dc2626; font-size: 12px; margin-top: 4px; }
        .btn { background: #16a34a; color: white; border: none; padding: 12px; width: 100%; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px; transition: background 0.2s; }
        .btn:hover:not(:disabled) { background: #15803d; }
        .btn:disabled { background: #94a3b8; cursor: not-allowed; }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="card">
            <h2>Add Staff</h2>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Full Name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="field">
                <label>Username</label>
                <input 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  placeholder="username123"
                />
                {errors.username && <span className="error">{errors.username}</span>}
              </div>

              <div className="field">
                <label>Email (Optional)</label>
                <input 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="example@domain.com"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="field">
                <label>Phone</label>
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="98XXXXXXXX"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              <div className="field">
                <label>Address</label>
                <input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Kathmandu, Nepal"
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>

              <div className="field">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="assistant">Assistant</option>
                  <option value="warehousestaff">Warehouse Staff</option>
                </select>
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Adding..." : "Add Staff"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAddStaff;