import React from "react";
import { TrendingUp, DollarSign } from "lucide-react";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";

const DeliveryEarnings: React.FC = () => {
  const earningsData = [
    {
      id: "#E001",
      orderId: "#ORD101",
      date: "2026-05-10",
      deliveryFee: 120,
      status: "Paid",
    },
    {
      id: "#E002",
      orderId: "#ORD102",
      date: "2026-05-11",
      deliveryFee: 150,
      status: "Pending",
    },
    {
      id: "#E003",
      orderId: "#ORD103",
      date: "2026-05-12",
      deliveryFee: 100,
      status: "Paid",
    },
  ];

  const totalEarnings = earningsData.reduce(
    (sum, item) => sum + item.deliveryFee,
    0
  );

  const paidCount = earningsData.filter((i) => i.status === "Paid").length;
  const pendingCount = earningsData.filter((i) => i.status === "Pending").length;

  return (
    <>
      <style>{`
        .earnings-layout {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: 'Poppins', sans-serif;
        }

        .earnings-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .earnings-content {
          padding: 25px;
        }

        .earnings-header h1 {
          font-size: 24px;
          color: #0f172a;
          margin: 0;
        }

        .earnings-header p {
          color: #64748b;
          font-size: 13px;
          margin-top: 4px;
          margin-bottom: 20px;
        }

        /* CARDS */
        .earnings-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .earnings-card {
          background: white;
          padding: 22px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .earnings-card-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .icon-green  { background: linear-gradient(135deg, #10b981, #34d399); }
        .icon-blue   { background: linear-gradient(135deg, #2563eb, #60a5fa); }
        .icon-orange { background: linear-gradient(135deg, #f97316, #fb923c); }

        .earnings-card h4 {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .earnings-card h2 {
          margin: 4px 0 0;
          font-size: 22px;
          color: #0f172a;
        }

        /* TABLE */
        .earnings-table-box {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .earnings-table-box h2 {
          padding: 18px 20px;
          font-size: 16px;
          color: #0f172a;
          border-bottom: 1px solid #e2e8f0;
          margin: 0;
        }

        .earnings-table-box table {
          width: 100%;
          border-collapse: collapse;
        }

        .earnings-table-box th {
          background: #f8fafc;
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .earnings-table-box td {
          padding: 13px 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          color: #334155;
        }

        .earnings-table-box tr:last-child td {
          border-bottom: none;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-paid {
          background: #dcfce7;
          color: #166534;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
      `}</style>

      <div className="earnings-layout">

        <DeliverymanSidebar />

        <div className="earnings-main">

          <DeliverymanNavbar />

          <div className="earnings-content">

            {/* HEADER */}
            <div className="earnings-header">
              <h1>My Earnings</h1>
              <p>Track your delivery payments and history</p>
            </div>

            {/* CARDS */}
            <div className="earnings-cards">

              <div className="earnings-card">
                <div className="earnings-card-icon icon-green">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4>Total Earnings</h4>
                  <h2>Rs. {totalEarnings}</h2>
                </div>
              </div>

              <div className="earnings-card">
                <div className="earnings-card-icon icon-blue">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h4>Paid Orders</h4>
                  <h2>{paidCount} Orders</h2>
                </div>
              </div>

              <div className="earnings-card">
                <div className="earnings-card-icon icon-orange">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h4>Pending</h4>
                  <h2>{pendingCount} Orders</h2>
                </div>
              </div>

            </div>

            {/* TABLE */}
            <div className="earnings-table-box">
              <h2>Earnings History</h2>

              <table>
                <thead>
                  <tr>
                    <th>Earning ID</th>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Delivery Fee</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {earningsData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.orderId}</td>
                      <td>{item.date}</td>
                      <td>Rs. {item.deliveryFee}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            item.status === "Paid"
                              ? "status-paid"
                              : "status-pending"
                          }`}
                        >
                          {item.status}
                        </span>
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

export default DeliveryEarnings;