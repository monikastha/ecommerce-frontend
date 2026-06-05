import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaGift, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

interface Promotion {
  id: number;
  name: string;
  d_type: string;
  d_value: number | null;
  applies_to: string;
  categories: number[];
  start_date: string;
  end_date: string;
  status: string;
}

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_BASE = `${API_ORIGIN}/api/admin/promotions`;

const AdminPromotion: React.FC = () => {
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      const data = await res.json();
      if (res.ok) setPromotions(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async (id: number) => {
    if (!window.confirm("Delete this promotion?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}/`, { method: "DELETE" });
      if (res.ok) {
        setPromotions((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete promotion");
    }
  };

  const filtered = promotions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedPromotions = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

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

        .status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
  
        .inactive { background: #fef3c7; color: #d97706; }
        .expired { background: #fee2e2; color: #ef4444; }

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
        .iconBtn.delete { background: #dc2626; color: white; }

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
        <AdminSidebar />
        <div className="main">
          <AdminNavbar />

          <div className="container">
            {/* Header */}
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon">
                  <FaGift />
                </div>
                <div>
                  <h2 className="title">Promotion Management</h2>
                  <p className="subtitle">Manage all promotions and discounts</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="search-container">
                  <FaSearch style={{ color: "#94a3b8" }} />
                  <input
                    className="searchInput"
                    placeholder="Search promotions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button className="addBtn" onClick={() => navigate("/admin/promotion/add")}>
                  <FaPlus /> Add Promotion
                </button>
              </div>
            </div>

            {/* Table - Consistent with AdminStaff */}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Applies To</th>
                  <th>Categories</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="empty">Loading promotions...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="empty">No promotions found</td>
                  </tr>
                ) : (
                  paginatedPromotions.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.d_type}</td>
                      <td>
                        {p.d_type === "percentage"
                          ? `${p.d_value ?? 0}%`
                          : `Rs. ${p.d_value ?? 0}`}
                      </td>
                      <td>
                        {p.applies_to === "all" ? "All Products" : "Specific Categories"}
                      </td>
                      <td>
                        {p.categories?.length > 0
                          ? `${p.categories.length} selected`
                          : "-"}
                      </td>
                      <td>
                        <span className={`status ${p.status}`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(p.start_date).toLocaleDateString()}</td>
                      <td>{new Date(p.end_date).toLocaleDateString()}</td>
                      <td className="actions" style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="iconBtn edit"
                          onClick={() => navigate(`/admin/promotion/update/${p.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="iconBtn delete"
                          onClick={() => deletePromotion(p.id)}
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
            {filtered.length > 0 && (
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
    </>
  );
};

export default AdminPromotion;
