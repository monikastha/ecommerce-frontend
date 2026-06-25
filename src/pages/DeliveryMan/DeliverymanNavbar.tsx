/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import RoleProfileModal from "../../components/RoleProfileModal";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faRightFromBracket, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  status: string;
};

const dummyOrders: Order[] = [
  { id: "#101", customer: "Ram Sharma", phone: "9800000000", address: "Newroad, Kathmandu", status: "Pending" },
  { id: "#102", customer: "Sita Rai", phone: "9811111111", address: "Jawalakhel, Lalitpur", status: "Accepted" },
  { id: "#103", customer: "Ram Kumar", phone: "9867662125", address: "Kathmandu, Newroad", status: "Pending" },
  { id: "#104", customer: "Maya Gurung", phone: "9840274396", address: "Lalitpur, Jawalakhel", status: "Delivered" },
  { id: "#105", customer: "Hari Thapa", phone: "9812345678", address: "Bhaktapur, Suryabinayak", status: "Delivered" },
];

const DeliverymanNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [allOrders, setAllOrders] = useState<Order[]>(dummyOrders);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  // Load real orders, fallback to dummy
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_ORIGIN}/api/orders/`);
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length === 0) {
          setAllOrders(dummyOrders);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: Order[] = data.map((o: any) => ({
            id: o.order_number || `#${o.id}`,
            customer: o.customer_name || "Unknown",
            phone: o.phone || "N/A",
            address: `${o.address}, ${o.city}`,
            status: o.status === "delivery_assigned" ? "Assigned"
                  : o.status === "delivery_accepted" ? "Accepted"
                  : o.status === "picked_up" ? "Picked Up"
                  : o.status === "out_for_delivery" ? "Out For Delivery"
                  : o.status === "shipped" ? "Accepted"
                  : o.status === "delivered" ? "Delivered"
                  : o.status,
          }));
          setAllOrders(mapped);
        }
      } catch (e) {
        setAllOrders(dummyOrders);
      }
    };
    fetchOrders();
  }, []);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    const filtered = allOrders.filter((o) =>
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery)
    );
    setSearchResults(filtered);
    setSearchOpen(true);
  }, [searchQuery, allOrders]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };
  const handleProfile = () => { setModalOpen(true); setProfileOpen(false); };
  const handleBellClick = () => { setNotifOpen(!notifOpen); setHasUnread(false); };

  const getStatusColor = (status: string) => {
    if (status === "Pending") return "#f97316";
    if (status === "Assigned") return "#2563eb";
    if (status === "Accepted") return "#3b82f6";
    if (status === "Picked Up") return "#0284c7";
    if (status === "Out For Delivery") return "#7c3aed";
    if (status === "Delivered") return "#22c55e";
    return "#64748b";
  };

  return (
    <>
      <style>{`
        .navbar { height:72px; background:rgba(255,255,255,0.9); backdrop-filter:blur(10px); border-bottom:1px solid #e2e8f0; padding:0 25px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
        .navbar-left { display:flex; flex-direction:column; }
        .navbar-left h2 { font-size:18px; margin:0; color:#0f172a; font-weight:600; }
        .navbar-left p { font-size:12px; color:#64748b; margin-top:2px; }
        .navbar-right { display:flex; align-items:center; gap:15px; }
        .search-box { display:flex; align-items:center; gap:8px; background:#f1f5f9; padding:10px 14px; border-radius:12px; width:260px; border:1px solid transparent; transition:0.3s; }
        .search-box:focus-within { background:#fff; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.12); }
        .search-box input { border:none; outline:none; background:transparent; width:100%; font-size:13px; }
        .search-icon { color:#94a3b8; }
        .search-dropdown { position:absolute; top:44px; left:0; width:100%; background:white; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.12); overflow:hidden; z-index:1001; max-height:300px; overflow-y:auto; }
        .search-result-item { padding:10px 14px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; transition:0.2s; }
        .search-result-item:hover { background:#f8fafc; }
        .result-name { font-size:13px; font-weight:600; color:#0f172a; }
        .result-addr { font-size:11px; color:#94a3b8; margin-top:2px; }
        .no-results { padding:16px; text-align:center; color:#94a3b8; font-size:13px; }
        .icon { font-size:18px; cursor:pointer; color:#475569; transition:0.2s; }
        .icon:hover { color:#2563eb; transform:scale(1.1); }
        .profile { width:42px; height:42px; border-radius:50%; cursor:pointer; border:2px solid #e2e8f0; object-fit:cover; }
        .profile:hover { border-color:#2563eb; }
        .dropdown { position:absolute; top:55px; right:0; width:180px; background:white; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1); overflow:hidden; }
        .dropdown-item { padding:12px 15px; font-size:14px; cursor:pointer; display:flex; align-items:center; gap:10px; color:#334155; transition:0.2s; }
        .dropdown-item:hover { background:#f1f5f9; }
        .dropdown-item.logout { color:#ef4444; border-top:1px solid #f1f5f9; }
        .notif-item { padding:10px 12px; border-radius:8px; font-size:13px; cursor:pointer; transition:0.2s; margin-bottom:6px; }
        .notif-item:hover { opacity:0.8; }
        @media(max-width:768px){ .search-box { display:none; } }
      `}</style>

      <div className="navbar">
        <div className="navbar-left">
          <h2>{getGreeting()}, Delivery Man</h2>
          <p>Welcome back to your dashboard</p>
        </div>

        <div className="navbar-right">

          {/* SEARCH */}
          <div ref={searchRef} style={{ position: "relative" }}>
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchOpen && (
              <div className="search-dropdown">
                {searchResults.length === 0 ? (
                  <div className="no-results">No results for "{searchQuery}"</div>
                ) : (
                  searchResults.map((o) => (
                    <div
                      key={o.id}
                      className="search-result-item"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchOpen(false);
                        navigate("/delivery/assigned");
                      }}
                    >
                      <div>
                        <div className="result-name">{o.customer} ({o.id})</div>
                        <div className="result-addr">{o.address}</div>
                        <div className="result-addr">{o.phone}</div>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: getStatusColor(o.status) }}>
                        {o.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* BELL */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <div onClick={handleBellClick} style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
              <FontAwesomeIcon icon={faBell} className="icon" />
              {hasUnread && (
                <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", pointerEvents: "none" }} />
              )}
            </div>
            {notifOpen && (
              <div style={{ position: "absolute", top: "34px", right: "0", width: "280px", background: "white", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.12)", padding: "16px", zIndex: 1001 }}>
                    <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>Notifications</h4>
                <div>
                  <div className="notif-item" style={{ background: "#fef9c3", color: "#854d0e" }} onClick={() => { navigate("/delivery/assigned?filter=Pending"); setNotifOpen(false); }}>
                    You have pending deliveries. Check now.
                  </div>
                  <div className="notif-item" style={{ background: "#dbeafe", color: "#1e40af" }} onClick={() => { navigate("/delivery/assigned"); setNotifOpen(false); }}>
                    Check your assigned orders and update status.
                  </div>
                  <div className="notif-item" style={{ background: "#dcfce7", color: "#166534" }} onClick={() => { navigate("/delivery/earnings"); setNotifOpen(false); }}>
                    Check your latest earnings.
                  </div>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#94a3b8", textAlign: "right" }}>Click to navigate</p>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <img className="profile" src={logo} alt="profile" onClick={() => setProfileOpen(!profileOpen)} />
            {profileOpen && (
              <div className="dropdown">
                <div className="dropdown-item" onClick={handleProfile}><FontAwesomeIcon icon={faUser} /> Profile</div>
                <div className="dropdown-item logout" onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} /> Logout</div>
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
