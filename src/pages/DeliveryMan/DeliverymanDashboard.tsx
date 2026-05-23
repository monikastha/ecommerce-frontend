import { useNavigate } from "react-router-dom";
import { FaTruck, FaBoxOpen, FaClock, FaMoneyBillWave } from "react-icons/fa";
import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const weeklyData = [
  { day: "Sat", orders: 15 },
  { day: "Sun", orders: 15 },
  { day: "Mon", orders: 10 },
  { day: "Tue", orders: 15 },
  { day: "Wed", orders: 5 },
  { day: "Thu", orders: 5 },
  { day: "Fri", orders: 10 },
];

const DeliverymanDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Poppins',sans-serif; }
        html, body { height:100%; background:#f1f5f9; }

        .dash-layout { display:flex; min-height:100vh; }
        .dash-main   { flex:1; display:flex; flex-direction:column; background:#f1f5f9; }
        .dash-content{ padding:16px 20px; }

        .breadcrumb {
          display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;
        }
        .breadcrumb h2 { font-size:15px; color:#334155; font-weight:600; }
        .breadcrumb span{ font-size:12px; color:#94a3b8; }

        .stat-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-card {
          background: #dbeafe;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          min-height: 80px;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37,99,235,0.15);
        }

        .stat-card-left h4 {
          font-size: 12px;
          color: #1e40af;
          font-weight: 600;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .stat-card-left h2 {
          font-size: 22px;
          color: #1e3a8a;
          font-weight: 700;
        }

        .stat-card-icon {
          font-size: 26px;
          color: #3b82f6;
          opacity: 0.6;
          flex-shrink: 0;
        }

        .chart-section {
          background: white;
          border-radius: 14px;
          padding: 16px 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .chart-header h3 { font-size:14px; color:#1e40af; font-weight:600; }

        .chart-select {
          border:1px solid #e2e8f0; border-radius:8px;
          padding:3px 10px; font-size:12px; color:#475569; background:white; cursor:pointer;
        }

        @media (max-width:768px) {
          .stat-cards { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="dash-layout">
        <DeliverymanSidebar />

        <div className="dash-main">
          <DeliverymanNavbar />

          <div className="dash-content">

            <div className="breadcrumb">
              <h2>Dashboard</h2>
              <span>Home &gt; Dashboard</span>
            </div>

            <div className="stat-cards">

              <div className="stat-card" onClick={() => navigate("/delivery/assigned")}>
                <div className="stat-card-left">
                  <h4>Total Assigned Deliveries</h4>
                  <h2>64</h2>
                </div>
                <FaTruck className="stat-card-icon" />
              </div>

              <div className="stat-card" onClick={() => navigate("/delivery/assigned?filter=Pending")}>
                <div className="stat-card-left">
                  <h4>Pending Deliveries</h4>
                  <h2>24</h2>
                </div>
                <FaClock className="stat-card-icon" />
              </div>

              <div className="stat-card" onClick={() => navigate("/delivery/earnings")}>
                <div className="stat-card-left">
                  <h4>Total Earnings</h4>
                  <h2>Rs. 24,000</h2>
                </div>
                <FaMoneyBillWave className="stat-card-icon" />
              </div>

              <div className="stat-card" onClick={() => navigate("/delivery/assigned?filter=Completed")}>
                <div className="stat-card-left">
                  <h4>Completed Deliveries</h4>
                  <h2>50</h2>
                </div>
                <FaBoxOpen className="stat-card-icon" />
              </div>

            </div>

            <div className="chart-section">
              <div className="chart-header">
                <h3>No of Orders</h3>
                <select className="chart-select">
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData} barSize={28} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:"#94a3b8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:"#94a3b8" }} domain={[0, 25]} />
                  <Tooltip contentStyle={{ borderRadius:"10px", border:"none", boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="orders" fill="#ef4444" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DeliverymanDashboard;