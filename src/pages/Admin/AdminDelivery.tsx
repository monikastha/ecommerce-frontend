import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaTruck, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/deliveryman/delivery`;

interface Deliveryman {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

const AdminDelivery: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Deliveryman[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/`);
      setDeliveries(res.data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to load delivery staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await axios.delete(`${API_BASE}/${id}/`);
      fetchDeliveries();
    } catch (err: any) {
      alert("Failed to delete deliveryman");
      console.error(err);
    }
  };

  const filteredData = deliveries.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search) ||
    d.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
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

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          width: 280px;
        }
        .search {
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
        .iconBtn.edit {
          background: #2563eb;
          color: white;
        }
        .iconBtn.delete {
          background: #dc2626;
          color: white;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 14px;
        }

        /* Pagination - Same as AdminStaff */
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
                  <FaTruck />
                </div>
                <div>
                  <h2 className="title">Delivery Management</h2>
                  <p className="subtitle">Manage delivery staff and assignments</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div className="search-box">
                  <FaSearch />
                  <input
                    className="search"
                    placeholder="Search delivery staff..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button className="addBtn" onClick={() => navigate("/admin/delivery/add")}>
                  <FaTruck /> Add Delivery
                </button>
              </div>
            </div>

            {/* Table - Direct like AdminStaff */}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="empty">Loading delivery staff...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="empty" style={{ color: "red" }}>{error}</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty">No delivery staff found</td>
                  </tr>
                ) : (
                  paginatedData.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.name}</td>
                      <td>{d.username}</td>
                      <td>{d.email}</td>
                      <td>{d.phone}</td>
                      <td>{d.address}</td>
                      <td className="actions" style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="iconBtn edit"
                          onClick={() => navigate(`/admin/delivery/update/${d.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="iconBtn delete"
                          onClick={() => handleDelete(d.id, d.name)}
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
            {filteredData.length > 0 && (
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

export default AdminDelivery;