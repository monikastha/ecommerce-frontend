import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar, { useProfileName } from "../../components/ProfileAvatar";
import RoleProfileModal from "../../components/RoleProfileModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const ADMIN_ORDER_NOTIFICATIONS_SEEN_KEY = "admin_order_notifications_seen_at";

type OrderNotification = {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  total: string | number;
  status: string;
  delivery_type: string;
  created_at: string;
  items?: { product_name: string; quantity: number }[];
};

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [orders, setOrders] = useState<OrderNotification[]>([]);
  const [seenAt, setSeenAt] = useState(() => localStorage.getItem(ADMIN_ORDER_NOTIFICATIONS_SEEN_KEY) || "");
  const profileName = useProfileName("Admin");

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
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadOrderNotifications = async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/api/orders/`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load order notifications");
        setOrders(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrderNotifications();
    const interval = window.setInterval(loadOrderNotifications, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfile = () => {
    setModalOpen(true);
    setProfileOpen(false);
  };

  const unreadCount = orders.filter((order) => {
    if (!order.created_at) return false;
    if (!seenAt) return true;
    return new Date(order.created_at).getTime() > new Date(seenAt).getTime();
  }).length;

  const openNotifications = () => {
    const nextSeenAt = new Date().toISOString();
    localStorage.setItem(ADMIN_ORDER_NOTIFICATIONS_SEEN_KEY, nextSeenAt);
    setSeenAt(nextSeenAt);
    setNotificationOpen((open) => !open);
    setProfileOpen(false);
  };

  const currency = (value?: string | number) =>
    `Rs. ${Number(value || 0).toLocaleString()}`;

  const productSummary = (order: OrderNotification) =>
    order.items?.length
      ? order.items.map((item) => `${item.product_name} x${item.quantity}`).join(", ")
      : "New order placed";

  return (
    <>
      <style>{`
        .navbar {
          height: 72px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
          padding: 0 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-left h2 { font-size: 18px; margin: 0; color: #0f172a; font-weight: 600; }
        .navbar-left p { font-size: 12px; color: #64748b; margin-top: 2px; }
        .navbar-right { display: flex; align-items: center; gap: 15px; }
        .icon {
          font-size: 18px;
          cursor: pointer;
          color: #475569;
          transition: 0.2s;
        }
        .icon:hover { color: #2563eb; transform: scale(1.1); }
        .notification-wrap {
          position: relative;
        }
        .bell-btn {
          position: relative;
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 10px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .bell-btn:hover {
          background: #eef2ff;
        }
        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #dc2626;
          color: white;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
        .notification-panel {
          position: absolute;
          top: 48px;
          right: 0;
          width: 380px;
          max-width: calc(100vw - 28px);
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 18px 45px rgba(15,23,42,0.16);
          overflow: hidden;
          z-index: 250;
        }
        .notification-head {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .notification-head h3 {
          font-size: 14px;
          color: #0f172a;
          font-weight: 800;
          margin: 0;
        }
        .notification-head button {
          border: none;
          background: #2563eb;
          color: white;
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }
        .notification-list {
          max-height: 390px;
          overflow-y: auto;
        }
        .notification-item {
          width: 100%;
          border: none;
          background: white;
          text-align: left;
          padding: 13px 16px;
          border-bottom: 1px solid #f8fafc;
          cursor: pointer;
          display: grid;
          gap: 6px;
        }
        .notification-item:hover {
          background: #f8fafc;
        }
        .notification-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: #0f172a;
          font-size: 13px;
          font-weight: 800;
        }
        .notification-total {
          color: #16a34a;
          white-space: nowrap;
        }
        .notification-meta {
          color: #64748b;
          font-size: 12px;
          line-height: 1.45;
        }
        .notification-status {
          display: inline-flex;
          width: fit-content;
          border-radius: 999px;
          padding: 4px 8px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 800;
          text-transform: capitalize;
        }
        .notification-empty {
          padding: 28px 16px;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 700;
        }
        .profile {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #e2e8f0;
          object-fit: cover;
        }
        .profile:hover { border-color: #2563eb; }
        .dropdown {
          position: absolute;
          top: 55px;
          right: 0;
          width: 180px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .dropdown-item {
          padding: 12px 15px;
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

      <div className="navbar">
        <div className="navbar-left">
          <h2>{getGreeting()}, {profileName}</h2>
          <p>Welcome back to your dashboard</p>
        </div>

        <div className="navbar-right">
          <div className="notification-wrap" ref={notificationRef}>
            <button className="bell-btn" onClick={openNotifications} aria-label="Order notifications" title="Order notifications">
              <FontAwesomeIcon icon={faBell} className="icon" />
              {unreadCount > 0 && <span className="badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>

            {notificationOpen && (
              <div className="notification-panel">
                <div className="notification-head">
                  <h3>Order Notifications</h3>
                  <button onClick={() => navigate("/admin/order")}>View Orders</button>
                </div>
                <div className="notification-list">
                  {orders.length ? (
                    orders.map((order) => (
                      <button
                        key={order.id}
                        className="notification-item"
                        onClick={() => {
                          setNotificationOpen(false);
                          navigate("/admin/order");
                        }}
                      >
                        <div className="notification-title">
                          <span>{order.order_number}</span>
                          <span className="notification-total">{currency(order.total)}</span>
                        </div>
                        <div className="notification-meta">
                          {order.customer_name || "Buyer"} | {order.phone || "No phone"}
                          <br />
                          {productSummary(order)}
                        </div>
                        <span className="notification-status">
                          {order.delivery_type || "normal"} | {order.status}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="notification-empty">No order notifications yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div ref={dropdownRef} style={{ position: "relative" }}>
            <ProfileAvatar className="profile" onClick={() => setProfileOpen(!profileOpen)} />

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

export default AdminNavbar;
