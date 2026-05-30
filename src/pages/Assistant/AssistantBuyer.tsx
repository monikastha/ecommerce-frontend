import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaTrash } from "react-icons/fa";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";

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

const Buyer: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/buyer/`);
      setBuyers(res.data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to load buyers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleDelete = async (buyer: Buyer) => {
    if (!window.confirm(`Delete buyer "${buyer.name}"? This action cannot be undone.`)) return;

    setDeletingId(buyer.user_id);

    try {
      await axios.delete(`${API_BASE}/users/${buyer.user_id}/`);
      alert("Buyer deleted successfully.");
      fetchBuyers();
    } catch (err: any) {
      alert("Failed to delete buyer. Please try again.");
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

  return (
    <>
      <style>{`
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
          width: 100%;
          min-height: calc(100vh - 72px);
          padding: 36px 42px;
        }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 28px 30px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 18px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 22px;
        }

        .title {
          font-size: 26px;
          font-weight: 700;
          color: #1f2937;
        }

        .subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .search {
          width: 360px;
          padding: 13px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
          font-size: 14px;
        }

        .search:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }

        .tableBox {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1040px;
          border-collapse: collapse;
        }

        th {
          background: #f8fafc;
          padding: 18px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          font-size: 14px;
        }

        td {
          padding: 18px;
          border-top: 1px solid #f1f5f9;
          color: #334155;
          font-size: 15px;
        }

        tr:hover {
          background: #f9fafb;
        }

        .delete-btn {
          color: #ef4444;
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }

        .delete-btn:hover {
          background: #fee2e2;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 15px;
        }

        @media (max-width: 900px) {
          .main-content { margin-left: 0; width: 100%; }
          .container { padding: 24px 18px; }
          .headerBox { padding: 22px; }
          .search { width: 100%; }
        }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            {/* Header */}
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon">
                  <FaUsers />
                </div>
                <div>
                  <h2 className="title">Buyer Management</h2>
                  <p className="subtitle">View and manage all registered buyers</p>
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

            {/* Table */}
            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
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
                      <td colSpan={7} className="empty" style={{ color: "#dc2626" }}>
                        {error}
                      </td>
                    </tr>
                  ) : filteredBuyers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty">No buyers found</td>
                    </tr>
                  ) : (
                    filteredBuyers.map((buyer) => (
                      <tr key={buyer.id}>
                        <td><strong>{buyer.id}</strong></td>
                        <td>{buyer.username}</td>
                        <td>{buyer.name}</td>
                        <td>{buyer.email}</td>
                        <td>{buyer.phone_number}</td>
                        <td>{buyer.address || "N/A"}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(buyer)}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buyer;
