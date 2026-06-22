/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaBoxOpen,
  FaCheck,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaRoute,
  FaShoppingBag,
  FaTruck,
  FaWarehouse,
} from "react-icons/fa";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type AssignedOrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  price: string | number;
  subtotal: string | number;
};

type AssignedOrder = {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  delivery_location_name?: string;
  delivery_type: string;
  delivery_fee: string | number;
  payment_type: string;
  subtotal: string | number;
  total: string | number;
  status: string;
  created_at: string;
  updated_at: string;
  items: AssignedOrderItem[];
};

const tabs = ["All Orders", "Today", "Pending", "Completed"];

const currency = (value?: string | number) =>
  `Rs. ${Number(value || 0).toLocaleString()}`;

const statusLabel = (status: string) => {
  if (["pending", "confirmed", "processing"].includes(status)) return "Pending";
  if (status === "shipped") return "Shipped";
  if (status === "out_for_delivery") return "Out For Delivery";
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";
  return status || "Pending";
};

const statusColors: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "#fef9c3", color: "#854d0e" },
  Shipped: { bg: "#dbeafe", color: "#1e40af" },
  "Out For Delivery": { bg: "#ede9fe", color: "#5b21b6" },
  Delivered: { bg: "#dcfce7", color: "#166534" },
  Cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

const productSummary = (order: AssignedOrder) =>
  order.items?.length
    ? order.items.map((item) => `${item.product_name} x${item.quantity}`).join(", ")
    : "No products";

