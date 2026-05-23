import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const pendingOrders = [
  {
    id: "#201",
    customer: "Hari Thapa",
    phone: "9802222222",
    address: "Baneshwor",
    date: "Pending 15 mins",
  },
  {
    id: "#202",
    customer: "Maya Gurung",
    phone: "9813333333",
    address: "Thamel",
    date: "Pending 25 mins",
  },
];

const PendingOrders = () => {
  return (
    <div className="assigned-layout">
      <DeliverymanSidebar />

      <div className="assigned-main">
        <DeliverymanNavbar />

        <div className="assigned-content">
          <h2 className="text-xl font-bold mb-3">⏳ Pending Orders</h2>

          <div className="table-box">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Delay</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {pendingOrders.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>

                    <td>
                      {o.customer}
                      <div className="phone-row">
                        <FaPhone size={9} /> {o.phone}
                      </div>
                    </td>

                    <td>
                      <FaMapMarkerAlt size={11} color="red" /> {o.address}
                    </td>

                    <td style={{ fontSize: "12px", color: "#f59e0b" }}>
                      {o.date}
                    </td>

                    <td>
                      <button className="btn-accept">Accept</button>
                      <button className="btn-reject">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PendingOrders;