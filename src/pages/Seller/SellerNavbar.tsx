import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faRightFromBracket,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const SellerNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProfile = () => {
    navigate("/seller/profile");
    setProfileOpen(false);
  };

  // Close dropdown when clicking outside
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // You can add search logic here (filter products, navigate, etc.)
  };

  return (
    <>
      <style>{`
        .navbar {
          height: 72px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
          padding: 0 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .navbar-left h2 {
          font-size: 18px;
          margin: 0;
          color: #0f172a;
          font-weight: 600;
        }

        .navbar-left p {
          font-size: 12.5px;
          color: #64748b;
          margin-top: 2px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: 12px;
          width: 280px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
        }

        .search-box:focus-within {
          background: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
          border-color: #3b82f6;
        }

        .search-box input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 14px;
          color: #334155;
        }

        .icon {
          font-size: 20px;
          cursor: pointer;
          color: #475569;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .icon:hover {
          background: #f1f5f9;
          color: #2563eb;
        }

        .profile {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #e2e8f0;
          object-fit: cover;
        }

        .dropdown {
          position: absolute;
          top: 58px;
          right: 10px;
          width: 190px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          z-index: 1001;
        }

        .dropdown div {
          padding: 12px 16px;
          font-size: 14.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #334155;
          transition: background 0.2s;
        }

        .dropdown div:hover {
          background: #f8fafc;
        }

        .logout {
          color: #ef4444 !important;
          border-top: 1px solid #f1f5f9;
        }

        @media (max-width: 768px) {
          .search-box {
            width: 200px;
          }
          .navbar-left h2 {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="navbar">
        {/* LEFT SIDE */}
        <div className="navbar-left">
          <h2>{getGreeting()}, Seller 👋</h2>
          <p>Manage your store efficiently</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="navbar-right">
          {/* SEARCH */}
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* NOTIFICATION */}
          <FontAwesomeIcon icon={faBell} className="icon" />

          {/* PROFILE */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <img
              className="profile"
              src={logo}           // Replace with actual user profile image later
              alt="profile"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            {profileOpen && (
              <div className="dropdown">
                <div onClick={handleProfile}>
                  <FontAwesomeIcon icon={faUser} />
                  Profile
                </div>
                <div className="logout" onClick={handleLogout}>
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

export default SellerNavbar;