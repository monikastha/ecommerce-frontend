import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaFolder, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/productcategory/categories/`;

type Category = {
  id: number;
  name: string;
  description?: string;
  image?: string;
};

const AssistantCategory: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}?search=${encodeURIComponent(search)}`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);

  const getFullUrl = (path: string | null) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${path}`;
  };

  const openZoom = (imagePath: string) => setZoomImage(getFullUrl(imagePath));
  const closeZoom = () => setZoomImage(null);

  const deleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}${id}/`);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
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
          padding: 25px 30px; 
        }

        .header {
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          background: white; 
          padding: 20px 24px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 20px;
        }

        .titleBox { 
          display: flex; 
          align-items: center; 
          gap: 14px; 
        }

        .header-icon {
          width: 52px; 
          height: 52px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border-radius: 14px; 
          background: linear-gradient(135deg, #5BBF9A, #4DA88A);
          color: white; 
          font-size: 22px;
        }

        .titleBox h1 { 
          font-size: 24px; 
          font-weight: 700; 
          margin: 0; 
          color: #1f2937; 
        }

        .titleBox h3 { 
          font-size: 13.5px; 
          color: #64748b; 
          margin: 4px 0 0 0; 
        }

        .search-container {
          display: flex; 
          align-items: center; 
          gap: 8px;
          background: white; 
          padding: 10px 14px; 
          border-radius: 10px;
          border: 1px solid #e2e8f0; 
          max-width: 320px;
        }

        .searchInput {
          border: none; 
          outline: none; 
          width: 260px; 
          font-size: 14px;
        }

        .addBtn {
          background: linear-gradient(135deg, #5BBF9A, #4DA88A); 
          color: white;
          border: none; 
          padding: 11px 18px; 
          border-radius: 10px;
          cursor: pointer; 
          font-weight: 600; 
          display: flex; 
          align-items: center; 
          gap: 6px;
        }

        table {
          width: 100%; 
          border-collapse: collapse; 
          background: white;
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        }

        th, td {
          padding: 16px 14px; 
          font-size: 14px; 
          color: #475569;
          border-bottom: 1px solid #f1f5f9; 
          text-align: left;
        }

        th { 
          background: #f8fafc; 
          font-weight: 600; 
        }

        tr:hover { 
          background: #f8fafc; 
        }

        .actions { 
          display: flex; 
          gap: 8px; 
        }

        .iconBtn {
          width: 36px; 
          height: 36px; 
          border: none; 
          border-radius: 8px;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer; 
          font-size: 15px; 
          color: white;
          transition: 0.2s;
        }

        .iconBtn.edit { 
          background: #3b82f6; 
        }

        .iconBtn.delete { 
          background: #ef4444; 
        }

        .iconBtn:hover {
          transform: scale(1.08);
        }

        img.table-img {
          width: 55px; 
          height: 55px; 
          object-fit: cover;
          border-radius: 8px; 
          border: 2px solid #e2e8f0; 
          cursor: zoom-in;
        }

        .zoom-modal {
          position: fixed; 
          top: 0; 
          left: 0; 
          right: 0; 
          bottom: 0;
          background: rgba(0,0,0,0.9); 
          display: flex;
          align-items: center; 
          justify-content: center; 
          z-index: 2000;
        }

        .empty {
          text-align: center;
          padding: 80px 20px;
          color: #94a3b8;
          font-size: 15px;
        }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="header">
              <div className="titleBox">
                <div className="header-icon">
                  <FaFolder />
                </div>
                <div>
                  <h1>Category Management</h1>
                  <h3>Manage product categories</h3>
                </div>
              </div>

              <button className="addBtn" onClick={() => navigate("/assistant/category/add")}>
                <FaPlus /> Add New Category
              </button>
            </div>

            {error && <p style={{ color: "red", textAlign: "center", margin: "10px 0" }}>{error}</p>}

            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: "20px" }}>
              <FaSearch style={{ color: "#94a3b8" }} />
              <input
                type="text"
                className="searchInput"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Categories Table */}
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="empty">Loading categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty">No categories found</td>
                  </tr>
                ) : (
                  categories.map((cat, index) => (
                    <tr key={cat.id}>
                      <td><strong>{index + 1}</strong></td>
                      <td><strong>{cat.name}</strong></td>
                      <td>
                        {cat.description 
                          ? cat.description.substring(0, 70) + (cat.description.length > 70 ? "..." : "") 
                          : "-"
                        }
                      </td>
                      <td>
                        {cat.image ? (
                          <img
                            src={getFullUrl(cat.image)}
                            alt={cat.name}
                            className="table-img"
                            onClick={() => openZoom(cat.image!)}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="actions">
                        <button 
                          className="iconBtn edit" 
                          onClick={() => navigate(`/assistant/category/update/${cat.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="iconBtn delete" 
                          onClick={() => deleteCategory(cat.id, cat.name)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="zoom-modal" onClick={closeZoom}>
          <img 
            src={zoomImage} 
            alt="Zoomed" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: "12px" }} 
          />
        </div>
      )}
    </>
  );
};

export default AssistantCategory;