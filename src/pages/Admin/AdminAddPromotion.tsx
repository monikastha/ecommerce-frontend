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

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let err: any = {};

    if (!formData.name.trim()) err.name = "Required";
    if (!formData.discount.trim()) err.discount = "Required";
    if (!formData.appliesTo.trim()) err.appliesTo = "Required";
    if (!formData.startDate) err.startDate = "Required";
    if (!formData.endDate) err.endDate = "Required";

    if (formData.startDate && formData.endDate) {
      if (formData.endDate < formData.startDate) {
        err.endDate = "End date must be after start date";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert("Promotion added successfully");
    navigate("/admin/promotion");
  };

  return (
    <>
      <div className="layout">

        <AdminSidebar />

        <div className="main">

          <AdminNavbar />

          <div className="page">

            <div className="card">

              <h2>Add Promotion</h2>

              <form onSubmit={handleSubmit}>

                <div className="field">
                  <label>Promotion Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter promotion name"
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </div>

                <div className="field">
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Discount">Discount</option>
                    <option value="Coupon">Coupon</option>
                  </select>
                </div>

                <div className="field">
                  <label>Discount</label>
                  <input
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="%"
                  />
                  {errors.discount && (
                    <p className="error">{errors.discount}</p>
                  )}
                </div>

                <div className="field">
                  <label>Applies To</label>
                  <input
                    name="appliesTo"
                    value={formData.appliesTo}
                    onChange={handleChange}
                  />
                  {errors.appliesTo && (
                    <p className="error">{errors.appliesTo}</p>
                  )}
                </div>

                <div className="field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                  {errors.startDate && (
                    <p className="error">{errors.startDate}</p>
                  )}
                </div>

                <div className="field">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                  {errors.endDate && (
                    <p className="error">{errors.endDate}</p>
                  )}
                </div>

                <div className="btnRow">

                  <button
                    type="button"
                    onClick={() => navigate("/admin/promotion")}
                    className="backBtn"
                  >
                    Back
                  </button>

                  <button type="submit" className="addBtn">
                    Save
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

      {/* FIXED STYLES */}
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Poppins',sans-serif;
        }

        body{
          background:#f4f6f8;
        }

        .layout{
          display:flex;
          min-height:100vh;
        }

        .main{
          flex:1;
          display:flex;
          flex-direction:column;
          background:#f4f6f8;
        }

        .page{
          padding:30px;
          display:flex;
          justify-content:center;
          align-items:center;
          min-height:80vh;
        }

        .card{
          width:100%;
          max-width:600px;
          background:white;
          padding:25px;
          border-radius:12px;
          box-shadow:0 10px 25px rgba(0,0,0,0.08);
        }

        h2{
          margin-bottom:15px;
          color:#0f172a;
        }

        .field{
          margin-bottom:12px;
        }

        label{
          font-size:13px;
          font-weight:600;
          color:#334155;
          display:block;
          margin-bottom:6px;
        }

        input, select{
          width:100%;
          padding:10px;
          border:1px solid #ddd;
          border-radius:8px;
          outline:none;
        }

        .error{
          color:red;
          font-size:12px;
          margin-top:4px;
        }

        .btnRow{
          display:flex;
          gap:10px;
          margin-top:10px;
        }

        .backBtn{
          flex:1;
          padding:10px;
          background:#e5e7eb;
          border:none;
          border-radius:8px;
        }

        .addBtn{
          flex:1;
          padding:10px;
          background:#4f46e5;
          color:white;
          border:none;
          border-radius:8px;
        }
      `}</style>
    </>
  );
};

export default AdminAddPromotion;