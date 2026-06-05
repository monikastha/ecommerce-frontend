import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaEdit, FaMapMarkerAlt, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const LOCATION_API = `${API_ORIGIN}/api/locations/`;
const RULE_API = `${API_ORIGIN}/api/delivery-charge-rules/`;

interface Location {
  id: number;
  name: string;
  province: string;
  city: string;
  status: string;
}

interface DeliveryChargeRule {
  id: number;
  location: number;
  location_name: string;
  province: string;
  city: string;
  delivery_type: "normal" | "emergency";
  min_product_total: string;
  max_product_total: string | null;
  charge: string;
  status: string;
}

const emptyRule = {
  location: "",
  delivery_type: "normal",
  min_product_total: "0",
  max_product_total: "",
  charge: "",
  status: "Active",
};

const AdminLocation: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"locations" | "rules">("locations");
  const [locations, setLocations] = useState<Location[]>([]);
  const [rules, setRules] = useState<DeliveryChargeRule[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [ruleForm, setRuleForm] = useState(emptyRule);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${LOCATION_API}?search=${search}`);
      setLocations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${RULE_API}?search=${search}`);
      setRules(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load delivery charge rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [search]);

  useEffect(() => {
    if (mode === "rules") fetchRules();
  }, [mode, search]);

  const activeLocations = useMemo(
    () => locations.filter((location) => location.status === "Active"),
    [locations]
  );

  // Pagination
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.province.toLowerCase().includes(search.toLowerCase()) ||
    loc.city.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRules = rules.filter((rule) =>
    rule.location_name.toLowerCase().includes(search.toLowerCase()) ||
    rule.province.toLowerCase().includes(search.toLowerCase()) ||
    rule.city.toLowerCase().includes(search.toLowerCase())
  );

  const currentData = mode === "locations" ? filteredLocations : filteredRules;
  const totalPages = Math.max(1, Math.ceil(currentData.length / itemsPerPage));
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, mode]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleDeleteLocation = async (id: number) => {
    if (!window.confirm("Delete this location zone?")) return;
    try {
      await axios.delete(`${LOCATION_API}${id}/`);
      fetchLocations();
      fetchRules();
    } catch (err) {
      alert("Failed to delete location");
    }
  };

  const resetRuleForm = () => {
    setRuleForm(emptyRule);
    setEditingRuleId(null);
  };

  const handleRuleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRuleForm({ ...ruleForm, [event.target.name]: event.target.value });
  };

  const handleRuleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ruleForm.location || !ruleForm.charge) {
      alert("Please select a location and enter a delivery charge.");
      return;
    }

    const payload = {
      ...ruleForm,
      max_product_total: ruleForm.max_product_total || null,
    };

    try {
      if (editingRuleId) {
        await axios.put(`${RULE_API}${editingRuleId}/`, payload);
      } else {
        await axios.post(RULE_API, payload);
      }
      resetRuleForm();
      fetchRules();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to save delivery charge rule");
    }
  };

  const startEditRule = (rule: DeliveryChargeRule) => {
    setEditingRuleId(rule.id);
    setRuleForm({
      location: String(rule.location),
      delivery_type: rule.delivery_type,
      min_product_total: rule.min_product_total,
      max_product_total: rule.max_product_total || "",
      charge: rule.charge,
      status: rule.status,
    });
  };

  const deleteRule = async (id: number) => {
    if (!window.confirm("Delete this delivery charge rule?")) return;
    try {
      await axios.delete(`${RULE_API}${id}/`);
      fetchRules();
      if (editingRuleId === id) resetRuleForm();
    } catch (err) {
      alert("Failed to delete delivery charge rule");
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        .wrapper { display: flex; min-height: 100vh; }
        .main { flex: 1; display: flex; flex-direction: column; }
        .container { padding: 30px; }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 22px 24px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .title-section { display: flex; align-items: center; gap: 14px; }
        .header-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 22px;
        }

        .title { font-size: 24px; font-weight: 700; color: #0f172a; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 3px; }

        .toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

        .search, .modeSelect {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          outline: none;
          font-size: 14px;
          background: white;
        }
        .search { width: 320px; }

        .addBtn {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Table - Same as AdminStaff */
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        th, td {
          padding: 12px;
          color: #475569;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          font-size: 14px;
        }

        th {
          background: #f8fafc;
          font-weight: 600;
        }

        tr:hover {
          background: #f8fafc;
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
        }
        .iconBtn.edit { background: #2563eb; color: white; }
        .iconBtn.delete { background: #dc2626; color: white; }

        .status-active { color: #22c55e; font-weight: 600; }
        .status-inactive { color: #ef4444; font-weight: 600; }

        .pill {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .normal { background: #dbeafe; color: #1d4ed8; }
        .emergency { background: #fee2e2; color: #b91c1c; }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 14px;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 14px 0 0;
        }

        .pagination-info {
          color: #64748b;
          font-size: 11px;
        }

        .pagination-actions {
          display: flex;
          gap: 10px;
        }

        .pagination button {
          padding: 6px 12px;
          border: none;
          border-radius: 0;
          background: #1598ad;
          color: white;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .pagination button:disabled {
          background: #cbd5e1;
          color: #64748b;
          cursor: not-allowed;
        }

        /* Rule Form */
        .ruleCard {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .ruleForm {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          align-items: end;
        }
        .ruleForm label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
        }
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
                  <p className="subtitle">Manage location zones and delivery fee rules</p>
                </div>
              </div>

              <div className="toolbar">
                <select 
                  className="modeSelect" 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value as "locations" | "rules")}
                >
                  <option value="locations">Location Zones</option>
                  <option value="rules">Delivery Fee Rules</option>
                </select>
                <input
                  className="search"
                  placeholder="Search location, province or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {mode === "locations" && (
                  <button className="addBtn" onClick={() => navigate("/admin/location/add")}>
                    <FaPlus /> Add Location
                  </button>
                )}
              </div>
            </div>

            {/* Rule Form (Only for Rules Mode) */}
            {mode === "rules" && (
              <div className="ruleCard">
                <form className="ruleForm" onSubmit={handleRuleSubmit}>
                  <label>
                    Zone
                    <select name="location" value={ruleForm.location} onChange={handleRuleChange}>
                      <option value="">Select zone</option>
                      {activeLocations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.province} - {location.city} ({location.name})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Delivery Type
                    <select name="delivery_type" value={ruleForm.delivery_type} onChange={handleRuleChange}>
                      <option value="normal">Normal</option>
                      <option value="emergency">Emergency Fast</option>
                    </select>
                  </label>
                  <label>
                    Min Product Total
                    <input name="min_product_total" type="number" min="0" value={ruleForm.min_product_total} onChange={handleRuleChange} />
                  </label>
                  <label>
                    Max Product Total
                    <input name="max_product_total" type="number" min="0" placeholder="Blank = above" value={ruleForm.max_product_total} onChange={handleRuleChange} />
                  </label>
                  <label>
                    Delivery Charge
                    <input name="charge" type="number" min="0" value={ruleForm.charge} onChange={handleRuleChange} />
                  </label>
                  <label>
                    Status
                    <select name="status" value={ruleForm.status} onChange={handleRuleChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="addBtn" type="submit">
                      {editingRuleId ? "Update Rule" : "Add Rule"}
                    </button>
                    {editingRuleId && (
                      <button type="button" className="addBtn" style={{ background: "#e2e8f0", color: "#334155" }} onClick={resetRuleForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Main Table - Consistent with AdminStaff */}
            <table>
              <thead>
                <tr>
                  {mode === "locations" ? (
                    <>
                      <th>ID</th>
                      <th>Location Name</th>
                      <th>Province</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </>
                  ) : (
                    <>
                      <th>Zone</th>
                      <th>Province</th>
                      <th>City</th>
                      <th>Type</th>
                      <th>Price Range</th>
                      <th>Charge</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={mode === "locations" ? 6 : 8} className="empty">Loading...</td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan={mode === "locations" ? 6 : 8} className="empty">
                      No {mode} found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item: any) => (
                    mode === "locations" ? (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.province}</td>
                        <td>{item.city}</td>
                        <td>
                          <span className={item.status === "Active" ? "status-active" : "status-inactive"}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ display: "flex", gap: "8px" }}>
                          <button className="iconBtn edit" onClick={() => navigate(`/admin/location/update/${item.id}`)}>
                            <FaEdit />
                          </button>
                          <button className="iconBtn delete" onClick={() => handleDeleteLocation(item.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={item.id}>
                        <td>{item.location_name}</td>
                        <td>{item.province}</td>
                        <td>{item.city}</td>
                        <td><span className={`pill ${item.delivery_type}`}>{item.delivery_type}</span></td>
                        <td>
                          Rs. {Number(item.min_product_total).toLocaleString()} -{" "}
                          {item.max_product_total ? `Rs. ${Number(item.max_product_total).toLocaleString()}` : "above"}
                        </td>
                        <td>Rs. {Number(item.charge).toLocaleString()}</td>
                        <td>
                          <span className={item.status === "Active" ? "status-active" : "status-inactive"}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ display: "flex", gap: "8px" }}>
                          <button className="iconBtn edit" onClick={() => startEditRule(item)}>
                            <FaEdit />
                          </button>
                          <button className="iconBtn delete" onClick={() => deleteRule(item.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    )
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {currentData.length > 0 && (
              <div className="pagination">
                <span className="pagination-info">
                  Showing page {currentPage} out of {totalPages} pages
                </span>
                <div className="pagination-actions">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => page - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => page + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLocation;