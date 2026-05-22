import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/productcategory/categories/`;

const AdminUpdateCategory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get full image URL
  const getFullUrl = (path: string | null) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${import.meta.env.VITE_API_URL}${path}`;
  };

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}${id}/`);
        setFormData({
          name: res.data.name,
          description: res.data.description || "",
        });
        setCurrentImage(res.data.image);
      } catch (err) {
        alert("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
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
    if (!formData.name.trim()) temp.name = "Category name is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("is_active", "true");

    if (image) form.append("image", image);

    try {
      await axios.put(`${API_BASE}${id}/`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Category updated successfully!");
      navigate("/admin/category");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.name?.[0] || "Failed to update category");
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
        .main{flex:1;margin-left:0px;background:#f1f5f9;}
        .container{padding:40px;display:flex;justify-content:center;}

        .card{
          width:100%; max-width:620px; background:#fff; padding:40px;
          border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08);
        }
        h2{text-align:center;margin-bottom:30px;color:#0f172a;font-size:26px;}

        .form-group { margin-bottom: 24px; }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #334155;
        }
        input, textarea {
          width:100%; padding:13px; border:1px solid #e2e8f0;
          border-radius:10px; font-size:15px;
        }
        textarea { min-height: 120px; resize: vertical; }

        .error { color:#ef4444; font-size:13px; margin-top:5px; }

        .btnRow {
          display:flex; gap:15px; margin-top:35px;
        }
        button {
          flex:1; padding:14px; border:none; border-radius:10px;
          font-weight:600; font-size:16px; cursor:pointer;
        }
        .submitBtn { background:#2563eb; color:white; }
        .cancelBtn { background:#e5e7eb; color:#334155; }

        .preview-img, .current-img {
          max-width: 280px; 
          margin-top: 10px; 
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }
      `}</style>

      <div className="wrapper">
        <AdminSidebar />
        <div className="main">
          <AdminNavbar />
          <div className="container">
            <div className="card">
              <h2>Update Category</h2>

              {loading ? (
                <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Category Name <span style={{color:"red"}}>*</span></label>
                    <input
                      name="name"
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label>Description <span style={{color:"red"}}>*</span></label>
                    <textarea
                      name="description"
                      placeholder="Enter category description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Current Image */}
                  {currentImage && !preview && (
                    <div className="form-group">
                      <label>Current Image</label>
                      <img 
                        src={getFullUrl(currentImage)} 
                        alt="Current" 
                        className="current-img" 
                      />
                    </div>
                  )}

                  {/* New Image Upload */}
                  <div className="form-group">
                    <label>Change Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </div>

                  {/* Preview */}
                  {preview && (
                    <div className="form-group">
                      <label>New Image Preview</label>
                      <img src={preview} alt="preview" className="preview-img" />
                    </div>
                  )}

                  <div className="btnRow">
                    <button
                      type="button"
                      className="cancelBtn"
                      onClick={() => navigate("/admin/category")}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submitBtn" disabled={submitting}>
                      {submitting ? "Updating..." : "Update Category"}
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
};

export default AdminUpdateCategory;