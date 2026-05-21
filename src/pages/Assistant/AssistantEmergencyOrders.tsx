import React from "react";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";

const EmergencyOrders: React.FC = () => {
  const orders = [
    {
      id: "001",
      buyer: "Ram Sharan",
      product: "Mobile",
      payment: "Paid",
      status: "Pending",
    },
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .wrapper {
          display: flex;
          background: #f4f6f9;
          min-height: 100vh;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .container {
          padding: 25px;
        }

        .headerBox {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .title {
          font-size: 28px;
          color: #b91c1c;
          margin-bottom: 5px;
        }

        .subtitle {
          color: #64748b;
          font-size: 15px;
          margin-bottom: 20px;
        }

        .topSection {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .orderBox {
          flex: 1;
          min-width: 320px;
          background: white;
          border: 2px solid #dc2626;
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .orderText p {
          margin-bottom: 10px;
          font-size: 15px;
          color: #1e293b;
        }

        .priority {
          color: #dc2626;
          font-weight: bold;
        }

        .assignBtn {
          align-self: flex-end;
          margin-top: 15px;
          background: #dc2626;
          color: white;
          border: none;
          padding: 12px 22px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        .assignBtn:hover {
          background: #b91c1c;
        }

        .tableContainer {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          font-size: 14px;
        }

        thead {
          background: #1e293b;
          color: white;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        /* HIGH PRIORITY BADGE FOR ACTION COLUMN */
        .highActionBadge {
          background: #dc2626;
          color: white;
          padding: 6px 16px;
          border-radius: 4px;
          font-weight: 800;
          font-size: 12px;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media(max-width:768px){
          .topSection {
            flex-direction: column;
          }
          .assignBtn {
            align-self: stretch;
            width: 100%;
          }
        }
      `}</style>

      <div className="wrapper">
        <AssistantSidebar />

        <div className="main">
          <AssistantNavbar />

          <div className="container">
            <div className="headerBox">
              <h2 className="title">Emergency Orders</h2>
              <p className="subtitle">New emergency order received</p>

              <div className="topSection">
                <div className="orderBox">
                  <div className="orderText">
                    <p><strong>Order ID:</strong> 001</p>
                    <p><strong>Buyer:</strong> Ram Sharan</p>
                    <p><strong>Product:</strong> Mobile</p>
                    <p className="priority"><strong>Priority:</strong> High</p>
                  </div>
                  <button className="assignBtn">
                    Assign Delivery
                  </button>
                </div>
              </div>

              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Buyer Name</th>
                      <th>Product</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.buyer}</td>
                        <td>{order.product}</td>
                        <td>
                          <span style={{ 
                            color: order.payment === "Paid" ? "#16a34a" : "#dc2626",
                            fontWeight: "bold" 
                          }}>
                            {order.payment}
                          </span>
                        </td>
                        <td>{order.status}</td>
                        <td>
                          <span className="highActionBadge">High</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmergencyOrders;