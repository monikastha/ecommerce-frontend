import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBoxesStacked,
  faClipboardList,
  faTruckFast,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const WarehouseStaffSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();   // ← Added this

  const menuItems = [
    { key: "/warehouse/dashboard", label: "Dashboard", icon: faGauge },
    { key: "/warehouse/inventory", label: "Inventory", icon: faBoxesStacked },
    { key: "/warehouse/orders", label: "Order Processing", icon: faClipboardList },
    { key: "/warehouse/tracking", label: "Order Tracking", icon: faTruckFast },
    { key: "/warehouse/reports", label: "Reports", icon: faChartLine },
  ];

  const isActive = (key: string) => location.pathname === key;

  // Handle navigation
  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <style>{`
        .sidebar { 
          width: 260px; 
          min-height: 100vh; 
          background: #b8cce4; 
          font-family:'Poppins',sans-serif;
          display: flex; 
          flex-direction: column; 
        }
        .sidebar-logo { 
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 18px 20px; 
          border-bottom: 1px solid rgba(255,255,255,0.4); 
        }
        .sidebar-logo img { 
          margin-top: -30px;
          width: 390px; 
          height: 270px; 
          object-fit: contain;
        }

        .sidebar-menu { 
          list-style: none; 
          margin-top: -65px;
          padding: 10px; 
          flex: 1; 
        }
        .sidebar-menu li {
          display: flex; 
          align-items: center; 
          gap: 12px;
          padding: 12px 16px; 
          margin: 4px 0;
          border-radius: 10px; 
          cursor: pointer;
          color: #1e3a5f;
          transition: all 0.3s;
        }
        .sidebar-menu li:hover { 
          background: rgba(255,255,255,0.35); 
        }
        .sidebar-menu li.active { 
          background: #2563eb; 
          color: white; 
        }

        .sidebar-profile {
          padding: 16px; 
          border-top: 1px solid rgba(255,255,255,0.4);
          display: flex; 
          gap: 10px; 
          align-items: center;
        }
      `}</style>

      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={isActive(item.key) ? "active" : ""}
              onClick={() => handleClick(item.key)}
            >
              <FontAwesomeIcon icon={item.icon} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default WarehouseStaffSidebar;
