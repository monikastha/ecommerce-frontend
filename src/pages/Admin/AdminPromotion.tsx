import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaGift, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

interface Promotion {
  id: number;
  name: string;
  d_type: string;
  d_value: number | null;
  applies_to: string;
  categories: number[];
  start_date: string;
  end_date: string;
  status: string;
}
const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin/promotions`;

const AdminPromotion: React.FC = () => {
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch(`${API_BASE}`);
      const data = await res.json();

      if (res.ok) setPromotions(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async (id: number) => {
    if (!window.confirm("Delete promotion?")) return;

    try {
      const res = await fetch(`${API_BASE}${id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPromotions((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = promotions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .wrapper { display:flex; min-height:100vh; }

        .main {
          flex:1;
          background:#f5f7fa;
        }

        .container {
          padding:30px;
        }

        /* SAME CATEGORY HEADER STYLE */
        .header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:25px;
          padding:15px 20px;
          background:white;
          border-radius:12px;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
        }

        .titleBox {
          display:flex;
          align-items:center;
          gap:12px;
        }

        .header-icon {
          width:52px;
          height:52px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:14px;
          background:linear-gradient(135deg,#2563eb,#3b82f6);
          color:white;
          font-size:22px;
        }

        .search-container {
          display:flex;
          align-items:center;
          gap:8px;
          padding:8px 12px;
          border:1px solid #e2e8f0;
          border-radius:10px;
          background:white;
        }

        .searchInput {
          border:none;
          outline:none;
          font-size:14px;
        }

        .addBtn {
          background:linear-gradient(135deg,#16a34a,#22c55e);
          color:white;
          border:none;
          padding:10px 16px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          display:flex;
          align-items:center;
          gap:6px;
        }

        /* TABLE SAME AS CATEGORY */
        table {
          width:100%;
          border-collapse:collapse;
          background:white;
          border-radius:10px;
          overflow:hidden;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
        }

        th, td {
          padding:14px;
          border-bottom:1px solid #e5e7eb;
          text-align:left;
          font-size:14px;
        }

        th {
          background:#f8fafc;
        }

        .status {
          padding:5px 12px;
          border-radius:20px;
          font-size:12px;
        }

        .active { background:#dcfce7; color:#166534; }
        .inactive { background:#fef3c7; color:#854d0e; }
        .expired { background:#fee2e2; color:#b91c1c; }

        .actions {
          display:flex;
          gap:8px;
        }

        .iconBtn {
          width:34px;
          height:34px;
          border:none;
          border-radius:8px;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          color:white;
        }

        .edit { background:#2563eb; }
        .delete { background:#dc2626; }
      `}</style>

      <div className="wrapper">
        <AdminSidebar />

        <div className="main">
          <AdminNavbar />

          <div className="container">

            {/* HEADER */}
            <div className="header">

              <div className="titleBox">
                <div className="header-icon">
                  <FaGift />
                </div>
                <div>
                  <h2>Promotion Management</h2>
                  <p style={{ fontSize: 13, color: "#64748b" }}>
                    Manage all promotions
                  </p>
                </div>
              </div>

              <div className="search-container">
                <FaSearch />
                <input
                  className="searchInput"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="addBtn"
                onClick={() => navigate("/admin/promotion/add")}
              >
                <FaPlus /> Add Promotions
              </button>

            </div>

            {/* TABLE */}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Applies To</th>
                  <th>Categories</th>
                  <th>Status</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: 40 }}>
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: 40 }}>
                      No promotions found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id}>

                      <td>{p.name}</td>

                      <td>{p.d_type}</td>

                      <td>
                        {p.d_type === "percentage"
                          ? `${p.d_value ?? 0}%`
                          : `Rs. ${p.d_value ?? 0}`}
                      </td>

                      <td>
                        {p.applies_to === "all" ? "All Products" : "Category"}
                      </td>

                      <td>
                        {p.categories?.length > 0
                          ? `${p.categories.length} selected`
                          : "-"}
                      </td>

                      <td>
                        <span className={`status ${p.status}`}>
                          {p.status}
                        </span>
                      </td>

                      <td>
                        {new Date(p.start_date).toLocaleDateString()}
                      </td>

                      <td>
                        {new Date(p.end_date).toLocaleDateString()}
                      </td>

                      <td className="actions">

                        <button
                          className="iconBtn edit"
                          onClick={() =>
                            navigate(`/admin/promotion/edit/${p.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="iconBtn delete"
                          onClick={() => deletePromotion(p.id)}
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
    </>
  );
};

export default AdminPromotion;