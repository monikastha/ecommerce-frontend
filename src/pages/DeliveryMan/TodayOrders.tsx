import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";
import { FaWarehouse, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
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
  backendId?: number;
};

const initialOrders: Order[] = [
  {
    id: "#101",
    customer: "Ram Sharma",
    phone: "9800000000",
    pickup: "Warehouse A, Kathmandu",
    address: "Newroad, Kathmandu",
    date: "Today 10:30 AM",
    status: "Accepted",
  },
  {
    id: "#102",
    customer: "Sita Rai",
    phone: "9811111111",
    pickup: "Warehouse B, Lalitpur",
    address: "Jawalakhel",
    date: "Today 12:00 PM",
    status: "Pending",
  },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "#fef9c3", color: "#854d0e" },
  Accepted: { bg: "#dbeafe", color: "#1e40af" },
  "Picked Up": { bg: "#f3e8ff", color: "#6b21a8" },
  "Out for Delivery": { bg: "#ffedd5", color: "#c2410c" },
  "Delivered Product": { bg: "#dcfce7", color: "#166534" },
};

const TodayOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const displayToBackend = (display: string) => {
    const status = display.toLowerCase();
    if (status === "accepted") return "shipped";
    if (status === "picked up" || status === "pickedup") return "out_for_delivery";
    if (status === "out for delivery") return "out_for_delivery";
    if (status === "delivered product" || status === "delivered") return "delivered";
    if (status === "pending") return "pending";
    return status;
  };

  const updateOrderStatus = async (orderId: string, backendId: number | undefined, nextStatus: string) => {
    const previousOrders = [...orders];
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)));

    if (!backendId) return;

    const backendStatus = displayToBackend(nextStatus);
    try {
      await axios.post(`${API_ORIGIN}/api/orders/${backendId}/set-status/`, { status: backendStatus });
    } catch (error) {
      setOrders(previousOrders);
      // eslint-disable-next-line no-alert
      alert("Unable to update order status. Please try again.");
    }
  };

  const renderActionButton = (order: Order) => {
    switch (order.status) {
      case "Accepted":
        return (
          <button className="btn-pickup" onClick={() => updateOrderStatus(order.id, order.backendId, "Picked Up")}>PickUp</button>
        );
      case "Picked Up":
        return (
          <button className="btn-out" onClick={() => updateOrderStatus(order.id, order.backendId, "Out for Delivery")}>Out for Delivery</button>
        );
      case "Out for Delivery":
        return (
          <button className="btn-delivered" onClick={() => updateOrderStatus(order.id, order.backendId, "Delivered Product")}>Delivered</button>
        );
      case "Delivered Product":
        return <span className="status-done">Done</span>;
      default:
        return <span className="status-await">Awaiting assignment</span>;
    }
  };

  return (
    <>
      <div className="assigned-layout">
        <DeliverymanSidebar />

        <div className="assigned-main">
          <DeliverymanNavbar />

          <div className="assigned-content">
            <h2 className="text-xl font-bold mb-3">📦 Today Orders</h2>

            <div className="table-box">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Pickup</th>
                    <th>Address</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {todayOrders.map((o) => (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td>

                      <td>
                        <div className="customer-cell">
                          {o.customer}
                          <span className="phone-row">
                            <FaPhone size={9} /> {o.phone}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="pickup-label">
                          <FaWarehouse size={11} /> {o.pickup}
                        </span>
                      </td>

                      <td>
                        <FaMapMarkerAlt size={11} color="red" /> {o.address}
                      </td>

                      <td style={{ fontSize: "11px" }}>{o.date}</td>

                      <td>
                        <span
                          className="status-badge"
                          style={{
                            background: statusColors[o.status]?.bg,
                            color: statusColors[o.status]?.color,
                          }}
                        >
                          {o.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-cell">
                          {renderActionButton(o)}
                          <button className="btn-view" onClick={() => navigate(`/delivery/orders/${o.id}`)}>View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
      <style>{`
        .action-cell { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
        .btn-pickup, .btn-out, .btn-delivered, .btn-view { border:none; border-radius:8px; padding:8px 12px; cursor:pointer; color:white; font-size:12px; }
        .btn-pickup { background:#2563eb; }
        .btn-out { background:#f59e0b; }
        .btn-delivered { background:#16a34a; }
        .btn-view { background:#475569; }
        .status-done, .status-await { font-size:12px; font-weight:600; }
        .status-await { color:#475569; }
      `}</style>
    </>
  );
};

export default TodayOrders;