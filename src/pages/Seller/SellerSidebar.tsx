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

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #0B3E60;
          color: white;
          font-family: sans-serif;
          position: fixed;
          top: 0;
          left: 0;
          overflow-y: auto;
        }

        .logo-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .logo-section img {
          width: 180px;
          height: auto;
        }

        .menu {
          list-style: none;
          padding: 10px 0;
          margin: 0;
        }

        .menu li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          cursor: pointer;
          margin: 4px 10px;
          border-radius: 8px;
          color: white;
          transition: all 0.25s;
          font-size: 14.5px;
        }

        .menu li:hover {
          background: #9B0F06;
          transform: translateX(4px);
        }

        .dropdown-title {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .submenu {
          list-style: none;
          padding-left: 35px;
          margin-top: 4px;
          margin-bottom: 8px;
        }

        .submenu li {
          padding: 9px 14px;
          font-size: 13.5px;
          margin: 2px 0;
          border-radius: 6px;
          color: white;
          transition: 0.2s;
        }

        .submenu li:hover {
          background: #9B0F06;
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
              navigate("/seller/dashboard");
            }}
          >
            <FontAwesomeIcon icon={faGauge} />
            Dashboard
          </li>

          {/* Product Management */}
          <li
            className={activeItem === "products" ? "active" : ""}
            onClick={() => {
              setActiveItem("products");
              navigate("/seller/manageproduct");
              setProductMenu(!productMenu);
            }}
          >
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faBox} />
              <span>Product Management</span>
            </div>
          </li>

          {/* Order Management */}
          <li
            className={activeItem === "orders" ? "active" : ""}
            onClick={() => {
              setActiveItem("orders");
              navigate("/seller/orders");
              setOrderMenu(!orderMenu);
            }}
          >
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Order Management</span>
            </div>
          </li>

          {/* Customer Engagement */}
          <li
            className={activeItem === "reviews" ? "active" : ""}
            onClick={() => {
              setActiveItem("reviews");
              navigate("/seller/reviews");
              setCustomerMenu(!customerMenu);
            }}
          >
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faComments} />
              <span>Customer Engagement</span>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SellerSidebar;
