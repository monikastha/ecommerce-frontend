/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar, { useProfileName } from "../../components/ProfileAvatar";
import RoleProfileModal from "../../components/RoleProfileModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";

interface AssistantNavbarProps {
  sidebarWidth?: number;
}

const AssistantNavbar: React.FC<AssistantNavbarProps> = ({ sidebarWidth = 250 }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("assistant_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const notificationsRef = useRef<any[]>(notifications);
  const [seenAt, setSeenAt] = useState(() => localStorage.getItem("assistant_notifications_seen_at") || "");
  const profileName = useProfileName("Assistant");

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const updateNotifications = (next: any[]) => {
    setNotifications(next);
    notificationsRef.current = next;
  };

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

  useEffect(() => {
    const onNew = (e: Event) => {
      try {
        const customEvent = e as CustomEvent<unknown>;
        const detail = customEvent.detail;
        const data = Array.isArray(detail)
          ? detail
          : JSON.parse(localStorage.getItem("assistant_notifications") || "[]");
        updateNotifications(data);
      } catch (error) {
        console.warn("assistant notification parse failed", error);
      }
    };

    const handleClickOutsideNotif = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    const pollOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/orders/?status=pending`);
        if (!res.ok) return;
        const body = await res.json();
        const orders = Array.isArray(body) ? body : body.results || [];
        const existingIds = new Set(notificationsRef.current.map((item) => item.order_id));
        const newNotifications = orders
          .filter((order: any) => order.id && !existingIds.has(order.id))
          .map((order: any) => ({
            event: order.delivery_type === 'emergency'
              ? `Emergency order placed (#${order.order_number})`
              : `Order placed (#${order.order_number})`,
            order_id: order.id,
            order_number: order.order_number,
            total: order.total,
            delivery_type: order.delivery_type,
            order_type: order.delivery_type === 'emergency' ? 'Emergency' : 'Normal',
            created_at: order.created_at,
            received_at: new Date().toISOString(),
          }));
        if (newNotifications.length > 0) {
          const merged = [...newNotifications, ...notificationsRef.current].slice(0, 50);
          updateNotifications(merged);
          localStorage.setItem("assistant_notifications", JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent("assistant:notification", { detail: merged }));
        }
      } catch (error) {
        console.warn("assistant order poll failed", error);
      }
    };

    window.addEventListener("assistant:notification", onNew);
    document.addEventListener("mousedown", handleClickOutsideNotif);
    const interval = setInterval(() => {
      try {
        setNotifications(JSON.parse(localStorage.getItem("assistant_notifications") || "[]"));
      } catch (error) {
        console.warn("assistant notification refresh failed", error);
      }
    }, 5000);
    const pollInterval = setInterval(pollOrders, 15000);
    void pollOrders();

    return () => {
      window.removeEventListener("assistant:notification", onNew);
      document.removeEventListener("mousedown", handleClickOutsideNotif);
      clearInterval(interval);
      clearInterval(pollInterval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfile = () => {
    setModalOpen(true);
    setProfileOpen(false);
  };

  const handleBellClick = () => {
    try {
      const data = JSON.parse(localStorage.getItem("assistant_notifications") || "[]");
      setNotifications(data);
    } catch {
      // ignore
    }

    setNotificationOpen((open) => {
      const next = !open;
      if (next) {
        const nextSeenAt = new Date().toISOString();
        localStorage.setItem("assistant_notifications_seen_at", nextSeenAt);
        setSeenAt(nextSeenAt);
      }
      return next;
    });
  };

  const unreadCount = notifications.filter((n) => {
    try {
      const receivedAt = n.received_at || n.created_at;
      if (!receivedAt) return true;
      return new Date(receivedAt).toISOString() > (seenAt || "");
    } catch {
      return true;
    }
  }).length;

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
        .bell-wrap { position: relative; display:inline-block; }
        .badge { position: absolute; right: -6px; top: -6px; background: #ef4444; color: #fff; border-radius: 999px; padding: 3px 7px; font-size: 12px; font-weight: 800; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
        .bell-btn { border: none; background: transparent; cursor: pointer; padding: 6px; border-radius: 8px; display: inline-flex; align-items:center; justify-content:center; }
        .bell-btn:focus { outline: 3px solid rgba(34,197,94,0.15); }
        .pulse { position: absolute; right: -2px; top: -2px; width: 12px; height: 12px; border-radius: 999px; background: rgba(239,68,68,0.2); animation: pulse 1.6s infinite; }
        @keyframes pulse { 0% { transform: scale(.9); opacity: .8 } 70% { transform: scale(1.6); opacity: 0 } 100% { transform: scale(.9); opacity: 0 } }
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
          <h2>{getGreeting()}, {profileName}</h2>
          <p>Welcome back to your dashboard</p>
        </div>

        <div className="navbar-right">
          <div className="bell-wrap">
            <button
              className="bell-btn"
              aria-label={`Notifications (${notifications.length})`}
              title="Notifications"
              onClick={handleBellClick}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBellClick(); } }}
            >
              <FontAwesomeIcon icon={faBell} className="icon" />
            </button>
            {unreadCount > 0 && (
              <>
                <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                <span className="pulse" aria-hidden="true" />
              </>
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
            {notificationOpen && (
              <div ref={notificationRef} style={{ position: "absolute", right: 10, top: 58, width: 340, background: "#fff", borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.12)", zIndex: 1001 }}>
                <div style={{ padding: 12, borderBottom: "1px solid #eef2f7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <strong>Notifications</strong>
                  <button onClick={() => { localStorage.removeItem("assistant_notifications"); setNotifications([]); }}>Clear</button>
                </div>
                <div style={{ maxHeight: 320, overflow: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 16, color: "#64748b" }}>No notifications</div>
                  ) : (
                    notifications.slice(0, 20).map((n, idx) => (
                      <div key={idx} style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ fontWeight: 800 }}>{n.event}</div>
                        {n.order_type && <div style={{ fontSize: 13, color: n.order_type === 'Emergency' ? '#b91c1c' : '#15803d' }}>{n.order_type} order</div>}
                        {n.order_number && <div style={{ fontSize: 13, color: "#475569" }}>Order: {n.order_number}</div>}
                        {n.total && <div style={{ fontSize: 13, color: "#475569" }}>Total: Rs. {n.total}</div>}
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{new Date(n.received_at || n.created_at || Date.now()).toLocaleString()}</div>
                      </div>
                    ))
                  )}
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
