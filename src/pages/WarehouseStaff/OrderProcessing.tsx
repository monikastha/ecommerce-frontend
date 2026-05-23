import { useState } from "react";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";
import { FaCheck, FaTimes, FaBox, FaTruck } from "react-icons/fa";

type Order = {
  id: string;
  customer: string;
  items: string;
  date: string;
  status: string;
};

const OrderProcessing = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#O101",
      customer: "Ram Kumar",
      items: "Rice, Oil, Soap",
      date: "20 May 2026",
      status: "Pending",
    },
    {
      id: "#O102",
      customer: "Sita Magar",
      items: "Shampoo, Powder",
      date: "20 May 2026",
      status: "Accepted",
    },
    {
      id: "#O103",
      customer: "Hari Thapa",
      items: "Snacks, Drinks",
      date: "19 May 2026",
      status: "Packed",
    },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, status: newStatus } : o
      )
    );
  };

  const getColor = (status: string) => {
    if (status === "Pending") return "#f97316";
    if (status === "Accepted") return "#3b82f6";
    if (status === "Processing") return "#8b5cf6";
    if (status === "Packed") return "#22c55e";
    return "#64748b";
  };

  return (
    <>
      <style>{`
        .layout { display:flex; min-height:100vh; background:#f1f5f9; }
        .main { flex:1; display:flex; flex-direction:column; }
        .content { padding:20px; }

        .cards {
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap:12px;
          margin-bottom:15px;
        }

        .card {
          background:white;
          padding:15px;
          border-radius:12px;
          text-align:center;
        }

        .card h2 { margin:0; }

        table {
          width:100%;
          background:white;
          border-collapse:collapse;
          border-radius:12px;
          overflow:hidden;
        }

        th, td {
          padding:12px;
          border-bottom:1px solid #e2e8f0;
        }

        th {
          background:#f8fafc;
          font-size:12px;
          color:#64748b;
        }

        .badge {
          padding:4px 10px;
          border-radius:20px;
          color:white;
          font-size:12px;
        }

        .actions button {
          margin-right:5px;
          border:none;
          padding:6px 8px;
          border-radius:6px;
          cursor:pointer;
          color:white;
        }

        .accept { background:#22c55e; }
        .reject { background:#ef4444; }
        .pack { background:#3b82f6; }
        .process { background:#8b5cf6; }
      `}</style>

      <div className="layout">
        <WarehouseStaffSidebar />

        <div className="main">
          <WarehouseStaffNavbar />

          <div className="content">

            {/* SUMMARY CARDS */}
            <div className="cards">
              <div className="card">
                <h3>Total Orders</h3>
                <h2>{orders.length}</h2>
              </div>

              <div className="card">
                <h3>Pending</h3>
                <h2>{orders.filter(o => o.status === "Pending").length}</h2>
              </div>

              <div className="card">
                <h3>Packed</h3>
                <h2>{orders.filter(o => o.status === "Packed").length}</h2>
              </div>
            </div>

            {/* TABLE */}
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.items}</td>
                    <td>{o.date}</td>

                    <td>
                      <span
                        className="badge"
                        style={{ background: getColor(o.status) }}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="actions">

                      {o.status === "Pending" && (
                        <>
                          <button
                            className="accept"
                            onClick={() => updateStatus(o.id, "Accepted")}
                          >
                            <FaCheck />
                          </button>

                          <button
                            className="reject"
                            onClick={() => updateStatus(o.id, "Rejected")}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}

                      {o.status === "Accepted" && (
                        <button
                          className="process"
                          onClick={() => updateStatus(o.id, "Processing")}
                        >
                          <FaBox />
                        </button>
                      )}

                      {o.status === "Processing" && (
                        <button
                          className="pack"
                          onClick={() => updateStatus(o.id, "Packed")}
                        >
                          <FaTruck />
                        </button>
                      )}

                      {o.status === "Packed" && (
                        <span style={{ color: "#22c55e", fontWeight: 600 }}>
                          Ready
                        </span>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
};

export default OrderProcessing;