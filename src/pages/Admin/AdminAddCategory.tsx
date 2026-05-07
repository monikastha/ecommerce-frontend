import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddCategory: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
    subCategory: "",
    description: "",
    image: null as File | null,
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const validate = () => {
    let temp: any = {};

    if (!formData.categoryName.trim())
      temp.categoryName = "Category name is required";

    if (!formData.subCategory.trim())
      temp.subCategory = "Subcategory is required";

    if (!formData.description.trim())
      temp.description = "Description is required";

    if (!formData.image)
      temp.image = "Image is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    alert("Category added successfully!");

    setFormData({
      categoryName: "",
      subCategory: "",
      description: "",
      image: null,
    });

    navigate("/admin/category");
  };

  return (
    <>
      {/* STYLE BLOCK (NORMAL CSS IN SAME FILE) */}
      <style>{`
        .admin-layout {
          display: flex;
        }

        .sidebar {
          width: 260px;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
        }

        .main {
          flex: 1;
          margin-left: 260px;
          background: linear-gradient(135deg, #f5f7fa, #e4ecf5);
          min-height: 100vh;
        }

        .page {
          padding: 30px;
          display: flex;
          justify-content: center;
        }

        .card {
          width: 100%;
          max-width: 650px;
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .subtitle {
          font-size: 13px;
          color: #666;
          margin-bottom: 15px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        input, textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
        }

        textarea {
          min-height: 80px;
        }

        .error {
          color: red;
          font-size: 12px;
        }

        .buttonRow {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .backBtn {
          background: #e5e7eb;
        }

        .addBtn {
          background: #4f46e5;
          color: white;
        }
      `}</style>

      <div className="admin-layout">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="page">
            <div className="card">
              <div className="title">Add Category</div>
              <div className="subtitle">
                Create new product category and subcategory
              </div>

              <form onSubmit={handleSubmit} className="form">

                <div className="field">
                  <label>Category Name</label>
                  <input
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                  />
                  {errors.categoryName && (
                    <span className="error">{errors.categoryName}</span>
                  )}
                </div>

                <div className="field">
                  <label>Sub Category</label>
                  <input
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                  />
                  {errors.subCategory && (
                    <span className="error">{errors.subCategory}</span>
                  )}
                </div>

                <div className="field">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                  {errors.description && (
                    <span className="error">{errors.description}</span>
                  )}
                </div>

                <div className="field">
                  <label>Image</label>
                  <input type="file" onChange={handleFileChange} />
                  {errors.image && (
                    <span className="error">{errors.image}</span>
                  )}
                </div>

                <div className="buttonRow">
                  <button
                    type="button"
                    className="btn backBtn"
                    onClick={() => navigate("/admin/category")}
                  >
                    Back
                  </button>

                  <button type="submit" className="btn addBtn">
                    Add Category
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

export default AdminAddCategory;