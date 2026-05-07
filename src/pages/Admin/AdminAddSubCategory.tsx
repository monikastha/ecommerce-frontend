import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminAddSubCategory: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
    subCategoryName: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let temp: any = {};

    if (!formData.categoryName.trim()) {
      temp.categoryName = "Category name is required";
    }

    if (!formData.subCategoryName.trim()) {
      temp.subCategoryName = "Subcategory name is required";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert("SubCategory added successfully!");
    navigate("/admin/category");
  };

  return (
    <>
      {/* CSS IN SAME FILE */}
      <style>{`
        .wrapper {
          display: flex;
          width: 100%;
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
          max-width: 600px;
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 22px;
          font-weight: 600;
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

        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .buttonRow {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .backBtn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #e5e7eb;
          cursor: pointer;
          font-weight: 600;
        }

        .addBtn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #4f46e5;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
        }

        .error {
          color: red;
          font-size: 12px;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="page">
            <div className="card">
              <h2 className="title">Add SubCategory</h2>
              <p className="subtitle">Create subcategory under a category</p>

              <form onSubmit={handleSubmit} className="form">

                <div className="field">
                  <label>Category Name</label>
                  <input
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    placeholder="Enter category name"
                  />
                  {errors.categoryName && (
                    <span className="error">{errors.categoryName}</span>
                  )}
                </div>

                <div className="field">
                  <label>SubCategory Name</label>
                  <input
                    name="subCategoryName"
                    value={formData.subCategoryName}
                    onChange={handleChange}
                    placeholder="Enter subcategory name"
                  />
                  {errors.subCategoryName && (
                    <span className="error">{errors.subCategoryName}</span>
                  )}
                </div>

                <div className="buttonRow">
                  <button
                    type="button"
                    className="backBtn"
                    onClick={() => navigate("/admin/category")}
                  >
                    Back
                  </button>

                  <button type="submit" className="addBtn">
                    Add SubCategory
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