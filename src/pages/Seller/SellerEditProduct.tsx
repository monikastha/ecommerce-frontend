import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Category = { id: number; name: string };
type ProductStatus = "pending" | "approved" | "rejected";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<ProductStatus>("pending");
  const [published, setPublished] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    code: "",
    description: "",
  });

  const imageUrl = (path?: string) => !path ? "" : path.startsWith("http") ? path : `${API_ORIGIN}${path}`;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const [categoryRes, productRes] = await Promise.all([
          axios.get(`${API_ORIGIN}/api/productcategory/categories/`),
          axios.get(`${API_ORIGIN}/api/products/${id}/`),
        ]);
        const product = productRes.data;

        setCategories(categoryRes.data);
        setForm({
          name: product.name || "",
          price: product.price || "",
          quantity: String(product.quantity ?? ""),
          category: product.category ? String(product.category) : "",
          code: product.code || "",
          description: product.description || "",
        });
        setStatus(product.status || "pending");
        setPublished(Boolean(product.is_published));
        setCurrentImage(product.image || "");
      } catch (error) {
        console.error("Failed to load product", error);
        alert("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "category" && !value) return;
        payload.append(key, String(value));
      });
      payload.append("status", "pending");
      payload.append("is_published", "false");
      if (image) payload.append("image", image);

      await axios.patch(`${API_ORIGIN}/api/products/${id}/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated and sent for approval.");
      navigate("/seller/manageproduct");
    } catch (error: any) {
      console.error("Failed to update product", error);
      alert(error?.response?.data?.detail || "Failed to update product");
    } finally {
      setSubmitting(false);
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
        .card{width:100%;max-width:720px;background:#fff;padding:40px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.08);}
        h2{text-align:center;margin-bottom:30px;color:#0f172a;font-size:26px;font-weight:700;}
        .form-group{margin-bottom:24px;}
        label{display:block;margin-bottom:8px;font-weight:600;color:#334155;}
        input,select,textarea{width:100%;padding:13px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;}
        textarea{min-height:110px;resize:vertical;}
        .btnRow{display:flex;gap:15px;margin-top:35px;}
        button{flex:1;padding:14px;border:none;border-radius:10px;font-weight:600;font-size:16px;cursor:pointer;}
        .submitBtn{background:#ef4444;color:white;}
        .submitBtn:disabled{opacity:.65;cursor:not-allowed;}
        .cancelBtn{background:#e5e7eb;color:#334155;}
        .backBtn{flex:0 0 auto;background:transparent;color:#0f172a;padding:10px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;}
        .preview-img{max-width:280px;margin-top:12px;border-radius:12px;border:1px solid #e2e8f0;}
        .metaRow{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0;color:#475569;font-size:14px;}
        .pill{padding:7px 12px;border-radius:999px;background:#f1f5f9;font-weight:700;}
      `}</style>

      <div className="wrapper">
        <SellerSidebar />
        <div className="main">
          <SellerNavbar />

          <div className="container">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
                <button type="button" className="backBtn" onClick={() => navigate("/seller/manageproduct")}>
                  <FaArrowLeft />
                </button>
                <h2>Edit Product</h2>
              </div>

              {loading ? (
                <p style={{ textAlign: "center", color: "#64748b" }}>Loading product...</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Enter product name" />
                  </div>

                  <div className="form-group">
                    <label>Product Code</label>
                    <input name="code" value={form.code} onChange={handleChange} placeholder="e.g. SR001" />
                  </div>

                  <div className="form-group">
                    <label>Price (Rs.) *</label>
                    <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Quantity</label>
                    <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Key Specifications</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder={"Enter each specification on a new line...\nExample:\n6.5 inch display\n128GB storage\n5000mAh battery"}
                    />
                  </div>

                  <div className="metaRow">
                    <span className="pill">Status: {status}</span>
                    <span className="pill">Published: {published ? "published" : "unpublished"}</span>
                  </div>

                  <div className="form-group">
                    <label>Product Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </div>

                  {currentImage && (
                    <div className="form-group">
                      <label>Current Image</label>
                      <img src={imageUrl(currentImage)} alt="Current" className="preview-img" />
                    </div>
                  )}

                  <div className="btnRow">
                    <button type="button" className="cancelBtn" onClick={() => navigate("/seller/manageproduct")}>
                      Cancel
                    </button>
                    <button type="submit" className="submitBtn" disabled={submitting}>
                      {submitting ? "Updating..." : "Update Product"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
