import { useState } from "react";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";

type Order = {
  id: string;
  customer: string;
  location: string;
  eta: string;
  status: string;
};

const WarehouseOrderTracking = () => {
  const [filter, setFilter] = useState("All");

  const orders: Order[] = [
    {
      id: "#W101",
      customer: "Ram Kumar",
      location: "Warehouse A → Kathmandu",
      eta: "12:30 PM",
      status: "Processing",
    },
    {
      id: "#W102",
      customer: "Sita Magar",
      location: "Warehouse B → Lalitpur",
      eta: "01:10 PM",
      status: "Packed",
    },
    {
      id: "#W103",
      customer: "Hari Thapa",
      location: "Warehouse A → Bhaktapur",
      eta: "02:00 PM",
      status: "Ready",
    },
    {
      id: "#W104",
      customer: "Mina Gurung",
      location: "Warehouse B → KTM",
      eta: "11:45 AM",
      status: "Pending",
    },
  ];

  const filtered =
    filter === "All"
      ? orders
      : orders.filter((o) => o.status === filter);

  const getColor = (status: string) => {
    if (status === "Pending") return "#f97316";
    if (status === "Processing") return "#3b82f6";
    if (status === "Packed") return "#8b5cf6";
    if (status === "Ready") return "#22c55e";
    return "#64748b";
  };

  return (
    <>
      <style>{`
        .layout {
          display:flex;
          min-height:100vh;
          background:#f1f5f9;
        }

        .main {
          flex:1;
          display:flex;
          flex-direction:column;
        }

        .content {
          padding:20px;
        }

        .header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:15px;
        }

        .filters {
          display:flex;
          gap:8px;
          margin-bottom:15px;
        }

        .filters button {
          padding:6px 14px;
          border:none;
          border-radius:20px;
          cursor:pointer;
          background:#e2e8f0;
          font-size:12px;
        }

        .filters .active {
          background:#2563eb;
          color:white;
        }

        .card {
          background:white;
          padding:12px;
          border-radius:12px;
          margin-bottom:10px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .left h4 {
          margin:0;
          font-size:14px;
        }

        .left p {
          font-size:12px;
          color:#64748b;
        }

        .badge {
          padding:4px 10px;
          border-radius:20px;
          color:white;
          font-size:11px;
        }
      `}</style>

      <div className="layout">
        <WarehouseStaffSidebar />

        <div className="main">
          <WarehouseStaffNavbar />

          <div className="content">

            {/* HEADER */}
            <div className="header">
              <h2>Warehouse Order Tracking</h2>
            </div>

            {/* FILTERS */}
            <div className="filters">
              {["All", "Pending", "Processing", "Packed", "Ready"].map((f) => (
                <button
                  key={f}
                  className={filter === f ? "active" : ""}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* LIST */}
            {filtered.map((o) => (
              <div className="card" key={o.id}>
                <div className="left">
                  <h4>{o.customer}</h4>
                  <p>{o.location}</p>
                  <p>ETA: {o.eta}</p>
                </div>

                <span
                  className="badge"
                  style={{ background: getColor(o.status) }}
                >
                  {o.status}
                </span>
              </div>
            ))}

          </div>
        </div>
      </div>
    </>
  );
};

export default WarehouseOrderTracking;
