import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/locations/`;

const AdminAddLocation: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    province: "",
    city: "",
    status: "Active",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors: any = {};
    if (!form.name.trim()) newErrors.name = "Location name is required";
    if (!form.province) newErrors.province = "Please select a province";
    if (!form.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post(API_BASE, form);
      alert("Location added successfully!");
      navigate("/admin/location");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to add location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:#f1f5f9; }
        .wrapper { display:flex; min-height:100vh; }
        .main { flex:1; display:flex; flex-direction:column; background:#f1f5f9; }
        .container { padding:30px; display:flex; justify-content:center; align-items:center; min-height:80vh; }
        .card {
          width:460px; background:#fff; padding:30px; border-radius:16px;
          box-shadow:0 10px 30px rgba(0,0,0,0.08);
        }
        h2 { margin-bottom:20px; color:#0f172a; text-align:center; }
        input, select {
          width:100%; margin:8px 0 4px 0; padding:12px; border:1px solid #e2e8f0;
          border-radius:10px; outline:none; font-size:14px;
        }
        input:focus, select:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.15); }
        .error { color:#dc2626; font-size:12.5px; margin-bottom:8px; }
        .btnRow { display:flex; gap:12px; margin-top:25px; }
        button {
          flex:1; padding:12px; border:none; border-radius:10px;
          cursor:pointer; font-weight:600; font-size:14px;
        }
        button[type="submit"] { background:#2563eb; color:white; }
        button[type="button"] { background:#e5e7eb; color:#334155; }
      `}</style>

      <div className="wrapper">
        <AdminSidebar />
        <div className="main">
          <AdminNavbar />
          <div className="container">
            <div className="card">
              <h2>Add New Location</h2>
              <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Location Name" value={form.name} onChange={handleChange} />
                {errors.name && <p className="error">{errors.name}</p>}

                <select name="province" value={form.province} onChange={handleChange}>
                  <option value="">Select Province</option>
                  <option value="Koshi">Koshi Province</option>
                  <option value="Madhesh">Madhesh Province</option>
                  <option value="Bagmati">Bagmati Province</option>
                  <option value="Gandaki">Gandaki Province</option>
                  <option value="Lumbini">Lumbini Province</option>
                  <option value="Karnali">Karnali Province</option>
                  <option value="Sudurpashchim">Sudurpashchim Province</option>
                </select>
                {errors.province && <p className="error">{errors.province}</p>}

                <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
                {errors.city && <p className="error">{errors.city}</p>}

                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div className="btnRow">
                  <button type="button" onClick={() => navigate("/admin/location")}>Cancel</button>
                  <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Location"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAddLocation;
