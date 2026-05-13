import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBox,
  faMoneyBill,
  // faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const DeliverymanSidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <>
      <style>{`
        .sidebar {
          width: 270px;
          min-height: 100vh;
          background: #445C6D;
          color: white;
          font-family: sans-serif;
        }

        /* LOGO */
        .logo-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .logo-section img {
          margin-top: -30px;
          width: 390px;
          height: 270px;
        }

        .menu {
          list-style: none;
          margin-top: -65px;
          padding: 8px 0;
        }

        .menu li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          cursor: pointer;
          margin: 4px 10px;
          border-radius: 8px;
          color: white;
          transition: 0.25s;
          font-size: 14px;
        }

        .menu li:hover {
          background: red;
          transform: translateX(4px);
        }

        .active {
          font-weight: 500;
          background: rgba(255,255,255,0.15);
        }

        .logout {
          margin-top: 20px;
        }
      `}</style>

      <div className="sidebar">
        {/* LOGO */}
        <div className="logo-section">
          <img src={logo} alt="logo" />
        </div>

        {/* MENU */}
        <ul className="menu">

          {/* Dashboard */}
          <li
            className={activeItem === "dashboard" ? "active" : ""}
            onClick={() => {
              setActiveItem("dashboard");
              navigate("/delivery/dashboard");
            }}
          >
            <FontAwesomeIcon icon={faGauge} />
            Dashboard
          </li>

          {/* Orders Tracking */}
          <li
            className={activeItem === "orders" ? "active" : ""}
            onClick={() => {
              setActiveItem("orders");
              navigate("/delivery/orders");
            }}
          >
            <FontAwesomeIcon icon={faBox} />
            Orders Tracking
          </li>

          {/* Earnings */}
          <li
            className={activeItem === "earnings" ? "active" : ""}
            onClick={() => {
              setActiveItem("earnings");
              navigate("/delivery/earnings");
            }}
          >
            <FontAwesomeIcon icon={faMoneyBill} />
            Earnings
          </li>

          {/* Logout */}

        </ul>
      </div>
    </>
  );
};

export default DeliverymanSidebar;