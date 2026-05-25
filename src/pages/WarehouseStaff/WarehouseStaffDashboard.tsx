import { useNavigate } from "react-router-dom";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";

import { FaBoxes, FaClipboardList, FaClock, FaCheckCircle } from "react-icons/fa";

const WarehouseStaffDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .dash-layout { display:flex; min-height:100vh; background:#f1f5f9; }
        .dash-main { flex:1; display:flex; flex-direction:column; }
        .dash-content { padding:20px; }

        .breadcrumb {
          display:flex; justify-content:space-between;
          margin-bottom:15px;
        }

        .cards {
          display:grid;
          grid-template-columns: repeat(2, 1fr);
          gap:12px;
          margin-bottom:20px;
        }

        .card {
          background:white;
          padding:15px;
          border-radius:12px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          cursor:pointer;
          transition:0.2s;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow:0 6px 15px rgba(0,0,0,0.1);
        }

        .card h3 { font-size:13px; color:#475569; }
        .card h2 { font-size:22px; }

        .icon { font-size:26px; color:#2563eb; }

        @media(max-width:768px){
          .cards { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="dash-layout">
        <WarehouseStaffSidebar />

        <div className="dash-main">
          <WarehouseStaffNavbar />

          <div className="dash-content">

            <div className="breadcrumb">
              <h2>Warehouse Dashboard</h2>
              <span>Home &gt; Dashboard</span>
            </div>

            <div className="cards">

              <div className="card" onClick={() => navigate("/warehouse/orders")}>
                <div>
                  <h3>Total Stock</h3>
                  <h2>120</h2>
                </div>
                <FaClipboardList className="icon" />
              </div>

              <div className="card" onClick={() => navigate("/warehouse/orders?filter=Pending")}>
                <div>
                  <h3>Out of Stock</h3>
                  <h2>30</h2>
                </div>
                <FaClock className="icon" />
              </div>

              <div className="card" onClick={() => navigate("/warehouse/orders?filter=Completed")}>
                <div>
                  <h3>Instock</h3>
                  <h2>80</h2>
                </div>
                <FaCheckCircle className="icon" />
              </div>

              <div className="card" onClick={() => navigate("/warehouse/inventory")}>
                <div>
                  <h3>Inventory Stock</h3>
                  <h2>450</h2>
                </div>
                <FaBoxes className="icon" />
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default WarehouseStaffDashboard;