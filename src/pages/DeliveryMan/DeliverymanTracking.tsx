/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaPhone, FaMapMarkerAlt, FaWarehouse } from "react-icons/fa";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";
import axios from "axios";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Order = {
  id: string;
  customer: string;
  phone: string;
  pickup: string;
  address: string;
  date: string;
  status: string;
  backendId?: number | string | null;
};

const dummyOrders: Order[] = [
  { id: "#101", backendId: 101, customer: "Ram Sharma", phone: "9800000000", pickup: "Warehouse A, Kathmandu", address: "Newroad, Kathmandu", date: "Today 10:30 AM", status: "Pending" },
  { id: "#102", backendId: 102, customer: "Sita Rai", phone: "9811111111", pickup: "Warehouse B, Lalitpur", address: "Jawalakhel, Lalitpur", date: "Today 12:00 PM", status: "Accepted" },
  { id: "#103", backendId: 103, customer: "Ram Kumar", phone: "9867662125", pickup: "Warehouse A, Lagankhel", address: "Kathmandu, Newroad", date: "Today 11:00 AM", status: "Pending" },
  { id: "#104", backendId: 104, customer: "Maya Gurung", phone: "9840274396", pickup: "Warehouse B, Koteshwor", address: "Lalitpur, Jawalakhel", date: "Yesterday 9:15 AM", status: "Delivered Product" },
  { id: "#105", backendId: 105, customer: "Hari Thapa", phone: "9812345678", pickup: "Warehouse A, Lagankhel", address: "Bhaktapur, Suryabinayak", date: "Yesterday 11:00 AM", status: "Delivered Product" },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Pending:          { bg: "#fef9c3", color: "#854d0e" },
  Accepted:         { bg: "#dbeafe", color: "#1e40af" },
  "Out for Delivery": { bg: "#fff7ed", color: "#92400e" },
  "Delivered Product": { bg: "#dcfce7", color: "#166534" },
  Delivered:        { bg: "#dcfce7", color: "#166534" },
  Rejected:         { bg: "#fee2e2", color: "#991b1b" },
};

const tabs = ["All", "Today", "Pending", "Accepted", "Delivered"];

