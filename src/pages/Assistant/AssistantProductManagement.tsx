import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaBoxOpen } from "react-icons/fa";

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
  status: "pending" | "approved" | "rejected";
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

  const imageUrl = (path?: string) => !path ? "" : path.startsWith("http") ? path : `${API_ORIGIN}${path}`;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        .dashboard-container { background: #f4f6f8; min-height: 100vh; }
        .main-content { margin-left: 250px; width: calc(100% - 250px); min-height: 100vh; }
        .container { padding: 25px 30px; }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 22px 26px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .title-section { display: flex; align-items: center; gap: 14px; }
        .header-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #5BBF9A, #4DA88A);
          color: white;
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px; font-size: 22px;
        }

        .title { font-size: 24px; font-weight: 700; color: #1f2937; }
        .subtitle { font-size: 14px; color: #64748b; }

        .search {
          width: 320px;
          padding: 11px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
        }
        .search:focus { border-color: #5BBF9A; }

        .tableBox {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        table { width: 100%; border-collapse: collapse; }
        th { background: #f8fafc; padding: 16px 14px; text-align: left; font-weight: 600; color: #475569; }
        td { padding: 16px 14px; border-top: 1px solid #f1f5f9; }
        tr:hover { background: #f8fafc; }

        .status { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
        .pending { background: #fef3c7; color: #d97706; }
        .approved { background: #d1fae5; color: #10b981; }
        .rejected { background: #fee2e2; color: #ef4444; }

        .btn {
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          margin-right: 6px;
        }
        .approve { background: #10b981; }
        .reject { background: #ef4444; }
        .publish { background: #2563eb; }
        .unpublish { background: #64748b; }
        .approvedLabel { display: inline-block; padding: 8px 14px; margin-right: 6px; border-radius: 8px; background: #d1fae5; color: #047857; font-size: 13px; font-weight: 700; }
        .productImg { width: 52px; height: 52px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />
        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon"><FaBoxOpen /></div>
                <div>
                  <h2 className="title">Product Management</h2>
                  <p className="subtitle">Review and manage seller products</p>
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
                    <tr><td colSpan={11} style={{ textAlign: "center", padding: "60px" }}>Loading products...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={11} style={{ textAlign: "center", padding: "60px" }}>No products found</td></tr>
                  ) : (
                    filtered.map((product) => (
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
                        <td>{product.image ? <img src={imageUrl(product.image)} alt={product.name} className="productImg" /> : "-"}</td>
                        <td style={{ maxWidth: "260px", whiteSpace: "normal" }}>{product.description || "-"}</td>
                        <td><span className={`status ${product.status}`}>{product.status.toUpperCase()}</span></td>
                        <td>{product.is_published ? "published" : "unpublished"}</td>
                        <td>
                          {product.status === "approved" ? (
                            <span className="approvedLabel">Approved</span>
                          ) : (
                            <>
                              <button className="btn approve" onClick={() => updateStatus(product.id, "approve")}>Approve</button>
                              <button className="btn reject" onClick={() => updateStatus(product.id, "reject")}>Reject</button>
                            </>
                          )}
                          {product.is_published ? (
                            <button className="btn unpublish" onClick={() => updatePublication(product.id, false)}>Unpublish</button>
                          ) : (
                            <button className="btn publish" onClick={() => updatePublication(product.id, true)}>Publish</button>
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

export default AssistantProductManagement;
