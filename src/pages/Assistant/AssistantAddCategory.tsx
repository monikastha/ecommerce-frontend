import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/productcategory/categories/`;

const AssistantAddCategory: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.description.trim()) temp.description = "Description is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("is_active", "true");
    if (image) form.append("image", image);

    try {
      await axios.post(API_BASE, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Category added successfully!");
      navigate("/assistant/category");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.name?.[0] || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }

        .dashboard-container {
          background: #f4f6f8;
          min-height: 100vh;
        }

        .main-content {
          margin-left: 250px;
          width: calc(100% - 250px);
          min-height: 100vh;
        }

        .container {
          padding: 40px;
          display: flex;
          justify-content: center;
        }

        .card {
          width: 100%;
          max-width: 620px;
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #1f2937;
          font-size: 26px;
          font-weight: 700;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #334155;
        }

        input, textarea {
          width: 100%;
          padding: 13px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        .error {
          color: #ef4444;
          font-size: 13px;
          margin-top: 5px;
        }

        .btnRow {
          display: flex;
          gap: 15px;
          margin-top: 35px;
        }

        button {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
        }

        .submitBtn {
          background: #5BBF9A;
          color: white;
        }

        .cancelBtn {
          background: #e5e7eb;
          color: #334155;
        }

        .preview-img {
          max-width: 250px;
          margin-top: 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="card">
              <h2>Add New Category</h2>

              <form onSubmit={handleSubmit}>
                {/* Category Name */}
                <div className="form-group">
                  <label>Category Name:</label>
                  <input
                    name="name"
                    placeholder="Enter category name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    placeholder="Enter category description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                  {errors.description && <p className="error">{errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label>Category Image:</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                {preview && (
                  <div className="form-group">
                    <label>Image Preview</label>
                    <img src={preview} alt="preview" className="preview-img" />
                  </div>
                )}

                {/* Buttons */}
                <div className="btnRow">
                  <button
                    type="button"
                    className="cancelBtn"
                    onClick={() => navigate("/assistant/category")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submitBtn" disabled={loading}>
                    {loading ? "Saving..." : "Add Category"}
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

export default AssistantAddCategory;