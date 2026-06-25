import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";
import {
  FaBoxes,
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaExclamationTriangle,
  FaSyncAlt,
  FaTruck,
} from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type StockItem = {
  id: number;
  product_name?: string;
  category_name?: string | null;
  quantity: number;
  availability_status?: "in_stock" | "low_stock" | "out_of_stock";
  available_to_buyers?: boolean;
  updated_at?: string;
};

type WarehouseOrder = {
  id: number;
  order_number?: string;
  customer_name?: string;
  delivery_type?: string;
  status: string;
  total?: string | number;
  created_at?: string;
  updated_at?: string;
};

const listFromResponse = <T,>(data: T[] | { results?: T[] }) =>
  Array.isArray(data) ? data : data.results || [];

const currency = (value?: string | number) => `Rs. ${Number(value || 0).toLocaleString()}`;

const statusLabel = (status: string) => status.replace(/_/g, " ");

const WarehouseStaffDashboard = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [orders, setOrders] = useState<WarehouseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [stockRes, orderRes] = await Promise.all([
        fetch(`${API_ORIGIN}/api/warehouse/stock/`),
        fetch(`${API_ORIGIN}/api/orders/`),
      ]);
      const [stockData, orderData] = await Promise.all([stockRes.json(), orderRes.json()]);

      if (!stockRes.ok) throw new Error(stockData.error || stockData.detail || "Failed to load warehouse stock.");
      if (!orderRes.ok) throw new Error(orderData.error || orderData.detail || "Failed to load warehouse orders.");

      setStocks(listFromResponse<StockItem>(stockData));
      setOrders(listFromResponse<WarehouseOrder>(orderData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load warehouse dashboard.");
      setStocks([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const totalUnits = stocks.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const outOfStock = stocks.filter((item) => Number(item.quantity || 0) <= 0 || item.availability_status === "out_of_stock").length;
    const lowStock = stocks.filter((item) => item.availability_status === "low_stock").length;
    const inStock = stocks.filter((item) => Number(item.quantity || 0) > 0).length;
    const buyerAvailable = stocks.filter((item) => item.available_to_buyers).length;
    const processing = orders.filter((order) => order.status === "warehouse_processing").length;
    const ready = orders.filter((order) => order.status === "ready_for_delivery").length;
    const tracked = orders.filter((order) =>
      ["ready_for_delivery", "delivery_assigned", "delivery_accepted", "picked_up", "out_for_delivery", "delivered"].includes(order.status)
    ).length;
    const delivered = orders.filter((order) => order.status === "delivered").length;
    const emergency = orders.filter((order) => order.delivery_type === "emergency" && order.status !== "delivered" && order.status !== "cancelled").length;

    return { totalUnits, outOfStock, lowStock, inStock, buyerAvailable, processing, ready, tracked, delivered, emergency };
  }, [orders, stocks]);

  const recentWarehouseOrders = useMemo(
    () =>
      orders
        .filter((order) =>
          ["warehouse_processing", "ready_for_delivery", "delivery_assigned", "delivery_accepted", "picked_up", "out_for_delivery", "delivered"].includes(order.status)
        )
        .sort((a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime())
        .slice(0, 5),
    [orders]
  );

  const lowStockItems = useMemo(
    () =>
      stocks
        .filter((item) => Number(item.quantity || 0) < 10)
        .sort((a, b) => Number(a.quantity || 0) - Number(b.quantity || 0))
        .slice(0, 5),
    [stocks]
  );

  const statCards = [
    { label: "Total Stock Units", value: metrics.totalUnits, icon: FaBoxes, color: "#2563eb", path: "/warehouse/inventory" },
    { label: "Products In Stock", value: metrics.inStock, icon: FaCheckCircle, color: "#16a34a", path: "/warehouse/inventory" },
    { label: "Low Stock Alerts", value: metrics.lowStock, icon: FaExclamationTriangle, color: "#d97706", path: "/warehouse/inventory" },
    { label: "Out Of Stock", value: metrics.outOfStock, icon: FaExclamationTriangle, color: "#dc2626", path: "/warehouse/inventory" },
    { label: "Orders To Pack", value: metrics.processing, icon: FaClipboardList, color: "#7c3aed", path: "/warehouse/orders" },
    { label: "Ready For Delivery", value: metrics.ready, icon: FaTruck, color: "#0f766e", path: "/warehouse/tracking" },
    { label: "Tracked Orders", value: metrics.tracked, icon: FaChartLine, color: "#0284c7", path: "/warehouse/tracking" },
    { label: "Emergency Active", value: metrics.emergency, icon: FaExclamationTriangle, color: "#be123c", path: "/warehouse/orders" },
  ];

  return (
    <>
      <style>{`
        .dash-layout{display:flex;min-height:100vh;background:#f1f5f9;font-family:'Poppins',sans-serif;}
        .dash-main{flex:1;display:flex;flex-direction:column;min-width:0;}
        .dash-content{padding:24px;}
        .dash-head{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px;}
        .dash-title h2{font-size:24px;color:#0f172a;margin:0;font-weight:900;}
        .dash-title p{font-size:13px;color:#64748b;margin-top:5px;}
        .refresh{width:42px;height:42px;border:none;border-radius:8px;background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .error{margin-bottom:14px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;border-radius:8px;padding:13px;font-size:13px;font-weight:800;}
        .cards{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:14px;margin-bottom:20px;}
        .card{background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;box-shadow:0 8px 20px rgba(15,23,42,0.06);}
        .card:hover{transform:translateY(-2px);box-shadow:0 12px 24px rgba(15,23,42,0.1);}
        .card h3{font-size:12px;color:#64748b;text-transform:uppercase;margin:0;font-weight:900;}
        .card h2{font-size:28px;color:#0f172a;margin:8px 0 0;font-weight:900;}
        .cardIcon{width:42px;height:42px;border-radius:8px;color:white;display:flex;align-items:center;justify-content:center;font-size:18px;}
        .dashboard-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;}
        .panel{background:white;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 8px 20px rgba(15,23,42,0.06);overflow:hidden;}
        .panel-head{padding:16px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;}
        .panel-head h3{margin:0;font-size:16px;color:#0f172a;}
        .panel-head button{border:none;background:#eff6ff;color:#1d4ed8;border-radius:7px;padding:8px 10px;font-size:12px;font-weight:900;cursor:pointer;}
        .row{display:grid;grid-template-columns:1.4fr .8fr .8fr;gap:12px;padding:14px 16px;border-bottom:1px solid #f8fafc;align-items:center;font-size:13px;}
        .row:last-child{border-bottom:none;}
        .muted{font-size:12px;color:#64748b;margin-top:4px;}
        .badge{display:inline-flex;border-radius:999px;padding:6px 10px;background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:900;text-transform:capitalize;}
        .stock-row{display:grid;grid-template-columns:1.5fr .7fr .7fr;gap:12px;padding:14px 16px;border-bottom:1px solid #f8fafc;align-items:center;font-size:13px;}
        .empty{padding:24px;text-align:center;color:#94a3b8;font-size:13px;font-weight:800;}
        @media(max-width:1100px){.cards{grid-template-columns:repeat(2,1fr);}.dashboard-grid{grid-template-columns:1fr;}}
        @media(max-width:720px){.dash-content{padding:16px;}.cards{grid-template-columns:1fr;}.row,.stock-row{grid-template-columns:1fr;}}
      `}</style>

      <div className="dash-layout">
        <WarehouseStaffSidebar />
        <div className="dash-main">
          <WarehouseStaffNavbar />
          <div className="dash-content">
            <div className="dash-head">
              <div className="dash-title">
                <h2>Warehouse Dashboard</h2>
                <p>Live inventory, packing, and delivery readiness from the backend</p>
              </div>
              <button className="refresh" onClick={loadDashboard} title="Refresh dashboard" aria-label="Refresh dashboard">
                <FaSyncAlt />
              </button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="cards">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div className="card" key={card.label} onClick={() => navigate(card.path)}>
                    <div>
                      <h3>{card.label}</h3>
                      <h2>{loading ? "..." : card.value}</h2>
                    </div>
                    <div className="cardIcon" style={{ background: card.color }}>
                      <Icon />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="dashboard-grid">
              <div className="panel">
                <div className="panel-head">
                  <h3>Recent Warehouse Orders</h3>
                  <button onClick={() => navigate("/warehouse/tracking")}>View Tracking</button>
                </div>
                {loading ? (
                  <div className="empty">Loading orders...</div>
                ) : recentWarehouseOrders.length ? (
                  recentWarehouseOrders.map((order) => (
                    <div className="row" key={order.id}>
                      <div>
                        <strong>{order.order_number || `Order #${order.id}`}</strong>
                        <div className="muted">{order.customer_name || "Customer"} | {order.delivery_type || "normal"}</div>
                      </div>
                      <span className="badge">{statusLabel(order.status)}</span>
                      <strong>{currency(order.total)}</strong>
                    </div>
                  ))
                ) : (
                  <div className="empty">No warehouse orders found.</div>
                )}
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h3>Stock Needing Attention</h3>
                  <button onClick={() => navigate("/warehouse/inventory")}>Open Inventory</button>
                </div>
                {loading ? (
                  <div className="empty">Loading inventory...</div>
                ) : lowStockItems.length ? (
                  lowStockItems.map((item) => (
                    <div className="stock-row" key={item.id}>
                      <div>
                        <strong>{item.product_name || "Product"}</strong>
                        <div className="muted">{item.category_name || "Uncategorized"}</div>
                      </div>
                      <strong>{item.quantity} units</strong>
                      <span className="badge" style={{ background: Number(item.quantity || 0) <= 0 ? "#fee2e2" : "#fef3c7", color: Number(item.quantity || 0) <= 0 ? "#991b1b" : "#92400e" }}>
                        {Number(item.quantity || 0) <= 0 ? "out of stock" : "low stock"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="empty">All stocked products are above the low-stock threshold.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WarehouseStaffDashboard;
