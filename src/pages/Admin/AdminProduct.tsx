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

  const imageUrl = (path?: string) => !path ? "" : path.startsWith("http") ? path : `${API_ORIGIN}${path}`;

  return (
    <>
      <style>{`
        *{ margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        .wrapper{ display:flex; }
        .sidebar{ width:260px; position:fixed; top:0; left:0; height:100vh; }
        .main{ flex:1; margin-left:260px; background:#ffffff; min-height:100vh; }
        .container{ padding:25px; }
        .headerBox{ display:flex; justify-content:space-between; align-items:center; background:#fff; padding:20px 22px; border-radius:14px; margin-bottom:18px; box-shadow:0 8px 20px rgba(0,0,0,0.06); flex-wrap:wrap; gap:15px; }
        .title-section{ display:flex; align-items:center; gap:14px; }
        .header-icon{ width:52px; height:52px; background:linear-gradient(135deg,#2563eb,#3b82f6); color:#fff; display:flex; align-items:center; justify-content:center; border-radius:14px; font-size:20px; }
        .title{ font-size:22px; font-weight:700; color:#0f172a; }
        .subtitle{ font-size:13px; color:#6b7280; margin-top:4px; }
        .search{ width:240px; padding:10px 12px; border-radius:10px; border:1px solid #d1d5db; outline:none; font-size:13px; }
        .headerActions{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .addBtn{ display:flex; align-items:center; gap:7px; border:none; border-radius:10px; padding:10px 14px; background:#2563eb; color:white; font-weight:700; cursor:pointer; }
        .tableBox{ background:#fff; padding:15px; border-radius:14px; box-shadow:0 8px 20px rgba(0,0,0,0.05); overflow-x:auto; }
        table{ width:100%; border-collapse:collapse; min-width:900px; }
        th{ text-align:left; padding:14px; font-size:13px; background:#f8fafc; color:#475569; }
        td{ padding:14px; border-top:1px solid #f1f5f9; font-size:13px; color:#334155; vertical-align:middle; }
        tr:hover{ background:#f9fafb; }
        .empty{ text-align:center; padding:35px; color:#94a3b8; font-size:13px; }
        .status{ padding:5px 11px; border-radius:999px; font-size:12px; font-weight:700; }
        .pending{ background:#fef3c7; color:#b45309; }
        .approved{ background:#dcfce7; color:#166534; }
        .rejected{ background:#fee2e2; color:#991b1b; }
        .flagged{ background:#ffedd5; color:#9a3412; }
        .productImg{ width:52px; height:52px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0; }
        .actionBtn{ border:none; border-radius:7px; color:white; padding:7px 10px; margin-right:6px; cursor:pointer; font-weight:600; font-size:12px; }
        .approve{ background:#16a34a; }
        .reject{ background:#dc2626; }
        .flag{ background:#f97316; }
        .remove{ background:#7f1d1d; }
        .publish{ background:#2563eb; }
        .unpublish{ background:#64748b; }
        .approvedLabel{ display:inline-block; padding:7px 10px; margin-right:6px; border-radius:7px; background:#dcfce7; color:#166534; font-size:12px; font-weight:700; }
      `}</style>

      <div className="wrapper">
        <div className="sidebar"><AdminSidebar /></div>
        <div className="main">
          <AdminNavbar />
          <div className="container">
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon"><FaBoxOpen /></div>
                <div>
                  <h2 className="title">Product Management</h2>
                  <p className="subtitle">Approve, reject, and review seller products</p>
                </div>
              </div>
              <div className="headerActions">
                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="search" />
              </div>
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
                    <tr><td colSpan={11} className="empty">Loading products...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan={11} className="empty">No product data available</td></tr>
                  ) : (
                    filteredProducts.map((product) => (
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
                        <td>{product.image ? <img src={imageUrl(product.image)} alt={product.name} className="productImg" /> : "-"}</td>
                        <td style={{ maxWidth: "260px", whiteSpace: "normal" }}>{product.description || "-"}</td>
                        <td>
                          <span className={`status ${product.status}`}>{product.status.toUpperCase()}</span>
                        </td>
                        <td>{product.is_published ? "published" : "unpublished"}</td>
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
                            <button className="actionBtn flag" onClick={() => flagProduct(product.id)}><FaFlag /> Flag</button>
                          )}
                          <button className="actionBtn remove" onClick={() => removeProduct(product.id)}><FaTrash /> Remove</button>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProduct;
