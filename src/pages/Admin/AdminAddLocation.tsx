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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.locationName || !form.province || !form.city) {
      alert("Please fill all required fields");
      return;
    }

    alert("Location added successfully");
    navigate("/admin/location");
  };

  return (
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
                onChange={handleChange}
              />

              <input
                name="province"
                placeholder="Province"
                onChange={handleChange}
              />

              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
              />

              <select name="status" onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="btnRow">
                <button type="button" onClick={() => navigate("/admin/location")}>
                  Back
                </button>

                <button type="submit">
                  Save
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>

      <style>{`
        .wrapper{
          display:flex;
        }

        .main{
          flex:1;
          margin-left:0px;
          background:#f4f6f8;
          min-height:100vh;
        }

        .container{
          padding:20px;
          display:flex;
          justify-content:center;
        }

        .card{
          width:400px;
          background:#fff;
          padding:20px;
          border-radius:10px;
        }

        input, select{
          width:100%;
          margin-top:10px;
          padding:10px;
          border:1px solid #ddd;
          border-radius:8px;
        }

        .btnRow{
          display:flex;
          gap:10px;
          margin-top:15px;
        }

        button{
          flex:1;
          padding:10px;
          border:none;
          border-radius:8px;
          cursor:pointer;
        }

        button[type="submit"]{
          background:#2563eb;
          color:white;
        }
      `}</style>
    </div>
  );
};

export default AdminAddLocation;