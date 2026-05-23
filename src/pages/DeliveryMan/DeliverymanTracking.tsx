import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";

const activeDeliveries = [
  {
    id: "#1234",
    customer: "Ram Kumar",
    pickup: "Warehouse A, LaganKhel",
    drop: "New Road, Kathmandu",
    eta: "12:15 PM",
    status: "In Transit",
  },
  {
    id: "#1235",
    customer: "Sita Magar",
    pickup: "Store B, Patan",
    drop: "Thamel, Kathmandu",
    eta: "01:05 PM",
    status: "Picked Up",
  },
];

const completedOrders = [
  {
    id: "#124",
    customer: "Kamala Stha",
    address: "Boudha, Kathmandu",
    amount: "Rs. 250",
    completedAt: "11:20 AM",
  },
  {
    id: "#1231",
    customer: "Princy Bhusal",
    address: "Pulchowk, Lalitpur",
    amount: "Rs. 180",
    completedAt: "10:05 AM",
  },
  {
    id: "#1228",
    customer: "Hari Thapa",
    address: "Baneshwor, Kathmandu",
    amount: "Rs. 320",
    completedAt: "09:30 AM",
  },
];

const statusColor: Record<string, string> = {
  "In Transit": "#f97316",
  "Picked Up": "#3b82f6",
};

const OrdersTracking = () => {
  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        html, body { height:100%; background:#f1f5f9; }

        .ot-layout { display:flex; min-height:100vh; }
        .ot-main   { flex:1; display:flex; flex-direction:column; background:#f1f5f9; }
        .ot-content{ padding:16px 20px; }

        /* BREADCRUMB */
        .breadcrumb {
          display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;
        }
        .breadcrumb h2  { font-size:15px; color:#334155; font-weight:600; }
        .breadcrumb span{ font-size:12px; color:#94a3b8; }

        /* TOP SECTION */
        .top-section {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 14px;
          margin-bottom: 16px;
        }

        /* ACTIVE ORDERS BOX */
        .active-box {
          background: white;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .active-box h2 {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 10px;
          margin-bottom: 10px;
        }

        .order-row:last-child { margin-bottom: 0; }

        .order-left p { font-weight: 600; font-size: 13px; color: #0f172a; }
        .order-left small { font-size: 11px; color: #94a3b8; }

        .order-right { text-align: right; }
        .order-right small { font-size: 11px; color: #94a3b8; }

        .status-pill {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          display: inline-block;
          margin-bottom: 4px;
        }

        /* STATS COLUMN */
        .stats-col { display: flex; flex-direction: column; gap: 12px; }

        .stat-box {
          border-radius: 14px;
          padding: 16px;
          color: white;
          flex: 1;
        }

        .stat-box.blue   { background: linear-gradient(135deg,#2563eb,#60a5fa); }
        .stat-box.orange { background: linear-gradient(135deg,#f97316,#fb923c); }

        .stat-box h4 { font-size: 12px; font-weight: 500; margin-bottom: 6px; opacity: 0.9; }
        .stat-box h2 { font-size: 28px; font-weight: 700; }
        .stat-box small { font-size: 11px; opacity: 0.85; display:flex; align-items:center; gap:4px; margin-top:4px; }

        /* TABLE */
        .table-box {
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .table-box-header {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .table-box-header h2 { font-size: 14px; font-weight: 600; color: #0f172a; }

        table { width:100%; border-collapse:collapse; }
        th { padding:11px 14px; text-align:left; font-size:11px; color:#64748b; font-weight:600; background:#f8fafc; }
        td { padding:11px 14px; font-size:13px; color:#334155; border-bottom:1px solid #f1f5f9; }
        tr:last-child td { border-bottom:none; }

        .delivered-badge {
          background: #22c55e;
          color: white;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 600;
        }
      `}</style>

      <div className="ot-layout">
        <DeliverymanSidebar />

        <div className="ot-main">
          <DeliverymanNavbar />

          <div className="ot-content">

            {/* BREADCRUMB */}
            <div className="breadcrumb">
              <h2>Orders Tracking</h2>
              <span>Home &gt; Orders Tracking</span>
            </div>

            {/* TOP SECTION */}
            <div className="top-section">

              {/* ACTIVE ORDERS */}
              <div className="active-box">
                <h2>🛍️ Active Deliveries ({activeDeliveries.length})</h2>

                {activeDeliveries.map((o) => (
                  <div className="order-row" key={o.id}>
                    <div className="order-left">
                      <p>{o.customer}</p>
                      <small>{o.pickup} → {o.drop}</small>
                    </div>
                    <div className="order-right">
                      <div>
                        <span
                          className="status-pill"
                          style={{ background: statusColor[o.status] || "#64748b" }}
                        >
                          {o.status}
                        </span>
                      </div>
                      <small>ETA: {o.eta}</small>
                    </div>
                  </div>
                ))}
              </div>

              {/* STATS */}
              <div className="stats-col">
                <div className="stat-box blue">
                  <h4>Today's Orders</h4>
                  <h2>8</h2>
                </div>
                <div className="stat-box orange">
                  <h4>Pending</h4>
                  <h2>2</h2>
                  <small>⚠️ 1 urgent</small>
                </div>
              </div>

            </div>

            {/* COMPLETED TABLE */}
            <div className="table-box">
              <div className="table-box-header">
                <h2>Completed Orders</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Amount</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{o.address}</td>
                      <td>{o.amount}</td>
                      <td>{o.completedAt}</td>
                      <td><span className="delivered-badge">Delivered</span></td>
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

export default OrdersTracking;