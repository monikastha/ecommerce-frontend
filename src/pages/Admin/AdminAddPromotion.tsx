import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddPromotion: React.FC = () => {

  const navigate = useNavigate();
const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin/promotions`;
  const [formData, setFormData] = useState({
    name: "",
    d_type: "percentage",
    d_value: "",
    applies_to: "all",
    start_date: "",
    end_date: "",
    status: "active",   // ✅ ADDED
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  

  useEffect(() => {
    fetch(`${API_BASE}`)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const validate = () => {
    let err: any = {};

    if (!formData.name) err.name = "Name required";
    if (!formData.d_value) err.d_value = "Discount required";
    if (!formData.start_date) err.start_date = "Start date required";
    if (!formData.end_date) err.end_date = "End date required";

    if (
      formData.applies_to === "category" &&
      selectedCategories.length === 0
    ) {
      err.categories = "Select at least one category";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const payload = {
      ...formData,
      d_value: formData.d_value ? parseFloat(formData.d_value) : null,
      categories:
        formData.applies_to === "category"
          ? selectedCategories
          : []
    };

    try {
      const res = await fetch(
        `${API_BASE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Promotion created");
        navigate("/admin/promotion");
      } else {
        alert(JSON.stringify(data));
      }

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
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

                {/* NAME */}
                <div className="field">
                  <label>Name</label>
                  <input name="name" onChange={handleChange} />
                  {errors.name && <p className="error">{errors.name}</p>}
                </div>

                {/* TYPE */}
                <div className="field">
                  <label>Discount Type</label>
                  <select name="d_type" onChange={handleChange}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                {/* VALUE */}
                <div className="field">
                  <label>Discount Value</label>
                  <input name="d_value" onChange={handleChange} />
                  {errors.d_value && <p className="error">{errors.d_value}</p>}
                </div>

                {/* APPLIES */}
                <div className="field">
                  <label>Applies To</label>
                  <select name="applies_to" onChange={handleChange}>
                    <option value="all">All Products</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                {/* CATEGORY */}
                {formData.applies_to === "category" && (
                  <div className="field">
                    <label>Categories</label>

                    {categories.map(cat => (
                      <label key={cat.id} className="checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                        />
                        {cat.name}
                      </label>
                    ))}

                    {errors.categories && (
                      <p className="error">{errors.categories}</p>
                    )}
                  </div>
                )}

                {/* START DATE */}
                <div className="field">
                  <label>Start Date</label>
                  <input type="datetime-local" name="start_date" onChange={handleChange} />
                  {errors.start_date && <p className="error">{errors.start_date}</p>}
                </div>

                {/* END DATE */}
                <div className="field">
                  <label>End Date</label>
                  <input type="datetime-local" name="end_date" onChange={handleChange} />
                  {errors.end_date && <p className="error">{errors.end_date}</p>}
                </div>

                {/* ✅ STATUS ADDED */}
                <div className="field">
                  <label>Status</label>
                  <select name="status" onChange={handleChange} value={formData.status}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* BUTTONS */}
                <div className="btnRow">

                  <button
                    type="button"
                    className="backBtn"
                    onClick={() => navigate("/admin/promotion")}
                  >
                    Cancel
                  </button>

                  <button className="addBtn" disabled={loading}>
                    {loading ? "Saving..." : "Create"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

      {/* CSS SAME */}
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Poppins',sans-serif;
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
        }

        .card{
          width:100%;
          max-width:650px;
          background:white;
          padding:30px;
          border-radius:16px;
          box-shadow:0 8px 20px rgba(0,0,0,0.06);
        }

        h2{
          margin-bottom:20px;
        }

        .field{
          margin-bottom:15px;
        }

        label{
          font-weight:600;
          font-size:13px;
          display:block;
          margin-bottom:6px;
        }

        input, select{
          width:100%;
          padding:10px;
          border:1px solid #ddd;
          border-radius:10px;
        }

        .checkbox{
          display:flex;
          gap:8px;
          margin:5px 0;
        }

        .btnRow{
          display:flex;
          gap:10px;
          margin-top:15px;
        }

        .backBtn{
          flex:1;
          background:#e5e7eb;
          border:none;
          padding:10px;
          border-radius:10px;
        }

        .addBtn{
          flex:1;
          background:#16a34a;
          color:white;
          border:none;
          padding:10px;
          border-radius:10px;
        }

        .error{
          color:red;
          font-size:12px;
          margin-top:4px;
        }
      `}</style>
    </>
  );
};

export default AdminAddPromotion;