import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddStaff: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "assistant",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 🔴 VALIDATION
  if (!formData.name.trim()) return alert("Name is required");
  if (!formData.username.trim()) return alert("Username is required");
  if (!formData.password.trim()) return alert("Password is required");
  if (!formData.address.trim())  return alert("Address is required");
  if (!formData.phone.trim())  return alert("Phone is required");
  if (!formData.email.trim())  return alert("Email is required");
  // Email validation (if provided)
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return alert("Invalid email format");
  }

  // Phone validation (if provided)
  if (formData.phone && !/^[0-9]{7,15}$/.test(formData.phone)) {
    return alert("Invalid phone number (7-15 digits only)");
  }

  // Password strength
  if (formData.password.length < 6) {
    return alert("Password must be at least 6 characters");
  }

  try {
    setLoading(true);

    await axios.post("http://127.0.0.1:8000/api/staff/", formData);

    alert("Staff Added Successfully!");
    navigate("/admin/staff");
  } catch (error: any) {
    console.log(error.response?.data);
    alert("Failed to add staff!");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{`
        .wrapper { display:flex; }
        .sidebar { width:260px; position:fixed; height:100vh; background:#1e293b; }
        .main { margin-left:260px; width:100%; background:#f5f7fa; min-height:100vh; }

        .card {
          max-width:600px;
          margin:40px auto;
          background:white;
          padding:25px;
          border-radius:10px;
          box-shadow:0 2px 10px rgba(0,0,0,0.1);
        }

        h2 { margin-bottom:15px; }

        .field { margin-bottom:12px; display:flex; flex-direction:column; }

        input, select {
          padding:10px;
          border:1px solid #ccc;
          border-radius:6px;
          outline:none;
        }

        input:focus, select:focus {
          border-color:#16a34a;
        }

        .btn {
          background:#16a34a;
          color:white;
          border:none;
          padding:12px;
          width:100%;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
        }

        .btn:disabled {
          background:#94a3b8;
        }
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
                <input name="name" onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Username</label>
                <input name="username" onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Email</label>
                <input name="email" onChange={handleChange} />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Phone</label>
                <input name="phone" onChange={handleChange} />
              </div>

              <div className="field">
                <label>Address</label>
                <input name="address" onChange={handleChange} />
              </div>

              <div className="field">
                <label>Role</label>
                <select name="role" onChange={handleChange}>
                  <option value="assistant">Assistant</option>
                  <option value="warehousestaff">Warehouse Staff</option>
                </select>
              </div>

              <button className="btn" disabled={loading}>
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
