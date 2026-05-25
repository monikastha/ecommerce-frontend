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
  const activeOrders = [
    {
      id: "#1234",
      name: "Ram Kumar",
      route: "Lagankhel → New Road",
      status: "In Transit",
    },
    {
      id: "#1235",
      name: "Sita Magar",
      route: "Patan → Thamel",
      status: "Picked Up",
    },
  ];

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

          {/* HEADER */}
          <div className="pageHeader">
            <h1>Orders Management</h1>
            <p>Track and manage your deliveries</p>
          </div>

          {/* TOP GRID */}
          <div className="topGrid">

            {/* ACTIVE ORDERS */}
            <div className="cardBox">

              <div className="sectionTitle">
                <ShoppingBag size={18} />
                <h3>Active Deliveries ({activeOrders.length})</h3>
              </div>

              {activeOrders.map((order, i) => (
                <div className="orderCard" key={i}>
                  <div className="orderId">{order.id}</div>

                  <div className="orderInfo">
                    <strong>{order.name}</strong>
                    <p>{order.route}</p>
                  </div>

                  <span className="badge orange">
                    {order.status}
                  </span>
                </div>
              ))}

            </div>

            {/* STATS */}
            <div className="statsCol">

              <div className="statBox blue">
                <ClipboardList size={24} />
                <div>
                  <h4>Today's Orders</h4>
                  <h2>8</h2>
                </div>
              </div>

              <div className="statBox orange">
                <Clock size={24} />
                <div>
                  <h4>Pending</h4>
                  <h2>2</h2>
                  <small>
                    <AlertCircle size={12} /> 1 urgent
                  </small>
                </div>
              </div>

            </div>
          </div>

          {/* TABLE */}
          <div className="tableBox">

            <h2>Completed Orders</h2>

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
                      <span className="badge green">Delivered</span>
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