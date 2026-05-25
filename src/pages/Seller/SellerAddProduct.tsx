import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Category = {
  id: number;
  name: string;
};

export default function SellerAddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_ORIGIN}/api/productcategory/categories/`);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    let temp: any = {};
    if (!formData.name.trim()) temp.name = "Product name is required";
    if (!formData.price) temp.price = "Price is required";
    if (!formData.quantity) temp.quantity = "Quantity is required";
    if (!formData.category) temp.category = "Please select a category";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const sellerId = localStorage.getItem("seller_id");
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("code", formData.code);
      payload.append("price", formData.price);
      payload.append("quantity", formData.quantity);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      payload.append("status", "pending");
      payload.append("is_published", "false");
      if (sellerId) payload.append("seller", sellerId);
      if (image) payload.append("image", image);

      await axios.post(`${API_ORIGIN}/api/products/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product submitted for admin/assistant approval.");
      navigate("/seller/manageproduct");
    } catch (error: any) {
      console.error("Failed to add product", error);
      alert(error?.response?.data?.detail || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif;}
        body{background:#f1f5f9;}

        .wrapper{display:flex;min-height:100vh;}
        .main{flex:1;margin-left:260px;background:#f1f5f9;}
        .container{padding:40px;display:flex;justify-content:center;}

        .card{
          width:100%; 
          max-width:720px; 
          background:#fff; 
          padding:40px;
          border-radius:16px; 
          box-shadow:0 10px 30px rgba(0,0,0,0.08);
        }

        h2{
          text-align:center;
          margin-bottom:30px;
          color:#0f172a;
          font-size:26px;
          font-weight:700;
        }

        .form-group { margin-bottom: 24px; }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #334155;
        }

        input, select, textarea {
          width:100%; 
          padding:13px; 
          border:1px solid #e2e8f0;
          border-radius:10px; 
          font-size:15px;
        }

        textarea { min-height: 110px; resize: vertical; }

        .error { color:#ef4444; font-size:13px; margin-top:5px; }

        .btnRow {
          display:flex; 
          gap:15px; 
          margin-top:35px;
        }

        button {
          flex:1; 
          padding:14px; 
          border:none; 
          border-radius:10px;
          font-weight:600; 
          font-size:16px; 
          cursor:pointer;
        }

        .submitBtn { 
          background:#ef4444; 
          color:white; 
        }
        .cancelBtn { 
          background:#e5e7eb; 
          color:#334155; 
        }

        .preview-img {
          max-width: 280px; 
          margin-top: 12px; 
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
      `}</style>

      <div className="wrapper">
        <SellerSidebar />
        <div className="main">
          <SellerNavbar />

          <div className="container">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
                <h2>Add New Product</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label>Product Code</label>
                  <input
                    name="code"
                    placeholder="e.g. SR001"
                    value={formData.code}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {errors.price && <p className="error">{errors.price}</p>}
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    placeholder="Enter stock quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                  {errors.quantity && <p className="error">{errors.quantity}</p>}
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="error">{errors.category}</p>}
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Write detailed description..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                {preview && (
                  <div className="form-group">
                    <label>Image Preview</label>
                    <img src={preview} alt="preview" className="preview-img" />
                  </div>
                )}

                <p style={{ color: "#64748b", fontSize: "14px", margin: "20px 0" }}>
                  New products are sent to Admin and Assistant for approval before they appear in the store.
                </p>

                <div className="btnRow">
                  <button
                    type="button"
                    className="cancelBtn"
                    onClick={() => navigate("/seller/manageproduct")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submitBtn" disabled={loading}>
                    {loading ? "Adding Product..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
