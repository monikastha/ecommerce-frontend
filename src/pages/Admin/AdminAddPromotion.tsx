import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddPromotion: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "Discount",
    discount: "",
    appliesTo: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="wrapper">
      <style>{`
        .wrapper { display: flex; }

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
          background: #f4f6f8;
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
          padding: 25px;
          border-radius: 12px;
        }

        input, select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          width: 100%;
        }

        .field {
          margin-bottom: 12px;
        }

        .btnRow {
          display: flex;
          gap: 10px;
        }

        .backBtn {
          flex: 1;
          padding: 10px;
          background: #eee;
          border: none;
          border-radius: 8px;
        }

        .addBtn {
          flex: 1;
          padding: 10px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
        }

        .error {
          color: red;
          font-size: 13px;
        }
      `}</style>

      <div className="sidebar">
        <AdminSidebar />
      </div>

      <div className="main">
        <AdminNavbar />

        <div className="page">
          <div className="card">

            <h2>Add Promotion</h2>

            <div className="field">
              <input name="name" placeholder="Name" onChange={handleChange} />
            </div>

            <div className="field">
              <select name="type" onChange={handleChange}>
                <option>Discount</option>
                <option>Coupon</option>
              </select>
            </div>

            <div className="field">
              <input name="discount" placeholder="Discount" onChange={handleChange} />
            </div>

            <div className="field">
              <input name="appliesTo" placeholder="Applies To" onChange={handleChange} />
            </div>

            <div className="field">
              <input type="date" name="startDate" onChange={handleChange} />
            </div>

            <div className="field">
              <input type="date" name="endDate" onChange={handleChange} />
            </div>

            <div className="btnRow">
              <button className="backBtn" onClick={() => navigate("/admin/promotion")}>
                Back
              </button>

              <button className="addBtn">
                Add
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAddPromotion;