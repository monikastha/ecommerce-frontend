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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    <>
      <div className="wrapper">

        {/* SIDEBAR */}
        <AdminSidebar />

        {/* MAIN */}
        <div className="main">

          {/* NAVBAR (NOW PROPERLY PLACED) */}
          <div className="navbar-wrapper">
            <AdminNavbar />
          </div>

          {/* CONTENT */}
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
                  <button
                    type="button"
                    onClick={() => navigate("/admin/location")}
                  >
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
      </div>

      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Poppins',sans-serif;
        }

        .wrapper{
          display:flex;
          min-height:100vh;
          background:#f1f5f9;
        }

        /* IMPORTANT FIX */
        .main{
          flex:1;
          margin-left:260px;
          display:flex;
          flex-direction:column;
        }

        /* NAVBAR FIX */
        .navbar-wrapper{
          width:100%;
        }

        .container{
          padding:30px;
          display:flex;
          justify-content:center;
          align-items:flex-start;
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