const AssignedDeliveries = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("All Orders");
  const [orders, setOrders] = useState<AssignedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const deliveryId = localStorage.getItem("delivery_id") || "";
  const POLL_INTERVAL_MS = 20000;

  const loadAssignedOrders = async () => {
    if (!deliveryId) {
      setOrders([]);
      setLoading(false);
      setError("Delivery profile was not found for this login.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/?assigned_deliveryman=${deliveryId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load assigned deliveries");
      setOrders(Array.isArray(data) ? data : []);
      if (Array.isArray(data)) {
        setOrders(data);
        setLastChecked(new Date());
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assigned deliveries");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlFilter = searchParams.get("filter");
    if (urlFilter === "Pending") setFilter("Pending");
    else if (urlFilter === "Completed") setFilter("Completed");
    else setFilter("All Orders");
  }, [searchParams]);

  useEffect(() => {
    if (!deliveryId) {
      loadAssignedOrders();
      return undefined;
    }

    loadAssignedOrders();
    const intervalId = window.setInterval(loadAssignedOrders, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [deliveryId]);

  const filtered = useMemo(() => {
    const today = new Date().toDateString();
    if (filter === "Today") {
      return orders.filter((order) => new Date(order.created_at).toDateString() === today);
    }
    if (filter === "Pending") {
      return orders.filter((order) => ["Pending", "Shipped", "Out For Delivery"].includes(statusLabel(order.status)));
    }
    if (filter === "Completed") {
      return orders.filter((order) => statusLabel(order.status) === "Delivered");
    }
    return orders;
  }, [filter, orders]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((order) => ["Pending", "Shipped", "Out For Delivery"].includes(statusLabel(order.status))).length,
    delivered: orders.filter((order) => statusLabel(order.status) === "Delivered").length,
  }), [orders]);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/${orderId}/set-status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update delivery status");
      setOrders((prev) => prev.map((order) => (order.id === orderId ? data : order)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update delivery status");
    }
  };

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        .assigned-layout { display:flex; min-height:100vh; background:#f1f5f9; }
        .assigned-main { flex:1; display:flex; flex-direction:column; }
        .assigned-content{ padding:20px; }
        .breadcrumb { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
        .breadcrumb h2 { font-size:15px; color:#334155; font-weight:700; }
        .breadcrumb span{ font-size:12px; color:#94a3b8; }
        .back-btn { margin-bottom:14px; background:white; border:1px solid #e2e8f0; border-radius:8px; padding:7px 14px; font-size:13px; color:#475569; cursor:pointer; font-weight:700; }
        .back-btn:hover { background:#f8fafc; }
        .page-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;}
        .page-title { display:flex; align-items:center; gap:10px; }
        .title-icon{width:42px;height:42px;border-radius:10px;background:#dc2626;color:white;display:flex;align-items:center;justify-content:center;}
        .page-title h2{ font-size:20px; color:#0f172a; font-weight:800; }
        .page-title p{ font-size:13px; color:#64748b; margin-top:2px; }
        .refresh-btn{width:38px;height:38px;border:none;border-radius:8px;background:#2563eb;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .stats{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:12px;margin-bottom:16px;}
        .stat-card{background:white;border:1px solid #e2e8f0;border-radius:10px;padding:14px;box-shadow:0 8px 20px rgba(15,23,42,0.06);display:flex;align-items:center;justify-content:space-between;gap:10px;}
        .stat-card h4{font-size:12px;color:#64748b;text-transform:uppercase;font-weight:800;}
        .stat-card h2{font-size:26px;color:#0f172a;margin-top:6px;font-weight:900;}
        .stat-icon{width:42px;height:42px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;}
        .stat-total .stat-icon{background:#2563eb;}
        .stat-pending .stat-icon{background:#d97706;}
        .stat-done .stat-icon{background:#16a34a;}
        .tab-row { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
        .tabs { display:flex; gap:6px; flex-wrap:wrap; }
        .tab-btn { padding:8px 14px; border-radius:8px; border:1px solid #e2e8f0; cursor:pointer; font-size:12px; font-weight:800; background:white; color:#475569; transition:0.2s; }
        .tab-btn.active { background:#dc2626; color:white; border-color:#dc2626; }
        .table-box { background:white; border-radius:10px; box-shadow:0 8px 20px rgba(15,23,42,0.06); overflow:hidden; }
        table { width:100%; border-collapse:collapse; }
        thead tr { background:#f8fafc; }
        th { padding:13px 14px; text-align:left; font-size:11px; color:#64748b; font-weight:800; white-space:nowrap; }
        td { padding:13px 14px; font-size:13px; color:#334155; border-bottom:1px solid #f1f5f9; vertical-align:top; }
        tr:last-child td { border-bottom:none; }
        .customer-cell { display:flex; flex-direction:column; gap:3px; }
        .phone-row { color:#64748b; font-size:12px; display:flex; align-items:center; gap:5px; }
        .pickup-cell { display:flex; flex-direction:column; gap:3px; font-size:12px; }
        .pickup-label{ display:flex; align-items:center; gap:6px; color:#2563eb; font-weight:800; }
        .pickup-sub { color:#64748b; }
        .drop-cell { font-size:12px; display:flex; align-items:flex-start; gap:6px; line-height:1.45; }
        .muted{color:#64748b;font-size:12px;margin-top:4px;line-height:1.45;}
        .delivery-pill{display:inline-flex;padding:5px 9px;border-radius:999px;font-size:11px;font-weight:800;text-transform:capitalize;margin-top:5px;}
        .delivery-pill.normal{background:#dcfce7;color:#166534;}
        .delivery-pill.emergency{background:#fee2e2;color:#991b1b;}
        .status-badge { padding:5px 10px; border-radius:999px; font-size:11px; font-weight:800; display:inline-block; }
        .action-btns { display:flex; gap:6px; flex-wrap:wrap; min-width:130px; }
        .icon-btn{width:34px;height:34px;border:none;border-radius:8px;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .btn-accept{background:#2563eb;}
        .btn-out{background:#7c3aed;}
        .btn-delivered{background:#16a34a;}
        .empty-msg { padding:34px; text-align:center; color:#94a3b8; font-size:14px; }
        .error-msg{margin-bottom:14px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;padding:12px;border-radius:8px;font-size:13px;font-weight:800;}
        @media(max-width:1000px){.table-box{overflow-x:auto;} table{min-width:1050px;} .stats{grid-template-columns:1fr;}}
      `}</style>

      <div className="assigned-layout">
        <DeliverymanSidebar />
        <div className="assigned-main">
          <DeliverymanNavbar />
          <div className="assigned-content">
            <div className="breadcrumb">
              <h2>Orders</h2>
              <span>Home &gt; Assigned Orders</span>
            </div>

            <button className="back-btn" onClick={() => navigate("/delivery/dashboard")}>
              Back to Dashboard
            </button>

            <div className="page-head">
              <div className="page-title">
                <div className="title-icon"><FaTruck /></div>
                <div>
                  <h2>Assigned Deliveries</h2>
                  <p>Orders assigned to your delivery profile from admin order management</p>
                  {lastChecked && (
                    <div className="muted" style={{ marginTop: 4, fontSize: 12 }}>
                      Last updated: {lastChecked.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
              <button className="refresh-btn" onClick={loadAssignedOrders} title="Refresh assigned deliveries" aria-label="Refresh assigned deliveries">
                <FaRoute />
              </button>
            </div>

            <div className="stats">
              <div className="stat-card stat-total">
                <div>
                  <h4>Total Assigned</h4>
                  <h2>{stats.total}</h2>
                </div>
                <div className="stat-icon"><FaShoppingBag /></div>
              </div>
              <div className="stat-card stat-pending">
                <div>
                  <h4>Pending Delivery</h4>
                  <h2>{stats.pending}</h2>
                </div>
                <div className="stat-icon"><FaClock /></div>
              </div>
              <div className="stat-card stat-done">
                <div>
                  <h4>Delivered</h4>
                  <h2>{stats.delivered}</h2>
                </div>
                <div className="stat-icon"><FaBoxOpen /></div>
              </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="tab-row">
              <div className="tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${filter === tab ? "active" : ""}`}
                    onClick={() => setFilter(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-box">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Pickup</th>
                    <th>Delivery Address</th>
                    <th>Total</th>
                    <th>Assigned Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9}>
                        <div className="empty-msg">Loading assigned deliveries...</div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9}>
                        <div className="empty-msg">No assigned deliveries found.</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => {
                      const label = statusLabel(order.status);
                      return (
                        <tr key={order.id}>
                          <td><strong>{order.order_number}</strong></td>
                          <td>
                            <div className="customer-cell">
                              <strong>{order.customer_name || "Customer"}</strong>
                              <span className="phone-row"><FaPhone size={10} /> {order.phone || "-"}</span>
                              <span className="muted">{order.email || "-"}</span>
                            </div>
                          </td>
                          <td>
                            <strong>{productSummary(order)}</strong>
                            <div className={`delivery-pill ${order.delivery_type === "emergency" ? "emergency" : "normal"}`}>
                              {order.delivery_type || "normal"}
                            </div>
                          </td>
                          <td>
                            <div className="pickup-cell">
                              <span className="pickup-label"><FaWarehouse size={11} /> Warehouse</span>
                              <span className="pickup-sub">{order.delivery_location_name || "Pickup location not set"}</span>
                            </div>
                          </td>
                          <td>
                            <div className="drop-cell">
                              <FaMapMarkerAlt size={11} color="#ef4444" />
                              <span>{order.address}{order.city ? `, ${order.city}` : ""}<br />Postal: {order.postal_code || "-"}</span>
                            </div>
                          </td>
                          <td>
                            <strong>{currency(order.total)}</strong>
                            <div className="muted">Delivery: {currency(order.delivery_fee)}</div>
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {order.updated_at ? new Date(order.updated_at).toLocaleString() : "-"}
                          </td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background: statusColors[label]?.bg,
                                color: statusColors[label]?.color,
                              }}
                            >
                              {label}
                            </span>
                          </td>
                          <td>
                            {label === "Shipped" && (
                              <div className="action-btns">
                                <button className="icon-btn btn-out" onClick={() => updateStatus(order.id, "out_for_delivery")} title="Out for delivery" aria-label="Out for delivery">
                                  <FaTruck />
                                </button>
                              </div>
                            )}
                            {label === "Out For Delivery" && (
                              <div className="action-btns">
                                <button className="icon-btn btn-delivered" onClick={() => updateStatus(order.id, "delivered")} title="Mark delivered" aria-label="Mark delivered">
                                  <FaCheck />
                                </button>
                              </div>
                            )}
                            {label === "Pending" && (
                              <span style={{ color: "#d97706", fontSize: "12px", fontWeight: 800 }}>Waiting</span>
                            )}
                            {label === "Delivered" && (
                              <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: 800 }}>Done</span>
                            )}
                            {label === "Cancelled" && (
                              <span style={{ color: "#dc2626", fontSize: "12px", fontWeight: 800 }}>Cancelled</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
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

export default AssignedDeliveries;
