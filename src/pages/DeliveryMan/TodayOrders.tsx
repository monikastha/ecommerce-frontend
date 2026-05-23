import { useNavigate } from "react-router-dom";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";
import { FaWarehouse, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const todayOrders = [
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
  Delivered: { bg: "#dcfce7", color: "#166534" },
};

const TodayOrders = () => {
  const navigate = useNavigate();

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
                        <button
                          className="btn-out"
                          onClick={() => navigate(`/delivery/orders/${o.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TodayOrders;