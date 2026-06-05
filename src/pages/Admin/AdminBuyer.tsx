import React, { useEffect, useState } from "react";
import { FaUsers, FaTrash } from "react-icons/fa";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api`;

interface Buyer {
  id: number;
  user_id: number;
  username: string;
  name: string;
  email: string;
  phone_number: string;
  address: string | null;
}

const AdminBuyer: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const itemsPerPage = 5;

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/buyer/`);
      setBuyers(res.data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load buyers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleDeleteBuyer = async (buyer: Buyer) => {
    if (!window.confirm(`Are you sure you want to delete buyer "${buyer.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(buyer.user_id);

    try {
      await axios.delete(`${API_BASE}/users/${buyer.user_id}/`);
      alert("Buyer deleted successfully.");
      fetchBuyers();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to delete buyer. Please try again.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBuyers = buyers.filter((buyer) => {
    const term = search.toLowerCase();
    return (
      buyer.name?.toLowerCase().includes(term) ||
      buyer.username?.toLowerCase().includes(term) ||
      buyer.email?.toLowerCase().includes(term) ||
      buyer.phone_number?.toLowerCase().includes(term) ||
      (buyer.address || "").toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredBuyers.length / itemsPerPage));
  const paginatedBuyers = filteredBuyers.slice(
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
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 22px;
        }

        .title { font-size: 24px; font-weight: 700; color: #0f172a; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 3px; }

        .search {
          width: 320px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
        }
        .search:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }

        /* Table - Same as AdminStaff */
        table {
          width:100%;
          border-collapse:collapse;
          background:white;
          border-radius:10px;
          overflow:hidden;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
        }

        th, td {
          padding:12px;
          color:#475569;
          border-bottom:1px solid #e5e7eb;
          text-align:left;
          font-size:14px;
        }

        th {
          background:#f8fafc;
          font-weight:600;
        }

        tr:hover { 
          background: #f8fafc; 
        }

        .delete-btn {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .delete-btn:hover {
          background: #b91c1c;
        }
        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty { 
          text-align: center; 
          padding: 60px 20px; 
          color: #94a3b8; 
          font-size: 14px; 
        }

        /* Pagination - Same as AdminStaff */
        .pagination {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          padding:14px 0 0;
        }

        .pagination-info {
          color:#64748b;
          font-size:11px;
        }

        .pagination-actions {
          display:flex;
          gap:10px;
        }

        .pagination button {
          padding:6px 12px;
          border:none;
          border-radius:0;
          background:#1598ad;
          color:white;
          font-size:11px;
          font-weight:600;
          cursor:pointer;
        }

        .pagination button:disabled {
          background:#cbd5e1;
          color:#64748b;
          cursor:not-allowed;
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
                  <FaUsers />
                </div>
                <div>
                  <h2 className="title">Buyer Management</h2>
                  <p className="subtitle">Manage registered buyers and their accounts</p>
                </div>
              </div>

              <input
                type="text"
                className="search"
                placeholder="Search by name, email, username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table - Direct like AdminStaff */}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="empty">Loading buyers...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="empty" style={{ color: "red" }}>{error}</td>
                  </tr>
                ) : filteredBuyers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty">No buyers found</td>
                  </tr>
                ) : (
                  paginatedBuyers.map((buyer) => (
                    <tr key={buyer.id}>
                      <td>{buyer.id}</td>
                      <td>{buyer.username}</td>
                      <td>{buyer.name}</td>
                      <td>{buyer.email}</td>
                      <td>{buyer.phone_number}</td>
                      <td>{buyer.address || "N/A"}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteBuyer(buyer)}
                          disabled={deletingId === buyer.user_id}
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
            {filteredBuyers.length > 0 && (
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

export default AdminBuyer;