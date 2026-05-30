import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";

const AssistantUpdateWarehouseStaff: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "warehousestaff",
  });

  // FETCH SINGLE STAFF
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/staff/${id}/`);
      setFormData({
        name: res.data.name || "",
        username: res.data.username || "",
        email: res.data.email || "",
        password: "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        role: "warehousestaff",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load staff data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [id]);

  // HANDLE CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const payload: Partial<typeof formData> = { ...formData, role: "warehousestaff" };
      if (!payload.password) delete payload.password;

      await axios.put(`http://127.0.0.1:8000/api/staff/${id}/`, payload);

      alert("Warehouse Staff updated successfully!");
      navigate("/assistant/warehouse/staff");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update warehouse staff");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .dashboard-container {
          background: #f4f6f8;
          min-height: 100vh;
        }

        .main-content {
          margin-left: 250px;
          width: calc(100% - 250px);
          min-height: 100vh;
        }

        .container {
          padding: 40px;
          display: flex;
          justify-content: center;
        }

        .card {
          width: 100%;
          max-width: 620px;
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #1f2937;
          font-size: 26px;
          font-weight: 700;
        }

        .subtitle {
          text-align: center;
          color: #64748b;
          margin-bottom: 30px;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #334155;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 13px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s;
        }

        input:focus {
          border-color: #5BBF9A;
          box-shadow: 0 0 0 3px rgba(91, 191, 154, 0.15);
          outline: none;
        }

        .btnRow {
          display: flex;
          gap: 15px;
          margin-top: 35px;
        }

        button {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
        }

        .submitBtn {
          background: #5BBF9A;
          color: white;
        }

        .submitBtn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .cancelBtn {
          background: #e5e7eb;
          color: #334155;
        }

        .note {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="card">
              <h2>Update Warehouse Staff</h2>
              <p className="subtitle">Edit staff information</p>

              {loading ? (
                <p style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                  Loading staff data...
                </p>
              ) : (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Username</label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password <span className="note">(Leave blank to keep current)</span></label>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password if changing"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      value="Warehouse Staff"
                      disabled
                      style={{ background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="btnRow">
                    <button
                      type="button"
                      className="cancelBtn"
                      onClick={() => navigate("/assistant/warehouse/staff")}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submitBtn" disabled={submitting}>
                      {submitting ? "Updating..." : "Update Staff"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantUpdateWarehouseStaff;
