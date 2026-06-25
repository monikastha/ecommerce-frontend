import { useEffect, useMemo, useState } from "react";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";
import { FaBox, FaCheckCircle, FaRoute, FaSearch, FaShippingFast, FaSyncAlt, FaTruck } from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const TRACKED_STATUSES = ["ready_for_delivery", "delivery_assigned", "delivery_accepted", "picked_up", "out_for_delivery", "delivered"];

type FilterTab = "all" | "ready_for_delivery" | "delivery_assigned" | "delivery_accepted" | "picked_up" | "out_for_delivery" | "delivered";

type OrderItem = {
  id: number;
  product_name?: string;
  quantity?: number;
  selected_size?: string;
};

type TrackedOrder = {
  id: number;
  order_number: string;
  customer_name: string;
  phone?: string;
  address?: string;
  city?: string;
  delivery_type?: string;
  delivery_location_name?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  assigned_deliveryman_detail?: {
    name?: string;
    phone?: string;
  } | null;
  items?: OrderItem[];
};

const statusLabel = (status?: string) => (status || "ready_for_delivery").replace(/_/g, " ");

const orderProducts = (order: TrackedOrder) =>
  order.items?.length
    ? order.items
        .map((item) => {
          const size = item.selected_size ? ` (${item.selected_size})` : "";
          return `${item.product_name || "Product"}${size} x${item.quantity || 1}`;
        })
        .join(", ")
    : "No products";

const statusColor = (status: string) => {
  if (status === "ready_for_delivery") return "#7c3aed";
  if (status === "delivery_assigned") return "#2563eb";
  if (status === "delivery_accepted") return "#0f766e";
  if (status === "picked_up") return "#0284c7";
  if (status === "out_for_delivery") return "#d97706";
  if (status === "delivered") return "#16a34a";
  return "#64748b";
};

const WarehouseOrderTracking = () => {
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Failed to load tracked orders.");
      const liveOrders = Array.isArray(data)
        ? data.filter((order: TrackedOrder) => TRACKED_STATUSES.includes(order.status))
        : [];
      setOrders(liveOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tracked orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === "all" || order.status === filter;
      const matchesSearch =
        !query ||
        [
          order.order_number,
          order.customer_name,
          order.phone,
          order.address,
          order.city,
          order.delivery_location_name,
          order.assigned_deliveryman_detail?.name,
          orderProducts(order),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [filter, orders, search]);

  const countByStatus = (status: string) => orders.filter((order) => order.status === status).length;

  return (
    <>
      <style>{`
        .layout{display:flex;min-height:100vh;background:#f1f5f9;font-family:'Poppins',sans-serif;}
        .main{flex:1;display:flex;flex-direction:column;}
        .content{padding:24px;}
        .pageHead{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px;}
        .titleWrap{display:flex;align-items:center;gap:12px;}
        .titleIcon{width:48px;height:48px;border-radius:10px;background:#0f766e;color:white;display:flex;align-items:center;justify-content:center;font-size:19px;}
        .title{font-size:24px;font-weight:900;color:#0f172a;margin:0;}
        .subtitle{font-size:13px;color:#64748b;margin-top:4px;}
        .toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .searchBox{width:320px;max-width:100%;display:flex;align-items:center;gap:9px;background:white;border:1px solid #d1d5db;border-radius:8px;padding:10px 12px;}
        .searchBox input{border:none;outline:none;width:100%;font-size:13px;background:transparent;}
        .refreshBtn{height:40px;width:40px;border:none;border-radius:8px;background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
        .filters button{border:1px solid #d1d5db;background:white;color:#475569;border-radius:999px;padding:9px 12px;font-size:12px;font-weight:900;cursor:pointer;display:flex;align-items:center;gap:7px;}
        .filters button.active{background:#2563eb;border-color:#2563eb;color:white;}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px;}
        .trackCard{background:white;border:1px solid #e2e8f0;border-radius:10px;padding:16px;box-shadow:0 8px 20px rgba(15,23,42,0.06);}
        .cardHead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;}
        .orderNo{font-size:15px;font-weight:900;color:#0f172a;}
        .badge{display:inline-flex;border-radius:999px;padding:6px 10px;color:white;font-size:11px;font-weight:900;text-transform:capitalize;white-space:nowrap;}
        .customer{font-size:14px;font-weight:900;color:#334155;margin-top:10px;}
        .muted{font-size:12px;color:#64748b;margin-top:5px;line-height:1.5;}
        .timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:15px;}
        .step{height:6px;border-radius:999px;background:#e2e8f0;}
        .step.done{background:#16a34a;}
        .deliveryman{margin-top:14px;border-top:1px solid #f1f5f9;padding-top:12px;font-size:12px;color:#475569;font-weight:800;}
        .empty,.error{padding:24px;text-align:center;font-size:13px;font-weight:800;}
        .empty{background:white;border:1px solid #e2e8f0;border-radius:10px;color:#94a3b8;}
        .error{margin-bottom:14px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;border-radius:8px;text-align:left;}
        @media(max-width:760px){.content{padding:16px;}.grid{grid-template-columns:1fr;}}
      `}</style>

      <div className="layout">
        <WarehouseStaffSidebar />
        <div className="main">
          <WarehouseStaffNavbar />
          <div className="content">
            <div className="pageHead">
              <div className="titleWrap">
                <div className="titleIcon"><FaRoute /></div>
                <div>
                  <h2 className="title">Order Tracking</h2>
                  <p className="subtitle">Track orders after warehouse processing through delivery completion</p>
                </div>
              </div>
              <div className="toolbar">
                <div className="searchBox">
                  <FaSearch color="#64748b" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tracked orders..." />
                </div>
                <button className="refreshBtn" onClick={loadOrders} title="Refresh tracking" aria-label="Refresh tracking">
                  <FaSyncAlt />
                </button>
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="filters">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}><FaRoute /> All ({orders.length})</button>
              <button className={filter === "ready_for_delivery" ? "active" : ""} onClick={() => setFilter("ready_for_delivery")}><FaBox /> Ready ({countByStatus("ready_for_delivery")})</button>
              <button className={filter === "delivery_assigned" ? "active" : ""} onClick={() => setFilter("delivery_assigned")}><FaShippingFast /> Assigned ({countByStatus("delivery_assigned")})</button>
              <button className={filter === "delivery_accepted" ? "active" : ""} onClick={() => setFilter("delivery_accepted")}><FaShippingFast /> Accepted ({countByStatus("delivery_accepted")})</button>
              <button className={filter === "picked_up" ? "active" : ""} onClick={() => setFilter("picked_up")}><FaTruck /> Picked ({countByStatus("picked_up")})</button>
              <button className={filter === "out_for_delivery" ? "active" : ""} onClick={() => setFilter("out_for_delivery")}><FaTruck /> Out ({countByStatus("out_for_delivery")})</button>
              <button className={filter === "delivered" ? "active" : ""} onClick={() => setFilter("delivered")}><FaCheckCircle /> Delivered ({countByStatus("delivered")})</button>
            </div>

            {loading ? (
              <div className="empty">Loading warehouse tracking...</div>
            ) : filteredOrders.length ? (
              <div className="grid">
                {filteredOrders.map((order) => {
                  const currentStep = TRACKED_STATUSES.indexOf(order.status);
                  return (
                    <div className="trackCard" key={order.id}>
                      <div className="cardHead">
                        <div>
                          <div className="orderNo">{order.order_number}</div>
                          <div className="muted">{order.updated_at ? `Updated ${new Date(order.updated_at).toLocaleString()}` : ""}</div>
                        </div>
                        <span className="badge" style={{ background: statusColor(order.status) }}>{statusLabel(order.status)}</span>
                      </div>
                      <div className="customer">{order.customer_name || "Customer"}</div>
                      <div className="muted">{orderProducts(order)}</div>
                      <div className="muted">{order.address || "-"}{order.city ? `, ${order.city}` : ""}</div>
                      <div className="timeline" aria-label="Warehouse order progress">
                        {TRACKED_STATUSES.map((status, index) => (
                          <span key={status} className={`step ${index <= currentStep ? "done" : ""}`} />
                        ))}
                      </div>
                      <div className="deliveryman">
                        Deliveryman: {order.assigned_deliveryman_detail?.name || "Not assigned yet"}
                        {order.assigned_deliveryman_detail?.phone ? ` | ${order.assigned_deliveryman_detail.phone}` : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty">No packed or tracked orders found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WarehouseOrderTracking;
