import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaBoxOpen, FaFlag, FaTrash, FaCheck, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import ProductViewModal from "../../components/ProductViewModal";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
    if (!window.confirm("Remove this product permanently?")) return;
    try {
      await axios.delete(`${API_ORIGIN}/api/products/${id}/remove/`);
      fetchProducts();
    } catch (error: any) {
      alert(error?.response?.data?.error || "Failed to remove product");
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      (product.seller_name || "").toLowerCase().includes(query) ||
      (product.category_name || "").toLowerCase().includes(query)
    );
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [search]);
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

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.07);
        }

        th, td {
          padding: 14px 12px;
          color: #475569;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          font-size: 14px;
          vertical-align: middle;
        }

        th {
          background: #f8fafc;
          font-weight: 600;
          color: #334155;
        }

        tr:hover {
          background: #f8fafc;
        }

        .status {
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 600;
          text-transform: capitalize;
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

        /* === Improved Action Buttons === */
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          max-width: 320px;
        }

        .actionBtn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border: none;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .actionBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .approve { background: #16a34a; color: white; }
        .reject { background: #dc2626; color: white; }
        .flag { background: #f97316; color: white; }
        .remove { background: #7f1d1d; color: white; }
        .publish { background: #2563eb; color: white; }
        .unpublish { background: #64748b; color: white; }
        .view { background: #0f766e; color: white; }

        .empty {
          text-align: center;
          padding: 80px 20px;
          color: #94a3b8;
          font-size: 15px;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }

        .pagination button {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          background: #1598ad;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .pagination button:disabled {
          background: #cbd5e1;
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
                  <p className="subtitle">Approve, review, and manage seller products</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search products, sellers, or categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Seller</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th style={{ minWidth: "280px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="empty">Loading products...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={9} className="empty">No products found</td></tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td><strong>#{product.id}</strong></td>
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
                        <span className={`status ${product.status}`}>{product.status}</span>
                      </td>
                      <td>{product.is_published ? "✅ Published" : "❌ Unpublished"}</td>
                      <td>
                        <div className="actions">
                          <button className="actionBtn view" onClick={() => setSelectedProduct(product)}>
                            <FaEye /> View
                          </button>

                          {product.status !== "approved" && (
                            <>
                              <button className="actionBtn approve" onClick={() => updateStatus(product.id, "approve")}>
                                <FaCheck /> Approve
                              </button>
                              <button className="actionBtn reject" onClick={() => updateStatus(product.id, "reject")}>
                                <FaTimes /> Reject
                              </button>
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
                              <button className="actionBtn unpublish" onClick={() => updatePublication(product.id, false)}>
                                <FaEyeSlash /> Unpublish
                              </button>
                            ) : (
                              <button className="actionBtn publish" onClick={() => updatePublication(product.id, true)}>
                                <FaEye /> Publish
                              </button>
                            )
                          )}
                        </div>
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
                  Showing page {currentPage} of {totalPages}
                </span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductViewModal
        product={selectedProduct}
        imageUrl={imageUrl}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default AdminProduct;
