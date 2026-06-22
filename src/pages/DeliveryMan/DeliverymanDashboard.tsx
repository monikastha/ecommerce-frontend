import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaBoxOpen, FaClock, FaMoneyBillWave } from "react-icons/fa";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type ChartRange = "Weekly" | "Monthly";

type ApiOrder = {
  id?: number | string;
  status?: string;
  delivery_fee?: string | number | null;
  created_at?: string;
  updated_at?: string;
  deliveryman?: number | string | { id?: number | string; user?: number | string; username?: string };
  delivery_man?: number | string | { id?: number | string; user?: number | string; username?: string };
  deliveryman_id?: number | string;
  delivery_man_id?: number | string;
  delivery_id?: number | string;
  assigned_delivery?: number | string | { id?: number | string; user?: number | string; username?: string };
  assigned_deliveryman?: number | string | { id?: number | string; user?: number | string; username?: string };
  assigned_to?: number | string | { id?: number | string; user?: number | string; username?: string };
};

const assignmentFields: (keyof ApiOrder)[] = [
  "deliveryman",
  "delivery_man",
  "deliveryman_id",
  "delivery_man_id",
  "delivery_id",
  "assigned_delivery",
  "assigned_deliveryman",
  "assigned_to",
];

const pendingStatuses = new Set(["pending", "confirmed", "processing", "shipped", "out_for_delivery"]);
const completedStatuses = new Set(["delivered"]);

const normalizeStatus = (status?: string) => (status || "").toLowerCase().replace(/\s+/g, "_");

const getAssignmentValues = (order: ApiOrder) =>
  assignmentFields.flatMap((field) => {
    const value = order[field];
    if (value === undefined || value === null || value === "") return [];
    if (typeof value === "object") {
      return [value.id, value.user, value.username].filter((item) => item !== undefined && item !== null && item !== "");
    }
    return [value];
  }).map(String);

const belongsToCurrentDeliveryman = (order: ApiOrder, identifiers: string[]) => {
  const assignmentValues = getAssignmentValues(order);
  if (assignmentValues.length === 0) return true;
  return assignmentValues.some((value) => identifiers.includes(value));
};

const orderDate = (order: ApiOrder) => {
  const rawDate = order.created_at || order.updated_at;
  const date = rawDate ? new Date(rawDate) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const moneyValue = (value: ApiOrder["delivery_fee"]) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
};

