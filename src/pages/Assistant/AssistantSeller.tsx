import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaUserTie, FaImage, FaSearch } from "react-icons/fa";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/seller`;

type Seller = {
  id: number;
  name: string;
  username?: string;
  email?: string;
  phone: string;
  address: string;
  citizenship: string;
  pan_no?: string;
  status: "pending" | "approved" | "rejected";
  logo?: string;
  business_certificate?: string;
  created_at: string;
};

const Seller: React.FC = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const getFullUrl = (path: string | null) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${path}`;
  };

  const openZoom = (imagePath: string) => setZoomImage(getFullUrl(imagePath));
  const closeZoom = () => setZoomImage(null);

  // Fetch Sellers
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/`);
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
      fetchSellers();
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
    (seller.phone || "").includes(search) ||
    (seller.email || "").toLowerCase().includes(search.toLowerCase())
  );

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

        .status {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 600;
        }

        .pending { background: #fef3c7; color: #d97706; }
        .approved { background: #d1fae5; color: #10b981; }
        .rejected { background: #fee2e2; color: #ef4444; }

        .table-img {
          width: 55px;
          height: 55px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          cursor: zoom-in;
        }

        .cert-link {
          color: #5BBF9A;
          text-decoration: none;
          font-weight: 600;
        }

        .cert-link:hover {
          text-decoration: underline;
        }

        .action-btn {
          padding: 7px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 6px;
        }

        .approve-btn { background: #10b981; color: white; }
        .reject-btn { background: #ef4444; color: white; }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 15px;
        }

        /* Zoom Modal */
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
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon">
                  <FaUserTie />
                </div>
                <div>
                  <h2 className="title">Seller Management</h2>
                  <p className="subtitle">View and manage all seller applications</p>
                </div>
              </div>

              <input
                type="text"
                placeholder="Search by name, email or phone..."
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
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Citizenship</th>
                    <th>Certificate</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={10} className="empty">Loading sellers...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={10} className="empty" style={{ color: "red" }}>{error}</td></tr>
                  ) : filteredSellers.length === 0 ? (
                    <tr><td colSpan={10} className="empty">No sellers found</td></tr>
                  ) : (
                    filteredSellers.map((seller) => (
                      <tr key={seller.id}>
                        <td><strong>{seller.id}</strong></td>

                        {/* Logo */}
                        <td>
                          {seller.logo ? (
                            <img
                              src={getFullUrl(seller.logo)}
                              alt="Logo"
                              className="table-img"
                              onClick={() => openZoom(seller.logo!)}
                            />
                          ) : (
                            <FaImage size={28} color="#94a3b8" />
                          )}
                        </td>

                        <td><strong>{seller.name}</strong></td>
                        <td>{seller.email || "-"}</td>
                        <td>{seller.phone}</td>
                        <td>{seller.address.substring(0, 35)}...</td>
                        <td>{seller.citizenship}</td>

                        {/* Certificate */}
                        <td>
                          {seller.business_certificate ? (
                            <a
                              href={getFullUrl(seller.business_certificate)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cert-link"
                            >
                              📄 View Certificate
                            </a>
                          ) : (
                            "No Document"
                          )}
                        </td>

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
                            <span style={{ color: "#64748b", fontSize: "13px", fontWeight: 600 }}>
                              {seller.status === "approved" ? "✅ Approved" : "❌ Rejected"}
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

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="zoom-modal" onClick={closeZoom}>
          <img
            src={zoomImage}
            alt="Zoomed Logo"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: "12px" }}
          />
        </div>
      )}
    </>
  );
};

export default Seller;