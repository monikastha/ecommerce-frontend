import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddLocation: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    locationName: "",
    province: "",
    city: "",
    status: "Active",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors: any = {};

    if (!form.locationName.trim()) newErrors.locationName = "Required";
    if (!form.province.trim()) newErrors.province = "Required";
    if (!form.city.trim()) newErrors.city = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert("Location added successfully");
    navigate("/admin/location");
  };

  return (
    <>
      <div className="wrapper">

        <AdminSidebar />

        <div className="main">

          <AdminNavbar />

          <div className="container">

            <div className="card">

              <h2>Add Location</h2>

              <form onSubmit={handleSubmit}>

                <input
                  name="locationName"
                  placeholder="Location Name"
                  value={form.locationName}
                  onChange={handleChange}
                />
                {errors.locationName && (
                  <p className="error">{errors.locationName}</p>
                )}

                <input
                  name="province"
                  placeholder="Province"
                  value={form.province}
                  onChange={handleChange}
                />
                {errors.province && (
                  <p className="error">{errors.province}</p>
                )}

                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && (
                  <p className="error">{errors.city}</p>
                )}

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div className="btnRow">
                  <button type="button" onClick={() => navigate("/admin/location")}>
                    Back
                  </button>

                  <button type="submit">Save</button>
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
          background:#f1f5f9;
        }

        .wrapper{
          display:flex;
          min-height:100vh;
        }

        .main{
          flex:1;
          display:flex;
          flex-direction:column;
          background:#f1f5f9;
        }

        .container{
          padding:30px;
          display:flex;
          justify-content:center;
          align-items:center;
          min-height:80vh;
        }

        .card{
          width:420px;
          background:#fff;
          padding:25px;
          border-radius:14px;
          box-shadow:0 10px 25px rgba(0,0,0,0.08);
        }

        h2{
          margin-bottom:15px;
          color:#0f172a;
        }

        input, select{
          width:100%;
          margin-top:12px;
          padding:11px;
          border:1px solid #e2e8f0;
          border-radius:10px;
          outline:none;
        }

        input:focus, select:focus{
          border-color:#2563eb;
          box-shadow:0 0 0 3px rgba(37,99,235,0.15);
        }

        .error{
          color:#dc2626;
          font-size:12px;
          margin-top:4px;
        }

        .btnRow{
          display:flex;
          gap:10px;
          margin-top:18px;
        }

        button{
          flex:1;
          padding:11px;
          border:none;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
        }

        button[type="submit"]{
          background:#2563eb;
          color:white;
        }

        button[type="button"]{
          background:#e5e7eb;
        }
      `}</style>
    </>
  );
};

export default AdminAddLocation;