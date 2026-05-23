import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/deliveryman/delivery`;

const AdminUpdateDelivery: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "", // Optional for update
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch existing deliveryman data
  useEffect(() => {
    const fetchDeliveryman = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${id}/`);
        const data = res.data;

        setFormData({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          password: "", // Leave blank for security
        });
      } catch (error) {
        setServerError("Failed to load delivery staff data");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchDeliveryman();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    let temp: any = {};

    if (!formData.name.trim()) temp.name = "Name is required";
    if (!formData.username.trim()) temp.username = "Username is required";
    if (!formData.email.trim()) temp.email = "Email is required";
    if (!formData.phone.trim()) temp.phone = "Phone is required";
    if (!formData.address.trim()) temp.address = "Address is required";

    // Password is optional on update, but if entered must be strong
    if (formData.password && formData.password.length < 6) {
      temp.password = "Password must be at least 6 characters";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = { ...formData };
      // Remove password if empty (don't update it)
      if (!payload.password) delete payload.password;

      await axios.put(`${API_BASE}/${id}/`, payload);

      alert("Delivery staff updated successfully!");
      navigate("/admin/delivery");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      "Failed to update delivery staff.";
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="wrapper"><div className="main"><AdminNavbar />Loading...</div></div>;
  }

  return (
    <div className="wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body{
        font-family: 'Poppins', sans-serif;
        }
        .wrapper { 
          display: flex; 
          font-family: 'Poppins', sans-serif;
        }

        .sidebar {
          width: 260px;
          position: fixed;
          top: 0; 
          left: 0;
          height: 100vh;
        }

        .main {
          margin-left: 260px;
          width: calc(100% - 260px);
          background: linear-gradient(135deg, #f5f7fa, #e4ecf5);
          min-height: 100vh;
        }

        .page {
          padding: 30px;
          display: flex;
          justify-content: center;
        }

        .card {
          width: 100%;
          max-width: 620px;
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        h2 {
          font-weight: 700;
          font-size: 24px;
          color: #1e2937;
          margin-bottom: 8px;
        }

        p {
          color: #64748b;
          font-size: 14.5px;
          margin-bottom: 25px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-weight: 600;
          font-size: 13.8px;
          color: #374151;
        }

        input {
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-size: 14.5px;
          font-family: 'Poppins', sans-serif;
          transition: all 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .btnRow {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }

        .backBtn {
          flex: 1;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: #e5e7eb;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }

        .updateBtn {
          flex: 1;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }

        .updateBtn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .error {
          color: #ef4444;
          font-size: 12.5px;
        }

        .server-error {
          color: #dc2626;
          background: #fee2e2;
          padding: 14px;
          border-radius: 10px;
          text-align: center;
          font-size: 14px;
        }
      `}</style>

      <div className="sidebar">
        <AdminSidebar />
      </div>

      <div className="main">
        <AdminNavbar />

        <div className="page">
          <div className="card">
            <h2>Update Delivery Staff</h2>
            <p>Edit delivery staff information</p>

            {serverError && <p className="server-error">{serverError}</p>}

            <form onSubmit={handleSubmit} className="form">
              <div className="field">
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="field">
                <label>Username</label>
                <input name="username" value={formData.username} onChange={handleChange} />
                {errors.username && <span className="error">{errors.username}</span>}
              </div>

              <div className="field">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="field">
                <label>New Password (optional)</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Leave blank to keep current password"
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="field">
                <label>Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              <div className="field">
                <label>Address</label>
                <input name="address" value={formData.address} onChange={handleChange} />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>

              <div className="btnRow">
                <button
                  type="button"
                  className="backBtn"
                  onClick={() => navigate("/admin/delivery")}
                >
                  Cancel
                </button>

                <button type="submit" className="updateBtn" disabled={loading}>
                  {loading ? "Updating..." : "Update Delivery Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateDelivery;