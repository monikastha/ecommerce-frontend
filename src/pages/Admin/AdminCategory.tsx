import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaFolder, FaTags, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/productcategory/categories/`;
const API_SUB = `${import.meta.env.VITE_API_URL}/api/productcategory/subcategories/`;

const AdminCategory: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"category" | "subcategory">("category");

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const [catSearch, setCatSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");

  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [error, setError] = useState("");

  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Fetch Categories
  const fetchCategories = async () => {
    setLoadingCats(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}?search=${encodeURIComponent(catSearch)}`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoadingCats(false);
    }
  };

  // Fetch Subcategories
  const fetchSubcategories = async () => {
    setLoadingSubs(true);
    setError("");
    try {
      const res = await axios.get(`${API_SUB}?search=${encodeURIComponent(subSearch)}`);
      console.log("✅ Subcategories loaded:", res.data.length);
      if (res.data.length > 0) console.log("Sample:", res.data[0]);
      setSubcategories(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load subcategories");
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    if (activeTab === "category") fetchCategories();
    else fetchSubcategories();
  }, [activeTab, catSearch, subSearch]);

  const getFullUrl = (path: string | null) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${import.meta.env.VITE_API_URL}${path}`;
  };

  const openZoom = (imagePath: string) => setZoomImage(getFullUrl(imagePath));
  const closeZoom = () => setZoomImage(null);

  const getParentName = (sub: any): string => {
    if (!sub) return "—";
    if (sub.category?.name) return sub.category.name;
    if (typeof sub.category === "number") return `Category #${sub.category}`;
    if (sub.category_name) return sub.category_name;
    return "—";
  };

  const deleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}${id}/`);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  const deleteSubcategory = async (id: number, name: string) => {
    if (!window.confirm(`Delete subcategory "${name}"?`)) return;
    try {
      await axios.delete(`${API_SUB}${id}/`);
      alert("Subcategory deleted successfully!");
      fetchSubcategories();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to delete subcategory");
    }
  };

  return (
    <>
      <style>{`
        .wrapper { display: flex; min-height: 100vh; }
        .main {
          flex: 1;
          background: #f5f7fa;
          margin-left: 0;
        }
        .container { padding: 30px; }

        .header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 25px; padding: 15px 20px;
          background: white; border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .titleBox { display: flex; align-items: center; gap: 12px; }
        .header-icon {
          width: 52px; height: 52px; display: flex; align-items: center; justify-content: center;
          border-radius: 14px; background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white; font-size: 22px;
        }
        .titleBox h1 { font-size: 24px; font-weight: 700; margin: 0; color: #0f172a; }
        .titleBox h3 { font-size: 13px; color: #64748b; margin: 4px 0 0 0; }

        .tab-container {
          display: flex; background: white; border-radius: 10px; padding: 5px;
          width: fit-content; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 25px;
        }
        .tab {
          padding: 10px 24px; border-radius: 8px; font-size: 14px;
          font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;
        }
        .tab.active { background: #2563eb; color: white; }

        .search-container {
          display: flex; align-items: center; gap: 8px;
          background: white; padding: 8px 12px; border-radius: 10px;
          border: 1px solid #e2e8f0;
        }
        .searchInput {
          border: none; outline: none; width: 260px; font-size: 14px;
        }

        .addBtn {
          background: linear-gradient(135deg, #16a34a, #22c55e); color: white;
          border: none; padding: 10px 16px; border-radius: 10px;
          cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 6px;
        }

        table {
          width: 100%; border-collapse: collapse; background: white;
          border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        th, td {
          padding: 14px; font-size: 14px; color: #475569;
          border-bottom: 1px solid #e5e7eb; text-align: left;
        }
        th { background: #f8fafc; font-weight: 600; }

        .actions { display: flex; gap: 8px; }
        .iconBtn {
          width: 34px; height: 34px; border: none; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 15px; color: white;
        }
        .iconBtn.edit { background: #2563eb; }
        .iconBtn.delete { background: #dc2626; }

        img.table-img {
          width: 55px; height: 55px; object-fit: cover;
          border-radius: 8px; border: 2px solid #e2e8f0; cursor: zoom-in;
        }

        .zoom-modal {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.9); display: flex;
          align-items: center; justify-content: center; z-index: 1000;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="container">
            <div className="header">
              <div className="titleBox">
                <div className="header-icon">
                  <FaFolder />
                </div>
                <div>
                  <h1>Category Management</h1>
                  <h3>Manage categories and subcategories</h3>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button className="addBtn" onClick={() => navigate("/admin/category/add")}>
                  <FaPlus /> Add Category
                </button>
                <button 
                  className="addBtn"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#a855f7)" }}
                  onClick={() => navigate("/admin/subcategory/add")}
                >
                  <FaPlus /> Add Subcategory
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="tab-container">
              <div className={`tab ${activeTab === "category" ? "active" : ""}`} onClick={() => setActiveTab("category")}>
                <FaFolder /> Categories
              </div>
              <div className={`tab ${activeTab === "subcategory" ? "active" : ""}`} onClick={() => setActiveTab("subcategory")}>
                <FaTags /> Subcategories
              </div>
            </div>

            {error && <p style={{ color: "red", textAlign: "center", margin: "10px 0" }}>{error}</p>}

            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: "20px", maxWidth: "320px" }}>
              <FaSearch style={{ color: "#94a3b8" }} />
              <input
                type="text"
                className="searchInput"
                placeholder={`Search ${activeTab}...`}
                value={activeTab === "category" ? catSearch : subSearch}
                onChange={(e) => 
                  activeTab === "category" 
                    ? setCatSearch(e.target.value) 
                    : setSubSearch(e.target.value)
                }
              />
            </div>

            {/* Categories Table */}
            {activeTab === "category" && (
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingCats ? (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: "80px" }}>Loading categories...</td></tr>
                  ) : categories.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: "80px" }}>No categories found</td></tr>
                  ) : (
                    categories.map((cat, index) => (
                      <tr key={cat.id}>
                        <td>{index + 1}</td>
                        <td><strong>{cat.name}</strong></td>
                        <td>{cat.description ? cat.description.substring(0, 70) + "..." : "-"}</td>
                        <td>
                          {cat.image ? (
                            <img
                              src={getFullUrl(cat.image)}
                              alt={cat.name}
                              className="table-img"
                              onClick={() => openZoom(cat.image)}
                            />
                          ) : "No Image"}
                        </td>
                        <td className="actions">
                          <button className="iconBtn edit" onClick={() => navigate(`/admin/category/update/${cat.id}`)}>
                            <FaEdit />
                          </button>
                          <button className="iconBtn delete" onClick={() => deleteCategory(cat.id, cat.name)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Subcategories Table */}
            {activeTab === "subcategory" && (
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Subcategory Name</th>
                    <th>Parent Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSubs ? (
                    <tr><td colSpan={4} style={{ textAlign: "center", padding: "80px" }}>Loading subcategories...</td></tr>
                  ) : subcategories.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: "center", padding: "80px" }}>No subcategories found</td></tr>
                  ) : (
                    subcategories.map((sub, index) => (
                      <tr key={sub.id}>
                        <td>{index + 1}</td>
                        <td><strong>{sub.name}</strong></td>
                        <td><strong>{getParentName(sub)}</strong></td>
                        <td className="actions">
                          <button className="iconBtn edit" onClick={() => navigate(`/admin/subcategory/update/${sub.id}`)}>
                            <FaEdit />
                          </button>
                          <button className="iconBtn delete" onClick={() => deleteSubcategory(sub.id, sub.name)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="zoom-modal" onClick={closeZoom}>
          <img src={zoomImage} alt="Zoomed" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: "12px" }} />
        </div>
      )}
    </>
  );
};

export default AdminCategory;