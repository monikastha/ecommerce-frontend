/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaBolt,
  FaBoxOpen,
  FaCheck,
  FaClock,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaRoute,
  FaShoppingBag,
  FaTimes,
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
  delivery_location?: number | null;
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

type WarehouseStaff = {
  id: number;
  name: string;
  role: string;
  address: string;
};

type AdminLocation = {
  id: number;
  name: string;
  province: string;
  city: string;
  status: string;
};

type DeliveryChargeRule = {
  id: number;
  location: number;
  location_name: string;
  province: string;
  city: string;
  delivery_type: string;
  status: string;
};

const tabs = ["All Orders", "Today", "Pending", "Completed"];

const currency = (value?: string | number) =>
  `Rs. ${Number(value || 0).toLocaleString()}`;

const statusLabel = (status: string) => {
  if (["pending", "seller_accepted", "preparing", "warehouse_processing", "ready_for_delivery", "confirmed", "processing"].includes(status)) return "Pending";
  if (status === "delivery_assigned") return "Assigned";
  if (status === "delivery_accepted" || status === "shipped") return "Accepted";
  if (status === "picked_up") return "Picked Up";
  if (status === "out_for_delivery") return "Out For Delivery";
  if (status === "delivered") return "Delivered";
  if (status === "delivery_rejected") return "Rejected";
  if (status === "cancelled") return "Cancelled";
  return status || "Pending";
};

const statusColors: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "#fef9c3", color: "#854d0e" },
  Assigned: { bg: "#dbeafe", color: "#1e40af" },
  Accepted: { bg: "#ede9fe", color: "#5b21b6" },
  "Picked Up": { bg: "#e0f2fe", color: "#0369a1" },
  "Out For Delivery": { bg: "#ede9fe", color: "#5b21b6" },
  Delivered: { bg: "#dcfce7", color: "#166534" },
  Rejected: { bg: "#fee2e2", color: "#991b1b" },
  Cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

const productSummary = (order: AssignedOrder) =>
  order.items?.length
    ? order.items.map((item) => `${item.product_name} x${item.quantity}`).join(", ")
    : "No products";

const isEmergency = (order: AssignedOrder) => order.delivery_type === "emergency";

const formatAdminLocation = (location: { name?: string; location_name?: string; city?: string; province?: string }) =>
  [location.name || location.location_name, location.city, location.province].filter(Boolean).join(", ");

const deliveryAddress = (
  order: AssignedOrder,
  deliveryRules: DeliveryChargeRule[],
  adminLocations: AdminLocation[]
) => {
  const matchingRule = deliveryRules.find((rule) =>
    rule.status === "Active" &&
    rule.delivery_type === order.delivery_type &&
    (
      rule.location === order.delivery_location ||
      rule.location_name === order.delivery_location_name
    )
  );
  if (matchingRule) return formatAdminLocation(matchingRule);

  const matchingLocation = adminLocations.find((location) =>
    location.status === "Active" &&
    (
      location.id === order.delivery_location ||
      location.name === order.delivery_location_name
    )
  );
  if (matchingLocation) return formatAdminLocation(matchingLocation);

  if (order.delivery_location_name) return order.delivery_location_name;

  const base = [order.address, order.city].filter(Boolean).join(", ");
  return `${base || "Delivery location not set"}${order.postal_code ? `\nPostal: ${order.postal_code}` : ""}`;
};

const pickupAddress = (order: AssignedOrder, warehouseAddress: string) =>
  warehouseAddress || order.delivery_location_name || "Pickup address not set";

