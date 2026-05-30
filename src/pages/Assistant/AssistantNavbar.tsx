import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import RoleProfileModal from "../../components/RoleProfileModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";

interface AssistantNavbarProps {
  sidebarWidth?: number;
}

const AssistantNavbar: React.FC<AssistantNavbarProps> = ({ sidebarWidth = 250 }) => {
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
        .navbar {
          height: 72px;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 999;
          width: 100%;
        }
        .navbar-left h2 {
          font-size: 19px;
          margin: 0;
          color: #0f172a;
          font-weight: 600;
        }
        .navbar-left p {
          font-size: 13px;
          color: #64748b;
          margin-top: 2px;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .icon {
          font-size: 19px;
          cursor: pointer;
          color: #475569;
          transition: 0.2s;
        }
        .icon:hover { color: #5BBF9A; transform: scale(1.1); }
        .profile {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #e2e8f0;
          object-fit: cover;
        }
        .profile:hover { border-color: #5BBF9A; }
        .dropdown {
          position: absolute;
          top: 58px;
          right: 10px;
          width: 180px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          overflow: hidden;
          z-index: 1001;
        }
        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #334155;
        }
        .dropdown-item:hover { background: #f8fafc; }
        .dropdown-item.logout {
          color: #ef4444;
          border-top: 1px solid #f1f5f9;
        }
      `}</style>

      <div className="navbar" data-sidebar-width={sidebarWidth}>
        <div className="navbar-left">
          <h2>{getGreeting()}, Assistant</h2>
          <p>Welcome back to your dashboard</p>
        </div>

        <div className="navbar-right">
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

export default AssistantNavbar;
