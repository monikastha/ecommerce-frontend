import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

type Product = {
  id: number;
  name: string;
  code?: string;
  category_name?: string;
  price: string;
  quantity: number;
  status: "pending" | "approved" | "rejected";
  is_published: boolean;
  image?: string;
};

export default function SellerProductManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]); // Empty array
  const [loading, setLoading] = useState(true);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Simulate initial loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts([]); // No data
      setLoading(false);
    }, 700);
  }, []);

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const openZoom = (image: string) => setZoomImage(image);
  const closeZoom = () => setZoomImage(null);

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
        .iconBtn.delete { background: #dc2626; }
        .iconBtn:hover { transform: scale(1.08); }

        img.table-img {
          width: 55px; 
          height: 55px; 
          object-fit: cover;
          border-radius: 8px; 
          border: 2px solid #e2e8f0; 
          cursor: zoom-in;
        }

        .zoom-modal {
          position: fixed; 
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.9); 
          display: flex;
          align-items: center; 
          justify-content: center; 
          z-index: 1000;
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
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "80px" }}>
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "80px" }}>
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="table-img"
                            onClick={() => openZoom(product.image!)}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
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
                                      product.status === "rejected" ? "#fee2e2" : "#fef3c7",
                          color: product.status === "approved" ? "#166534" : 
                                 product.status === "rejected" ? "#b91c1c" : "#854d0e"
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

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="zoom-modal" onClick={closeZoom}>
          <img 
            src={zoomImage} 
            alt="Zoomed" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: "12px" }} 
          />
        </div>
      )}
    </>
  );
}