import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBox,
  faMoneyBill,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const DeliverymanSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    { key: "/delivery/dashboard", label: "Dashboard", icon: faGauge },
    { key: "/delivery/orders", label: "Orders Tracking", icon: faBox },
    { key: "/delivery/earnings", label: "Earnings", icon: faMoneyBill },
    { key: "logout", label: "Logout", icon: faRightFromBracket },
  ];

  const handleClick = (key: string) => {
    if (key === "logout") {
      setShowLogout(true);
    } else {
      navigate(key);
    }
  };

  const isActive = (key: string) => location.pathname === key;

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #b8cce4;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .sidebar-logo {
          padding: 20px 0 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.4);
        }

        .sidebar-logo img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          border-radius: 50%;
        }

        .sidebar-menu {
          list-style: none;
          padding: 6px 10px;
          margin: 0;
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
          font-size: 14px;
          font-weight: 500;
          color: #1e3a5f;
          transition: 0.2s;
        }

        .sidebar-menu li:hover {
          background: rgba(255,255,255,0.35);
        }

        .sidebar-menu li.active {
          background: #e8392a;
          color: white;
          font-weight: 600;
        }

        .sidebar-profile {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid rgba(255,255,255,0.4);
        }

        .profile-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #d1dce8;
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info h4 {
          font-size: 13px;
          font-weight: 600;
          color: #1e3a5f;
        }

        .profile-info p {
          font-size: 11px;
          color: #3b5f8a;
        }

        .logout-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .logout-modal {
          background: white;
          border-radius: 16px;
          padding: 30px;
          width: 340px;
          text-align: center;
          position: relative;
        }

        .logout-modal-bar {
          height: 8px;
          background: #e8392a;
          border-radius: 12px 12px 0 0;
          position: absolute;
          top: 0; left: 0; right: 0;
        }

        .logout-close {
          position: absolute;
          top: 12px; right: 14px;
          background: #7f1d1d;
          color: white;
          border: none;
          border-radius: 50%;
          width: 28px; height: 28px;
          font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }

        .logout-modal p {
          font-size: 16px;
          color: #334155;
          margin: 20px 0;
        }

        .logout-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-yes {
          padding: 10px 30px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-cancel {
          padding: 10px 30px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
      `}</style>

      <div className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Sajilo Mart" />
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
            <img src={logo} alt="profile" />
          </div>
          <div className="profile-info">
            <h4>Profile Name</h4>
            <p>example@gmail.com</p>
          </div>
        </div>
      </div>

      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <div className="logout-modal-bar" />
            <button className="logout-close" onClick={() => setShowLogout(false)}>✕</button>
            <p>Are you sure you want to logout?</p>
            <div className="logout-btns">
              <button className="btn-yes" onClick={() => navigate("/login")}>Yes</button>
              <button className="btn-cancel" onClick={() => setShowLogout(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliverymanSidebar;