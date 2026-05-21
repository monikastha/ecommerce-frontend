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
  faRightFromBracket,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const AssistantSidebar = () => {
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState("dashboard");
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #5BBF9A;
          color: white;
          font-family: sans-serif;
        }

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
          justify-content: space-between;
          padding: 12px 18px;
          cursor: pointer;
          margin: 4px 10px;
          border-radius: 8px;
          color: white;
          transition: 0.25s;
          font-size: 14px;
        }

        .menu-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .menu li:hover {
          background: #E53935;
          transform: translateX(4px);
        }

        .active {
          // background: #E53935;
          font-weight: 500;
        }

        .submenu {
          margin-left: 25px;
          margin-top: 2px;
        }

        .submenu li {
          font-size: 13px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.08);
        }

        .submenu li:hover {
          background: #E53935;
        }
      `}</style>

      <div className="sidebar">
        {/* Logo */}
        <div className="logo-section">
          <img src={logo} alt="logo" />
        </div>

        <ul className="menu">

          {/* Dashboard */}
          <li
            className={activeItem === "dashboard" ? "active" : ""}
            onClick={() => {
              setActiveItem("dashboard");
              navigate("/assistant/dashboard");
            }}
          >
            <div className="menu-left">
              <FontAwesomeIcon icon={faGauge} />
              Dashboard
            </div>
          </li>

          {/* User Management Dropdown */}
          <li
            className={activeItem.includes("user") ? "active" : ""}
            onClick={() => setUserDropdown(!userDropdown)}
          >
            <div className="menu-left">
              <FontAwesomeIcon icon={faUser} />
              User Management
            </div>

            <FontAwesomeIcon
              icon={userDropdown ? faChevronUp : faChevronDown}
            />
          </li>

          {/* Dropdown Items */}
          {userDropdown && (
            <ul className="submenu">

              <li
                onClick={() => {
                  setActiveItem("user-warehouse");
                  navigate("/assistant/warehouse/staff");
                }}
              >
                Warehouse Staff
              </li>

              <li
                onClick={() => {
                  setActiveItem("user-seller");
                  navigate("/assistant/seller");
                }}
              >
                Seller
              </li>

              <li
                onClick={() => {
                  setActiveItem("user-buyer");
                  navigate("/assistant/buyer");
                }}
              >
                Buyer
              </li>

              <li
                onClick={() => {
                  setActiveItem("user-delivery");
                  navigate("/assistant/delivery-man");
                }}
              >
                Delivery Man
              </li>

            </ul>
          )}

          {/* Product Management */}
          <li
            className={activeItem === "product" ? "active" : ""}
            onClick={() => {
              setActiveItem("product");
              navigate("/assistant/product");
            }}
          >
            <div className="menu-left">
              <FontAwesomeIcon icon={faBox} />
              Product Management
            </div>
          </li>

          {/* Order Management */}
          <li
            className={activeItem === "order" ? "active" : ""}
            onClick={() => {
              setActiveItem("order");
              navigate("/assistant/order");
            }}
          >
            <div className="menu-left">
              <FontAwesomeIcon icon={faCartShopping} />
              Order Management
            </div>
          </li>

          {/* Emergency Fast Delivery */}
          <li
            className={activeItem === "emergency" ? "active" : ""}
            onClick={() => {
              setActiveItem("emergency");
              navigate("/assistant/emergency/orders");
            }}
          >
            <div className="menu-left">
              <FontAwesomeIcon icon={faTruckFast} />
              Emergency Fast Delivery
            </div>
          </li>

          {/* Logout */}
          <li
            onClick={() => {
              navigate("/login");
            }}
          >
            <div className="menu-left">
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </div>
          </li>

        </ul>
      </div>
    </>
  );
};

export default AssistantSidebar;