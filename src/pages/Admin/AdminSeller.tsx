import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaUserTie, FaImage } from "react-icons/fa";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/seller`;

interface Seller {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address: string;
  username?: string;
  citizenship: string;
  pan_no: string;
  status: "pending" | "approved" | "rejected";
  logo?: string;
  business_certificate?: string;
  created_at: string;
}

const AdminSeller: React.FC = () => {
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
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: #f1f5f9; }

        .wrapper { display: flex; min-height: 100vh; }
        .main { flex: 1; display: flex; flex-direction: column; }
        .container { padding: 28px; }

        .headerBox {
          display: flex; justify-content: space-between; align-items: center;
          background: #ffffff; padding: 22px; border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06); margin-bottom: 22px;
          flex-wrap: wrap; gap: 15px;
        }

        .title-section { display: flex; align-items: center; gap: 14px; }
        .header-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #fff; display: flex; align-items: center; justify-content: center;
          border-radius: 14px; font-size: 20px;
        }
        .title { font-size: 23px; font-weight: 700; color: #0f172a; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 3px; }

        .search {
          width: 280px; padding: 10px 14px; border-radius: 10px;
          border: 1px solid #d1d5db; outline: none; font-size: 13px;
        }
        .search:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }

        .tableBox {
          background: #fff; border-radius: 16px; overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        table { width: 100%; border-collapse: collapse; }
        th, td {
          padding: 14px 12px; text-align: left; vertical-align: middle;
        }
        th {
          font-size: 13px; color: #475569; background: #f8fafc; font-weight: 600;
        }
        td { font-size: 13.5px; color: #334155; border-top: 1px solid #f1f5f9; }

        tr:hover { background: #f8fafc; }

        .status {
          padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
        }
        .pending { background: #fef3c7; color: #d97706; }
        .approved { background: #d1fae5; color: #10b981; }
        .rejected { background: #fee2e2; color: #ef4444; }

        .table-img {
          width: 55px; height: 55px; object-fit: cover;
          border-radius: 8px; border: 2px solid #e2e8f0; cursor: zoom-in;
        }

        .cert-link {
          color: #2563eb; text-decoration: none; font-weight: 600;
        }
        .cert-link:hover { text-decoration: underline; }

        .action-btn {
          padding: 6px 14px; border: none; border-radius: 6px;
          font-size: 12.5px; font-weight: 600; cursor: pointer; margin-right: 6px;
        }
        .approve-btn { background: #10b981; color: white; }
        .reject-btn { background: #ef4444; color: white; }

        .empty { text-align: center; padding: 60px 20px; color: #94a3b8; font-size: 14px; }

        /* Zoom Modal */
        .zoom-modal {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.9); display: flex;
          align-items: center; justify-content: center; z-index: 1000;
        }
      `}</style>

      <div className="wrapper">
        <AdminSidebar />
        <div className="main">
          <AdminNavbar />

          <div className="container">
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon"><FaUserTie /></div>
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

                        {/* Logo - Clickable Image */}
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

                        {/* Business Certificate */}
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
                            <span style={{ color: "#64748b", fontSize: "12.5px", fontWeight: 600 }}>
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

export default AdminSeller;
