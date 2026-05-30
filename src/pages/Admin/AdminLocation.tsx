import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaEdit, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
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
        .toolbar { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .search, .modeSelect, .ruleForm input, .ruleForm select {
          padding:11px 14px; border:1px solid #d1d5db;
          border-radius:10px; outline:none; font-size:14px; background:white;
        }
        .search { width:280px; }
        .addBtn {
          background:linear-gradient(135deg,#16a34a,#22c55e); color:white;
          border:none; padding:11px 18px; border-radius:10px;
          cursor:pointer; font-weight:600;
        }
        .tableBox, .ruleCard { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.05); }
        .ruleCard { padding:18px; margin-bottom:18px; }
        .ruleForm { display:grid; grid-template-columns:repeat(6,minmax(120px,1fr)); gap:12px; align-items:end; }
        .ruleForm label { display:flex; flex-direction:column; gap:6px; color:#475569; font-size:12px; font-weight:700; }
        .ruleActions { display:flex; gap:8px; }
        th { background:#f8fafc; padding:16px; text-align:left; color:#475569; font-weight:600; }
        td { padding:16px; border-top:1px solid #f1f5f9; color:#334155; }
        tr:hover { background:#f9fafb; }
        .actionBtn {
          border:none; padding:8px 10px; border-radius:6px; color:white;
          cursor:pointer; margin-right:6px; transition:0.2s;
        }
        .editBtn { background:#2563eb; }
        .deleteBtn { background:#dc2626; }
        .cancelBtn { background:#e2e8f0; color:#334155; }
        .status-active { color:#22c55e; font-weight:600; }
        .status-inactive { color:#ef4444; font-weight:600; }
        .pill { display:inline-block; padding:5px 10px; border-radius:999px; font-size:12px; font-weight:700; }
        .normal { background:#dbeafe; color:#1d4ed8; }
        .emergency { background:#fee2e2; color:#b91c1c; }
        @media (max-width: 1100px) { .ruleForm { grid-template-columns:repeat(2,minmax(160px,1fr)); } }
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
                <select className="modeSelect" value={mode} onChange={(e) => setMode(e.target.value as "locations" | "rules")}>
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
                    + Add Location
                  </button>
                )}
              </div>
            </div>

            {mode === "locations" ? (
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
                    ) : locations.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>No locations found</td></tr>
                    ) : (
                      locations.map((location) => (
                        <tr key={location.id}>
                          <td>{location.id}</td>
                          <td>{location.name}</td>
                          <td>{location.province}</td>
                          <td>{location.city}</td>
                          <td><span className={location.status === "Active" ? "status-active" : "status-inactive"}>{location.status}</span></td>
                          <td>
                            <button className="actionBtn editBtn" onClick={() => navigate(`/admin/location/update/${location.id}`)}>
                              <FaEdit />
                            </button>
                            <button className="actionBtn deleteBtn" onClick={() => handleDeleteLocation(location.id)}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
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
                    <div className="ruleActions">
                      <button className="addBtn" type="submit">{editingRuleId ? "Update Rule" : "Add Rule"}</button>
                      {editingRuleId && <button className="actionBtn cancelBtn" type="button" onClick={resetRuleForm}>Cancel</button>}
                    </div>
                  </form>
                </div>

                <div className="tableBox">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>Zone</th>
                        <th>Province</th>
                        <th>City</th>
                        <th>Type</th>
                        <th>Price Range</th>
                        <th>Charge</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={8} style={{ textAlign: "center", padding: "30px" }}>Loading...</td></tr>
                      ) : rules.length === 0 ? (
                        <tr><td colSpan={8} style={{ textAlign: "center", padding: "30px" }}>No delivery fee rules found</td></tr>
                      ) : (
                        rules.map((rule) => (
                          <tr key={rule.id}>
                            <td>{rule.location_name}</td>
                            <td>{rule.province}</td>
                            <td>{rule.city}</td>
                            <td><span className={`pill ${rule.delivery_type}`}>{rule.delivery_type}</span></td>
                            <td>Rs. {Number(rule.min_product_total).toLocaleString()} - {rule.max_product_total ? `Rs. ${Number(rule.max_product_total).toLocaleString()}` : "above"}</td>
                            <td>Rs. {Number(rule.charge).toLocaleString()}</td>
                            <td><span className={rule.status === "Active" ? "status-active" : "status-inactive"}>{rule.status}</span></td>
                            <td>
                              <button className="actionBtn editBtn" onClick={() => startEditRule(rule)}><FaEdit /></button>
                              <button className="actionBtn deleteBtn" onClick={() => deleteRule(rule.id)}><FaTrash /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLocation;
