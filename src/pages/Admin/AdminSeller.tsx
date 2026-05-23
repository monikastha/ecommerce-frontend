import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaUserTie } from "react-icons/fa";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/seller";

interface Seller {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address: string;
  username?: string;
  citizenship: string;
  status: "pending" | "approved" | "rejected";
  business_certificate?: string;
  created_at: string;
}

const AdminSeller: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch Sellers
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/`); // Adjust endpoint if needed
      setSellers(res.data);
      setError("");
    } catch (err: any) {
      setError("Failed to load sellers. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Approve Seller
  const handleApprove = async (id: number) => {
    if (!window.confirm("Approve this seller?")) return;
    setActionLoading(id);
    try {
      await axios.post(`${API_BASE}/${id}/approve/`);
      fetchSellers(); // Refresh list
    } catch (err) {
      alert("Failed to approve seller");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject Seller
  const handleReject = async (id: number) => {
    if (!window.confirm("Reject this seller?")) return;
    setActionLoading(id);
    try {
      await axios.post(`${API_BASE}/${id}/reject/`);
      fetchSellers();
    } catch (err) {
      alert("Failed to reject seller");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(search.toLowerCase()) ||
    seller.phone.includes(search)
  );

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        body {
          background: #f1f5f9;
        }

        .wrapper {
          display: flex;
          min-height: 100vh;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .container {
          padding: 28px;
        }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 22px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 20px;
        }

        .title {
          font-size: 23px;
          font-weight: 700;
          color: #0f172a;
        }

        .subtitle {
          font-size: 13px;
          color: #64748b;
          margin-top: 3px;
        }

        .search {
          width: 280px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 13px;
        }

        .search:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }

        .tableBox {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          font-size: 13px;
          padding: 16px 12px;
          text-align: left;
          color: #475569;
          background: #f8fafc;
          font-weight: 600;
        }

        td {
          font-size: 13.5px;
          padding: 16px 12px;
          border-top: 1px solid #f1f5f9;
          color: #334155;
        }

        tr:hover {
          background: #f8fafc;
        }

        .status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .pending { background: #fef3c7; color: #d97706; }
        .approved { background: #d1fae5; color: #10b981; }
        .rejected { background: #fee2e2; color: #ef4444; }

        .action-btn {
          padding: 6px 14px;
          border: none;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 6px;
        }

        .approve-btn {
          background: #10b981;
          color: white;
        }

        .reject-btn {
          background: #ef4444;
          color: white;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 14px;
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
                  <FaUserTie />
                </div>
                <div>
                  <h2 className="title">Seller Management</h2>
                  <p className="subtitle">Manage seller applications and approvals</p>
                </div>
              </div>

              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />
            </div>

            {/* Table */}
            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Citizenship</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="empty">Loading sellers...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={8} className="empty" style={{ color: "red" }}>{error}</td>
                    </tr>
                  ) : filteredSellers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty">No sellers found</td>
                    </tr>
                  ) : (
                    filteredSellers.map((seller) => (
                      <tr key={seller.id}>
                        <td>{seller.id}</td>
                        <td><strong>{seller.name}</strong></td>
                        <td>{seller.email || "-"}</td>
                        <td>{seller.phone}</td>
                        <td>{seller.address.substring(0, 35)}...</td>
                        <td>{seller.citizenship}</td>
                        <td>
                          <span className={`status ${seller.status}`}>
                            {seller.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {seller.status === "pending" && (
                            <>
                              <button
                                className="action-btn approve-btn"
                                onClick={() => handleApprove(seller.id)}
                                disabled={actionLoading === seller.id}
                              >
                                {actionLoading === seller.id ? "..." : "Approve"}
                              </button>
                              <button
                                className="action-btn reject-btn"
                                onClick={() => handleReject(seller.id)}
                                disabled={actionLoading === seller.id}
                              >
                                {actionLoading === seller.id ? "..." : "Reject"}
                              </button>
                            </>
                          )}
                          {seller.status !== "pending" && (
                            <span style={{ color: "#64748b", fontSize: "12px" }}>
                              {seller.status === "approved" ? "Approved" : "Rejected"}
                            </span>
                          )}
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

export default AdminSeller;