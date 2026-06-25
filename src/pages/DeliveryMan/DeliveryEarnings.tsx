import { useEffect, useMemo, useState } from "react";
import { Clock, DollarSign, TrendingUp } from "lucide-react";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type EarningOrder = {
  id: number;
  order_number: string;
  customer_name: string;
  delivery_fee: string | number;
  total: string | number;
  status: string;
  updated_at: string;
};

const currency = (value?: string | number) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const DeliveryEarnings = () => {
  const [orders, setOrders] = useState<EarningOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deliveryId = localStorage.getItem("delivery_id") || "";

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!deliveryId) {
        setLoading(false);
        setError("Delivery profile was not found for this login.");
        return;
      }

      try {
        setError("");
        const res = await fetch(`${API_ORIGIN}/api/orders/?assigned_deliveryman=${deliveryId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load delivery earnings");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load delivery earnings");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [deliveryId]);

  const completed = useMemo(
    () => orders.filter((order) => order.status === "delivered"),
    [orders]
  );

  const totalEarnings = completed.reduce((sum, order) => sum + Number(order.delivery_fee || 0), 0);
  const pendingCount = orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled").length;

  return (
    <>
      <style>{`
        .earnings-layout { display:flex; min-height:100vh; background:#f1f5f9; font-family:'Poppins',sans-serif; }
        .earnings-main { flex:1; display:flex; flex-direction:column; }
        .earnings-content { padding:25px; }
        .earnings-header h1 { font-size:24px; color:#0f172a; margin:0; }
        .earnings-header p { color:#64748b; font-size:13px; margin-top:4px; margin-bottom:20px; }
        .earnings-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; margin-bottom:25px; }
        .earnings-card { background:white; padding:22px; border-radius:10px; box-shadow:0 4px 12px rgba(15,23,42,0.06); display:flex; align-items:center; gap:16px; }
        .earnings-card-icon { width:52px; height:52px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; flex-shrink:0; }
        .icon-green { background:#10b981; }
        .icon-blue { background:#2563eb; }
        .icon-orange { background:#f97316; }
        .earnings-card h4 { margin:0; font-size:12px; color:#64748b; }
        .earnings-card h2 { margin:4px 0 0; font-size:22px; color:#0f172a; }
        .earnings-table-box { background:white; border-radius:10px; box-shadow:0 4px 12px rgba(15,23,42,0.06); overflow:hidden; }
        .earnings-table-box h2 { padding:18px 20px; font-size:16px; color:#0f172a; border-bottom:1px solid #e2e8f0; margin:0; }
        .earnings-table-box table { width:100%; border-collapse:collapse; }
        .earnings-table-box th { background:#f8fafc; padding:12px 16px; text-align:left; font-size:12px; color:#64748b; font-weight:700; }
        .earnings-table-box td { padding:13px 16px; border-bottom:1px solid #f1f5f9; font-size:14px; color:#334155; }
        .earnings-table-box tr:last-child td { border-bottom:none; }
        .status-badge { padding:4px 12px; border-radius:999px; font-size:12px; font-weight:700; background:#dcfce7; color:#166534; }
        .empty-msg, .error-msg { padding:24px; text-align:center; color:#64748b; font-size:14px; }
        .error-msg { color:#b91c1c; background:#fef2f2; border:1px solid #fecaca; margin-bottom:16px; border-radius:8px; }
        @media(max-width:800px){ .earnings-table-box{overflow-x:auto;} .earnings-table-box table{min-width:760px;} }
      `}</style>

      <div className="earnings-layout">
        <DeliverymanSidebar />
        <div className="earnings-main">
          <DeliverymanNavbar />
          <div className="earnings-content">
            <div className="earnings-header">
              <h1>My Earnings</h1>
              <p>Completed deliveries and delivery fee history</p>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="earnings-cards">
              <div className="earnings-card">
                <div className="earnings-card-icon icon-green"><TrendingUp size={24} /></div>
                <div>
                  <h4>Total Earnings</h4>
                  <h2>{currency(totalEarnings)}</h2>
                </div>
              </div>
              <div className="earnings-card">
                <div className="earnings-card-icon icon-blue"><DollarSign size={24} /></div>
                <div>
                  <h4>Completed Deliveries</h4>
                  <h2>{completed.length}</h2>
                </div>
              </div>
              <div className="earnings-card">
                <div className="earnings-card-icon icon-orange"><Clock size={24} /></div>
                <div>
                  <h4>Active Deliveries</h4>
                  <h2>{pendingCount}</h2>
                </div>
              </div>
            </div>

            <div className="earnings-table-box">
              <h2>Earnings History</h2>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Delivered Date</th>
                    <th>Order Total</th>
                    <th>Delivery Fee</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6}><div className="empty-msg">Loading earnings...</div></td></tr>
                  ) : completed.length === 0 ? (
                    <tr><td colSpan={6}><div className="empty-msg">No completed delivery earnings yet.</div></td></tr>
                  ) : (
                    completed.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.order_number}</strong></td>
                        <td>{order.customer_name || "Customer"}</td>
                        <td>{order.updated_at ? new Date(order.updated_at).toLocaleString() : "-"}</td>
                        <td>{currency(order.total)}</td>
                        <td><strong>{currency(order.delivery_fee)}</strong></td>
                        <td><span className="status-badge">Paid</span></td>
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

export default DeliveryEarnings;