const formatCurrency = (value: number) =>
  `Rs. ${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const getStartOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const buildWeeklyData = (orders: ApiOrder[]) => {
  const today = getStartOfDay(new Date());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = date.toDateString();

    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      deliveries: orders.filter((order) => getStartOfDay(orderDate(order)).toDateString() === key).length,
    };
  });
};

const buildMonthlyData = (orders: ApiOrder[]) => {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);

    return {
      label: date.toLocaleDateString("en-US", { month: "short" }),
      deliveries: orders.filter((order) => {
        const created = orderDate(order);
        return created.getFullYear() === date.getFullYear() && created.getMonth() === date.getMonth();
      }).length,
    };
  });
};

const DeliverymanDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [chartRange, setChartRange] = useState<ChartRange>("Weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deliveryIdentifiers = useMemo(
    () => [
      localStorage.getItem("delivery_id"),
      localStorage.getItem("user_id"),
      localStorage.getItem("username"),
      localStorage.getItem("email"),
    ].filter(Boolean) as string[],
    []
  );

  useEffect(() => {
    let ignore = false;

    const fetchAssignedDeliveries = async () => {
      try {
        setError("");
        const res = await fetch(`${API_ORIGIN}/api/orders/`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || data.error || "Failed to load delivery data.");
        }

        const nextOrders = Array.isArray(data)
          ? data.filter((order: ApiOrder) => belongsToCurrentDeliveryman(order, deliveryIdentifiers))
          : [];

        if (!ignore) setOrders(nextOrders);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load delivery data.");
          setOrders([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchAssignedDeliveries();
    const intervalId = window.setInterval(fetchAssignedDeliveries, 30000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [deliveryIdentifiers]);

  const totalAssigned = orders.length;
  const pendingDeliveries = orders.filter((order) => pendingStatuses.has(normalizeStatus(order.status))).length;
  const completedDeliveries = orders.filter((order) => completedStatuses.has(normalizeStatus(order.status))).length;
  const totalEarnings = orders
    .filter((order) => completedStatuses.has(normalizeStatus(order.status)))
    .reduce((sum, order) => sum + moneyValue(order.delivery_fee), 0);
  const chartData = chartRange === "Weekly" ? buildWeeklyData(orders) : buildMonthlyData(orders);
  const maxDeliveries = Math.max(...chartData.map((item) => item.deliveries), 1);

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        html, body { height:100%; background:#f1f5f9; }
        .dash-layout { display:flex; min-height:100vh; }
        .dash-main { flex:1; display:flex; flex-direction:column; background:#f1f5f9; }
        .dash-content { padding:16px 20px; }
        .breadcrumb { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
        .breadcrumb h2 { font-size:15px; color:#334155; font-weight:600; }
        .stat-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:16px; }
        .stat-card { background:#dbeafe; border-radius:14px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; min-height:80px; }
        .stat-card:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(37,99,235,0.15); }
        .stat-card-left h4 { font-size:12px; color:#1e40af; font-weight:600; margin-bottom:6px; }
        .stat-card-left h2 { font-size:22px; color:#1e3a8a; font-weight:700; }
        .stat-card-icon { font-size:26px; color:#3b82f6; opacity:0.6; flex-shrink:0; }
        .chart-section { background:white; border-radius:14px; padding:16px 18px; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
        .chart-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .chart-header h3 { font-size:14px; color:#1e40af; font-weight:600; }
        .chart-select { border:1px solid #e2e8f0; border-radius:8px; padding:3px 10px; font-size:12px; color:#475569; background:white; cursor:pointer; }
        .dashboard-message { margin-bottom:12px; padding:10px 12px; border-radius:8px; font-size:13px; }
        .dashboard-message.error { color:#991b1b; background:#fee2e2; }
        .dashboard-message.loading { color:#1e40af; background:#dbeafe; }
        @media(max-width:768px){ .stat-cards { grid-template-columns:1fr; } }
      `}</style>

      <div className="dash-layout">
        <DeliverymanSidebar />
        <div className="dash-main">
          <DeliverymanNavbar />
          <div className="dash-content">

            <div className="breadcrumb">
              <h2>Dashboard</h2>
            </div>

            {loading && <div className="dashboard-message loading">Loading assigned delivery data...</div>}
            {error && <div className="dashboard-message error">{error}</div>}

            <div className="stat-cards">

              <div className="stat-card" onClick={() => navigate("/delivery/tracking")}>
                <div className="stat-card-left">
                  <h4>Total Assigned Deliveries</h4>
                  <h2>{totalAssigned}</h2>
                </div>
                <FaTruck className="stat-card-icon" />
              </div>

              <div className="stat-card" onClick={() => navigate("/delivery/tracking?filter=Pending")}>
                <div className="stat-card-left">
                  <h4>Pending Deliveries</h4>
                  <h2>{pendingDeliveries}</h2>
                </div>
                <FaClock className="stat-card-icon" />
              </div>

              <div className="stat-card" onClick={() => navigate("/delivery/earnings")}>
                <div className="stat-card-left">
                  <h4>Total Earnings</h4>
                  <h2>{formatCurrency(totalEarnings)}</h2>
                </div>
                <FaMoneyBillWave className="stat-card-icon" />
              </div>

              <div className="stat-card" onClick={() => navigate("/delivery/tracking?filter=Delivered")}>
                <div className="stat-card-left">
                  <h4>Completed Deliveries</h4>
                  <h2>{completedDeliveries}</h2>
                </div>
                <FaBoxOpen className="stat-card-icon" />
              </div>

            </div>

            <div className="chart-section">
              <div className="chart-header">
                <h3>No of Orders</h3>
                <select
                  className="chart-select"
                  value={chartRange}
                  onChange={(event) => setChartRange(event.target.value as ChartRange)}
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={28} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:"#94a3b8" }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize:11, fill:"#94a3b8" }} domain={[0, Math.ceil(maxDeliveries * 1.2)]} />
                  <Tooltip contentStyle={{ borderRadius:"10px", border:"none", boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="deliveries" name="Deliveries" fill="#ef4444" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DeliverymanDashboard;
