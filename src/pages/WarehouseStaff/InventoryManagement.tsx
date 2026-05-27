import { useState, useEffect } from "react";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

type Product = {
  id: number | string;
  product_name: string;
  category_name?: string;
  productcategory?: number;
  quantity: number;
  availability_status: string;
};

type Category = {
  id: number;
  name: string;
};

const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState<number | string | null>(null);

  const API_BASE = "http://localhost:8000/api/warehouse/stock/";
  const CATEGORY_API = "http://localhost:8000/api/productcategory/categories/";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_BASE);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getStatus = (stock: number) => {
    if (stock <= 0) return "Out of Stock";
    if (stock < 15) return "Low Stock";
    return "In Stock";
  };

  const getStatusColor = (status: string) => {
    if (status === "Out of Stock") return "#ef4444";
    if (status === "Low Stock") return "#f97316";
    return "#22c55e";
  };

  const resetForm = () => {
    setForm({ name: "", category: "", stock: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.category || !form.stock) {
      alert("Please fill all fields");
      return;
    }

    const stockNum = Number(form.stock);
    const payload = {
      product_name: form.name.trim(),
      quantity: stockNum,
      productcategory: Number(form.category),
      availability_status: getStatus(stockNum),
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE}${editingId}/`, payload);
      } else {
        await axios.post(API_BASE, payload);
      }
      fetchProducts();
      resetForm();
      alert("Product saved successfully!");
    } catch (error: any) {
      console.error(error.response?.data);
      alert("Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.product_name,
      category: String(product.productcategory || ""),
      stock: product.quantity.toString(),
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`${API_BASE}${id}/`);
        fetchProducts();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading Inventory...</div>;

  return (
    <>
      <style>{`
        .layout { display:flex; min-height:100vh; background:#f1f5f9; }
        .main { flex:1; display:flex; flex-direction:column; }
        .content { padding:20px; flex:1; }

        .header { margin-bottom:24px; }
        .main-content { display: flex; gap: 24px; height: calc(100vh - 160px); }

        .table-section { flex: 7; }
        .form-section { flex: 3; min-width: 380px; }

        .form-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          height: 100%;
        }

        .form { display: grid; gap: 16px; }
        .form label { font-size: 13px; color: #475569; margin-bottom: 6px; font-weight: 500; }
        .form input, .form select {
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          width: 100%;
        }

        table {
          width: 100%;
          background: white;
          border-collapse: collapse;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        th, td { padding: 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; font-weight: 600; color: #64748b; }

        .badge {
          padding: 6px 12px;
          border-radius: 9999px;
          color: white;
          font-size: 13px;
          font-weight: 500;
        }

        .actions button {
          padding: 8px;
          border-radius: 6px;
          margin-right: 6px;
        }

        /* Smaller Add/Update Buttons */
        .submit-btn {
          padding: 10px 16px !important;
          font-size: 14px !important;
          border-radius: 8px;
        }
      `}</style>

      <div className="layout">
        <WarehouseStaffSidebar />
        <div className="main">
          <WarehouseStaffNavbar />

          <div className="content">
            <div className="header">
              <h2>Inventory Management</h2>
            </div>

            <div className="main-content">
              {/* Table */}
              <div className="table-section">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                          No products yet. Add your first product from the right panel.
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td><strong>{p.product_name}</strong></td>
                          <td>{p.category_name || "N/A"}</td>
                          <td><strong>{p.quantity}</strong></td>
                          <td>
                            <span className="badge" style={{ background: getStatusColor(p.availability_status) }}>
                              {p.availability_status}
                            </span>
                          </td>
                          <td className="actions">
                            <button onClick={() => handleEdit(p)} style={{ background: "#3b82f6", color: "white" }}>
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(p.id)} style={{ background: "#ef4444", color: "white" }}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Form */}
              <div className="form-section">
                <div className="form-card">
                  <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

                  <div className="form">
                    <div>
                      <label>Product Name *</label>
                      <input 
                        value={form.name} 
                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                        placeholder="Enter product name" 
                      />
                    </div>

                    <div>
                      <label>Category *</label>
                      <select 
                        value={form.category} 
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>Stock Quantity *</label>
                      <input 
                        type="number" 
                        value={form.stock} 
                        onChange={(e) => setForm({ ...form, stock: e.target.value })} 
                        placeholder="Quantity in stock" 
                      />
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <button 
                        onClick={handleSubmit} 
                        className="submit-btn"
                        style={{ 
                          background: "#2563eb", 
                          color: "white", 
                          width: "100%", 
                          padding: "10px 16px",
                          fontSize: "14px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px"
                        }}
                      >
                        <FaPlus /> {editingId ? "Update Product" : "Add Product"}
                      </button>

                      {editingId && (
                        <button 
                          onClick={resetForm} 
                          style={{ 
                            background: "#64748b", 
                            color: "white", 
                            width: "100%", 
                            marginTop: "10px", 
                            padding: "10px 16px",
                            fontSize: "14px",
                            borderRadius: "8px" 
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;