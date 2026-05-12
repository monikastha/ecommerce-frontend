import { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faRightFromBracket,
  // faIdBadge,
} from "@fortawesome/free-solid-svg-icons";

const AdminNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // close dropdown on outside click
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        .navbar{
          height:70px;
          background:white;
          border-bottom:1px solid #ddd;
          padding:0 25px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .navbar-left h2{
          color:#444;
          font-size:22px;
          margin:0;
        }

        .navbar-left p{
          font-size:13px;
          color:gray;
          margin-top:5px;
        }

        .navbar-right{
          display:flex;
          align-items:center;
          gap:15px;
        }

        .search-box input{
          width:260px;
          padding:10px;
          border:none;
          outline:none;
          background:#f2f2f2;
          border-radius:6px;
        }

        .icon{
          font-size:18px;
          cursor:pointer;
          color:#444;
        }

        .profile{
          width:40px;
          height:40px;
          border-radius:50%;
          cursor:pointer;
          border:2px solid #ddd;
        }

        /* DROPDOWN */
        .dropdown {
          position: absolute;
          top: 60px;
          right: 0;
          width: 180px;
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          overflow: hidden;
          z-index: 100;
        }

        .dropdown div {
          padding: 12px 15px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.2s;
        }

        .dropdown div:hover {
          background: #f5f5f5;
        }

        .logout {
          color: red;
        }
      `}</style>

      <div className="navbar">

        {/* LEFT */}
        <div className="navbar-left">
          <h2>Good Morning, Admin</h2>

        </div>

        {/* RIGHT */}
        <div className="navbar-right">

          {/* SEARCH */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search Product, Order etc."
            />
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

                <div>
                  <FontAwesomeIcon icon={faUser} />
                  Profile
                </div>

                <div className="logout">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default AdminNavbar;