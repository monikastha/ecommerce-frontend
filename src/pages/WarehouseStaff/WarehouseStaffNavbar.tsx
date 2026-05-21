import { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faRightFromBracket, faSearch } from "@fortawesome/free-solid-svg-icons";

const WarehouseStaffNavbar = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <style>{`
        .navbar { height:72px; background:white; display:flex; justify-content:space-between; padding:0 20px; align-items:center; }

        .search { display:flex; gap:8px; background:#f1f5f9; padding:8px 12px; border-radius:10px; }

        .icon { cursor:pointer; }
        .profile { width:40px; border-radius:50%; cursor:pointer; }
      `}</style>

      <div className="navbar">
        <div>
          <h3>{getGreeting()}, Warehouse Staff</h3>
          <p>Manage inventory & orders</p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div className="search">
            <FontAwesomeIcon icon={faSearch} />
            <input placeholder="Search..." />
          </div>

          <FontAwesomeIcon icon={faBell} className="icon" />

          <div ref={ref}>
            <img src={logo} className="profile" onClick={() => setOpen(!open)} />

            {open && (
              <div className="dropdown">
                <div><FontAwesomeIcon icon={faUser} /> Profile</div>
                <div><FontAwesomeIcon icon={faRightFromBracket} /> Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WarehouseStaffNavbar;