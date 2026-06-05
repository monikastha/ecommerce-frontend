import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaBoxOpen, FaFlag, FaTrash } from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Product = {
  id: number;
  seller_name?: string;
  seller_email?: string;
  name: string;
  code?: string;
  category_name?: string;
  price: string;
  quantity: number;
  description?: string;
  image?: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  is_published: boolean;
};

const AdminProduct: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_ORIGIN}/api/products/`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStatus = async (id: number, action: "approve" | "reject") => {
    if (!window.confirm(`${action === "approve" ? "Approve" : "Reject"} this product?`)) return;
    try {
      const body = action === "reject"
        ? { rejection_reason: window.prompt("Reason for rejection (optional)") || "" }
        : undefined;
      await axios.post(`${API_ORIGIN}/api/products/${id}/${action}/`, body);
      fetchProducts();
    } catch (error: any) {
      alert(error?.response?.data?.error || `Failed to ${action} product`);
    }
  };

  const updatePublication = async (id: number, publish: boolean) => {
    if (!window.confirm(`${publish ? "Publish" : "Unpublish"} this product?`)) return;
    try {
      await axios.post(`${API_ORIGIN}/api/products/${id}/${publish ? "publish" : "unpublish"}/`);
      fetchProducts();
    } catch (error: any) {
      alert(error?.response?.data?.error || `Failed to ${publish ? "publish" : "unpublish"} product`);
    }
  };

  const flagProduct = async (id: number) => {
    if (!window.confirm("Flag this product as inappropriate?")) return;
    try {
      const reason = window.prompt("Reason for flagging (optional)") || "";
      await axios.post(`${API_ORIGIN}/api/products/${id}/flag/`, { reason });
      fetchProducts();
    } catch (error: any) {
      alert(error?.response?.data?.error || "Failed to flag product");
    }
  };

  const removeProduct = async (id: number) => {
    if (!window.confirm("Remove this inappropriate product permanently?")) return;
    try {
      await axios.delete(`${API_ORIGIN}/api/products/${id}/remove/`);
      fetchProducts();
    } catch (error: any) {
      alert(error?.response?.data?.error || "Failed to remove product");
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const query = search.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          (product.seller_name || "").toLowerCase().includes(query) ||
          (product.category_name || "").toLowerCase().includes(query)
        );
      }),
    [products, search]
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const imageUrl = (path?: string) => 
    !path ? "" : path.startsWith("http") ? path : `${API_ORIGIN}${path}`;

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

        .search {
          width: 320px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 14px;
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
          vertical-align: middle;
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
        .pending { background: #fef3c7; color: #d97706; }
        .approved { background: #d1fae5; color: #10b981; }
        .rejected { background: #fee2e2; color: #ef4444; }
        .flagged { background: #ffedd5; color: #f97316; }

        .productImg {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .actionBtn {
          border: none;
          border-radius: 6px;
          color: white;
          padding: 6px 10px;
          margin-right: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }
        .approve { background: #16a34a; }
        .reject { background: #dc2626; }
        .flag { background: #f97316; }
        .remove { background: #7f1d1d; }
        .publish { background: #2563eb; }
        .unpublish { background: #64748b; }

        .approvedLabel {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          background: #d1fae5;
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
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
        <div className="sidebar">
          <AdminSidebar />
        </div>
        <div className="main">
          <AdminNavbar />
          <div className="container">
            {/* Header */}
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon"><FaBoxOpen /></div>
                <div>
                  <h2 className="title">Product Management</h2>
                  <p className="subtitle">Approve, reject, and review seller products</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />
            </div>

            {/* Table - Now consistent with AdminStaff (no tableBox) */}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Seller</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={11} className="empty">Loading products...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={11} className="empty">No product data available</td></tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>#{product.id}</td>
                      <td>
                        <strong>{product.seller_name || "-"}</strong>
                        {product.seller_email && <div style={{ color: "#64748b", fontSize: "12px" }}>{product.seller_email}</div>}
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        {product.code && <div style={{ color: "#64748b", fontSize: "12px" }}>Code: {product.code}</div>}
                      </td>
                      <td>{product.category_name || "-"}</td>
                      <td>Rs. {product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        {product.image ? (
                          <img src={imageUrl(product.image)} alt={product.name} className="productImg" />
                        ) : "-"}
                      </td>
                      <td style={{ maxWidth: "260px", whiteSpace: "normal" }}>{product.description || "-"}</td>
                      <td>
                        <span className={`status ${product.status}`}>{product.status.toUpperCase()}</span>
                      </td>
                      <td>{product.is_published ? "✅ Published" : "❌ Unpublished"}</td>
                      <td>
                        {product.status === "approved" ? (
                          <span className="approvedLabel">Approved</span>
                        ) : (
                          <>
                            <button className="actionBtn approve" onClick={() => updateStatus(product.id, "approve")}>Approve</button>
                            <button className="actionBtn reject" onClick={() => updateStatus(product.id, "reject")}>Reject</button>
                          </>
                        )}
                        {product.status !== "flagged" && (
                          <button className="actionBtn flag" onClick={() => flagProduct(product.id)}>
                            <FaFlag /> Flag
                          </button>
                        )}
                        <button className="actionBtn remove" onClick={() => removeProduct(product.id)}>
                          <FaTrash /> Remove
                        </button>
                        {product.status === "approved" && (
                          product.is_published ? (
                            <button className="actionBtn unpublish" onClick={() => updatePublication(product.id, false)}>Unpublish</button>
                          ) : (
                            <button className="actionBtn publish" onClick={() => updatePublication(product.id, true)}>Publish</button>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
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

export default AdminProduct;