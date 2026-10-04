/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardCheck, FaFolder, FaShoppingCart, FaUsers } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaBell } from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Product = {
  id: number;
  name: string;
  status?: string;
  is_published?: boolean;
};

type Order = {
  order_number: ReactNode;
  customer_name: string;
  id: number;
  assigned_deliveryman?: number | null;
  total?: string | number;
  status?: string;
  delivery_type?: string;
  created_at?: string;
  updated_at?: string;
};

type DashboardStats = {
  users: number;
  products: Product[];
  categories: number;
  orders: Order[];
};

const countText = (value: number) => value.toLocaleString();
const moneyText = (value: number) => `Rs. ${value.toLocaleString()}`;
const listFromResponse = <T,>(data: T[] | { results?: T[] }) =>
  Array.isArray(data) ? data : data.results || [];
const statusLabel = (status: string) => status.replace(/_/g, " ");
const chartColors = ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#dc2626", "#0f766e"];
type CardStyle = CSSProperties & { "--card-color": string };

const AssistantDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    products: [],
    categories: 0,
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [usersRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
          fetch(`${API_ORIGIN}/api/users/`),
          fetch(`${API_ORIGIN}/api/products/`),
          fetch(`${API_ORIGIN}/api/productcategory/categories/`),
          fetch(`${API_ORIGIN}/api/orders/`),
        ]);

        if (!usersRes.ok || !productsRes.ok || !categoriesRes.ok || !ordersRes.ok) {
          throw new Error("Unable to load assistant dashboard.");
        }

        const [users, products, categories, orders] = await Promise.all([
          usersRes.json(),
          productsRes.json(),
          categoriesRes.json(),
          ordersRes.json(),
        ]);

        const userList = listFromResponse(users);
        const productList = listFromResponse<Product>(products);
        const categoryList = listFromResponse(categories);
        const orderList = listFromResponse<Order>(orders);

        setStats({
          users: userList.length,
          products: productList,
          categories: categoryList.length,
          orders: orderList,
        });
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const approvedProducts = stats.products.filter((product) => product.status === "approved").length;
  const pendingProducts = stats.products.filter((product) => product.status === "pending").length;
  const rejectedProducts = stats.products.filter((product) => product.status === "rejected").length;
  const flaggedProducts = stats.products.filter((product) => product.status === "flagged").length;
  const publishedProducts = stats.products.filter((product) => product.is_published).length;
  const totalEarnings = stats.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const emergencyOrders = stats.orders.filter((order) => order.delivery_type === "emergency").length;
  const activeOrders = stats.orders.filter((order) => !["delivered", "cancelled"].includes(order.status || "")).length;
  const unassignedDeliveries = stats.orders.filter((order) => order.status === "ready_for_delivery" && !order.assigned_deliveryman).length;

  const productStatusData = useMemo(
    () => [
      { label: "Approved", value: approvedProducts, color: "#16a34a" },
      { label: "Pending", value: pendingProducts, color: "#f97316" },
      { label: "Rejected", value: rejectedProducts, color: "#dc2626" },
      { label: "Flagged", value: flaggedProducts, color: "#7c3aed" },
      { label: "Draft", value: Math.max(stats.products.length - publishedProducts, 0), color: "#64748b" },
    ],
    [approvedProducts, flaggedProducts, pendingProducts, publishedProducts, rejectedProducts, stats.products.length]
  );

  const orderStatusData = useMemo(() => {
    const counts = stats.orders.reduce<Record<string, number>>((acc, order) => {
      const key = order.status || "pending";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([status, count]) => ({ status: statusLabel(status), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [stats.orders]);

  const deliveryTypeData = useMemo(() => {
    const normalOrders = stats.orders.filter((order) => order.delivery_type !== "emergency").length;
    return [
      { name: "Normal", value: normalOrders },
      { name: "Emergency", value: emergencyOrders },
    ].filter((item) => item.value > 0);
  }, [emergencyOrders, stats.orders]);

  const needsToDo = useMemo(
    () => [
      { label: "Review pending products", count: pendingProducts, path: "/assistant/product" },
      { label: "Check flagged products", count: flaggedProducts, path: "/assistant/product" },
      { label: "Process active orders", count: activeOrders, path: "/assistant/order" },
      { label: "Assign ready deliveries", count: unassignedDeliveries, path: "/assistant/order" },
      { label: "Monitor emergency orders", count: emergencyOrders, path: "/assistant/emergency-orders" },
    ],
    [activeOrders, emergencyOrders, flaggedProducts, pendingProducts, unassignedDeliveries]
  );

  const recentOrders = useMemo(
    () =>
      [...stats.orders]
        .sort((a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime())
        .slice(0, 5),
    [stats.orders]
  );

  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [ordersNotifs, setOrdersNotifs] = useState<Order[]>([]);
  const NOTIF_KEY = "assistant_order_notifications_seen_at";
  const [, setSeenAt] = useState(() => localStorage.getItem(NOTIF_KEY) || "");

  useEffect(() => {
    const loadOrderNotifications = async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/api/orders/`);
        const data = await res.json();
        if (!res.ok) throw new Error((data && (data as any).error) || "Failed to load order notifications");
        setOrdersNotifs(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error("assistant load order notifications", error);
      }
    };

    loadOrderNotifications();
    const interval = window.setInterval(loadOrderNotifications, 30000);
    return () => window.clearInterval(interval);
  }, []);



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function money(arg0: number): import("react").ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        .dashboard-container { background: #f6f8fb; min-height: 100vh; }
        .main-content { margin-left: 250px; width: calc(100% - 250px); min-height: 100vh; background: #f6f8fb; }
        .content { padding: 28px 30px; }
        .dashboard-title { font-size: 25px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .dashboard-subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
        /* Admin-style notification panel (copied) */
        .notification-wrap { position: relative; }
        .bell-btn { position: relative; width: 38px; height: 38px; border: none; border-radius: 10px; background: #f8fafc; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .bell-btn:hover { background: #eef2ff; }
        .badge { position: absolute; top: -5px; right: -5px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; background: #dc2626; color: white; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid white; }
        .notification-panel { position: absolute; top: 48px; right: 0; width: 380px; max-width: calc(100vw - 28px); background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 18px 45px rgba(15,23,42,0.16); overflow: hidden; z-index: 250; }
        .notification-head { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .notification-head h3 { font-size: 14px; color: #0f172a; font-weight: 800; margin: 0; }
        .notification-head button { border: none; background: #2563eb; color: white; border-radius: 8px; padding: 7px 10px; font-size: 11px; font-weight: 800; cursor: pointer; }
        .notification-list { max-height: 390px; overflow-y: auto; }
        .notification-item { width: 100%; border: none; background: white; text-align: left; padding: 13px 16px; border-bottom: 1px solid #f8fafc; cursor: pointer; display: grid; gap: 6px; }
        .notification-item:hover { background: #f8fafc; }
        .notification-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #0f172a; font-size: 13px; font-weight: 800; }
        .notification-total { color: #16a34a; white-space: nowrap; }
        .notification-meta { color: #64748b; font-size: 12px; line-height: 1.45; }
        .notification-status { display: inline-flex; width: fit-content; border-radius: 999px; padding: 4px 8px; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 800; text-transform: capitalize; }
        .notification-empty { padding: 28px 16px; text-align: center; color: #94a3b8; font-size: 13px; font-weight: 700; }
        .alert { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; padding: 12px 14px; border-radius: 8px; margin-bottom: 16px; font-weight: 700; }
        .cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
        .card {
          position: relative;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 19px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--card-color);
        }
        .card::after {
          content: "";
          position: absolute;
          right: -34px;
          top: -34px;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: var(--card-color);
          opacity: 0.08;
        }
        .card:hover {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--card-color), #e2e8f0 58%);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.11);
        }
        .card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .card h3 { font-size: 13px; color: #64748b; margin-bottom: 8px; font-weight: 700; }
        .card h1 { font-size: 28px; font-weight: 900; color: #0f172a; }
        .card small { display: block; margin-top: 9px; color: #64748b; font-size: 12px; font-weight: 700; }
        .card-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #fff;
          background: var(--card-color);
          box-shadow: 0 10px 20px color-mix(in srgb, var(--card-color), transparent 72%);
          position: relative;
          z-index: 1;
        }
        .chart-grid { margin-top: 26px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
        .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06); }
        .panel-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .panel h2 { color: #0f172a; font-size: 17px; font-weight: 800; }
        .panel p { color: #64748b; font-size: 12px; margin-top: 4px; }
        .chart-box { height: 280px; min-width: 0; }
        .todo-grid { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
        .todo-list { display: grid; gap: 10px; }
        .todo-item { display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: center; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; background: #f8fafc; cursor: pointer; transition: 0.2s; }
        .todo-item:hover { border-color: #5BBF9A; transform: translateY(-1px); }
        .todo-item strong { color: #334155; font-size: 13px; }
        .todo-count { min-width: 34px; text-align: center; border-radius: 999px; padding: 6px 10px; background: #fee2e2; color: #991b1b; font-size: 12px; font-weight: 900; }
        .recent-list { display: grid; gap: 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .recent-row { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; align-items: center; padding: 12px 14px; border-bottom: 1px solid #edf2f7; font-size: 13px; }
        .recent-row:last-child { border-bottom: 0; }
        .recent-row strong { color: #0f172a; }
        .badge { display: inline-flex; border-radius: 999px; padding: 5px 9px; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 900; text-transform: capitalize; }
        .empty { padding: 22px; text-align: center; color: #94a3b8; font-size: 13px; font-weight: 800; }
        .summary-grid { margin-top: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .summary { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; box-shadow: 0 8px 20px rgba(15,23,42,0.05); }
        .summary span { display: block; color: #64748b; font-size: 12px; font-weight: 800; }
        .summary strong { display: block; color: #0f172a; font-size: 20px; margin-top: 6px; }
        @media (max-width: 1180px) { .cards { grid-template-columns: repeat(2, 1fr); } .chart-grid, .todo-grid { grid-template-columns: 1fr; } }
        @media (max-width: 760px) { .main-content { margin-left: 0; width: 100%; } .content { padding: 18px; } .cards, .summary-grid { grid-template-columns: 1fr; } .recent-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />
        <div className="main-content">
          <AssistantNavbar />
          <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'flex-end' }}>
            <div className="notification-wrap" ref={notificationRef}>
              {notificationOpen && (
                <div className="notification-panel">
                  <div className="notification-head">
                    <h3>Order Notifications</h3>
                    <button onClick={() => navigate('/assistant/order')}>View Orders</button>
                  </div>
                  <div className="notification-list">
                    {ordersNotifs.length ? (
                      ordersNotifs.map((order) => (
                        <button
                          key={order.id}
                          className="notification-item"
                          onClick={() => {
                            setNotificationOpen(false);
                            navigate('/assistant/order');
                          }}
                        >
                          <div className="notification-title">
                            <span>{order.order_number}</span>
                            <span className="notification-total">{money(Number(order.total || 0))}</span>
                          </div>
                          <div className="notification-meta">
                            {order.customer_name || 'Buyer'} | {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}
                          </div>
                          <span className="notification-status">{order.delivery_type || 'normal'} | {statusLabel(order.status)}</span>
                        </button>
                      ))
                    ) : (
                      <div className="notification-empty">No order notifications yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="content">
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">Live users, products, categories, and order activity.</p>

            {error && <div className="alert">{error}</div>}

            <div className="cards">
              <div className="card" style={{ "--card-color": "#2563eb" } as CardStyle}>
                <div className="card-top">
                  <div>
                    <h3>Total Users</h3>
                    <h1>{loading ? "..." : countText(stats.users)}</h1>
                    <small>Registered platform users</small>
                  </div>
                  <div className="card-icon"><FaUsers /></div>
                </div>
              </div>
              <div className="card" style={{ "--card-color": "#16a34a" } as CardStyle}>
                <div className="card-top">
                  <div>
                    <h3>Total Products</h3>
                    <h1>{loading ? "..." : countText(stats.products.length)}</h1>
                    <small>{publishedProducts} published products</small>
                  </div>
                  <div className="card-icon"><FaBoxOpen /></div>
                </div>
              </div>
              <div className="card" style={{ "--card-color": "#f97316" } as CardStyle}>
                <div className="card-top">
                  <div>
                    <h3>Total Categories</h3>
                    <h1>{loading ? "..." : countText(stats.categories)}</h1>
                    <small>Active product groups</small>
                  </div>
                  <div className="card-icon"><FaFolder /></div>
                </div>
              </div>
              <div className="card" style={{ "--card-color": "#7c3aed" } as CardStyle}>
                <div className="card-top">
                  <div>
                    <h3>Total Orders</h3>
                    <h1>{loading ? "..." : countText(stats.orders.length)}</h1>
                    <small>{emergencyOrders} emergency orders</small>
                  </div>
                  <div className="card-icon"><FaShoppingCart /></div>
                </div>
              </div>
            </div>

            <div className="chart-grid">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Order Status Bar Graph</h2>
                    <p>Live order counts grouped by current backend status.</p>
                  </div>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderStatusData} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="status" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ border: "0", borderRadius: 8, boxShadow: "0 10px 26px rgba(15,23,42,0.12)" }} />
                      <Bar dataKey="count" name="Orders" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Product Status Pie Chart</h2>
                    <p>Approval, flag, rejection, and draft product split.</p>
                  </div>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productStatusData.filter((item) => item.value > 0)}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="48%"
                        outerRadius={88}
                        innerRadius={48}
                        paddingAngle={2}
                      >
                        {productStatusData.filter((item) => item.value > 0).map((item) => (
                          <Cell key={item.label} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ border: "0", borderRadius: 8, boxShadow: "0 10px 26px rgba(15,23,42,0.12)" }} />
                      <Legend verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="summary-grid">
              <div className="summary">
                <span>Pending Product Reviews</span>
                <strong>{loading ? "..." : countText(pendingProducts)}</strong>
              </div>
              <div className="summary">
                <span>Emergency Orders</span>
                <strong>{loading ? "..." : countText(emergencyOrders)}</strong>
              </div>
              <div className="summary">
                <span>Total Order Value</span>
                <strong>{loading ? "..." : moneyText(totalEarnings)}</strong>
              </div>
            </div>

            <div className="todo-grid">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Needs To Be Done</h2>
                    <p>Tasks calculated from live products and orders.</p>
                  </div>
                  <FaClipboardCheck color="#5BBF9A" />
                </div>
                <div className="todo-list">
                  {needsToDo.map((task) => (
                    <div className="todo-item" key={task.label} onClick={() => navigate(task.path)}>
                      <strong>{task.label}</strong>
                      <span className="todo-count">{loading ? "..." : task.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Delivery Type Pie Chart</h2>
                    <p>Normal versus emergency delivery demand.</p>
                  </div>
                </div>
                <div className="chart-box">
                  {deliveryTypeData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={deliveryTypeData} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={92}>
                          {deliveryTypeData.map((item, index) => (
                            <Cell key={item.name} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ border: "0", borderRadius: 8, boxShadow: "0 10px 26px rgba(15,23,42,0.12)" }} />
                        <Legend verticalAlign="bottom" iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty">No order delivery data yet.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="panel" style={{ marginTop: 20 }}>
              <div className="panel-head">
                <div>
                  <h2>Recent Orders</h2>
                  <p>Latest backend order activity for assistant follow-up.</p>
                </div>
              </div>
              <div className="recent-list">
                {loading ? (
                  <div className="empty">Loading recent orders...</div>
                ) : recentOrders.length ? (
                  recentOrders.map((order) => (
                    <div className="recent-row" key={order.id}>
                      <strong>Order #{order.id}</strong>
                      <span className="badge">{statusLabel(order.status || "pending")}</span>
                      <strong>{moneyText(Number(order.total || 0))}</strong>
                    </div>
                  ))
                ) : (
                  <div className="empty">No orders found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantDashboard;
