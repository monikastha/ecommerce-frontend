import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import RoleProfileModal from "../../components/RoleProfileModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faRightFromBracket, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";

const DeliverymanNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfile = () => {
    setModalOpen(true);
    setProfileOpen(false);
  };

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
        .navbar-left{
          display:flex;
          flex-direction:column;
        }
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
        .search-box{
          display:flex;
          align-items:center;
          gap:8px;
          background:#f1f5f9;
          padding:10px 14px;
          border-radius:12px;
          width:260px;
          flex-shrink:0;
          border:1px solid transparent;
          transition:0.3s;
        }
        .search-box:focus-within{
          background:#fff;
          border-color:#2563eb;
          box-shadow:0 0 0 3px rgba(37,99,235,0.12);
        }
        .search-box input{
          border:none;
          outline:none;
          background:transparent;
          width:100%;
          font-size:13px;
        }
        .search-icon{ color:#94a3b8; }
        .icon{
          font-size:18px;
          cursor:pointer;
          color:#475569;
          transition:0.2s;
        }
        .icon:hover{
          color:#2563eb;
          transform:scale(1.1);
        }
        .profile{
          width:42px;
          height:42px;
          border-radius:50%;
          cursor:pointer;
          border:2px solid #e2e8f0;
          object-fit: cover;
        }
        .profile:hover{ border-color:#2563eb; }
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
        .dropdown-item{
          padding:12px 15px;
          font-size:14px;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:10px;
          color:#334155;
          transition:0.2s;
        }
        .dropdown-item:hover{ background:#f1f5f9; }
        .dropdown-item.logout{
          color:#ef4444;
          border-top:1px solid #f1f5f9;
        }
        @media(max-width:768px){
          .search-box{ display:none; }
        }
      `}</style>

      <div className="navbar">
        <div className="navbar-left">
          <h2>{getGreeting()}, Delivery Man</h2>
          <p>Welcome back to your dashboard</p>
        </div>

        <div className="navbar-right">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input placeholder="Search products, orders..." />
          </div>

          <FontAwesomeIcon icon={faBell} className="icon" />

          <div ref={dropdownRef} style={{ position: "relative" }}>
            <img className="profile" src={logo} alt="profile" onClick={() => setProfileOpen(!profileOpen)} />

            {profileOpen && (
              <div className="dropdown">
                <div className="dropdown-item" onClick={handleProfile}>
                  <FontAwesomeIcon icon={faUser} />
                  Profile
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <RoleProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default DeliverymanNavbar;