const DeliverymanTracking = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Read filter from URL
  useEffect(() => {
    const urlFilter = searchParams.get("filter");
    if (urlFilter) setFilter(urlFilter);
  }, [searchParams]);

  // Load orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_ORIGIN}/api/orders/`);
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length === 0) {
          setOrders(dummyOrders);
        } else {
          const mapped: Order[] = data.map((o: any) => ({
              id: o.order_number || `#${o.id}`,
              backendId: o.id,
              customer: o.customer_name || "Unknown",
              phone: o.phone || "N/A",
              pickup: "Warehouse, Kathmandu",
              address: `${o.address}, ${o.city}`,
              date: new Date(o.created_at).toLocaleDateString(),
              status: o.status === "pending" ? "Pending"
              : o.status === "confirmed" ? "Confirmed"
              : o.status === "processing" ? "Processing"
              : o.status === "shipped" ? "Accepted"
              : o.status === "out_for_delivery" ? "Out for Delivery"
              : o.status === "delivered" ? "Delivered Product"
              : (typeof o.status === "string" ? capitalize(o.status) : "Pending"),
            }));
          setOrders(mapped);
        }
      } catch (e) {
        setOrders(dummyOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // helper: capitalize a status string
  function capitalize(s: string) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  const filtered =
    filter === "Today"    ? orders.filter((o) => o.date.includes("Today"))
    : filter === "Pending"  ? orders.filter((o) => o.status === "Pending")
    : filter === "Accepted" ? orders.filter((o) => o.status === "Accepted")
    : filter === "Delivered"? orders.filter((o) => o.status && o.status.toLowerCase().includes("deliver"))
    : orders;

  const displayToBackend = (display: string) => {
    const d = display.toLowerCase();
    if (d === "pending") return "pending"; // keep in backend pending
    if (d === "accepted") return "shipped";
    if (d === "out for delivery" || d === "out_for_delivery" || d.includes("out")) return "out_for_delivery";
    if (d === "pickedup" || d === "picked up" || d === "pickedup") return "out_for_delivery";
    if (d.includes("deliver")) return "delivered";
    if (d === "rejected") return "cancelled";
    return d;
  };

  const updateStatus = async (displayId: string, backendId: number | string | null | undefined, newStatus: string) => {
    // optimistic update with revert support
    let previousStatus: string | undefined;
    setOrders((prev) => prev.map((o) => {
      if (o.id === displayId) {
        previousStatus = o.status;
        return { ...o, status: newStatus };
      }
      return o;
    }));

    if (!backendId) return; // nothing to sync

    const payloadStatus = displayToBackend(newStatus);
    try {
      // use set-status endpoint to respect backend transitions
      await axios.post(`${API_ORIGIN}/api/orders/${backendId}/set-status/`, { status: payloadStatus });
      // backend is expected to broadcast/reflect changes to other roles
    } catch (err) {
      // revert optimistic update on error
      setOrders((prev) => prev.map((o) => o.id === displayId ? { ...o, status: previousStatus || "Pending" } : o));
      // minimal feedback
      // eslint-disable-next-line no-alert
      alert("Failed to update order status. Please try again.");
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: "center" }}>Loading Orders...</div>;

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        .layout { display:flex; min-height:100vh; background:#f1f5f9; }
        .main { flex:1; display:flex; flex-direction:column; }
        .content { padding:16px 20px; }
        .page-header { margin-bottom:16px; }
        .page-header h2 { font-size:18px; color:#0f172a; font-weight:700; }
        .page-header p { font-size:13px; color:#64748b; margin-top:4px; }
        .summary-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:16px; }
        .summary-card { background:white; padding:16px; border-radius:12px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
        .summary-card h3 { font-size:12px; color:#64748b; margin-bottom:6px; }
        .summary-card h2 { font-size:24px; font-weight:700; }
        .tab-row { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
        .tab-btn { padding:6px 16px; border-radius:20px; border:none; cursor:pointer; font-size:12px; font-weight:500; background:#e2e8f0; color:#475569; transition:0.2s; }
        .tab-btn.active { background:#ef4444; color:white; }
        .table-box { background:white; border-radius:14px; box-shadow:0 2px 8px rgba(0,0,0,0.05); overflow:hidden; }
        table { width:100%; border-collapse:collapse; }
        th { padding:12px 14px; text-align:left; font-size:11px; color:#64748b; font-weight:600; background:#f8fafc; }
        td { padding:12px 14px; font-size:13px; color:#334155; border-bottom:1px solid #f1f5f9; }
        tr:last-child td { border-bottom:none; }
        .customer-cell { display:flex; flex-direction:column; gap:2px; }
        .phone-row { color:#94a3b8; font-size:11px; display:flex; align-items:center; gap:4px; }
        .pickup-cell { display:flex; flex-direction:column; gap:2px; font-size:12px; }
        .pickup-label { display:flex; align-items:center; gap:5px; color:#3b82f6; font-weight:500; }
        .drop-cell { font-size:12px; display:flex; align-items:center; gap:5px; }
        .status-badge { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; display:inline-block; }
        .action-btns { display:flex; flex-direction:column; gap:4px; }
        .btn { border:none; border-radius:6px; padding:4px 10px; font-size:11px; cursor:pointer; color:white; }
        .btn-accept { background:#22c55e; }
        .btn-reject { background:#ef4444; }
        .btn-pickup { background:#94a3b8; }
        .btn-delivered { background:#22c55e; }
        .empty-msg { padding:30px; text-align:center; color:#94a3b8; font-size:14px; }
        @media(max-width:768px){ .summary-cards { grid-template-columns:1fr 1fr; } }
      `}</style>

      <div className="layout">
        <DeliverymanSidebar />
        <div className="main">
          <DeliverymanNavbar />
          <div className="content">

            <div className="page-header">
              <h2>Orders Tracking</h2>
              <p>Track and manage all your deliveries in one place</p>
            </div>

            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Orders</h3>
                <h2 style={{ color: "#2563eb" }}>{orders.length}</h2>
              </div>
              <div className="summary-card">
                <h3>Today</h3>
                <h2 style={{ color: "#8b5cf6" }}>{orders.filter(o => o.date.includes("Today")).length}</h2>
              </div>
              <div className="summary-card">
                <h3>Pending</h3>
                <h2 style={{ color: "#f97316" }}>{orders.filter(o => o.status === "Pending").length}</h2>
              </div>
              <div className="summary-card">
                <h3>Delivered</h3>
                <h2 style={{ color: "#22c55e" }}>{orders.filter(o => o.status && o.status.toLowerCase().includes("deliver")).length}</h2>
              </div>
            </div>

            <div className="tab-row">
              {tabs.map((t) => (
                <button
                  key={t}
                  className={`tab-btn ${filter === t ? "active" : ""}`}
                  onClick={() => setFilter(t)}
                >
                  {t} ({t === "All" ? orders.length : t === "Today" ? orders.filter(o => o.date.includes("Today")).length : t === "Delivered" ? orders.filter(o => o.status && o.status.toLowerCase().includes("deliver")).length : orders.filter(o => o.status === t).length})
                </button>
              ))}
            </div>

            <div className="table-box">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Pickup</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7}><div className="empty-msg">No orders found.</div></td></tr>
                  ) : (
                    filtered.map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>
                          <div className="customer-cell">
                            <span>{o.customer}</span>
                            <span className="phone-row"><FaPhone size={9} /> {o.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div className="pickup-cell">
                            <span className="pickup-label"><FaWarehouse size={11} /> {o.pickup.split(",")[0]}</span>
                            <span style={{ color: "#94a3b8" }}>{o.pickup.split(",").slice(1).join(",")}</span>
                          </div>
                        </td>
                        <td><div className="drop-cell"><FaMapMarkerAlt size={11} color="#ef4444" /> {o.address}</div></td>
                        <td style={{ fontSize: "11px" }}>{o.date}</td>
                        <td>
                          <span className="status-badge" style={{
                            background: statusColors[o.status]?.bg,
                            color: statusColors[o.status]?.color,
                          }}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          {o.status === "Pending" && (
                            <div className="action-btns">
                              <button className="btn btn-accept" onClick={() => updateStatus(o.id, o.backendId, "Confirmed")}>✓ Accept</button>
                              <button className="btn btn-reject" onClick={() => updateStatus(o.id, o.backendId, "Rejected")}>✗ Reject</button>
                            </div>
                          )}
                          {o.status === "Accepted" && (
                            <div className="action-btns">
                              <button className="btn btn-pickup" onClick={() => updateStatus(o.id, o.backendId, "Out for Delivery")}>Out for Delivery</button>
                            </div>
                          )}
                          {o.status === "Out for Delivery" && (
                            <div className="action-btns">
                              <button className="btn btn-delivered" onClick={() => updateStatus(o.id, o.backendId, "Delivered Product")}>Delivered Product</button>
                            </div>
                          )}
                          {o.status && o.status.toLowerCase().includes("deliver") && <span style={{ color: "#22c55e", fontSize: "12px", fontWeight: 600 }}>✓ Done</span>}
                          {o.status === "Rejected" && <span style={{ color: "#ef4444", fontSize: "12px", fontWeight: 600 }}>✗ Rejected</span>}
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

export default DeliverymanTracking;