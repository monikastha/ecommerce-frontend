import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaBoxOpen, FaCheck, FaTimes, FaEyeSlash, FaUpload, FaFlag, FaTrash } from "react-icons/fa";

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

const AssistantProductManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const filtered = useMemo(() => 
    products.filter((product) => {
      const query = search.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        (product.seller_name || "").toLowerCase().includes(query) ||
        (product.category_name || "").toLowerCase().includes(query)
      );
    }), [products, search]
  );

  const updateStatus = async (id: number, action: "approve" | "reject") => {
    if (!window.confirm(`Are you sure you want to ${action} this product?`)) return;
    try {
      const body = action === "reject" 
        ? { rejection_reason: window.prompt("Reason for rejection (optional)") || "" } 
        : {};
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
      alert(error?.response?.data?.error || `Failed to update product`);
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

  const imageUrl = (path?: string) => !path ? "" : path.startsWith("http") ? path : `${API_ORIGIN}${path}`;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        .dashboard-container { background: #f8fafc; min-height: 100vh; }
        .main-content { margin-left: 260px; width: calc(100% - 260px); }
        .container { padding: 30px; }

        /* Greeting Header */
        .greeting {
          font-size: 22px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        .welcome { color: #64748b; font-size: 15px; }

        /* Product Management Card */
        .pm-card {
          margin-top: 30px;
          margin-left: 30px;
          margin-right: 30px;
          background: white;
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .pm-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pm-icon {
          width: 48px;
          height: 48px;
          background: #7c3aed;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .search {
          width: 340px;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          font-size: 15px;
        }
        .search:focus { border-color: #7c3aed; }

        .tableBox {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        table { width: 100%; border-collapse: collapse; }
        th { 
          background: #f8fafc; 
          padding: 18px 14px; 
          text-align: left; 
          font-weight: 600; 
          color: #475569;
          font-size: 14px;
        }
        td { 
          padding: 18px 14px; 
          border-top: 1px solid #f1f5f9; 
          vertical-align: middle;
        }

        tr:hover { background: #f9fafb; }

        .status {
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
        }
        .approved { background: #d1fae5; color: #10b981; }
        .pending { background: #fef3c7; color: #b45309; }
        .rejected { background: #fee2e2; color: #991b1b; }
        .flagged { background: #ffedd5; color: #9a3412; }

        /* Medium Action Buttons */
        .action-btn {
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 4px 6px 4px 0;
        }

        .approve-btn { background: #10b981; color: white; }
        .approve-btn:hover { background: #059669; }

        .reject-btn { background: #ef4444; color: white; }
        .reject-btn:hover { background: #dc2626; }

        .flag-btn { background: #f97316; color: white; }
        .flag-btn:hover { background: #ea580c; }

        .remove-btn { background: #7f1d1d; color: white; }
        .remove-btn:hover { background: #651616; }

        .unpublish-btn { 
          background: #334155; 
          color: white; 
        }
        .unpublish-btn:hover { background: #1e2937; }

        .publish-btn {
          background: #2563eb;
          color: white;
        }
        .publish-btn:hover { background: #1d4ed8; }

        .productImg { 
          width: 50px; 
          height: 50px; 
          object-fit: cover; 
          border-radius: 10px; 
        }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />


            {/* Product Management Header */}
            <div className="pm-card">
              <div className="pm-left">
                <div className="pm-icon">
                  <FaBoxOpen />
                </div>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Product Management</h2>
                  <p style={{ color: "#64748b", marginTop: "2px" }}>Review and manage seller products</p>
                </div>
              </div>

              <input
                type="text"
                className="search"
                placeholder="Search products, seller or category..."
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
                    <tr><td colSpan={11} style={{ textAlign: "center", padding: "80px" }}>Loading products...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={11} style={{ textAlign: "center", padding: "80px" }}>No products found</td></tr>
                  ) : (
                    filtered.map((product) => (
                      <tr key={product.id}>
                        <td><strong>#{product.id}</strong></td>
                        <td>
                          <strong>{product.seller_name}</strong><br/>
                          <small style={{ color: "#64748b" }}>{product.seller_email}</small>
                        </td>
                        <td><strong>{product.name}</strong></td>
                        <td>{product.category_name}</td>
                        <td>Rs. {product.price}</td>
                        <td>{product.quantity}</td>
                        <td>
                          {product.image && <img src={imageUrl(product.image)} alt="" className="productImg" />}
                        </td>
                        <td style={{ maxWidth: "280px" }}>{product.description}</td>
                        <td>
                          <span className={`status ${product.status}`}>{product.status.toUpperCase()}</span>
                        </td>
                        <td>{product.is_published ? "Yes" : "No"}</td>
                        <td>
                          {product.status !== "approved" && (
                            <>
                              <button className="action-btn approve-btn" onClick={() => updateStatus(product.id, "approve")}>
                                <FaCheck /> Approve
                              </button>
                              <button className="action-btn reject-btn" onClick={() => updateStatus(product.id, "reject")}>
                                <FaTimes /> Reject
                              </button>
                            </>
                          )}
                          {product.status !== "flagged" && (
                            <button className="action-btn flag-btn" onClick={() => flagProduct(product.id)}>
                              <FaFlag /> Flag
                            </button>
                          )}
                          <button className="action-btn remove-btn" onClick={() => removeProduct(product.id)}>
                            <FaTrash /> Remove
                          </button>
                          {product.status === "approved" && (
                            product.is_published ? (
                              <button 
                                className="action-btn unpublish-btn"
                                onClick={() => updatePublication(product.id, false)}
                              >
                                <FaEyeSlash /> Unpublish
                              </button>
                            ) : (
                              <button 
                                className="action-btn publish-btn"
                                onClick={() => updatePublication(product.id, true)}
                              >
                                <FaUpload /> Publish
                              </button>
                            )
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
  
    </>
  );
};

export default AssistantProductManagement;
