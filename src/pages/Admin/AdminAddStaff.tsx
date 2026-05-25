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

    if (!formData.name.trim()) newErrors.name = "Name is required";

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post(`${apiUrl}/api/staff/`, formData);

      alert("Staff Added Successfully!");
      navigate("/admin/staff");
    } catch (error: any) {
      console.error("Backend Error:", error.response?.data);

      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add staff";

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .wrapper {
    display: flex;
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
  }

  .sidebar {
    width: 260px;
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    background: #1e293b;
    z-index: 100;
  }

  .main {
    margin-left: 260px;
    flex: 1;
    background: #f5f7fa;
    min-height: 100vh;
  }

  .container { 
    padding: 30px; 
  }

        .content {
          padding: 30px;
        }

        .card {
          max-width: 650px;
          margin: 40px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }

        h2 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #0f172a;
        }

        .field {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }

        label {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #334155;
        }

        input, select {
          padding: 11px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: 0.2s;
          background: #f8fafc;
        }

        input:focus, select:focus {
          border-color: #22c55e;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
        }

        .error {
          color: #ef4444;
          font-size: 12px;
          margin-top: 5px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(34,197,94,0.25);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="content">
            <div className="card">
              <h2>Add Staff</h2>

              <form onSubmit={handleSubmit}>
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
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} />
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

                <div className="field">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
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
      </div>
    </>
  );
};

export default AdminAddStaff;