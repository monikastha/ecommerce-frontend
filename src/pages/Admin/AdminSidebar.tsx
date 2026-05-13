import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faUser,
  faBox,
  faCartShopping,
  faBullhorn,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  const navigate = useNavigate();
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
        margin-top:-30px;
          width: 390px;   /* 👈 bigger logo */
          height: 270px;
        }


        .menu {
          list-style: none;
          margin-top:-65px;
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
          color:white;
          transition: 0.2s;
        }

        .submenu li:hover {
           width:230px;
          background: #9B0F06;
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
              navigate("/admin/dashboard");
            }}
          >
            <FontAwesomeIcon icon={faGauge} />
            Dashboard
          </li>
          {/* User */}
          <li onClick={() => setUserMenu(!userMenu)}>
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faUser} />
              <span>User Management</span>
            </div>
          </li>

          {userMenu && (
            <ul className="submenu">
              <li onClick={() => navigate("/admin/staff")}>Staff</li>
              <li onClick={() => navigate("/admin/seller")}>Seller</li>
              <li onClick={() => navigate("/admin/buyer")}>Buyer</li>
              <li onClick={() => navigate("/admin/delivery")}>Delivery Man</li>
            </ul>
          )}

          {/* Product */}
          <li onClick={() => setProductMenu(!productMenu)}>
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faBox} />
              <span>Product Management</span>
            </div>
          </li>

          {productMenu && (
            <ul className="submenu">
              <li onClick={() => navigate("/admin/category")}>Category</li>
              <li onClick={() => navigate("/admin/product")}>Product</li>
            </ul>
          )}

          {/* Order */}
          <li onClick={() => setOrderMenu(!orderMenu)}>
            <div className="dropdown-title">
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Order Management</span>
            </div>
          </li>

          {orderMenu && (
            <ul className="submenu">
             <li onClick={() => navigate("/admin/order")}>Order</li>
               <li onClick={() => navigate("/admin/earnings")}>Earnings</li>
              <li>Assign Delivery</li>
            </ul>
          )}

          {/* Others */}
          <li
            onClick={() => {
              setActiveItem("promotion");
              navigate("/admin/promotion");
            }}
            className={activeItem === "promotion" ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faBullhorn} />
            Promotional Settings
          </li>
          <li
            onClick={() => {
              setActiveItem("location");
              navigate("/admin/location");
            }}
            className={activeItem === "location" ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faLocationDot} />
            Location
          </li>

          {/* <li>
            <FontAwesomeIcon icon={faLocationDot} />
            Location
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
