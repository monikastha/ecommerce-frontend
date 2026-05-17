import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaTags, FaArrowLeft, FaSave } from "react-icons/fa";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/productcategory/categories/`;
const API_SUB = `${import.meta.env.VITE_API_URL}/api/productcategory/subcategories/`;

const AdminAddSubCategory: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const fetchParentCategories = async () => {
    try {
      const res = await axios.get(API_BASE);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    // Basic validation
    if (!formData.category) {
      setErrors({ category: "Please select parent category" });
      setLoading(false);
      return;
    }
    if (!formData.name.trim()) {
      setErrors({ name: "Subcategory name is required" });
      setLoading(false);
      return;
    }

    try {
      // FIX: Changed 'category' to 'category_id' to match the Django serializer write-only target
      const payload = {
        name: formData.name.trim(),
        category_id: parseInt(formData.category),   
      };

      console.log("Sending payload:", payload);

      const res = await axios.post(API_SUB, payload, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Success response:", res.data);

      alert("✅ Subcategory added successfully!");
      navigate("/admin/category");

    } catch (err: any) {
      console.error("Full Error:", err);
      
      const errorData = err.response?.data;
      console.log("Error Data from server:", errorData);

      if (errorData) {
        let message = "Failed to add subcategory";

        if (errorData.name) message = `Name: ${errorData.name[0]}`;
        else if (errorData.category_id) message = `Category Error: ${errorData.category_id[0]}`;
        else if (typeof errorData === 'string') message = errorData;
        else if (errorData.detail) message = errorData.detail;

        setApiError(message);
        alert(message);
      } else {
        setApiError("Network error or server is not responding");
        alert("Network error. Please check your backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .wrapper { display: flex; width: 100%; }
        .sidebar { width: 260px; position: fixed; top: 0; left: 0; height: 100vh; }
        .main { flex: 1; margin-left: 260px; background: linear-gradient(135deg, #f5f7fa, #e4ecf5); min-height: 100vh; }

        .page { padding: 30px; display: flex; justify-content: center; }
        .card {
          width: 100%; max-width: 600px; background: #fff; padding: 35px;
          border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.09);
        }
        .title { font-size: 24px; font-weight: 700; color: #1e2937; }
        .subtitle { font-size: 14px; color: #64748b; margin-bottom: 25px; }

        .form { display: flex; flex-direction: column; gap: 20px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-weight: 600; color: #374151; }
        input, select {
          padding: 12px 14px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 15px;
        }
        input:focus, select:focus { border-color: #8b5cf6; outline: none; }

        .buttonRow { display: flex; gap: 12px; margin-top: 10px; }
        .backBtn, .addBtn {
          flex: 1; padding: 13px; border: none; border-radius: 10px;
          font-weight: 600; cursor: pointer;
        }
        .backBtn { background: #e2e8f0; color: #475569; }
        .addBtn { background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; }
        .addBtn:disabled { opacity: 0.7; cursor: not-allowed; }

        .error { color: #ef4444; font-size: 13px; }
        .api-error {
          background: #fee2e2; color: #ef4444; padding: 12px; border-radius: 8px;
          text-align: center; margin-bottom: 15px;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar"><AdminSidebar /></div>
        <div className="main">
          <AdminNavbar />

          <div className="page">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <FaTags style={{ fontSize: "28px", color: "#8b5cf6" }} />
                <h2 className="title">Add New Subcategory</h2>
              </div>
              <p className="subtitle">Create a subcategory under a parent category</p>

              {apiError && <div className="api-error">{apiError}</div>}

              <form onSubmit={handleSubmit} className="form">
                <div className="field">
                  <label>Parent Category <span style={{color:"red"}}>*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select Parent Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error">{errors.category}</span>}
                </div>

                <div className="field">
                  <label>Subcategory Name <span style={{color:"red"}}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Smartphones"
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="buttonRow">
                  <button type="button" className="backBtn" onClick={() => navigate("/admin/category")}>
                    <FaArrowLeft /> Back
                  </button>
                  <button type="submit" className="addBtn" disabled={loading}>
                    <FaSave /> {loading ? "Saving..." : "Save Subcategory"}
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

export default AdminAddSubCategory;