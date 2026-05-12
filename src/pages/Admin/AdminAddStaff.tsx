import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddStaff: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "Assistant",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let tempErrors: any = {};

    if (!formData.name.trim()) tempErrors.name = "Name is required";

    if (!formData.username.trim())
      tempErrors.username = "Username is required";
    else if (formData.username.length < 3)
      tempErrors.username = "Username must be at least 3 characters";

    if (!formData.email.trim())
      tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Invalid email format";

    if (!formData.phone.trim())
      tempErrors.phone = "Phone is required";
    else if (!/^\d{7,15}$/.test(formData.phone))
      tempErrors.phone = "Phone must be 7-15 digits";

    if (!formData.address.trim())
      tempErrors.address = "Address is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    alert("Staff added successfully!");
    navigate("/admin/staff");
  };

  return (
    <>
      {/* CSS IN SAME FILE */}
      <style>{`
        .wrapper {
          display: flex;
          width: 100%;
        }

        .sidebar {
          width: 260px;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
        }

        .main {
          flex: 1;
          margin-left: 260px;
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
          max-width: 700px;
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .field {
          display: flex;
          flex-direction: column;
        }

        input, select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
        }

        .error {
          color: red;
          font-size: 12px;
          margin-top: 4px;
        }

        .buttonRow {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .backBtn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #e5e7eb;
          font-weight: 600;
          cursor: pointer;
        }

        .addBtn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #16a34a;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="page">
            <div className="card">

              <h2 className="title">Add New Staff</h2>
              <p className="subtitle">
                Fill in the details to create a staff account
              </p>

              <form onSubmit={handleSubmit} className="form">

                <div className="field">
                  <label>Full Name</label>
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
                  <input name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <span className="error">{errors.email}</span>}
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
                    <option value="Assistant">Assistant</option>
                    <option value="Warehouse Staff">Warehouse Staff</option>
                  </select>
                </div>

                <div className="buttonRow">
                  <button type="button" className="backBtn" onClick={() => navigate("/admin/staff")}>
                    Back
                  </button>

                  <button type="submit" className="addBtn">
                    Add Staff
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminAddStaff;