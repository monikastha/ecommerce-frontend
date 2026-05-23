import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBoxesStacked,
  faClipboardList,
  faTruckFast,
  faChartLine,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const WarehouseStaffSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    { key: "/warehouse/dashboard", label: "Dashboard", icon: faGauge },
    { key: "/warehouse/inventory", label: "Inventory", icon: faBoxesStacked },
    { key: "/warehouse/orders", label: "Order Processing", icon: faClipboardList },
    { key: "/warehouse/tracking", label: "Order Tracking", icon: faTruckFast },
    { key: "/warehouse/reports", label: "Reports", icon: faChartLine },
    { key: "logout", label: "Logout", icon: faRightFromBracket },
  ];

  const handleClick = (key: string) => {
    if (key === "logout") setShowLogout(true);
    else navigate(key);
  };

  const isActive = (key: string) => location.pathname === key;

  return (
    <>
      <style>{`
        .sidebar { width:260px; min-height:100vh; background:#b8cce4; display:flex; flex-direction:column; }
        .sidebar-logo { padding:20px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.4); }
        .sidebar-logo img { width:120px; height:120px; border-radius:50%; }

        .sidebar-menu { list-style:none; padding:10px; flex:1; }
        .sidebar-menu li {
          display:flex; align-items:center; gap:12px;
          padding:12px 16px; margin:4px 0;
          border-radius:10px; cursor:pointer;
          color:#1e3a5f;
        }
        .sidebar-menu li:hover { background:rgba(255,255,255,0.35); }
        .sidebar-menu li.active { background:#2563eb; color:white; }

        .sidebar-profile {
          padding:16px; border-top:1px solid rgba(255,255,255,0.4);
          display:flex; gap:10px; align-items:center;
        }

        .profile-avatar img { width:40px; height:40px; border-radius:50%; }
      `}</style>

      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} />
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

        <div className="sidebar-profile">
          <div className="profile-avatar">
            <img src={logo} />
          </div>
          <div>
            <h4>Warehouse Staff</h4>
            <p>staff@gmail.com</p>
          </div>
        </div>
      </div>

      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <p>Logout?</p>
            <button onClick={() => navigate("/login")}>Yes</button>
            <button onClick={() => setShowLogout(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default WarehouseStaffSidebar;