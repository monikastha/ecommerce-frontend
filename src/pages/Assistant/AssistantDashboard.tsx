import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";

const AssistantDashboard = () => {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
        }

        .dashboard-container {
          background: #f3f4f6;
          min-height: 100vh;
        }

        /* Sidebar is fixed, so main content needs margin */
        .main-content {
          margin-left: 250px;   /* Same as sidebar width */
          width: calc(100% - 250px);
          min-height: 100vh;
          background: #f3f4f6;
        }

        .content {
          padding: 20px 30px;
        }

        /* ===== Cards ===== */
        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 15px;
        }

        .card {
          padding: 20px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .card h3 {
          font-size: 15px;
          color: #444;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .card h1 {
          font-size: 28px;
          font-weight: 600;
          color: #1f2937;
        }

        .blue { background: linear-gradient(135deg, #dbeafe, #eff6ff); }
        .green { background: linear-gradient(135deg, #d1fae5, #ecfdf5); }
        .pink { background: linear-gradient(135deg, #ffe4e6, #fff1f2); }

        /* ===== Overview ===== */
        .overview {
          margin-top: 35px;
        }

        .overview h2 {
          margin-bottom: 15px;
          color: #222;
          font-size: 19px;
          font-weight: 600;
        }

        .chart-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .chart-box {
          background: #fff;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
        }

        .chart-box h3 {
          margin-bottom: 20px;
          font-size: 15px;
          color: #333;
          font-weight: 500;
        }

        .bars {
          height: 210px;
          display: flex;
          align-items: flex-end;
          gap: 25px;
          padding-top: 10px;
        }

        .bar {
          width: 55px;
          border-radius: 8px 8px 0 0;
        }

        .bar1 { height: 110px; background: #ef4444; }
        .bar2 { height: 75px; background: #f97316; }
        .bar3 { height: 160px; background: #22c55e; }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="content">
            {/* Cards */}
            <div className="cards">
              <div className="card blue">
                <h3>Total Users</h3>
                <h1>1,124</h1>
              </div>

              <div className="card green">
                <h3>Total Products</h3>
                <h1>23</h1>
              </div>

              <div className="card pink">
                <h3>Total Categories</h3>
                <h1>3</h1>
              </div>
            </div>

            {/* Overview */}
            <div className="overview">
              <h2>Overview</h2>

              <div className="chart-container">
                <div className="chart-box">
                  <h3>Top 3 Products Sold This Month</h3>
                  <div className="bars">
                    <div className="bar bar1"></div>
                    <div className="bar bar2"></div>
                    <div className="bar bar3"></div>
                  </div>
                </div>

                <div className="chart-box">
                  <h3>Top 3 Income This Month</h3>
                  <div className="bars">
                    <div className="bar bar1"></div>
                    <div className="bar bar2"></div>
                    <div className="bar bar3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantDashboard;