import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faUser,
  faBox,
  faCartShopping,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";

const AssistantSidebar = () => {
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState("dashboard");
  const [userMenu, setUserMenu] = useState(false);
  const [productMenu, setProductMenu] = useState(false);
  const [orderMenu, setOrderMenu] = useState(false);

  return (
    <>
      <style>{`
        .sidebar {
          width: 250px;
          min-height: 100vh;
          background: #5BBF9A;
          color: white;
          font-family: sans-serif;
          position: fixed;           /* ← Fixed Position */
          top: 0;
          left: 0;
          overflow-y: auto;          /* Scroll if content is too long */
          z-index: 1000;
        }

        /* LOGO */
        .logo-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.15);
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
          background: #E53935;
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
          width: 190px;
          background: #E53935;
          color: white;
        }
      `}</style>

      <div className="sidebar">
        {/* Logo */}
        <div className="logo-section">
          <img src={logo} alt="logo" />
        </div>

        {/* Menu */}
        <ul className="menu">
          {/* Dashboard */}
          <li
            className={activeItem === "dashboard" ? "active" : ""}
            onClick={() => {
              setActiveItem("dashboard");
              navigate("/assistant/dashboard");
            }}
          >
            <FontAwesomeIcon icon={faGauge} />
            Dashboard
          </li>

          {/* User Management */}
          <li onClick={() => setUserMenu(!userMenu)}>
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faUser} />
              <span>User Management</span>
            </div>
          </li>

          {userMenu && (
            <ul className="submenu">
              <li onClick={() => { setActiveItem("user-warehouse"); navigate("/assistant/warehouse/staff"); }}>Warehouse Staff</li>
              <li onClick={() => { setActiveItem("user-seller"); navigate("/assistant/seller"); }}>Seller</li>
              <li onClick={() => { setActiveItem("user-buyer"); navigate("/assistant/buyer"); }}>Buyer</li>
              <li onClick={() => { setActiveItem("user-delivery"); navigate("/assistant/delivery-man"); }}>Delivery Man</li>
            </ul>
          )}

          {/* Product Management */}
          <li onClick={() => setProductMenu(!productMenu)}>
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faBox} />
              <span>Product Management</span>
            </div>
          </li>

          {productMenu && (
            <ul className="submenu">
              <li onClick={() => { setActiveItem("category"); navigate("/assistant/category"); }}>Category</li>
              <li onClick={() => { setActiveItem("product"); navigate("/assistant/product"); }}>Product</li>
            </ul>
          )}

          {/* Order Management */}
          <li onClick={() => setOrderMenu(!orderMenu)}>
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Order Management</span>
            </div>
          </li>

          {orderMenu && (
            <ul className="submenu">
              <li onClick={() => { setActiveItem("order"); navigate("/assistant/order"); }}>Order</li>
            </ul>
          )}

          {/* Emergency Fast Delivery */}
          <li
            className={activeItem === "emergency" ? "active" : ""}
            onClick={() => {
              setActiveItem("emergency");
              navigate("/assistant/emergency-orders");
            }}
          >
            <FontAwesomeIcon icon={faTruckFast} />
            Emergency Fast Delivery
          </li>
        </ul>
      </div>
    </>
  );
};

export default AssistantSidebar;
