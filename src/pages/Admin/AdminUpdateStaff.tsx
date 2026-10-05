import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  getStaffDeliveryApiErrorMessage,
  validateStaffDeliveryValues,
  type StaffDeliveryErrors,
} from "../../utils/staffDeliveryValidation";

const AdminUpdateStaff: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<StaffDeliveryErrors>({});

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "assistant",
  });

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/staff/${id}/`);
      setFormData((previous) => ({ ...previous, ...res.data, password: "" }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateStaffDeliveryValues(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    try {
      setLoading(true);

      await axios.put(
        `http://127.0.0.1:8000/api/staff/${id}/`,
        formData
      );

      alert("Staff updated successfully!");
      navigate("/admin/staff");
    } catch (err: any) {
      console.log(err);
      alert(getStaffDeliveryApiErrorMessage(err.response?.data, "Failed to update staff"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .wrapper {
          display: flex;
          background: #f1f5f9;
          min-height: 100vh;
        }
body {
  font-family: "Poppins", sans-serif;
}
        .sidebar {
          width: 260px;
          position: fixed;
          height: 100vh;
          background: #0f172a;
          color: white;
        }

        .main {
          flex: 1;
          width: calc(100% - 260px);
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
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
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
          background: #f8fafc;
          transition: 0.2s;
        }

        input:focus, select:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }

        .btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(37,99,235,0.25);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          background: #e2e8f0;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          color: #334155;
          transition: 0.2s;
        }

        .back:hover {
          background: #cbd5e1;
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
              <h2>Update Staff</h2>

              <form onSubmit={handleUpdate}>
                <div className="field">
                  <label>Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Username</label>
                  <input name="username" value={formData.username} onChange={handleChange} />
                  {errors.username && <span className="error">{errors.username}</span>}
                </div>

                <div className="field">
                  <label>Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="field">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
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
                </div>

                <div className="field">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="assistant">Assistant</option>
                    <option value="warehousestaff">Warehouse Staff</option>
                  </select>
                </div>

                <button className="btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Staff"}
                </button>

                <button
                  type="button"
                  className="back"
                  onClick={() => navigate("/admin/staff")}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUpdateStaff;