const AssignedDeliveries = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("All Orders");
  const [orders, setOrders] = useState<AssignedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AssignedOrder | null>(null);
  const [warehousePickupAddress, setWarehousePickupAddress] = useState("");
  const [adminLocations, setAdminLocations] = useState<AdminLocation[]>([]);
  const [deliveryRules, setDeliveryRules] = useState<DeliveryChargeRule[]>([]);
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
      if (Array.isArray(data)) {
        setOrders(data);
        setLastChecked(new Date());
      } else {
        setOrders([]);
      }

      const [staffResult, locationsResult, rulesResult] = await Promise.allSettled([
        fetch(`${API_ORIGIN}/api/staff/`),
        fetch(`${API_ORIGIN}/api/locations/`),
        fetch(`${API_ORIGIN}/api/delivery-charge-rules/`),
      ]);

      if (staffResult.status === "fulfilled") {
        const staffData = await staffResult.value.json();
        if (staffResult.value.ok && Array.isArray(staffData)) {
          const warehouseStaff = staffData.find(
            (staff: WarehouseStaff) => staff.role === "warehousestaff" && staff.address
          );
          setWarehousePickupAddress(warehouseStaff?.address || "");
        }
      }

      if (locationsResult.status === "fulfilled") {
        const locationsData = await locationsResult.value.json();
        setAdminLocations(locationsResult.value.ok && Array.isArray(locationsData) ? locationsData : []);
      }

      if (rulesResult.status === "fulfilled") {
        const rulesData = await rulesResult.value.json();
        setDeliveryRules(rulesResult.value.ok && Array.isArray(rulesData) ? rulesData : []);
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
    const prioritySorted = [...orders].sort((a, b) => {
      if (isEmergency(a) && !isEmergency(b)) return -1;
      if (!isEmergency(a) && isEmergency(b)) return 1;
      return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
    });

    if (filter === "Today") {
      return prioritySorted.filter((order) => new Date(order.created_at).toDateString() === today);
    }
    if (filter === "Pending") {
      return prioritySorted.filter((order) => ["Pending", "Assigned", "Accepted", "Picked Up", "Out For Delivery"].includes(statusLabel(order.status)));
    }
    if (filter === "Completed") {
      return prioritySorted.filter((order) => statusLabel(order.status) === "Delivered");
    }
    return prioritySorted;
  }, [filter, orders]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((order) => ["Pending", "Assigned", "Accepted", "Picked Up", "Out For Delivery"].includes(statusLabel(order.status))).length,
    delivered: orders.filter((order) => statusLabel(order.status) === "Delivered").length,
    emergency: orders.filter(isEmergency).length,
    earnings: orders
      .filter((order) => statusLabel(order.status) === "Delivered")
      .reduce((sum, order) => sum + Number(order.delivery_fee || 0), 0),
  }), [orders]);
  const completionRate = stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0;
  const priorityOrder = filtered.find((order) => ["Assigned", "Accepted", "Picked Up", "Out For Delivery"].includes(statusLabel(order.status)));

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

  const renderActions = (order: AssignedOrder) => {
    const label = statusLabel(order.status);

    return (
      <div className="action-btns">
        <button className="icon-btn btn-view" onClick={() => setSelectedOrder(order)} title="View delivery details" aria-label="View delivery details">
          <FaEye />
        </button>
        {label === "Assigned" && (
          <>
            <button className="icon-btn btn-accept" onClick={() => updateStatus(order.id, "delivery_accepted")} title="Accept delivery" aria-label="Accept delivery">
              <FaCheck />
            </button>
            <button className="icon-btn btn-reject" onClick={() => updateStatus(order.id, "delivery_rejected")} title="Reject delivery" aria-label="Reject delivery">
              <FaTimes />
            </button>
          </>
        )}
        {label === "Accepted" && (
          <button className="icon-btn btn-accept" onClick={() => updateStatus(order.id, "picked_up")} title="Picked up" aria-label="Picked up">
            <FaBoxOpen />
          </button>
        )}
        {label === "Picked Up" && (
          <button className="icon-btn btn-out" onClick={() => updateStatus(order.id, "out_for_delivery")} title="Out for delivery" aria-label="Out for delivery">
            <FaTruck />
          </button>
        )}
        {label === "Out For Delivery" && (
          <button className="icon-btn btn-delivered" onClick={() => updateStatus(order.id, "delivered")} title="Mark delivered" aria-label="Mark delivered">
            <FaCheck />
          </button>
        )}
        {label === "Pending" && <span className="state-note waiting">Waiting</span>}
        {label === "Delivered" && <span className="state-note done">Done</span>}
        {label === "Rejected" && <span className="state-note rejected">Rejected</span>}
        {label === "Cancelled" && <span className="state-note rejected">Cancelled</span>}
      </div>
    );
  };

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        .assigned-layout { display:flex; min-height:100vh; background:#eef3f8; }
        .assigned-main { flex:1; display:flex; flex-direction:column; }
        .assigned-content{ padding:22px; }
        .dashboard-shell{display:grid;gap:18px;}
        .ops-hero{background:#ffffff;border:1px solid #dbe5f0;border-radius:10px;box-shadow:0 16px 36px rgba(15,23,42,0.08);overflow:hidden;}
        .ops-hero-top{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:20px 22px;background:linear-gradient(135deg,#b8cce4 0%,#ffffff 72%);border-bottom:1px solid #dbe5f0;}
        .page-title { display:flex; align-items:center; gap:10px; }
        .title-icon{width:48px;height:48px;border-radius:10px;background:#dc2626;color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 18px rgba(220,38,38,0.22);}
        .page-title h2{ font-size:22px; color:#0f172a; font-weight:900; letter-spacing:0; }
        .page-title p{ font-size:13px; color:#475569; margin-top:3px; }
        .hero-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end;}
        .last-sync{font-size:12px;color:#475569;background:rgba(255,255,255,0.7);border:1px solid #dbe5f0;border-radius:8px;padding:9px 11px;font-weight:700;}
        .refresh-btn{height:38px;width:38px;border:none;border-radius:8px;background:#2563eb;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 18px rgba(37,99,235,0.22);}
        .refresh-btn:hover{background:#1d4ed8;}
        .ops-hero-bottom{display:grid;grid-template-columns:1.2fr 0.8fr;gap:16px;padding:18px 22px;}
        .priority-card{border:1px solid #dbe5f0;border-radius:10px;background:#f8fafc;padding:15px;}
        .priority-card.emergency{border-color:#fecaca;background:#fff7ed;}
        .priority-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px;}
        .priority-head h3{font-size:14px;color:#0f172a;font-weight:900;}
        .priority-id{font-size:12px;color:#64748b;font-weight:900;}
        .priority-route{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .route-point{background:white;border:1px solid #e2e8f0;border-radius:8px;padding:10px;}
        .route-point span{display:block;font-size:11px;color:#64748b;text-transform:uppercase;font-weight:900;margin-bottom:5px;}
        .route-point strong{font-size:13px;color:#0f172a;line-height:1.4;}
        .progress-card{border:1px solid #dbe5f0;border-radius:10px;background:white;padding:15px;}
        .progress-row{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:10px;}
        .progress-row h3{font-size:14px;color:#0f172a;font-weight:900;}
        .progress-row strong{font-size:22px;color:#dc2626;}
        .progress-track{height:10px;border-radius:999px;background:#e2e8f0;overflow:hidden;}
        .progress-fill{height:100%;background:#dc2626;border-radius:999px;}
        .stats{display:grid;grid-template-columns:repeat(5,minmax(150px,1fr));gap:12px;}
        .stat-card{background:white;border:1px solid #dbe5f0;border-radius:10px;padding:15px;box-shadow:0 10px 26px rgba(15,23,42,0.06);display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:96px;}
        .stat-card h4{font-size:11px;color:#64748b;text-transform:uppercase;font-weight:900;letter-spacing:0;}
        .stat-card h2{font-size:25px;color:#0f172a;margin-top:7px;font-weight:900;}
        .stat-icon{width:42px;height:42px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;}
        .stat-total .stat-icon{background:#2563eb;}
        .stat-pending .stat-icon{background:#d97706;}
        .stat-done .stat-icon{background:#16a34a;}
        .stat-emergency .stat-icon{background:#dc2626;}
        .stat-earnings .stat-icon{background:#0f766e;}
        .queue-card{background:white;border:1px solid #dbe5f0;border-radius:10px;box-shadow:0 16px 36px rgba(15,23,42,0.08);overflow:hidden;}
        .queue-header{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:16px 18px;border-bottom:1px solid #e2e8f0;background:#ffffff;}
        .queue-header h3{font-size:16px;color:#0f172a;font-weight:900;}
        .queue-header p{font-size:12px;color:#64748b;margin-top:3px;}
        .tab-row { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
        .tabs { display:flex; gap:6px; flex-wrap:wrap; }
        .tab-btn { padding:8px 14px; border-radius:8px; border:1px solid #e2e8f0; cursor:pointer; font-size:12px; font-weight:800; background:white; color:#475569; transition:0.2s; }
        .tab-btn.active { background:#dc2626; color:white; border-color:#dc2626; }
        .table-box { background:white; overflow:hidden; }
        table { width:100%; border-collapse:collapse; }
        thead tr { background:#f8fafc; border-bottom:1px solid #e2e8f0; }
        th { padding:13px 16px; text-align:left; font-size:11px; color:#64748b; font-weight:900; white-space:nowrap; text-transform:uppercase; }
        td { padding:15px 16px; font-size:13px; color:#334155; border-bottom:1px solid #edf2f7; vertical-align:top; }
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
        .emergency-row{background:#fff7ed;}
        .emergency-row td{border-bottom-color:#fed7aa;}
        .emergency-alert{display:inline-flex;align-items:center;gap:5px;background:#dc2626;color:white;border-radius:999px;padding:4px 8px;font-size:10px;font-weight:900;margin-top:6px;}
        .status-badge { padding:5px 10px; border-radius:999px; font-size:11px; font-weight:800; display:inline-block; }
        .action-btns { display:flex; gap:6px; flex-wrap:wrap; min-width:150px; align-items:center; }
        .icon-btn{width:34px;height:34px;border:none;border-radius:8px;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .btn-view{background:#475569;}
        .btn-accept{background:#2563eb;}
        .btn-reject{background:#dc2626;}
        .btn-out{background:#7c3aed;}
        .btn-delivered{background:#16a34a;}
        .state-note{font-size:12px;font-weight:800;}
        .state-note.waiting{color:#d97706;}
        .state-note.done{color:#16a34a;}
        .state-note.rejected{color:#dc2626;}
        .empty-msg { padding:34px; text-align:center; color:#94a3b8; font-size:14px; }
        .error-msg{margin-bottom:14px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;padding:12px;border-radius:8px;font-size:13px;font-weight:800;}
        .detail-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:1200;display:flex;align-items:center;justify-content:center;padding:20px;}
        .detail-modal{width:min(760px,100%);max-height:90vh;overflow:auto;background:white;border-radius:12px;box-shadow:0 24px 70px rgba(15,23,42,0.25);}
        .detail-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding:18px 20px;border-bottom:1px solid #e2e8f0;}
        .detail-head h3{font-size:18px;color:#0f172a;font-weight:900;margin-bottom:4px;}
        .detail-head p{font-size:13px;color:#64748b;}
        .detail-close{width:34px;height:34px;border:none;border-radius:8px;background:#f1f5f9;color:#334155;cursor:pointer;}
        .detail-body{padding:20px;display:grid;gap:14px;}
        .detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
        .detail-box{border:1px solid #e2e8f0;border-radius:10px;padding:13px;background:#f8fafc;}
        .detail-box h4{font-size:12px;color:#64748b;text-transform:uppercase;font-weight:900;margin-bottom:8px;}
        .detail-box p{font-size:13px;color:#334155;line-height:1.5;}
        @media(max-width:1200px){.stats{grid-template-columns:repeat(2,minmax(160px,1fr));}.ops-hero-bottom{grid-template-columns:1fr;}}
        @media(max-width:1000px){.table-box{overflow-x:auto;} table{min-width:1120px;}}
        @media(max-width:700px){.assigned-content{padding:14px;}.ops-hero-top{flex-direction:column;}.hero-actions{justify-content:flex-start;}.priority-route{grid-template-columns:1fr;}.stats{grid-template-columns:1fr;}.detail-grid{grid-template-columns:1fr;}}
      `}</style>

      <div className="assigned-layout">
        <DeliverymanSidebar />
        <div className="assigned-main">
          <DeliverymanNavbar />
          <div className="assigned-content">
            <div className="dashboard-shell">
              <section className="ops-hero">
                <div className="ops-hero-top">
                  <div className="page-title">
                    <div className="title-icon"><FaTruck /></div>
                    <div>
                      <h2>Delivery Operations</h2>
                      <p>Assigned deliveries, emergency orders, and earnings</p>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <button className="tab-btn" onClick={() => navigate("/delivery/dashboard")}>Dashboard</button>
                    {lastChecked && <span className="last-sync">Updated {lastChecked.toLocaleTimeString()}</span>}
                    <button className="refresh-btn" onClick={loadAssignedOrders} title="Refresh assigned deliveries" aria-label="Refresh assigned deliveries">
                      <FaRoute />
                    </button>
                  </div>
                </div>

                <div className="ops-hero-bottom">
                  <div className={`priority-card ${priorityOrder && isEmergency(priorityOrder) ? "emergency" : ""}`}>
                    <div className="priority-head">
                      <h3>Priority Delivery</h3>
                      <span className="priority-id">{priorityOrder?.order_number || "No active order"}</span>
                    </div>
                    <div className="priority-route">
                      <div className="route-point">
                        <span>Pickup</span>
                        <strong>{priorityOrder ? pickupAddress(priorityOrder, warehousePickupAddress) : "No pickup scheduled"}</strong>
                      </div>
                      <div className="route-point">
                        <span>Dropoff</span>
                        <strong>{priorityOrder ? deliveryAddress(priorityOrder, deliveryRules, adminLocations) : "No delivery address"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="progress-card">
                    <div className="progress-row">
                      <h3>Completion Rate</h3>
                      <strong>{completionRate}%</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${completionRate}%` }} />
                    </div>
                    <div className="muted">Delivered {stats.delivered} of {stats.total} assigned orders</div>
                  </div>
                </div>
              </section>

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
                    <h4>Active Queue</h4>
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
                <div className="stat-card stat-emergency">
                  <div>
                    <h4>Emergency Fast</h4>
                    <h2>{stats.emergency}</h2>
                  </div>
                  <div className="stat-icon"><FaBolt /></div>
                </div>
                <div className="stat-card stat-earnings">
                  <div>
                    <h4>Earnings</h4>
                    <h2>{currency(stats.earnings)}</h2>
                  </div>
                  <div className="stat-icon"><FaRoute /></div>
                </div>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <section className="queue-card">
                <div className="queue-header">
                  <div>
                    <h3>Delivery Queue</h3>
                    <p>{filtered.length} orders in current view</p>
                  </div>
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
                        <tr key={order.id} className={isEmergency(order) ? "emergency-row" : ""}>
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
                            {isEmergency(order) && (
                              <div className="emergency-alert"><FaBolt size={10} /> Fast Delivery</div>
                            )}
                          </td>
                          <td>
                            <div className="pickup-cell">
                              <span className="pickup-label"><FaWarehouse size={11} /> Warehouse</span>
                              <span className="pickup-sub">{pickupAddress(order, warehousePickupAddress)}</span>
                            </div>
                          </td>
                          <td>
                            <div className="drop-cell">
                              <FaMapMarkerAlt size={11} color="#ef4444" />
                              <span style={{ whiteSpace: "pre-line" }}>{deliveryAddress(order, deliveryRules, adminLocations)}</span>
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
                            {renderActions(order)}
                          </td>
                        </tr>
                      );
                    })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="detail-overlay" role="dialog" aria-modal="true">
          <div className="detail-modal">
            <div className="detail-head">
              <div>
                <h3>{selectedOrder.order_number}</h3>
                <p>{isEmergency(selectedOrder) ? "Emergency Fast Delivery" : "Normal Delivery"} - {statusLabel(selectedOrder.status)}</p>
              </div>
              <button className="detail-close" onClick={() => setSelectedOrder(null)} aria-label="Close details">
                <FaTimes />
              </button>
            </div>
            <div className="detail-body">
              <div className="detail-grid">
                <div className="detail-box">
                  <h4>Customer Details</h4>
                  <p>
                    <strong>{selectedOrder.customer_name || "Customer"}</strong><br />
                    {selectedOrder.phone || "-"}<br />
                    {selectedOrder.email || "-"}
                  </p>
                </div>
                <div className="detail-box">
                  <h4>Pickup Location</h4>
                  <p>{pickupAddress(selectedOrder, warehousePickupAddress)}</p>
                </div>
                <div className="detail-box">
                  <h4>Delivery Address</h4>
                  <p style={{ whiteSpace: "pre-line" }}>{deliveryAddress(selectedOrder, deliveryRules, adminLocations)}</p>
                </div>
                <div className="detail-box">
                  <h4>Payment And Earnings</h4>
                  <p>Total: <strong>{currency(selectedOrder.total)}</strong><br />Delivery fee: <strong>{currency(selectedOrder.delivery_fee)}</strong><br />Payment: {selectedOrder.payment_type}</p>
                </div>
              </div>

              <div className="detail-box">
                <h4>Products</h4>
                <p>{productSummary(selectedOrder)}</p>
              </div>

              {renderActions(selectedOrder)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedDeliveries;
