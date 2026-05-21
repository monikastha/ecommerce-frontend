import { useState } from "react";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  status: string;
};

const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: "#P101", name: "Rice 25kg", category: "Food", stock: 50, status: "High" },
    { id: "#P102", name: "Cooking Oil", category: "Food", stock: 10, status: "Low" },
    { id: "#P103", name: "Soap Pack", category: "Hygiene", stock: 30, status: "Medium" },
  ]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
  });

  const handleAdd = () => {
    if (!form.name || !form.category || !form.stock) return;

    const stockNum = Number(form.stock);

    const newProduct: Product = {
      id: "#P" + Math.floor(Math.random() * 1000),
      name: form.name,
      category: form.category,
      stock: stockNum,
      status:
        stockNum < 15 ? "Low" : stockNum < 40 ? "Medium" : "High",
    };

    setProducts([...products, newProduct]);

    setForm({ name: "", category: "", stock: "" });
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const getColor = (status: string) => {
    if (status === "Low") return "#ef4444";
    if (status === "Medium") return "#f97316";
    return "#22c55e";
  };

  return (
    <>
      <style>{`
        .layout { display:flex; min-height:100vh; background:#f1f5f9; }
        .main { flex:1; display:flex; flex-direction:column; }
        .content { padding:20px; }

        .header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:15px;
        }

        .form {
          display:flex;
          gap:10px;
          margin-bottom:15px;
        }

        .form input {
          padding:8px;
          border:1px solid #e2e8f0;
          border-radius:8px;
        }

        .form button {
          background:#2563eb;
          color:white;
          border:none;
          padding:8px 14px;
          border-radius:8px;
          cursor:pointer;
        }

        table {
          width:100%;
          background:white;
          border-collapse:collapse;
          border-radius:12px;
          overflow:hidden;
        }

        th, td {
          padding:12px;
          border-bottom:1px solid #e2e8f0;
          text-align:left;
        }

        th {
          background:#f8fafc;
          font-size:12px;
          color:#64748b;
        }

        .badge {
          padding:4px 10px;
          border-radius:20px;
          color:white;
          font-size:12px;
        }

        .actions button {
          margin-right:6px;
          border:none;
          padding:6px;
          border-radius:6px;
          cursor:pointer;
        }

        .edit { background:#3b82f6; color:white; }
        .delete { background:#ef4444; color:white; }
      `}</style>

      <div className="layout">
        <WarehouseStaffSidebar />

        <div className="main">
          <WarehouseStaffNavbar />

          <div className="content">

            {/* HEADER */}
            <div className="header">
              <h2>Inventory Management</h2>
            </div>

            {/* ADD FORM */}
            <div className="form">
              <input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />

              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />

              <button onClick={handleAdd}>
                <FaPlus /> Add
              </button>
            </div>

            {/* TABLE */}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.stock}</td>

                    <td>
                      <span
                        className="badge"
                        style={{ background: getColor(p.status) }}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="actions">
                      <button className="edit">
                        <FaEdit />
                      </button>

                      <button
                        className="delete"
                        onClick={() => handleDelete(p.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;