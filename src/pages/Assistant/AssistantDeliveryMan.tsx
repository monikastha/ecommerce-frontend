/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/deliveryman/delivery`;

type Deliveryman = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
};

const DeliveryMan: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deliverymen, setDeliverymen] = useState<Deliveryman[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const fetchDeliverymen = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/`);
      setDeliverymen(res.data);
    } catch (err) {
      console.error("Error fetching delivery men:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverymen();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this delivery man?")) return;
    
    try {
      await axios.delete(`${API_BASE}/${id}/`);
      fetchDeliverymen();
    } catch (err) {
      alert("Failed to delete delivery man");
    }
  };

  const filtered = deliverymen.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedDeliverymen = filtered.slice(
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

        .container { padding: 25px 30px; }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 22px 24px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 22px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #5BBF9A, #4DA88A);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 22px;
        }

        .title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .subtitle {
          font-size: 13.5px;
          color: #64748b;
          margin-top: 3px;
        }

        .search {
          width: 280px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
        }

        .search:focus {
          border-color: #5BBF9A;
          box-shadow: 0 0 0 3px rgba(91, 191, 154, 0.15);
        }

        .tableBox {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 15px 12px;
          text-align: left;
          vertical-align: middle;
        }

        th {
          background: #f8fafc;
          font-size: 13.5px;
          color: #475569;
          font-weight: 600;
        }

        td {
          font-size: 14px;
          color: #334155;
          border-top: 1px solid #f1f5f9;
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

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 15px;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-top: 1px solid #f1f5f9;
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

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon">
                  <FaUser />
                </div>
                <div>
                  <h2 className="title">Delivery Man</h2>
                  <p className="subtitle">Manage all delivery personnel in the system</p>
                </div>
              </div>

              <input
                type="text"
                placeholder="Search by name, username or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />
            </div>

            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="empty">Loading delivery men...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="empty">No delivery man available</td></tr>
                  ) : (
                    paginatedDeliverymen.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.id}</strong></td>
                        <td>{item.name}</td>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.phone || "N/A"}</td>
                        <td>{item.address || "N/A"}</td>
                        <td className="actions">
                          <button
                            className="iconBtn edit"
                            onClick={() => navigate(`/assistant/delivery-man/update/${item.id}`)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="iconBtn delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {!loading && filtered.length > 0 && (
                <div className="pagination">
                  <span className="pagination-info">Showing page {currentPage} out of {totalPages} pages</span>
                  <div className="pagination-actions">
                    <button type="button" onClick={() => setCurrentPage((page) => page - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <button type="button" onClick={() => setCurrentPage((page) => page + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryMan;
