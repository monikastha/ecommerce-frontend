import { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faRightFromBracket,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const AdminNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ✅ GREETING STATE
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();

      // Nepal time (Asia/Kathmandu)
      const nepalTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })
      );

      const hour = nepalTime.getHours();

      if (hour < 12) {
        setGreeting("Good Morning 🌅");
      } else if (hour < 17) {
        setGreeting("Good Afternoon ☀️");
      } else if (hour < 21) {
        setGreeting("Good Evening 🌇");
      } else {
        setGreeting("Good Night 🌙");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // update every minute

    return () => clearInterval(interval);
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

        .navbar-left h2{
          font-size:18px;
          margin:0;
          color:#0f172a;
          font-weight:600;
        }

        .navbar-left p{
          font-size:13px;
          color:#64748b;
          margin-top:3px;
        }

        .navbar-right{
          display:flex;
          align-items:center;
          gap:16px;
        }

        .search-box{
          display:flex;
          align-items:center;
          gap:8px;
          background:#f1f5f9;
          padding:10px 14px;
          border-radius:12px;
          width:280px;
        }

        .search-box input{
          border:none;
          outline:none;
          background:transparent;
          width:100%;
          font-size:13px;
        }

        .icon{
          font-size:18px;
          color:#334155;
          cursor:pointer;
        }

        .profile{
          width:42px;
          height:42px;
          border-radius:50%;
          cursor:pointer;
          border:2px solid #e2e8f0;
        }

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
        }

        .logout{
          color:#ef4444;
        }
      `}</style>

      <div className="navbar">

        {/* LEFT */}
        <div className="navbar-left">
          <h2>{greeting} Admin</h2>
          {/* <p>Welcome back Admin 👋</p> */}
        </div>

        {/* RIGHT */}
        <div className="navbar-right">

          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input placeholder="Search..." />
          </div>

          <FontAwesomeIcon icon={faBell} className="icon" />

          <div ref={dropdownRef} style={{ position: "relative" }}>
            <img
              className="profile"
              src={logo}
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