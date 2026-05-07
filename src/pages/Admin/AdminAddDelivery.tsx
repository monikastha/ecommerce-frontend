import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddDelivery: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let temp: any = {};

    if (!formData.name.trim()) temp.name = "Name is required";
    if (!formData.email.trim()) temp.email = "Email is required";
    if (!formData.phone.trim()) temp.phone = "Phone is required";
    if (!formData.address.trim()) temp.address = "Address is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert("Delivery staff added successfully!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    navigate("/admin/delivery");
  };

  return (
    <div className="wrapper">

      <style>{`
        .wrapper {
          display: flex;
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
          background: linear-gradient(135deg,#f5f7fa,#e4ecf5);
          min-height: 100vh;
        }

        .page {
          padding: 30px;
          display: flex;
          justify-content: center;
        }

        .card {
          width: 100%;
          max-width: 600px;
          background: white;
          padding: 30px;
          border-radius: 15px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .btnRow {
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
          cursor: pointer;
          font-weight: 600;
        }

        .addBtn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #16a34a;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }

        .error {
          color: red;
          font-size: 12px;
        }
      `}</style>

      <div className="sidebar">
        <AdminSidebar />
      </div>

      <div className="main">
        <AdminNavbar />

        <div className="page">
          <div className="card">

            <h2>Add Delivery Staff</h2>
            <p>Fill in delivery staff details carefully</p>

            <form onSubmit={handleSubmit} className="form">

              <div className="field">
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error">{errors.name}</span>}
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

              <div className="btnRow">
                <button
                  type="button"
                  className="backBtn"
                  onClick={() => navigate("/admin/delivery")}
                >
                  Back
                </button>

                <button type="submit" className="addBtn">
                  Add Delivery
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAddDelivery;