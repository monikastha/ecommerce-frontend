import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";
import { FaWarehouse, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const allOrders = [
  {
    id: "#123",
    customer: "Princy Shrestha",
    phone: "9867662125",
    pickup: "Warehouse A, Lagankhel, KTM",
    address: "Kathmandu, Newroad, Ward 10",
    date: "12 Jan 2025, 12 AM",
    status: "Pending",
  },
  {
    id: "#251",
    customer: "Maya Gurung",
    phone: "9840274396",
    pickup: "Warehouse B, Koteshwor, KTM",
    address: "Lalitpur, Jawalakhel, Ward 5",
    date: "14 Jan 2025, 9:15 AM",
    status: "Accepted",
  },
  {
    id: "#312",
    customer: "Ram Kumar",
    phone: "9812345678",
    pickup: "Warehouse A, Lagankhel, KTM",
    address: "Bhaktapur, Suryabinayak",
    date: "15 Jan 2025, 11 AM",
    status: "Pending",
  },
  {
    id: "#401",
    customer: "Sita Magar",
    phone: "9856781234",
    pickup: "Warehouse B, Koteshwor, KTM",
    address: "Thamel, Kathmandu",
    date: "15 Jan 2025, 2 PM",
    status: "Delivered",
  },
  {
    id: "#502",
    customer: "Hari Thapa",
    phone: "9823456789",
    pickup: "Warehouse A, Lagankhel, KTM",
    address: "Baneshwor, Kathmandu",
    date: "16 Jan 2025, 10 AM",
    status: "Delivered",
  },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Pending:  { bg: "#fef9c3", color: "#854d0e" },
  Accepted: { bg: "#dbeafe", color: "#1e40af" },
  Delivered:{ bg: "#dcfce7", color: "#166534" },
};

const tabs = ["All Orders", "Today", "Pending", "Completed"];

const AssignedDeliveries = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("All Orders");

  // Read ?filter= from URL (from dashboard card clicks)
  useEffect(() => {
    const urlFilter = searchParams.get("filter");
    if (urlFilter === "Pending") setFilter("Pending");
    else if (urlFilter === "Completed") setFilter("Completed");
    else setFilter("All Orders");
  }, [searchParams]);

 const isToday = (date: string) => {
  return date.includes("Today");
};

const filtered =
  filter === "Today"
    ? allOrders.filter((o) => isToday(o.date))
    : filter === "Pending"
    ? allOrders.filter((o) => o.status === "Pending")
    : filter === "Completed"
    ? allOrders.filter((o) => o.status === "Delivered")
    : allOrders;
  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }

        .assigned-layout { display:flex; min-height:100vh; background:#f1f5f9; }
        .assigned-main   { flex:1; display:flex; flex-direction:column; }
        .assigned-content{ padding:16px 20px; }

        .breadcrumb {
          display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;
        }
        .breadcrumb h2  { font-size:15px; color:#334155; font-weight:600; }
        .breadcrumb span{ font-size:12px; color:#94a3b8; }

        .back-btn {
          margin-bottom:12px; background:none; border:1px solid #e2e8f0;
          border-radius:8px; padding:5px 14px; font-size:13px; color:#475569; cursor:pointer;
        }
        .back-btn:hover { background:#f1f5f9; }

        .page-title { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
        .page-title h2{ font-size:18px; color:#0f172a; font-weight:700; }

        .tab-row {
          display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;
        }
        .tabs { display:flex; gap:6px; }
        .tab-btn {
          padding:6px 16px; border-radius:20px; border:none; cursor:pointer;
          font-size:12px; font-weight:500; background:#e2e8f0; color:#475569; transition:0.2s;
        }
        .tab-btn.active { background:#ef4444; color:white; }

        .status-select {
          padding:6px 12px; border-radius:8px; border:1px solid #e2e8f0;
          font-size:12px; color:#475569; background:white; cursor:pointer;
        }

        .table-box {
          background:white; border-radius:14px;
          box-shadow:0 2px 8px rgba(0,0,0,0.05); overflow:hidden;
        }

        table { width:100%; border-collapse:collapse; }
        thead tr { background:#f8fafc; }
        th { padding:12px 14px; text-align:left; font-size:11px; color:#64748b; font-weight:600; white-space:nowrap; }
        td { padding:12px 14px; font-size:13px; color:#334155; border-bottom:1px solid #f1f5f9; }
        tr:last-child td { border-bottom:none; }

        .customer-cell { display:flex; flex-direction:column; gap:2px; }
        .phone-row { color:#94a3b8; font-size:11px; display:flex; align-items:center; gap:4px; }

        .pickup-cell { display:flex; flex-direction:column; gap:2px; font-size:12px; }
        .pickup-label{ display:flex; align-items:center; gap:5px; color:#3b82f6; font-weight:500; }
        .pickup-sub  { color:#94a3b8; }

        .drop-cell { font-size:12px; display:flex; align-items:center; gap:5px; }

        .status-badge {
          padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; display:inline-block;
        }

        .action-btns { display:flex; flex-direction:column; gap:4px; }
        .btn-accept   { background:#22c55e; color:white; border:none; border-radius:6px; padding:4px 10px; font-size:11px; cursor:pointer; }
        .btn-reject   { background:#ef4444; color:white; border:none; border-radius:6px; padding:4px 10px; font-size:11px; cursor:pointer; }
        .btn-pickup   { background:#94a3b8; color:white; border:none; border-radius:6px; padding:4px 10px; font-size:11px; cursor:pointer; }
        .btn-out      { background:#3b82f6; color:white; border:none; border-radius:6px; padding:4px 10px; font-size:11px; cursor:pointer; }
        .btn-delivered{ background:#22c55e; color:white; border:none; border-radius:6px; padding:4px 10px; font-size:11px; cursor:pointer; }

        .empty-msg { padding:30px; text-align:center; color:#94a3b8; font-size:14px; }
      `}</style>

      <div className="assigned-layout">
        <DeliverymanSidebar />

        <div className="assigned-main">
          <DeliverymanNavbar />

          <div className="assigned-content">

            <div className="breadcrumb">
              <h2>Orders</h2>
              <span>Home &gt; Assigned Orders</span>
            </div>

            <button className="back-btn" onClick={() => navigate("/delivery/dashboard")}>
              ← Back to Dashboard
            </button>

            <div className="page-title">
              <span>📦</span>
              <h2>Assigned Orders</h2>
            </div>

            <div className="tab-row">
              <div className="tabs">
                {tabs.map((t) => (
                  <button
                    key={t}
                    className={`tab-btn ${filter === t ? "active" : ""}`}
                    onClick={() => setFilter(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <select className="status-select">
                <option>All Status</option>
                <option>Pending</option>
                <option>Accepted</option>
                <option>Delivered</option>
              </select>
            </div>

            <div className="table-box">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Pickup Location</th>
                    <th>Delivery Address</th>
                    <th>Assigned Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-msg">No orders found.</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>

                        <td>
                          <div className="customer-cell">
                            <span>{o.customer}</span>
                            <span className="phone-row">
                              <FaPhone size={9} /> {o.phone}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="pickup-cell">
                            <span className="pickup-label">
                              <FaWarehouse size={11} />
                              {o.pickup.split(",")[0]}
                            </span>
                            <span className="pickup-sub">
                              {o.pickup.split(",").slice(1).join(",")}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="drop-cell">
                            <FaMapMarkerAlt size={11} color="#ef4444" />
                            {o.address}
                          </div>
                        </td>

                        <td style={{ fontSize:"11px" }}>{o.date}</td>

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
                          {o.status === "Pending" && (
                            <div className="action-btns">
                              <button className="btn-accept">✓ Accept</button>
                              <button className="btn-reject">✗ Reject</button>
                            </div>
                          )}
                          {o.status === "Accepted" && (
                            <div className="action-btns">
                              <button className="btn-pickup">Picked Up</button>
                              <button className="btn-out">Out for Delivery</button>
                              <button className="btn-delivered">Delivered</button>
                            </div>
                          )}
                          {o.status === "Delivered" && (
                            <span style={{ color:"#22c55e", fontSize:"12px", fontWeight:600 }}>
                              ✓ Done
                            </span>
                          )}
                        </td>
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

export default AssignedDeliveries;