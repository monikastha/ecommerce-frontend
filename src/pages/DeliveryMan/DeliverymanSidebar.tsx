import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBox,
  faMoneyBill,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";

const DeliverymanSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [earningsOpen, setEarningsOpen] = useState(
    location.pathname === "/delivery/tracking" || location.pathname === "/delivery/earnings"
  );
  const [dropdownFocus, setDropdownFocus] = useState(false);

  const menuItems = [
    { key: "/delivery/dashboard", label: "Dashboard", icon: faGauge },
    { key: "/delivery/assigned", label: "Order Tracking", icon: faTruckFast },
  ];

  const handleClick = (key: string) => {
    setDropdownFocus(false);
    navigate(key);
  };

  const isActive = (key: string) => location.pathname === key && !dropdownFocus;
  const isSubmenuActive = (key: string) => location.pathname === key;

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: #b8cce4;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar + .dash-main,
        .sidebar + .main,
        .sidebar + .assigned-main,
        .sidebar + .earnings-main {
          margin-left: 260px;
          width: calc(100% - 260px);
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
          background: #e8392a;
          color: white;
        }

        .sidebar-menu li.active {
          background: #e8392a;
          color: white;
          font-weight: 600;
        }

        .sidebar-menu li.sidebar-dropdown {
          display: block;
          align-items: stretch;
          gap: 0;
          padding: 0;
          margin: 4px 0;
          cursor: default;
          border-radius: 0;
          color: inherit;
        }

        .sidebar-menu li.sidebar-dropdown:hover {
          background: transparent;
        }

        .dropdown-title {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #1e3a5f;
          transition: 0.2s;
        }

        .dropdown-title:hover {
          background: #e8392a;
          color: white;
        }

        .submenu {
          list-style: none;
          padding-left: 20px;
          margin: 4px 0 8px;
          width: 100%;
        }

        .sidebar-menu .submenu li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          font-size: 13px;
          margin: 2px 0;
          border-radius: 6px;
          color: #25496f;
          transition: 0.2s;
        }

        .sidebar-menu .submenu li:hover {
          background: #9B0F06;
          color: white;
        }

        .sidebar-menu .submenu li.active {
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

        @media (max-width: 768px) {
          .sidebar {
            width: 220px;
          }

          .sidebar + .dash-main,
          .sidebar + .main,
          .sidebar + .assigned-main,
          .sidebar + .earnings-main {
            margin-left: 220px;
            width: calc(100% - 220px);
          }
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

          <li className="sidebar-dropdown">
            <div
              className="dropdown-title"
              onClick={() => {
                setDropdownFocus(true);
                setEarningsOpen((open) => !open);
              }}
            >
              <FontAwesomeIcon icon={faMoneyBill} />
              <span>Earnings Management</span>
            </div>

            {earningsOpen && (
              <ul className="submenu">
                <li
                  className={isSubmenuActive("/delivery/tracking") ? "active" : ""}
                  onClick={() => {
                    setDropdownFocus(false);
                    navigate("/delivery/tracking");
                  }}
                >
                  <FontAwesomeIcon icon={faBox} />
                  Delivery History
                </li>
                <li
                  className={isSubmenuActive("/delivery/earnings") ? "active" : ""}
                  onClick={() => {
                    setDropdownFocus(false);
                    navigate("/delivery/earnings");
                  }}
                >
                  <FontAwesomeIcon icon={faMoneyBill} />
                  Earnings
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default DeliverymanSidebar;
