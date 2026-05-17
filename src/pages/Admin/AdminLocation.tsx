import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/locations/`;

interface Location {
  id: number;
  name: string;
  province: string;
  city: string;
  status: string;
}

const AdminLocation: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}?search=${search}`);
      setLocations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await axios.delete(`${API_BASE}${id}/`);
        fetchLocations();
      } catch (err) {
        alert("Failed to delete location");
      }
    }
  };

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        body { background:#f4f6f8; }
        .wrapper { display:flex; min-height:100vh; }
        .main { flex:1; display:flex; flex-direction:column; background:#f4f6f8; }
        .container { padding:28px; }

        .headerBox {
          display:flex; justify-content:space-between; align-items:center;
          background:#fff; padding:22px; border-radius:16px;
          box-shadow:0 8px 20px rgba(0,0,0,0.06); margin-bottom:22px;
          flex-wrap:wrap; gap:15px;
        }
        .title-section { display:flex; align-items:center; gap:14px; }
        .header-icon {
          width:52px; height:52px; background:linear-gradient(135deg,#2563eb,#3b82f6);
          color:#fff; display:flex; align-items:center; justify-content:center;
          border-radius:14px; font-size:20px;
        }
        .title { font-size:23px; font-weight:700; color:#0f172a; }
        .subtitle { font-size:13px; color:#64748b; }

        .search {
          width:280px; padding:11px 14px; border:1px solid #d1d5db;
          border-radius:10px; outline:none; font-size:14px;
        }
        .addBtn {
          background:linear-gradient(135deg,#16a34a,#22c55e); color:white;
          border:none; padding:11px 18px; border-radius:10px;
          cursor:pointer; font-weight:600;
        }

        .tableBox { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.05); }
        th { background:#f8fafc; padding:16px; text-align:left; color:#475569; font-weight:600; }
        td { padding:16px; border-top:1px solid #f1f5f9; color:#334155; }
        tr:hover { background:#f9fafb; }

        .actionBtn {
          border:none; padding:8px 10px; border-radius:6px; color:white;
          cursor:pointer; margin-right:6px; transition:0.2s;
        }
        .editBtn { background:#2563eb; }
        .deleteBtn { background:#dc2626; }
        .actionBtn:hover { transform: translateY(-2px); }

        .status-active { color:#22c55e; font-weight:600; }
        .status-inactive { color:#ef4444; font-weight:600; }
      `}</style>

      <div className="wrapper">
        <AdminSidebar />
        <div className="main">
          <AdminNavbar />
          <div className="container">
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon"><FaMapMarkerAlt /></div>
                <div>
                  <h2 className="title">Location Management</h2>
                  <p className="subtitle">Manage provinces, cities and service areas</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input
                  className="search"
                  placeholder="Search location, province or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="addBtn" onClick={() => navigate("/admin/location/add")}>
                  + Add Location
                </button>
              </div>
            </div>

            <div className="tableBox">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Location Name</th>
                    <th>Province</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>Loading...</td></tr>
                  ) : (
                    locations.map((l) => (
                      <tr key={l.id}>
                        <td>{l.id}</td>
                        <td>{l.name}</td>
                        <td>{l.province}</td>
                        <td>{l.city}</td>
                        <td><span className={l.status === "Active" ? "status-active" : "status-inactive"}>{l.status}</span></td>
                        <td>
                          <button className="actionBtn editBtn" onClick={() => navigate(`/admin/location/update/${l.id}`)}>
                            <FaEdit />
                          </button>
                          <button className="actionBtn deleteBtn" onClick={() => handleDelete(l.id)}>
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
      </div>
    </>
  );
};

export default AdminLocation;