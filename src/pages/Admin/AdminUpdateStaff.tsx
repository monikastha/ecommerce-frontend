import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminUpdateStaff: React.FC = () => {
  const { id } = useParams();
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

  // FETCH SINGLE STAFF
  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/staff/${id}/`
      );
      setFormData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [id]);

  // HANDLE CHANGE
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT UPDATE
  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        `http://127.0.0.1:8000/api/staff/${id}/`,
        formData
      );

      alert("Staff updated successfully!");
      navigate("/admin/staff");
    } catch (err) {
      console.log(err);
      alert("Failed to update staff");
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
          border-radius:12px;
          box-shadow:0 3px 10px rgba(0,0,0,0.1);
        }

        h2 {
          margin-bottom:20px;
          color:#0f172a;
        }

        .field {
          display:flex;
          flex-direction:column;
          margin-bottom:12px;
        }

        label {
          font-size:13px;
          margin-bottom:5px;
          color:#475569;
        }

        input, select {
          padding:10px;
          border:1px solid #cbd5e1;
          border-radius:8px;
          outline:none;
        }

        input:focus, select:focus {
          border-color:#2563eb;
        }

        .btn {
          width:100%;
          padding:12px;
          background:#2563eb;
          color:white;
          border:none;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        }

        .btn:disabled {
          background:#94a3b8;
          cursor:not-allowed;
        }

        .back {
          margin-top:10px;
          width:100%;
          padding:10px;
          background:#e2e8f0;
          border:none;
          border-radius:8px;
          cursor:pointer;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="card">
            <h2>Update Staff</h2>

            <form onSubmit={handleUpdate}>

              <div className="field">
                <label>Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  name="password"
                  type="text"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="assistant">Assistant</option>
                  {/* <option value="staff">Staff</option> */}
                  <option value="warehouse_staff">Warehouse Staff</option>
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
    </>
  );
};

export default AdminUpdateStaff;