import { useEffect, useMemo, useState } from "react";
import { FaBoxOpen, FaFolder, FaShoppingCart, FaUsers } from "react-icons/fa";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Product = {
  id: number;
  name: string;
  status?: string;
  is_published?: boolean;
};

type Order = {
  id: number;
  total?: string | number;
  status?: string;
  delivery_type?: string;
};

type DashboardStats = {
  users: number;
  products: Product[];
  categories: number;
  orders: Order[];
};

const countText = (value: number) => value.toLocaleString();
const moneyText = (value: number) => `Rs. ${value.toLocaleString()}`;

const AssistantDashboard = () => {
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

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          products: Array.isArray(products) ? products : [],
          categories: Array.isArray(categories) ? categories.length : 0,
          orders: Array.isArray(orders) ? orders : [],
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
  const publishedProducts = stats.products.filter((product) => product.is_published).length;
  const totalEarnings = stats.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const emergencyOrders = stats.orders.filter((order) => order.delivery_type === "emergency").length;

  const productStatusData = useMemo(
    () => [
      { label: "Approved", value: approvedProducts, color: "#16a34a" },
      { label: "Pending", value: pendingProducts, color: "#f97316" },
      { label: "Published", value: publishedProducts, color: "#2563eb" },
    ],
    [approvedProducts, pendingProducts, publishedProducts]
  );

  const orderStatusData = useMemo(() => {
    const counts = stats.orders.reduce<Record<string, number>>((acc, order) => {
      const key = order.status || "pending";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).slice(0, 4);
  }, [stats.orders]);

  const maxProductValue = Math.max(1, ...productStatusData.map((item) => item.value));
  const maxOrderValue = Math.max(1, ...orderStatusData.map(([, value]) => value));

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        .dashboard-container { background: #f3f4f6; min-height: 100vh; }
        .main-content { margin-left: 250px; width: calc(100% - 250px); min-height: 100vh; background: #f3f4f6; }
        .content { padding: 28px 30px; }
        .dashboard-title { font-size: 25px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .dashboard-subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
        .alert { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; padding: 12px 14px; border-radius: 8px; margin-bottom: 16px; font-weight: 700; }
        .cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.06); }
        .card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .card h3 { font-size: 13px; color: #64748b; margin-bottom: 8px; font-weight: 700; }
        .card h1 { font-size: 28px; font-weight: 900; color: #0f172a; }
        .card-icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #fff; }
        .overview { margin-top: 26px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05); }
        .panel h2 { color: #0f172a; font-size: 17px; font-weight: 800; margin-bottom: 18px; }
        .bars { height: 230px; display: flex; align-items: flex-end; gap: 18px; border-bottom: 1px solid #e2e8f0; padding: 0 6px; }
        .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; }
        .bar { width: 100%; max-width: 58px; min-height: 8px; border-radius: 8px 8px 0 0; }
        .bar-label { color: #475569; font-size: 12px; font-weight: 700; text-transform: capitalize; text-align: center; overflow-wrap: anywhere; }
        .bar-value { color: #0f172a; font-size: 12px; font-weight: 900; }
        .summary-grid { margin-top: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
        .summary span { display: block; color: #64748b; font-size: 12px; font-weight: 800; }
        .summary strong { display: block; color: #0f172a; font-size: 20px; margin-top: 6px; }
        @media (max-width: 1180px) { .cards { grid-template-columns: repeat(2, 1fr); } .overview { grid-template-columns: 1fr; } }
        @media (max-width: 760px) { .main-content { margin-left: 0; width: 100%; } .cards, .summary-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />
        <div className="main-content">
          <AssistantNavbar />
          <div className="content">
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">Live users, products, categories, and order activity.</p>

            {error && <div className="alert">{error}</div>}

            <div className="cards">
              <div className="card">
                <div className="card-top">
                  <div>
                    <h3>Total Users</h3>
                    <h1>{loading ? "..." : countText(stats.users)}</h1>
                  </div>
                  <div className="card-icon" style={{ background: "#2563eb" }}><FaUsers /></div>
                </div>
              </div>
              <div className="card">
                <div className="card-top">
                  <div>
                    <h3>Total Products</h3>
                    <h1>{loading ? "..." : countText(stats.products.length)}</h1>
                  </div>
                  <div className="card-icon" style={{ background: "#16a34a" }}><FaBoxOpen /></div>
                </div>
              </div>
              <div className="card">
                <div className="card-top">
                  <div>
                    <h3>Total Categories</h3>
                    <h1>{loading ? "..." : countText(stats.categories)}</h1>
                  </div>
                  <div className="card-icon" style={{ background: "#f97316" }}><FaFolder /></div>
                </div>
              </div>
              <div className="card">
                <div className="card-top">
                  <div>
                    <h3>Total Orders</h3>
                    <h1>{loading ? "..." : countText(stats.orders.length)}</h1>
                  </div>
                  <div className="card-icon" style={{ background: "#7c3aed" }}><FaShoppingCart /></div>
                </div>
              </div>
            </div>

            <div className="overview">
              <div className="panel">
                <h2>Product Review Status</h2>
                <div className="bars">
                  {productStatusData.map((item) => (
                    <div className="bar-wrap" key={item.label}>
                      <span className="bar-value">{item.value}</span>
                      <div className="bar" style={{ height: `${(item.value / maxProductValue) * 180}px`, background: item.color }} />
                      <span className="bar-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <h2>Order Status</h2>
                <div className="bars">
                  {(orderStatusData.length ? orderStatusData : [["No Orders", 0] as [string, number]]).map(([label, value]) => (
                    <div className="bar-wrap" key={label}>
                      <span className="bar-value">{value}</span>
                      <div className="bar" style={{ height: `${(value / maxOrderValue) * 180}px`, background: "#0f766e" }} />
                      <span className="bar-label">{label.replace(/_/g, " ")}</span>
                    </div>
                  ))}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantDashboard;
