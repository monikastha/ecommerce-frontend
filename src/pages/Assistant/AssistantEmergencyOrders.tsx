import React from "react";
import { FaExclamationTriangle, FaTruck } from "react-icons/fa";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";

const EmergencyOrders: React.FC = () => {
  const orders = [
    {
      id: "EM-001",
      buyer: "Ram Sharan",
      product: "Mobile Phone",
      payment: "Paid",
      status: "Pending",
      time: "2 min ago",
    },
    {
      id: "EM-002",
      buyer: "Sita KC",
      product: "Laptop Charger",
      payment: "Pending",
      status: "Pending",
      time: "15 min ago",
    },
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .dashboard-container {
          background: #f4f6f8;
          min-height: 100vh;
        }

        .main-content {
          margin-left: 250px;
          width: calc(100% - 250px);
          min-height: 100vh;
        }

        .container {
          padding: 25px 30px;
        }

        .headerBox {
          background: white;
          padding: 22px 26px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 25px;
        }

        .title {
          font-size: 26px;
          font-weight: 700;
          color: #b91c1c;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .subtitle {
          color: #64748b;
          font-size: 14.5px;
          margin-top: 4px;
        }

        /* Emergency Highlight Card */
        .emergencyCard {
          background: linear-gradient(135deg, #fee2e2, #fef2f2);
          border: 2px solid #ef4444;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .emergencyInfo h3 {
          color: #b91c1c;
          margin-bottom: 8px;
        }

        .emergencyInfo p {
          color: #444;
          font-size: 15px;
        }

        .assignBtn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.3s;
        }

        .assignBtn:hover {
          background: #b91c1c;
          transform: translateY(-2px);
        }

        /* Table */
        .tableBox {
          background: white;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #1e293b;
          color: white;
          padding: 16px 14px;
          text-align: left;
          font-weight: 600;
        }

        td {
          padding: 16px 14px;
          border-top: 1px solid #f1f5f9;
          color: #334155;
        }

        tr:hover {
          background: #f8fafc;
        }

        .high-priority {
          color: #ef4444;
          font-weight: 600;
        }

        .status-pending {
          background: #fef3c7;
          color: #d97706;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .payment-paid {
          color: #22c55e;
          font-weight: 500;
        }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="headerBox">
              <div className="title">
                <FaExclamationTriangle /> Emergency Orders
              </div>
              <p className="subtitle">High priority orders requiring immediate attention</p>
            </div>

            {/* Highlighted Emergency Card */}
            <div className="emergencyCard">
              <div className="emergencyInfo">
                <h3>🚨 New Emergency Order</h3>
                <p><strong>Order ID:</strong> EM-001</p>
                <p><strong>Buyer:</strong> Ram Sharan</p>
                <p><strong>Product:</strong> Mobile Phone</p>
                <p><strong>Time:</strong> 2 minutes ago</p>
              </div>
              <button className="assignBtn">
                <FaTruck /> Assign Delivery Now
              </button>
            </div>

            {/* Table */}
            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Buyer Name</th>
                    <th>Product</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.buyer}</td>
                      <td>{order.product}</td>
                      <td className="payment-paid">{order.payment}</td>
                      <td>
                        <span className="status-pending">{order.status}</span>
                      </td>
                      <td className="high-priority">{order.time}</td>
                      <td>
                        <button 
                          className="assignBtn" 
                          style={{ padding: "8px 16px", fontSize: "13px" }}
                        >
                          Assign
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

export default EmergencyOrders;