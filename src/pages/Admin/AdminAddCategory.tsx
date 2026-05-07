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

    console.log("Category Data:", formData);
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
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <AdminSidebar />
      </div>

      <div style={styles.main}>
        <AdminNavbar />

        <div style={styles.page}>
          <div style={styles.card}>
            <h2 style={styles.title}>Add Category</h2>
            <p style={styles.subtitle}>
              Create new product category and subcategory
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
                />
                {errors.categoryName && (
                  <span style={styles.error}>{errors.categoryName}</span>
                )}
              </div>

              {/* Sub Category */}
              <div style={styles.field}>
                <label>Sub Category</label>
                <input
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  style={styles.input}
                />
                {errors.subCategory && (
                  <span style={styles.error}>{errors.subCategory}</span>
                )}
              </div>

              {/* Description */}
              <div style={styles.field}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                />
                {errors.description && (
                  <span style={styles.error}>{errors.description}</span>
                )}
              </div>

              {/* Image */}
              <div style={styles.field}>
                <label>Image</label>
                <input type="file" onChange={handleFileChange} />
                {errors.image && (
                  <span style={styles.error}>{errors.image}</span>
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCategory;

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
    maxWidth: "650px",
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

  textarea: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    minHeight: "80px",
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
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  error: {
    color: "red",
    fontSize: "12px",
  },
};