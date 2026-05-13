import React from "react";
import {
  ShoppingBag,
  Clock,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

import "./DeliverymanOrder.css";

import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";

const DeliverymanOrder: React.FC = () => {
  const completedOrders = [
    {
      id: "#1240",
      name: "Kamala Shahi",
      addr: "Boudha, Kathmandu",
      amt: "Rs. 250",
      time: "11:20 AM",
    },
    {
      id: "#1231",
      name: "Princy Bhusal",
      addr: "Pulchowk, Lalitpur",
      amt: "Rs. 180",
      time: "10:05 AM",
    },
  ];

  return (
    <div className="layout">
      <DeliverymanSidebar />

      <div className="main">
        <DeliverymanNavbar />

        <div className="content">
          
          <div className="breadcrumb">
            <span className="active">Orders</span>
            <span>Home &gt; Orders</span>
          </div>

          {/* TOP GRID */}
          <div className="topGrid">

            {/* ACTIVE ORDERS */}
            <div className="card">

              <h2 className="title">
                <ShoppingBag size={18} color="#3b82f6" />
                Active Deliveries (2)
              </h2>

              <div className="orderCard">
                <div className="orderId">#1234</div>
                <div className="orderInfo">
                  <p><strong>Ram Kumar</strong></p>
                  <p>🏠 Lagankhel → 📍 New Road</p>
                </div>
                <span className="badgeOrange">In Transit</span>
              </div>

              <div className="orderCard">
                <div className="orderId">#1235</div>
                <div className="orderInfo">
                  <p><strong>Sita Magar</strong></p>
                  <p>🏠 Patan → 📍 Thamel</p>
                </div>
                <span className="badgeGreen">Picked Up</span>
              </div>

            </div>

            {/* STATS */}
            <div className="statsCol">

              <div className="statBoxBlue">
                <ClipboardList size={26} />
                <div>
                  <h4>Today's Orders</h4>
                  <h2>8</h2>
                </div>
              </div>

              <div className="statBoxOrange">
                <Clock size={26} />
                <div>
                  <h4>Pending</h4>
                  <h2>2</h2>
                  <small className="urgent">
                    <AlertCircle size={12} /> 1 urgent
                  </small>
                </div>
              </div>

            </div>
          </div>

          {/* TABLE */}
          <div className="tableBox">
            <h2>Recent Completed Orders</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {completedOrders.map((o, i) => (
                  <tr key={i}>
                    <td>{o.id}</td>
                    <td>{o.name}</td>
                    <td>{o.addr}</td>
                    <td>{o.amt}</td>
                    <td>{o.time}</td>
                    <td>
                      <span className="badgeGreen">Delivered</span>
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

export default DeliverymanOrder;