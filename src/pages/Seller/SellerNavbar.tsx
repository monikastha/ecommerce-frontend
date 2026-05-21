import { useState, useRef, useEffect } from "react";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faRightFromBracket,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

<<<<<<< HEAD
const AdminNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ✅ Time-based greeting (Nepal time works automatically from browser)
=======
const SellerNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

<<<<<<< HEAD
=======
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProfile = () => {
    navigate("/seller/profile");
    setProfileOpen(false);
  };

>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        .navbar{
          height:72px;
          background:rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-bottom:1px solid #e2e8f0;
          padding:0 25px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          position:sticky;
          top:0;
          z-index:100;
        }

<<<<<<< HEAD
        .navbar-left{
          display:flex;
          flex-direction:column;
        }

=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        .navbar-left h2{
          font-size:18px;
          margin:0;
          color:#0f172a;
          font-weight:600;
        }

        .navbar-left p{
          font-size:12px;
          color:#64748b;
          margin-top:2px;
        }

        .navbar-right{
          display:flex;
          align-items:center;
          gap:15px;
        }

<<<<<<< HEAD
        /* ✅ SEARCH FIXED */
=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        .search-box{
          display:flex;
          align-items:center;
          gap:8px;
          background:#f1f5f9;
          padding:10px 14px;
          border-radius:12px;
<<<<<<< HEAD

          width:260px;
          flex-shrink:0;   /* 🔥 IMPORTANT FIX */
          border:1px solid transparent;
=======
          width:260px;
          flex-shrink:0;
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
          transition:0.3s;
        }

        .search-box:focus-within{
          background:#fff;
<<<<<<< HEAD
          border-color:#2563eb;
=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
          box-shadow:0 0 0 3px rgba(37,99,235,0.12);
        }

        .search-box input{
          border:none;
          outline:none;
          background:transparent;
          width:100%;
          font-size:13px;
        }

<<<<<<< HEAD
        .search-icon{
          color:#94a3b8;
        }

        /* ICON */
=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        .icon{
          font-size:18px;
          cursor:pointer;
          color:#475569;
<<<<<<< HEAD
          transition:0.2s;
=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        }

        .icon:hover{
          color:#2563eb;
          transform:scale(1.1);
        }

<<<<<<< HEAD
        /* PROFILE */
=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        .profile{
          width:42px;
          height:42px;
          border-radius:50%;
          cursor:pointer;
          border:2px solid #e2e8f0;
        }

<<<<<<< HEAD
        .profile:hover{
          border-color:#2563eb;
        }

        /* DROPDOWN */
=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        .dropdown{
          position:absolute;
          top:55px;
          right:0;
          width:180px;
          background:white;
          border-radius:12px;
          box-shadow:0 10px 25px rgba(0,0,0,0.1);
          overflow:hidden;
        }

        .dropdown div{
          padding:12px 15px;
          font-size:14px;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:10px;
          color:#334155;
<<<<<<< HEAD
          transition:0.2s;
=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        }

        .dropdown div:hover{
          background:#f1f5f9;
        }

        .logout{
          color:#ef4444 !important;
        }

<<<<<<< HEAD
        /* RESPONSIVE */
=======
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        @media(max-width:768px){
          .search-box{
            display:none;
          }
        }
      `}</style>

      <div className="navbar">

        {/* LEFT */}
        <div className="navbar-left">
<<<<<<< HEAD
          <h2>{getGreeting()}, Admin 👋</h2>
          <p>Welcome back to your dashboard</p>
=======
          <h2>{getGreeting()}, Seller 👋</h2>
          <p>Manage your store efficiently</p>
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        </div>

        {/* RIGHT */}
        <div className="navbar-right">

          {/* SEARCH */}
          <div className="search-box">
<<<<<<< HEAD
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
=======
            <FontAwesomeIcon icon={faSearch} />
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
            <input placeholder="Search products, orders..." />
          </div>

          {/* NOTIFICATION */}
          <FontAwesomeIcon icon={faBell} className="icon" />

          {/* PROFILE */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <img
              className="profile"
              src={logo}
              alt="profile"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            {profileOpen && (
              <div className="dropdown">
<<<<<<< HEAD
                <div>
=======

                <div onClick={handleProfile}>
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
                  <FontAwesomeIcon icon={faUser} />
                  Profile
                </div>

<<<<<<< HEAD
                <div className="logout">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </div>
=======
                <div className="logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </div>

>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

<<<<<<< HEAD
export default AdminNavbar;
=======
export default SellerNavbar;
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
