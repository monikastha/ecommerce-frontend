import { useState } from "react";
<<<<<<< HEAD
import logo from "../../assets/logo.png";

interface NavItem {
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>,
  },
  {
    label: "Products",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.1-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" /></svg>,
  },
  {
    label: "Orders",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>,
  },
  {
    label: "Customers",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>,
  },
  {
    label: "Logout",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>,
  },
];

export default function SellerSidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div
      style={{
        width: "230px",
        height: "100vh",
        background: "#1b2d4f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        fontFamily: "Segoe UI",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          width: "90px",
          height: "90px",
          background: "#fff",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: "80%", height: "80%", objectFit: "contain" }}
        />
      </div>

      {/* NAV */}
      <div style={{ width: "100%" }}>
        {navItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActive(item.label)}
            style={{
              display: "flex",
              gap: "10px",
              padding: "12px 18px",
              cursor: "pointer",
              color: "#fff",
              background: active === item.label ? "#e53935" : "transparent",
              fontSize: "14px",
            }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>

      {/* PROFILE */}
      <div style={{ marginTop: "auto", padding: "15px", color: "#fff" }}>
        <div style={{ fontSize: "13px", fontWeight: 600 }}>Seller Name</div>
        <div style={{ fontSize: "11px", color: "#aaa" }}>
          seller@email.com
        </div>
      </div>
    </div>
  );
}
=======
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
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
