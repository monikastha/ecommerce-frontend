import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaUsers, FaBoxOpen, FaTags, FaMoneyBillWave } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <>
      <style>{`
         body {
  font-family: "Poppins", sans-serif;
}
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        html, body {
          height: 100%;
          overflow-x: hidden;   /* ✅ FIX SCROLL ISSUE */
          background: #f1f5f9;
        }

        /* MAIN WRAPPER */
        .dashboard-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        /* MAIN AREA */
        .main-content {
          flex: 1;
          width: calc(100% - 260px); /* ✅ prevents overflow */
        }

        .content {
          padding: 25px;
        }

        /* HEADER */
        .dashboard-header h1 {
          font-size: 28px;
          color: #0f172a;
        }

        .dashboard-header p {
          color: #64748b;
          margin-top: 5px;
        }

        /* CARDS */
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .card {
          padding: 22px;
          border-radius: 18px;
          color: white;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-6px);
        }

        .card-icon {
          font-size: 30px;
          margin-bottom: 10px;
        }

        .purple { background: linear-gradient(135deg,#7c3aed,#a855f7); }
        .blue { background: linear-gradient(135deg,#2563eb,#3b82f6); }
        .pink { background: linear-gradient(135deg,#ec4899,#f472b6); }
        .green { background: linear-gradient(135deg,#059669,#10b981); }

        /* OVERVIEW */
        .overview {
          margin-top: 30px;
        }

        .overview h2 {
          margin-bottom: 15px;
        }

        .chart-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .chart-box {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.05);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {

          .main-content {
            width: 100%;
          }

          .content {
            padding: 15px;
          }

        }

      `}</style>

      <div className="dashboard-container">

        <AdminSidebar />

        <div className="main-content">

          <AdminNavbar />

          <div className="content">

            <div className="dashboard-header">
              <h1>Admin Dashboard</h1>
              <p>Welcome back 👋 Here's your store overview.</p>
            </div>

            <div className="cards">

              <div className="card purple">
                <FaUsers className="card-icon" />
                <h3>Total Users</h3>
                <h2>1124</h2>
              </div>

              <div className="card blue">
                <FaBoxOpen className="card-icon" />
                <h3>Total Products</h3>
                <h2>23</h2>
              </div>

              <div className="card pink">
                <FaTags className="card-icon" />
                <h3>Total Categories</h3>
                <h2>3</h2>
              </div>

              <div className="card green">
                <FaMoneyBillWave className="card-icon" />
                <h3>Total Earnings</h3>
                <h2>Rs. 24,555</h2>
              </div>

            </div>

            <div className="overview">

              <h2>Analytics Overview</h2>

              <div className="chart-container">

                <div className="chart-box">
                  <h3>Top Products</h3>
                  {/* <p>Graph area</p> */}
                </div>

                <div className="chart-box">
                  <h3>Monthly Income</h3>
                  {/* <p>Graph area</p> */}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default AdminDashboard;