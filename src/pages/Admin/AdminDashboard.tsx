import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  FaBoxOpen,
  FaClipboardList,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStore,
  FaSyncAlt,
  FaTags,
  FaTruck,
  FaUsers,
  FaUserTie,
  FaWarehouse,
} from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type User = {
  id: number;
  role?: string;
};

type Product = {
  id: number;
  name: string;
  category_name?: string;
  seller_name?: string;
  price?: string | number;
  status?: "pending" | "approved" | "rejected" | "flagged";
  is_published?: boolean;
  created_at?: string;
};

type Category = {
  id: number;
  name: string;
};

type Seller = {
  id: number;
  name?: string;
  email?: string;
  status?: "pending" | "approved" | "rejected";
  created_at?: string;
};

type Staff = {
  id: number;
  name?: string;
  role?: "assistant" | "warehousestaff";
};

type Deliveryman = {
  id: number;
  name?: string;
};

type Buyer = {
  id: number;
  name?: string;
};

type Location = {
  id: number;
  name?: string;
  city?: string;
};

type StockItem = {
  id: number;
  product_name?: string;
  category_name?: string | null;
  quantity: number;
  availability_status?: "in_stock" | "low_stock" | "out_of_stock";
};

type Order = {
  id: number;
  order_number?: string;
  customer_name?: string;
  delivery_type?: string;
  payment_type?: string;
  status: string;
  total?: string | number;
  assigned_deliveryman?: number | null;
  created_at?: string;
  updated_at?: string;
};

const listFromResponse = <T,>(data: T[] | { results?: T[] }) =>
  Array.isArray(data) ? data : data.results || [];

const money = (value: number) => `Rs. ${value.toLocaleString()}`;
const statusLabel = (status: string) => status.replace(/_/g, " ");

const fetchList = async <T,>(url: string): Promise<T[]> => {
  const response = await axios.get<T[] | { results?: T[] }>(url);
  return listFromResponse<T>(response.data);
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [deliverymen, setDeliverymen] = useState<Deliveryman[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        usersRes,
        productsRes,
        categoriesRes,
        ordersRes,
        sellersRes,
        staffRes,
        deliveryRes,
        buyersRes,
        locationsRes,
        stockRes,
      ] = await Promise.allSettled([
        fetchList<User>(`${API_ORIGIN}/api/users/`),
        fetchList<Product>(`${API_ORIGIN}/api/products/`),
        fetchList<Category>(`${API_ORIGIN}/api/productcategory/categories/`),
        fetchList<Order>(`${API_ORIGIN}/api/orders/`),
        fetchList<Seller>(`${API_ORIGIN}/api/seller/`),
        fetchList<Staff>(`${API_ORIGIN}/api/staff/`),
        fetchList<Deliveryman>(`${API_ORIGIN}/api/deliveryman/delivery/`),
        fetchList<Buyer>(`${API_ORIGIN}/api/buyer/`),
        fetchList<Location>(`${API_ORIGIN}/api/locations/`),
        fetchList<StockItem>(`${API_ORIGIN}/api/warehouse/stock/`),
      ]);

      const failures = [
        usersRes,
        productsRes,
        categoriesRes,
        ordersRes,
        sellersRes,
        staffRes,
        deliveryRes,
        buyersRes,
        locationsRes,
        stockRes,
      ].filter((result) => result.status === "rejected");

      setUsers(usersRes.status === "fulfilled" ? usersRes.value : []);
      setProducts(productsRes.status === "fulfilled" ? productsRes.value : []);
      setCategories(categoriesRes.status === "fulfilled" ? categoriesRes.value : []);
      setOrders(ordersRes.status === "fulfilled" ? ordersRes.value : []);
      setSellers(sellersRes.status === "fulfilled" ? sellersRes.value : []);
      setStaff(staffRes.status === "fulfilled" ? staffRes.value : []);
      setDeliverymen(deliveryRes.status === "fulfilled" ? deliveryRes.value : []);
      setBuyers(buyersRes.status === "fulfilled" ? buyersRes.value : []);
      setLocations(locationsRes.status === "fulfilled" ? locationsRes.value : []);
      setStocks(stockRes.status === "fulfilled" ? stockRes.value : []);

      if (failures.length) {
        setError(`${failures.length} dashboard data source${failures.length > 1 ? "s" : ""} could not be loaded.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const dashboard = useMemo(() => {
    const deliveredOrders = orders.filter((order) => order.status === "delivered");
    const revenue = deliveredOrders.reduce((total, order) => total + Number(order.total || 0), 0);
    const orderValue = orders.reduce((total, order) => total + Number(order.total || 0), 0);
    const pendingProducts = products.filter((product) => product.status === "pending").length;
    const flaggedProducts = products.filter((product) => product.status === "flagged").length;
    const pendingSellers = sellers.filter((seller) => seller.status === "pending").length;
    const activeOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
    const unassignedDelivery = orders.filter((order) => order.status === "ready_for_delivery" && !order.assigned_deliveryman).length;
    const warehouseStaff = staff.filter((person) => person.role === "warehousestaff").length;
    const assistants = staff.filter((person) => person.role === "assistant").length;
    const lowStock = stocks.filter((item) => item.availability_status === "low_stock").length;
    const outOfStock = stocks.filter((item) => Number(item.quantity || 0) <= 0 || item.availability_status === "out_of_stock").length;

    const statusCounts = Object.entries(
      orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    const topProducts = Object.entries(
      orders.reduce<Record<string, { name: string; quantity: number; revenue: number }>>((acc, order: any) => {
        (order.items || []).forEach((item: any) => {
          const key = item.product_name || `Product ${item.product || ""}`;
          acc[key] = acc[key] || { name: key, quantity: 0, revenue: 0 };
          acc[key].quantity += Number(item.quantity || 0);
          acc[key].revenue += Number(item.subtotal || 0);
        });
        return acc;
      }, {})
    )
      .map(([, value]) => value)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const stockAlerts = stocks
      .filter((item) => Number(item.quantity || 0) < 10)
      .sort((a, b) => Number(a.quantity || 0) - Number(b.quantity || 0))
      .slice(0, 5);

    const reviewQueue = [
      { label: "Seller approvals", count: pendingSellers, path: "/admin/seller" },
      { label: "Product approvals", count: pendingProducts, path: "/admin/product" },
      { label: "Flagged products", count: flaggedProducts, path: "/admin/product" },
      { label: "Unassigned deliveries", count: unassignedDelivery, path: "/admin/assign-delivery" },
      { label: "Low/out stock alerts", count: lowStock + outOfStock, path: "/admin/product" },
    ];

    return {
      revenue,
      orderValue,
      pendingProducts,
      pendingSellers,
      activeOrders,
      unassignedDelivery,
      warehouseStaff,
      assistants,
      lowStock,
      outOfStock,
      statusCounts,
      topProducts,
      stockAlerts,
      reviewQueue,
    };
  }, [orders, products, sellers, staff, stocks]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.created_at || b.updated_at || 0).getTime() - new Date(a.created_at || a.updated_at || 0).getTime())
        .slice(0, 6),
    [orders]
  );

  const maxStatusCount = Math.max(1, ...dashboard.statusCounts.map((item) => item.count));
  const countText = (value: number) => (loading ? "..." : value.toLocaleString());

  const statCards = [
    { label: "Total Users", value: users.length || buyers.length + sellers.length + staff.length + deliverymen.length, icon: FaUsers, color: "#2563eb", path: "/admin/buyer" },
    { label: "Products", value: products.length, icon: FaBoxOpen, color: "#7c3aed", path: "/admin/product" },
    { label: "Categories", value: categories.length, icon: FaTags, color: "#db2777", path: "/admin/category" },
    { label: "Delivered Revenue", value: money(dashboard.revenue), icon: FaMoneyBillWave, color: "#059669", path: "/admin/earnings", isMoney: true },
    { label: "Total Orders", value: orders.length, icon: FaClipboardList, color: "#0f766e", path: "/admin/order" },
    { label: "Active Orders", value: dashboard.activeOrders, icon: FaTruck, color: "#d97706", path: "/admin/order" },
    { label: "Sellers", value: sellers.length, icon: FaStore, color: "#be123c", path: "/admin/seller" },
    { label: "Delivery Staff", value: deliverymen.length, icon: FaUserTie, color: "#0284c7", path: "/admin/delivery" },
    { label: "Warehouse Staff", value: dashboard.warehouseStaff, icon: FaWarehouse, color: "#475569", path: "/admin/staff" },
    { label: "Locations", value: locations.length, icon: FaMapMarkerAlt, color: "#16a34a", path: "/admin/location" },
  ];

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif;}
        html,body{height:100%;overflow-x:hidden;background:#f1f5f9;}
        .dashboard-container{display:flex;width:100%;min-height:100vh;}
        .main-content{flex:1;width:calc(100% - 260px);min-width:0;}
        .content{padding:25px;}
        .dashboard-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:20px;}
        .dashboard-header h1{font-size:28px;color:#0f172a;font-weight:900;}
        .dashboard-header p{color:#64748b;margin-top:5px;font-size:14px;}
        .refresh-btn{height:42px;width:42px;border:0;border-radius:8px;background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .error{margin-bottom:16px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;border-radius:8px;padding:13px;font-size:13px;font-weight:800;}
        .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;}
        .card{padding:18px;border-radius:8px;color:white;box-shadow:0 8px 20px rgba(15,23,42,0.08);transition:.25s;cursor:pointer;display:flex;justify-content:space-between;align-items:center;min-height:110px;}
        .card:hover{transform:translateY(-3px);}
        .card-icon{font-size:28px;opacity:.9;}
        .card h3{font-size:13px;text-transform:uppercase;letter-spacing:0;color:rgba(255,255,255,.88);margin-bottom:8px;}
        .card h2{font-size:26px;font-weight:900;color:white;}
        .section-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:22px;}
        .panel{background:white;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 8px 20px rgba(15,23,42,0.06);overflow:hidden;}
        .panel-head{padding:16px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;gap:12px;}
        .panel-head h2{font-size:17px;color:#0f172a;font-weight:900;}
        .panel-head button{border:0;border-radius:7px;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:900;padding:8px 10px;cursor:pointer;}
        .queue{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:14px 16px;border-bottom:1px solid #f8fafc;cursor:pointer;}
        .queue:hover{background:#f8fafc;}
        .queue strong{font-size:13px;color:#334155;}
        .queue span{min-width:34px;text-align:center;border-radius:999px;background:#fee2e2;color:#991b1b;padding:6px 10px;font-size:12px;font-weight:900;}
        .bar-row{display:grid;grid-template-columns:160px 1fr 42px;gap:12px;align-items:center;padding:13px 16px;border-bottom:1px solid #f8fafc;font-size:13px;}
        .bar-track{height:10px;background:#e2e8f0;border-radius:999px;overflow:hidden;}
        .bar-fill{height:100%;background:#2563eb;border-radius:999px;}
        .table-row{display:grid;grid-template-columns:1.25fr .75fr .75fr;gap:12px;padding:13px 16px;border-bottom:1px solid #f8fafc;align-items:center;font-size:13px;}
        .table-row.header{background:#f8fafc;color:#64748b;font-size:12px;text-transform:uppercase;font-weight:900;}
        .order-row{display:grid;grid-template-columns:1.1fr 1fr .75fr .7fr;gap:12px;padding:13px 16px;border-bottom:1px solid #f8fafc;align-items:center;font-size:13px;}
        .muted{font-size:12px;color:#64748b;margin-top:4px;}
        .badge{display:inline-flex;border-radius:999px;padding:6px 10px;background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:900;text-transform:capitalize;}
        .empty{padding:24px;text-align:center;color:#94a3b8;font-size:13px;font-weight:800;}
        .summary-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:18px;}
        .summary-item{background:white;border:1px solid #e2e8f0;border-radius:8px;padding:15px;box-shadow:0 8px 20px rgba(15,23,42,0.05);}
        .summary-item span{font-size:12px;color:#64748b;text-transform:uppercase;font-weight:900;}
        .summary-item strong{display:block;font-size:24px;color:#0f172a;margin-top:7px;}
        @media(max-width:1100px){.section-grid{grid-template-columns:1fr;}.summary-strip{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:768px){.main-content{width:100%;}.content{padding:15px;}.summary-strip{grid-template-columns:1fr;}.bar-row,.table-row,.order-row{grid-template-columns:1fr;}}
      `}</style>

      <div className="dashboard-container">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavbar />
          <div className="content">
            <div className="dashboard-header">
              <div>
                <h1>Admin Dashboard</h1>
                <p>Live store overview, approvals, order flow, and stock health.</p>
              </div>
              <button className="refresh-btn" onClick={loadDashboard} title="Refresh dashboard" aria-label="Refresh dashboard">
                <FaSyncAlt />
              </button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="cards">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div className="card" key={card.label} style={{ background: card.color }} onClick={() => navigate(card.path)}>
                    <div>
                      <h3>{card.label}</h3>
                      <h2>{card.isMoney ? (loading ? "..." : card.value) : countText(Number(card.value))}</h2>
                    </div>
                    <Icon className="card-icon" />
                  </div>
                );
              })}
            </div>

            <div className="summary-strip">
              <div className="summary-item"><span>Pending Sellers</span><strong>{countText(dashboard.pendingSellers)}</strong></div>
              <div className="summary-item"><span>Pending Products</span><strong>{countText(dashboard.pendingProducts)}</strong></div>
              <div className="summary-item"><span>Unassigned Delivery</span><strong>{countText(dashboard.unassignedDelivery)}</strong></div>
              <div className="summary-item"><span>Order Value</span><strong>{loading ? "..." : money(dashboard.orderValue)}</strong></div>
            </div>

            <div className="section-grid">
              <div className="panel">
                <div className="panel-head">
                  <h2>Needs Admin Attention</h2>
                  <button onClick={() => navigate("/admin/product")}>Review</button>
                </div>
                {dashboard.reviewQueue.map((item) => (
                  <div className="queue" key={item.label} onClick={() => navigate(item.path)}>
                    <strong>{item.label}</strong>
                    <span>{loading ? "..." : item.count}</span>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h2>Order Status Breakdown</h2>
                  <button onClick={() => navigate("/admin/order")}>Orders</button>
                </div>
                {loading ? (
                  <div className="empty">Loading order report...</div>
                ) : dashboard.statusCounts.length ? (
                  dashboard.statusCounts.slice(0, 8).map((item) => (
                    <div className="bar-row" key={item.status}>
                      <strong>{statusLabel(item.status)}</strong>
                      <div className="bar-track"><div className="bar-fill" style={{ width: `${(item.count / maxStatusCount) * 100}%` }} /></div>
                      <strong>{item.count}</strong>
                    </div>
                  ))
                ) : (
                  <div className="empty">No orders found.</div>
                )}
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h2>Top Products From Orders</h2>
                  <button onClick={() => navigate("/admin/product")}>Products</button>
                </div>
                <div className="table-row header">
                  <span>Product</span><span>Sold</span><span>Revenue</span>
                </div>
                {loading ? (
                  <div className="empty">Loading top products...</div>
                ) : dashboard.topProducts.length ? (
                  dashboard.topProducts.map((item) => (
                    <div className="table-row" key={item.name}>
                      <strong>{item.name}</strong>
                      <span>{item.quantity}</span>
                      <span>{money(item.revenue)}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty">No ordered product data yet.</div>
                )}
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h2>Stock Alerts</h2>
                  <button onClick={() => navigate("/admin/product")}>Products</button>
                </div>
                <div className="table-row header">
                  <span>Product</span><span>Category</span><span>Units</span>
                </div>
                {loading ? (
                  <div className="empty">Loading inventory alerts...</div>
                ) : dashboard.stockAlerts.length ? (
                  dashboard.stockAlerts.map((item) => (
                    <div className="table-row" key={item.id}>
                      <strong>{item.product_name || "Product"}</strong>
                      <span>{item.category_name || "Uncategorized"}</span>
                      <span>{item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty">No low stock alerts right now.</div>
                )}
              </div>
            </div>

            <div className="panel" style={{ marginTop: 18 }}>
              <div className="panel-head">
                <h2>Recent Orders</h2>
                <button onClick={() => navigate("/admin/order")}>View All</button>
              </div>
              <div className="order-row table-row header">
                <span>Order</span><span>Customer</span><span>Status</span><span>Total</span>
              </div>
              {loading ? (
                <div className="empty">Loading recent orders...</div>
              ) : recentOrders.length ? (
                recentOrders.map((order) => (
                  <div className="order-row" key={order.id}>
                    <div>
                      <strong>{order.order_number || `Order #${order.id}`}</strong>
                      <div className="muted">{order.created_at ? new Date(order.created_at).toLocaleString() : "-"}</div>
                    </div>
                    <span>{order.customer_name || "Customer"}</span>
                    <span className="badge">{statusLabel(order.status)}</span>
                    <strong>{money(Number(order.total || 0))}</strong>
                  </div>
                ))
              ) : (
                <div className="empty">No orders found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
