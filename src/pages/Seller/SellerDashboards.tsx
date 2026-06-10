import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FaBox, FaCheckCircle, FaClock, FaShoppingCart } from "react-icons/fa";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Product = {
  id: number;
  name: string;
  status?: "pending" | "approved" | "rejected" | "flagged";
  is_published?: boolean;
};

type OrderItem = {
  product?: number | null;
  product_name?: string;
  quantity?: number;
  subtotal?: string | number;
};

type Order = {
  id: number;
  total?: string | number;
  status?: string;
  items?: OrderItem[];
};

const moneyText = (value: number) => `Rs. ${value.toLocaleString()}`;

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const sellerId = localStorage.getItem("seller_id");
        const productUrl = sellerId
          ? `${API_ORIGIN}/api/products/?seller=${sellerId}`
          : `${API_ORIGIN}/api/products/`;

        const [productRes, orderRes] = await Promise.all([
          fetch(productUrl),
          fetch(`${API_ORIGIN}/api/orders/`),
        ]);

        if (!productRes.ok || !orderRes.ok) {
          throw new Error("Unable to load seller dashboard.");
        }

        const [productData, orderData] = await Promise.all([productRes.json(), orderRes.json()]);
        const nextProducts = Array.isArray(productData) ? productData : [];
        const productIds = new Set(nextProducts.map((product: Product) => product.id));

        const sellerOrders = Array.isArray(orderData)
          ? orderData.filter((order: Order) =>
              (order.items || []).some((item) => item.product && productIds.has(item.product))
            )
          : [];

        setProducts(nextProducts);
        setOrders(sellerOrders);
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const productIds = useMemo(() => new Set(products.map((product) => product.id)), [products]);
  const pendingProducts = products.filter((product) => product.status === "pending").length;
  const approvedProducts = products.filter((product) => product.status === "approved").length;
  const publishedProducts = products.filter((product) => product.is_published).length;
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
  const pendingOrders = orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled").length;

  const totalRevenue = orders.reduce((sum, order) => {
    const sellerItemTotal = (order.items || [])
      .filter((item) => item.product && productIds.has(item.product))
      .reduce((itemSum, item) => itemSum + Number(item.subtotal || 0), 0);
    return sum + sellerItemTotal;
  }, 0);

  const productSalesData = useMemo(() => {
    const sales = new Map<string, number>();

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (!item.product || !productIds.has(item.product)) return;
        const name = item.product_name || `Product ${item.product}`;
        sales.set(name, (sales.get(name) || 0) + Number(item.quantity || 0));
      });
    });

    return Array.from(sales.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders, productIds]);

  const statusData = [
    { name: "Approved", value: approvedProducts },
    { name: "Pending", value: pendingProducts },
    { name: "Published", value: publishedProducts },
  ];

  const chartData = productSalesData.length ? productSalesData : [{ name: "No sales", value: 0 }];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .seller-dashboard { display: flex; min-height: 100vh; background: #f8fafc; font-family: 'Poppins', sans-serif; }
        .seller-main { flex: 1; margin-left: 260px; min-width: 0; }
        .seller-content { padding: 28px; }
        .seller-title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
        .seller-subtitle { color: #64748b; font-size: 14px; margin: 6px 0 24px; }
        .alert { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; padding: 12px 14px; border-radius: 8px; margin-bottom: 16px; font-weight: 700; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; margin-bottom: 26px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.06); display: flex; justify-content: space-between; gap: 14px; align-items: center; }
        .stat-card span { display: block; color: #64748b; font-size: 13px; font-weight: 800; }
        .stat-card strong { display: block; color: #0f172a; font-size: 28px; margin-top: 6px; }
        .stat-icon { width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; }
        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        .chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05); min-width: 0; }
        .chart-card h2 { color: #0f172a; font-size: 17px; font-weight: 800; margin: 0 0 16px; }
        .chart-area { width: 100%; height: 320px; }
        .summary-row { margin-top: 22px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .summary-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
        .summary-box span { display: block; color: #64748b; font-size: 12px; font-weight: 800; }
        .summary-box strong { display: block; color: #0f172a; font-size: 20px; margin-top: 6px; }
        @media (max-width: 1180px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: 1fr; } }
        @media (max-width: 760px) { .seller-main { margin-left: 0; } .stats-grid, .summary-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="seller-dashboard">
        <SellerSidebar />
        <div className="seller-main">
          <SellerNavbar />
          <div className="seller-content">
            <h1 className="seller-title">Dashboard Overview</h1>
            <p className="seller-subtitle">Live product approval, order, and revenue summary for your store.</p>

            {error && <div className="alert">{error}</div>}

            <div className="stats-grid">
              <div className="stat-card">
                <div>
                  <span>Total Products</span>
                  <strong>{loading ? "..." : products.length.toLocaleString()}</strong>
                </div>
                <div className="stat-icon" style={{ background: "#2563eb" }}><FaBox /></div>
              </div>
              <div className="stat-card">
                <div>
                  <span>Total Orders</span>
                  <strong>{loading ? "..." : orders.length.toLocaleString()}</strong>
                </div>
                <div className="stat-icon" style={{ background: "#16a34a" }}><FaShoppingCart /></div>
              </div>
              <div className="stat-card">
                <div>
                  <span>Pending Orders</span>
                  <strong>{loading ? "..." : pendingOrders.toLocaleString()}</strong>
                </div>
                <div className="stat-icon" style={{ background: "#f97316" }}><FaClock /></div>
              </div>
              <div className="stat-card">
                <div>
                  <span>Delivered Orders</span>
                  <strong>{loading ? "..." : deliveredOrders.toLocaleString()}</strong>
                </div>
                <div className="stat-icon" style={{ background: "#7c3aed" }}><FaCheckCircle /></div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h2>Most Sold Products</h2>
                <div className="chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h2>Product Status</h2>
                <div className="chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="summary-row">
              <div className="summary-box">
                <span>Total Revenue</span>
                <strong>{loading ? "..." : moneyText(totalRevenue)}</strong>
              </div>
              <div className="summary-box">
                <span>Pending Product Reviews</span>
                <strong>{loading ? "..." : pendingProducts.toLocaleString()}</strong>
              </div>
              <div className="summary-box">
                <span>Published Products</span>
                <strong>{loading ? "..." : publishedProducts.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
