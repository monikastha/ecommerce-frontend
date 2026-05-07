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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    console.log("SubCategory Data:", formData);
    alert("SubCategory added successfully!");

    setFormData({
      categoryName: "",
      subCategoryName: "",
    });

    navigate("/admin/category");
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <AdminSidebar />
      </div>

      {/* Main */}
      <div style={styles.main}>
        <AdminNavbar />

        <div style={styles.page}>
          <div style={styles.card}>
            <h2 style={styles.title}>Add SubCategory</h2>
            <p style={styles.subtitle}>
              Create subcategory under a category
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>

              {/* Category Name */}
              <div style={styles.field}>
                <label>Category Name</label>
                <input
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter category name"
                />
                {errors.categoryName && (
                  <span style={styles.error}>{errors.categoryName}</span>
                )}
              </div>

              {/* SubCategory Name */}
              <div style={styles.field}>
                <label>SubCategory Name</label>
                <input
                  name="subCategoryName"
                  value={formData.subCategoryName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter subcategory name"
                />
                {errors.subCategoryName && (
                  <span style={styles.error}>{errors.subCategoryName}</span>
                )}
              </div>

              {/* BUTTONS */}
              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={styles.backBtn}
                  onClick={() => navigate("/admin/category")}
                >
                  Back
                </button>

                <button type="submit" style={styles.addBtn}>
                  Add SubCategory
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddSubCategory;

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    width: "100%",
  },

  sidebar: {
    width: "260px",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
  },

  main: {
    flex: 1,
    marginLeft: "260px",
    background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
    minHeight: "100vh",
  },

  page: {
    padding: "30px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "22px",
    fontWeight: 600,
  },

  subtitle: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "15px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  backBtn: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 600,
  },

  addBtn: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  error: {
    color: "red",
    fontSize: "12px",
  },
};