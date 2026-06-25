import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaEdit, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const STOCK_API = `${API_ORIGIN}/api/warehouse/stock/`;
const PRODUCT_API = `${API_ORIGIN}/api/products/`;

type Product = {
  id: number;
  name: string;
  category_name?: string;
  price: string;
};

type StockItem = {
  id: number;
  product: number;
  product_name: string;
  category_name?: string;
  quantity: number;
  availability_status: "in_stock" | "low_stock" | "out_of_stock";
  available_to_buyers: boolean;
};

const statusLabel = (status: StockItem["availability_status"]) => {
  if (status === "out_of_stock") return "Out of Stock";
  if (status === "low_stock") return "Low Stock";
  return "In Stock";
};

const statusColor = (status: StockItem["availability_status"]) => {
  if (status === "out_of_stock") return "#ef4444";
  if (status === "low_stock") return "#f97316";
  return "#22c55e";
};

export default function InventoryManagement() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    product: "",
    quantity: "",
  });

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === form.product),
    [form.product, products]
  );

  const fetchInventory = async () => {
    const [stockRes, productRes] = await Promise.allSettled([
      axios.get(STOCK_API),
      axios.get(PRODUCT_API),
    ]);

    if (stockRes.status === "fulfilled") {
      setStocks(Array.isArray(stockRes.value.data) ? stockRes.value.data : []);
    } else {
      console.error("Failed to load stock data", stockRes.reason);
      setStocks([]);
    }

    if (productRes.status === "fulfilled") {
      setProducts(Array.isArray(productRes.value.data) ? productRes.value.data : []);
    } else {
      console.error("Failed to load product data", productRes.reason);
      setProducts([]);
    }

  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchInventory();
      } catch (error) {
        console.error(error);
        alert("Some inventory data failed to load. Check backend server and migrations.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetForm = () => {
    setForm({ product: "", quantity: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const quantity = Number(form.quantity);
    if (!form.product || Number.isNaN(quantity) || quantity < 0) {
      alert("Select product and enter a valid stock quantity.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        product: Number(form.product),
        quantity,
      };

      if (editingId) {
        await axios.patch(`${STOCK_API}${editingId}/`, payload);
      } else {
        await axios.post(STOCK_API, payload);
      }

      await fetchInventory();
      resetForm();
      alert("Inventory saved successfully.");
    } catch (error: any) {
      console.error(error.response?.data || error);
      alert("Failed to save inventory.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: StockItem) => {
    setEditingId(item.id);
    setForm({
      product: String(item.product),
      quantity: String(item.quantity),
    });
  };

  const handleBuyerAvailabilityChange = async (item: StockItem, checked: boolean) => {
    try {
      await axios.patch(`${STOCK_API}${item.id}/`, {
        available_to_buyers: checked,
      });
      await fetchInventory();
    } catch (error) {
      console.error(error);
      alert("Failed to update buyer availability.");
    }
  };

  const handleReduce = async (item: StockItem) => {
    const value = window.prompt(`Reduce stock for ${item.product_name} by:`, "1");
    if (!value) return;
    const quantity = Number(value);
    if (Number.isNaN(quantity) || quantity < 1) {
      alert("Enter a valid quantity to reduce.");
      return;
    }

    try {
      await axios.post(`${STOCK_API}${item.id}/reduce/`, { quantity });
      await fetchInventory();
    } catch (error) {
      console.error(error);
      alert("Failed to reduce stock.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this inventory record?")) return;
    try {
      await axios.delete(`${STOCK_API}${id}/`);
      await fetchInventory();
    } catch (error) {
      console.error(error);
      alert("Failed to delete inventory record.");
    }
  };

  if (loading) {
    return <div style={{ padding: 50, textAlign: "center" }}>Loading Inventory...</div>;
  }

  return (
    <>
      <style>{`
        .layout { display:flex; min-height:100vh; background:#f1f5f9; font-family:'Poppins',sans-serif; }
        .main { flex:1; display:flex; flex-direction:column; min-width:0; }
        .content { padding:20px; flex:1; }
        .header { margin-bottom:20px; }
        .main-content { display:grid; grid-template-columns:minmax(0,1fr) 380px; gap:24px; align-items:start; }
        .panel { background:white; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1); overflow:hidden; }
        .form-card { background:white; padding:24px; border-radius:12px; box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .form { display:grid; gap:16px; }
        .form label { display:block; font-size:13px; color:#475569; margin-bottom:6px; font-weight:600; }
        .form input, .form select { padding:10px 12px; border:1px solid #e2e8f0; border-radius:8px; width:100%; outline:none; }
        table { width:100%; border-collapse:collapse; }
        th, td { padding:14px 16px; text-align:left; border-bottom:1px solid #e2e8f0; vertical-align:middle; }
        th { background:#f8fafc; font-weight:700; color:#64748b; font-size:13px; }
        .badge { padding:6px 12px; border-radius:9999px; color:white; font-size:12px; font-weight:700; display:inline-flex; }
        .actions { display:flex; gap:7px; }
        .actions button { width:34px; height:34px; border:0; border-radius:7px; color:white; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; }
        .submit-btn { border:0; color:white; width:100%; padding:11px 16px; border-radius:8px; font-weight:800; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; }
      `}</style>

      <div className="layout">
        <WarehouseStaffSidebar />
        <div className="main">
          <WarehouseStaffNavbar />
          <div className="content">
            <div className="header">
              <h2>Inventory Management</h2>
              <p style={{ color: "#64748b", marginTop: 4 }}>
                Store stock by seller product and control which inventory is available to buyers.
              </p>
            </div>

            <div className="main-content">
              <div className="panel">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Available to Buyers</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: 50, color: "#64748b" }}>
                          No inventory yet. Add product stock from the right panel.
                        </td>
                      </tr>
                    ) : (
                      stocks.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.product_name}</strong></td>
                          <td>{item.category_name || "N/A"}</td>
                          <td><strong>{item.quantity}</strong></td>
                          <td>
                            <span className="badge" style={{ background: statusColor(item.availability_status) }}>
                              {statusLabel(item.availability_status)}
                            </span>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={item.available_to_buyers}
                              onChange={(event) => handleBuyerAvailabilityChange(item, event.target.checked)}
                              title={item.available_to_buyers ? "Available to buyers" : "Not available to buyers"}
                              style={{ width: 18, height: 18, accentColor: "#22c55e", cursor: "pointer" }}
                            />
                          </td>
                          <td className="actions">
                            <button onClick={() => handleEdit(item)} style={{ background: "#2563eb" }} title="Update stock">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleReduce(item)} style={{ background: "#f97316" }} title="Reduce stock">
                              <FaMinus />
                            </button>
                            <button onClick={() => handleDelete(item.id)} style={{ background: "#ef4444" }} title="Delete">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="form-card">
                <h3>{editingId ? "Update Inventory" : "Add Inventory"}</h3>
                <div className="form" style={{ marginTop: 18 }}>
                  <div>
                    <label>Seller Product *</label>
                    <select
                      value={form.product}
                      onChange={(e) => setForm({ ...form, product: e.target.value })}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Category</label>
                    <input
                      value={selectedProduct?.category_name || ""}
                      readOnly
                      placeholder="Category appears after selecting product"
                    />
                  </div>

                  <div>
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      min={0}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="Quantity in stock"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="submit-btn"
                    style={{ background: saving ? "#93c5fd" : "#2563eb" }}
                  >
                    <FaPlus /> {saving ? "Saving..." : editingId ? "Update Stock" : "Save Stock"}
                  </button>

                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="submit-btn"
                      style={{ background: "#64748b" }}
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
    </>
  );
}
