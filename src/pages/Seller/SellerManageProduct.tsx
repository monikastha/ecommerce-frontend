import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaEdit, FaTrash, FaPlus, FaSearch, FaEye } from "react-icons/fa";
import axios from "axios";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";
import ProductViewModal from "../../components/ProductViewModal";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Product = {
  id: number;
  name: string;
  code?: string;
  category_name?: string;
  price: string;
  quantity: number;
  size?: string;
  description?: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  rejection_reason?: string;
  is_published: boolean;
  image?: string;
};

export default function SellerProductManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]); // Empty array
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const imageUrl = (path?: string | null) => !path ? "" : path.startsWith("http") ? path : `${API_ORIGIN}${path}`;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const sellerId = localStorage.getItem("seller_id");
      const url = sellerId ? `${API_ORIGIN}/api/products/?seller=${sellerId}` : `${API_ORIGIN}/api/products/`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      await axios.delete(`${API_ORIGIN}/api/products/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    return products.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      (p.code || "").toLowerCase().includes(query) ||
      (p.category_name || "").toLowerCase().includes(query) ||
      String(p.id).includes(query)
    );
  }, [products, search]);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .wrapper {
          display: flex;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }

        .sidebar {
          width: 260px;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: #445C6D;
          z-index: 100;
        }

        .main {
          margin-left: 260px;
          flex: 1;
          background: #f5f7fa;
          min-height: 100vh;
        }

        .container { 
          padding: 30px; 
        }

        .header {
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 25px; 
          padding: 15px 20px;
          background: white; 
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .titleBox { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .header-icon {
          width: 52px; 
          height: 52px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border-radius: 14px; 
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white; 
          font-size: 22px;
        }
        .titleBox h1 { 
          font-size: 24px; 
          font-weight: 700; 
          margin: 0; 
          color: #0f172a; 
        }
        .titleBox h3 { 
          font-size: 13px; 
          color: #64748b; 
          margin: 4px 0 0 0; 
        }

        .search-container {
          display: flex; 
          align-items: center; 
          gap: 8px;
          background: white; 
          padding: 8px 12px; 
          border-radius: 10px;
          border: 1px solid #e2e8f0; 
          max-width: 320px;
        }
        .searchInput {
          border: none; 
          outline: none; 
          width: 260px; 
          font-size: 14px;
        }

        .addBtn {
          background: linear-gradient(135deg, #ef4444, #f97316); 
          color: white;
          border: none; 
          padding: 10px 18px; 
          border-radius: 10px;
          cursor: pointer; 
          font-weight: 600; 
          display: flex; 
          align-items: center; 
          gap: 6px;
          transition: 0.3s;
        }
        .addBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        table {
          width: 100%; 
          border-collapse: collapse; 
          background: white;
          border-radius: 10px; 
          overflow: hidden; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        th, td {
          padding: 14px; 
          font-size: 14px; 
          color: #475569;
          border-bottom: 1px solid #e5e7eb; 
          text-align: left;
        }
        th { 
          background: #f8fafc; 
          font-weight: 600; 
        }

        .actions { 
          display: flex; 
          gap: 8px; 
        }
        .iconBtn {
          width: 34px; 
          height: 34px; 
          border: none; 
          border-radius: 8px;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer; 
          font-size: 15px; 
          color: white;
          transition: 0.2s;
        }
        .iconBtn.edit { background: #2563eb; }
        .iconBtn.view { background: #0f766e; }
        .iconBtn.delete { background: #dc2626; }
        .iconBtn:hover { transform: scale(1.08); }

        .review-reason {
          margin-top: 8px;
          max-width: 220px;
          border-left: 3px solid #f97316;
          background: #fff7ed;
          color: #9a3412;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.45;
        }

        .review-reason.rejected {
          border-left-color: #dc2626;
          background: #fef2f2;
          color: #991b1b;
        }

        .review-reason strong {
          display: block;
          margin-bottom: 2px;
          color: inherit;
        }

        img.table-img {
          width: 55px; 
          height: 55px; 
          object-fit: cover;
          border-radius: 8px; 
          border: 2px solid #e2e8f0; 
          cursor: zoom-in;
        }

      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <SellerSidebar />
        </div>

        <div className="main">
          <SellerNavbar />

          <div className="container">
            <div className="header">
              <div className="titleBox">
                <div className="header-icon">
                  <FaBox />
                </div>
                <div>
                  <h1>Product Management</h1>
                  <h3>Manage your store products</h3>
                </div>
              </div>

              <button className="addBtn" onClick={() => navigate("/seller/product/add")}>
                <FaPlus /> Add New Product
              </button>
            </div>

            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: "20px" }}>
              <FaSearch style={{ color: "#94a3b8" }} />
              <input
                type="text"
                className="searchInput"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Products Table */}
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "80px" }}>
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "80px" }}>
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td><strong>{product.name}</strong></td>
                      <td>{product.category_name || "-"}</td>
                      <td>Rs. {product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <span style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: product.status === "approved" ? "#dcfce7" : 
                                      product.status === "rejected" ? "#fee2e2" :
                                      product.status === "flagged" ? "#ffedd5" : "#fef3c7",
                          color: product.status === "approved" ? "#166534" : 
                                 product.status === "rejected" ? "#b91c1c" :
                                 product.status === "flagged" ? "#9a3412" : "#854d0e"
                        }}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: product.is_published ? "#16a34a" : "#64748b" }}>
                          {product.is_published ? "Yes" : "No"}
                        </strong>
                      </td>
                      <td className="actions">
                        <button
                          className="iconBtn view"
                          onClick={() => setSelectedProduct(product)}
                          title="View product"
                          aria-label="View product"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="iconBtn edit" 
                          onClick={() => navigate(`/seller/product/edit/${product.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="iconBtn delete" 
                          onClick={() => handleDelete(product.id, product.name)}
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

      <ProductViewModal
        product={selectedProduct}
        imageUrl={imageUrl}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
