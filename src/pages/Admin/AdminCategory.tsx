import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaFolder, FaEdit, FaEye, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import CategoryViewModal from "../../components/CategoryViewModal";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/productcategory/categories/`;

const AdminCategory: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const itemsPerPage = 5;

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

  const getFullUrl = (path?: string | null) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${import.meta.env.VITE_API_URL}${path}`;
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    (cat.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

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
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        .wrapper { display: flex; min-height: 100vh; }
        .main { flex: 1; display: flex; flex-direction: column; }
        .container { padding: 30px; }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 22px 24px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .title-section { display: flex; align-items: center; gap: 14px; }
        .header-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 22px;
        }

        .title { font-size: 24px; font-weight: 700; color: #0f172a; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 3px; }

        .search-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          width: 320px;
        }
        .searchInput {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 14px;
        }

        .addBtn {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Table - Same as AdminStaff */
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        th, td {
          padding: 12px;
          color: #475569;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          font-size: 14px;
        }

        th {
          background: #f8fafc;
          font-weight: 600;
        }

        tr:hover {
          background: #f8fafc;
        }

        .iconBtn {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .iconBtn.edit { background: #2563eb; color: white; }
        .iconBtn.view { background: #0f766e; color: white; }
        .iconBtn.delete { background: #dc2626; color: white; }

        .table-img {
          width: 55px;
          height: 55px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 14px;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 14px 0 0;
        }

        .pagination-info {
          color: #64748b;
          font-size: 11px;
        }

        .pagination-actions {
          display: flex;
          gap: 10px;
        }

        .pagination button {
          padding: 6px 12px;
          border: none;
          border-radius: 0;
          background: #1598ad;
          color: white;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .pagination button:disabled {
          background: #cbd5e1;
          color: #64748b;
          cursor: not-allowed;
        }

      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="container">
            {/* Header */}
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon">
                  <FaFolder />
                </div>
                <div>
                  <h2 className="title">Category Management</h2>
                  <p className="subtitle">Manage your product categories</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="search-container">
                  <FaSearch style={{ color: "#94a3b8" }} />
                  <input
                    type="text"
                    className="searchInput"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button className="addBtn" onClick={() => navigate("/admin/category/add")}>
                  <FaPlus /> Add New Category
                </button>
              </div>
            </div>

            {error && <p style={{ color: "red", textAlign: "center", margin: "10px 0" }}>{error}</p>}

            {/* Table - Now consistent with AdminStaff */}
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
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty">No categories found</td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat, index) => (
                    <tr key={cat.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="actions" style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="iconBtn view"
                          onClick={() => setSelectedCategory(cat)}
                          title="View category"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="iconBtn edit" 
                          onClick={() => navigate(`/admin/category/update/${cat.id}`)}
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

            {/* Pagination */}
            {filteredCategories.length > 0 && (
              <div className="pagination">
                <span className="pagination-info">
                  Showing page {currentPage} out of {totalPages} pages
                </span>
                <div className="pagination-actions">
                  <button 
                    type="button" 
                    onClick={() => setCurrentPage((page) => page - 1)} 
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCurrentPage((page) => page + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CategoryViewModal
        category={selectedCategory}
        imageUrl={getFullUrl}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
};

export default AdminCategory;
