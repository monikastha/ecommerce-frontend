import { useEffect, useMemo, useState } from "react";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";
import { FaBoxes, FaChartBar, FaClipboardCheck, FaExclamationTriangle, FaSyncAlt } from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type StockItem = {
  id: number;
  product_name?: string;
  category_name?: string | null;
  quantity: number;
  availability_status?: "in_stock" | "low_stock" | "out_of_stock";
  available_to_buyers?: boolean;
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

const warehouseStatuses = [
  "warehouse_processing",
  "ready_for_delivery",
  "delivery_assigned",
  "delivery_accepted",
  "picked_up",
  "out_for_delivery",
  "delivered",
];

const statusLabel = (status: string) => status.replace(/_/g, " ");

const WarehouseReports = () => {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [orders, setOrders] = useState<WarehouseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const [stockRes, orderRes] = await Promise.all([
        fetch(`${API_ORIGIN}/api/warehouse/stock/`),
        fetch(`${API_ORIGIN}/api/orders/`),
      ]);
      const [stockData, orderData] = await Promise.all([stockRes.json(), orderRes.json()]);

      if (!stockRes.ok) throw new Error(stockData.error || stockData.detail || "Failed to load stock report.");
      if (!orderRes.ok) throw new Error(orderData.error || orderData.detail || "Failed to load order report.");

      setStocks(listFromResponse<StockItem>(stockData));
      setOrders(listFromResponse<WarehouseOrder>(orderData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load warehouse reports.");
      setStocks([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const report = useMemo(() => {
    const warehouseOrders = orders.filter((order) => warehouseStatuses.includes(order.status));
    const completed = warehouseOrders.filter((order) => order.status === "delivered").length;
    const pending = warehouseOrders.filter((order) => order.status === "warehouse_processing").length;
    const inTransit = warehouseOrders.filter((order) =>
      ["ready_for_delivery", "delivery_assigned", "delivery_accepted", "picked_up", "out_for_delivery"].includes(order.status)
    ).length;
    const efficiency = warehouseOrders.length ? Math.round(((completed + inTransit) / warehouseOrders.length) * 100) : 0;
    const totalStock = stocks.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const lowStock = stocks.filter((item) => item.availability_status === "low_stock").length;
    const outOfStock = stocks.filter((item) => Number(item.quantity || 0) <= 0 || item.availability_status === "out_of_stock").length;
    const buyerAvailable = stocks.filter((item) => item.available_to_buyers).length;

    const categoryStock = Object.entries(
      stocks.reduce<Record<string, { products: number; units: number; low: number }>>((acc, item) => {
        const key = item.category_name || "Uncategorized";
        acc[key] = acc[key] || { products: 0, units: 0, low: 0 };
        acc[key].products += 1;
        acc[key].units += Number(item.quantity || 0);
        if (Number(item.quantity || 0) < 10) acc[key].low += 1;
        return acc;
      }, {})
    )
      .map(([category, values]) => ({ category, ...values }))
      .sort((a, b) => b.units - a.units);

    const statusCounts = warehouseStatuses.map((status) => ({
      status,
      count: warehouseOrders.filter((order) => order.status === status).length,
    }));

    const recentCompleted = warehouseOrders
      .filter((order) => order.status === "delivered")
      .sort((a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime())
      .slice(0, 6);

    return {
      warehouseOrders,
      completed,
      pending,
      inTransit,
      efficiency,
      totalStock,
      lowStock,
      outOfStock,
      buyerAvailable,
      categoryStock,
      statusCounts,
      recentCompleted,
    };
  }, [orders, stocks]);

  const largestStatus = Math.max(1, ...report.statusCounts.map((item) => item.count));

  return (
    <>
      <style>{`
        .layout{display:flex;min-height:100vh;background:#f1f5f9;font-family:'Poppins',sans-serif;}
        .main{flex:1;display:flex;flex-direction:column;min-width:0;}
        .content{padding:24px;}
        .head{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px;}
        .head h2{font-size:24px;color:#0f172a;margin:0;font-weight:900;}
        .head p{font-size:13px;color:#64748b;margin-top:5px;}
        .refresh{width:42px;height:42px;border:none;border-radius:8px;background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .error{margin-bottom:14px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;border-radius:8px;padding:13px;font-size:13px;font-weight:800;}
        .cards{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:14px;margin-bottom:18px;}
        .metric{background:white;border:1px solid #e2e8f0;border-radius:8px;padding:16px;box-shadow:0 8px 20px rgba(15,23,42,0.06);display:flex;justify-content:space-between;align-items:center;}
        .metric span{font-size:12px;color:#64748b;text-transform:uppercase;font-weight:900;}
        .metric strong{display:block;font-size:28px;color:#0f172a;margin-top:8px;}
        .metricIcon{width:42px;height:42px;border-radius:8px;color:white;display:flex;align-items:center;justify-content:center;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
        .panel{background:white;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 8px 20px rgba(15,23,42,0.06);overflow:hidden;}
        .panel h3{padding:16px;margin:0;border-bottom:1px solid #f1f5f9;font-size:16px;color:#0f172a;}
        .barRow{display:grid;grid-template-columns:170px 1fr 48px;gap:12px;align-items:center;padding:13px 16px;border-bottom:1px solid #f8fafc;font-size:13px;}
        .barTrack{height:10px;background:#e2e8f0;border-radius:999px;overflow:hidden;}
        .barFill{height:100%;background:#2563eb;border-radius:999px;}
        .tableRow{display:grid;grid-template-columns:1.4fr .7fr .7fr .7fr;gap:12px;padding:13px 16px;border-bottom:1px solid #f8fafc;align-items:center;font-size:13px;}
        .tableRow.header{background:#f8fafc;color:#64748b;font-size:12px;text-transform:uppercase;font-weight:900;}
        .orderRow{display:grid;grid-template-columns:1.2fr 1fr .8fr;gap:12px;padding:13px 16px;border-bottom:1px solid #f8fafc;align-items:center;font-size:13px;}
        .muted{font-size:12px;color:#64748b;margin-top:4px;}
        .empty{padding:24px;text-align:center;color:#94a3b8;font-size:13px;font-weight:800;}
        @media(max-width:1050px){.cards{grid-template-columns:repeat(2,1fr);}.grid{grid-template-columns:1fr;}}
        @media(max-width:720px){.content{padding:16px;}.cards{grid-template-columns:1fr;}.barRow,.tableRow,.orderRow{grid-template-columns:1fr;}}
      `}</style>

      <div className="layout">
        <WarehouseStaffSidebar />
        <div className="main">
          <WarehouseStaffNavbar />
          <div className="content">
            <div className="head">
              <div>
                <h2>Warehouse Reports</h2>
                <p>Operational reporting from live inventory and order records</p>
              </div>
              <button className="refresh" onClick={loadReports} title="Refresh reports" aria-label="Refresh reports">
                <FaSyncAlt />
              </button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="cards">
              <div className="metric">
                <div><span>Efficiency</span><strong>{loading ? "..." : `${report.efficiency}%`}</strong></div>
                <div className="metricIcon" style={{ background: "#2563eb" }}><FaChartBar /></div>
              </div>
              <div className="metric">
                <div><span>Completed</span><strong>{loading ? "..." : report.completed}</strong></div>
                <div className="metricIcon" style={{ background: "#16a34a" }}><FaClipboardCheck /></div>
              </div>
              <div className="metric">
                <div><span>Pending Packing</span><strong>{loading ? "..." : report.pending}</strong></div>
                <div className="metricIcon" style={{ background: "#d97706" }}><FaExclamationTriangle /></div>
              </div>
              <div className="metric">
                <div><span>Stock Units</span><strong>{loading ? "..." : report.totalStock}</strong></div>
                <div className="metricIcon" style={{ background: "#0f766e" }}><FaBoxes /></div>
              </div>
            </div>

            <div className="grid">
              <div className="panel">
                <h3>Order Status Breakdown</h3>
                {loading ? (
                  <div className="empty">Loading order status report...</div>
                ) : report.statusCounts.some((item) => item.count > 0) ? (
                  report.statusCounts.map((item) => (
                    <div className="barRow" key={item.status}>
                      <strong>{statusLabel(item.status)}</strong>
                      <div className="barTrack">
                        <div className="barFill" style={{ width: `${(item.count / largestStatus) * 100}%` }} />
                      </div>
                      <strong>{item.count}</strong>
                    </div>
                  ))
                ) : (
                  <div className="empty">No warehouse order activity found.</div>
                )}
              </div>

              <div className="panel">
                <h3>Inventory By Category</h3>
                <div className="tableRow header">
                  <span>Category</span><span>Products</span><span>Units</span><span>Low</span>
                </div>
                {loading ? (
                  <div className="empty">Loading category stock...</div>
                ) : report.categoryStock.length ? (
                  report.categoryStock.map((item) => (
                    <div className="tableRow" key={item.category}>
                      <strong>{item.category}</strong>
                      <span>{item.products}</span>
                      <span>{item.units}</span>
                      <span>{item.low}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty">No inventory records found.</div>
                )}
              </div>

              <div className="panel">
                <h3>Inventory Health</h3>
                <div className="tableRow header">
                  <span>Measure</span><span>Count</span><span>Share</span><span>Status</span>
                </div>
                {[
                  { label: "Available To Buyers", count: report.buyerAvailable, status: "Visible" },
                  { label: "Low Stock Products", count: report.lowStock, status: "Restock" },
                  { label: "Out Of Stock Products", count: report.outOfStock, status: "Blocked" },
                ].map((item) => (
                  <div className="tableRow" key={item.label}>
                    <strong>{item.label}</strong>
                    <span>{loading ? "..." : item.count}</span>
                    <span>{loading || !stocks.length ? "0%" : `${Math.round((item.count / stocks.length) * 100)}%`}</span>
                    <span>{item.status}</span>
                  </div>
                ))}
              </div>

              <div className="panel">
                <h3>Recently Completed Deliveries</h3>
                {loading ? (
                  <div className="empty">Loading completed orders...</div>
                ) : report.recentCompleted.length ? (
                  report.recentCompleted.map((order) => (
                    <div className="orderRow" key={order.id}>
                      <div>
                        <strong>{order.order_number || `Order #${order.id}`}</strong>
                        <div className="muted">{order.customer_name || "Customer"}</div>
                      </div>
                      <span>{order.updated_at ? new Date(order.updated_at).toLocaleString() : "-"}</span>
                      <strong>Rs. {Number(order.total || 0).toLocaleString()}</strong>
                    </div>
                  ))
                ) : (
                  <div className="empty">No delivered warehouse orders yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WarehouseReports;
