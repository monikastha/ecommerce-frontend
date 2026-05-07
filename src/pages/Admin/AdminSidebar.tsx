import React, { useState } from "react";
import logo from "../../assets/logo.png";

const AdminSidebar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const [userMenu, setUserMenu] = useState(false);
  const [productMenu, setProductMenu] = useState(false);
  const [orderMenu, setOrderMenu] = useState(false);

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #2f4156;
          color: white;
          font-family: sans-serif;
        }

        /* LOGO */
        .logo-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 20px;
          border-bottom: 1px solid #3f556b;
        }

        .logo-section img {
          width: 170px;
          height: auto;
        }

        /* MENU */
        .menu {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu li:first-child {
          margin-top: 6px;
        }

        .menu li {
          padding: 14px 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          border-radius: 6px;
          margin: 4px 10px;
          color: #d1d5db;
        }

        /* 🔥 HOVER = LIGHT RED */
        .menu li:hover {
          background: rgba(239, 68, 68, 0.15);
          transform: translateX(4px);
          color: white;
        }

        /* 🔥 ACTIVE = SOLID RED */
        .active {
          background: #ef4444;
          color: white !important;
        }

        .dropdown-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .submenu {
          list-style: none;
          padding-left: 10px;
          margin-top: 5px;
          border: none;
        }

        .submenu li {
          padding: 10px 15px;
          font-size: 14px;
          margin: 2px 0;
          border-radius: 5px;
          color: #d1d5db;
          transition: all 0.2s ease;
        }

        .submenu li:hover {
          background:#9B0F06;
          padding-left:10px;
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
            onClick={() => setActiveItem("dashboard")}
          >
            🏠 Dashboard
          </li>

          {/* User Management */}
          <li onClick={() => setUserMenu(!userMenu)}>
            <div className="dropdown-title">
              <span>👤 User Management</span>
            </div>
          </li>

          {userMenu && (
            <ul className="submenu">
              <li>Assistant</li>
              <li>Warehouse Staff</li>
              <li>Seller</li>
              <li>Buyer</li>
              <li>Delivery Man</li>
            </ul>
          )}

          {/* Product Management */}
          <li onClick={() => setProductMenu(!productMenu)}>
            <div className="dropdown-title">
              <span>🛒 Product Management</span>
            </div>
          </li>

          {productMenu && (
            <ul className="submenu">
              <li>Category</li>
              <li>Product</li>
            </ul>
          )}

          {/* Order Management */}
          <li onClick={() => setOrderMenu(!orderMenu)}>
            <div className="dropdown-title">
              <span>📦 Order Management</span>
            </div>
          </li>

          {orderMenu && (
            <ul className="submenu">
              <li>Order</li>
              <li>Earnings</li>
              <li>Assign Delivery</li>
            </ul>
          )}

          {/* Other items */}
          <li>📢 Promotional Settings</li>
          <li>📍 Location</li>

        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;