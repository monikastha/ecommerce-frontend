import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBox,
  faCartShopping,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

const SellerSidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");

  const [productMenu, setProductMenu] = useState(false);
  const [orderMenu, setOrderMenu] = useState(false);
  const [customerMenu, setCustomerMenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #445C6D;
          color: white;
          font-family: sans-serif;
        }

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
        }

        .dropdown-title {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .submenu {
          list-style: none;
          padding-left: 20px;
          margin-top: 4px;
        }

        .submenu li {
          padding: 10px 14px;
          font-size: 13px;
          margin: 2px 0;
          border-radius: 6px;
          color: white;
          transition: 0.2s;
        }

        .submenu li:hover {
          width: 230px;
          background: #9B0F06;
          color: white;
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
              navigate("/seller/dashboards");
            }}
          >
            <FontAwesomeIcon icon={faGauge} />
            Dashboard
          </li>

          {/* Product Management - Now navigates on click */}
          <li 
            onClick={() => {
              navigate("/seller/manageproduct");
              setProductMenu(!productMenu);   // Optional: still toggle submenu
            }}
          >
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faBox} />
              <span>Product Management</span>
            </div>
          </li>

          {/* Order Management */}
          <li onClick={() => {
            navigate("/seller/orders");
            setOrderMenu(!orderMenu);
          }}>
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Order Management</span>
            </div>
          </li>


          {/* Customer Engagement */}
          <li onClick={() => {
              navigate("/seller/reviews");
            setCustomerMenu(!customerMenu);
          }}>
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faComments} />
              <span>Customer Engagement</span>
            </div>
          </li>

          
          )
        </ul>
      </div>
    </>
  );
};

export default SellerSidebar;