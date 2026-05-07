import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  return (
    <>
      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial, sans-serif;
        }

        .dashboard-container{
          display:flex;
          background:#f5f6fa;
          min-height:100vh;
        }

        .main-content{
          flex:1;
        }

        .content{
          padding:25px;
        }

        .cards{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:20px;
        }

        .card{
          padding:20px;
          border-radius:12px;
        }

        .card h3{
          margin-bottom:10px;
        }

        .card h1{
          font-size:28px;
        }

        .purple{
          background:#8b5cf6;
          color:white;
        }

        .blue{
          background:#dbeafe;
        }

        .pink{
          background:#ffe4e6;
        }

        .green{
          background:#d1fae5;
        }

        .overview{
          margin-top:40px;
        }

        .overview h2{
          margin-bottom:20px;
          color:#333;
        }

        .chart-container{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:20px;
        }

        .chart-box{
          background:white;
          padding:20px;
          border-radius:12px;
        }

        .chart-box h3{
          margin-bottom:20px;
        }

        .bars{
          height:220px;
          display:flex;
          align-items:flex-end;
          gap:20px;
        }

        .bar{
          width:60px;
          border-radius:8px 8px 0 0;
        }

        .bar1{
          height:120px;
          background:#3b82f6;
        }

        .bar2{
          height:80px;
          background:#06b6d4;
        }

        .bar3{
          height:170px;
          background:#2563eb;
        }

      `}</style>

      <div className="dashboard-container">

        <AdminSidebar />

        <div className="main-content">

          <AdminNavbar />

          <div className="content">

            {/* Cards */}
            <div className="cards">

              <div className="card purple">
                <h3>Total Users</h3>
                <h1>1124</h1>
              </div>

              <div className="card blue">
                <h3>Total Products</h3>
                <h1>23</h1>
              </div>

              <div className="card pink">
                <h3>Total Category</h3>
                <h1>3</h1>
              </div>

              <div className="card green">
                <h3>Total Earnings</h3>
                <h1>Rs.24555</h1>
              </div>

            </div>

            {/* Overview */}
            <div className="overview">

              <h2>Overview</h2>

              <div className="chart-container">

                <div className="chart-box">
                  <h3>Top 3 Products sold this month</h3>

                  <div className="bars">
                    <div className="bar bar1"></div>
                    <div className="bar bar2"></div>
                    <div className="bar bar3"></div>
                  </div>
                </div>

                <div className="chart-box">
                  <h3>Top 3 Income this month</h3>

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

export default AdminDashboard;