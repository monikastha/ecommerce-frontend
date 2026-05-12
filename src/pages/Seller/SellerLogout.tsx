import { useState } from "react";

export default function SajiloMartLogout() {
  const [activeNav, setActiveNav] = useState("Logout");
  const [showModal, setShowModal] = useState(true);

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Product Management",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      label: "Orders Management",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      label: "Customer Engagement",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#6b7280", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Top system bar */}
      <div style={{ backgroundColor: "#2c3e50", color: "#ccc", fontSize: "13px", padding: "7px 16px" }}>
        Seller Logout 1
      </div>

      {/* Page body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "180px",
            minWidth: "180px",
            backgroundColor: "#1e3a5f",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            minHeight: "calc(100vh - 32px)",
          }}
        >
          <div>
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 12px 16px" }}>
              <div
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  padding: "6px",
                  boxSizing: "border-box",
                }}
              >
                <svg width="48" height="34" viewBox="0 0 52 36" fill="none">
                  <path d="M26 5 Q33 1 41 4" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M26 5 Q19 1 11 4" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M26 5 Q35 9 43 6" stroke="#1e3a5f" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5" />
                  <path d="M26 5 Q17 9 9 6" stroke="#1e3a5f" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5" />
                  <path d="M8 12 L12 12 L15 24 L37 24 L40 15 L12 15" stroke="#1e3a5f" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="18" cy="28" r="2.4" fill="#1e3a5f" />
                  <circle cx="32" cy="28" r="2.4" fill="#1e3a5f" />
                </svg>
                <div style={{ fontSize: "7.5px", color: "#1e3a5f", fontWeight: "bold", letterSpacing: "0.8px", textAlign: "center", marginTop: "1px" }}>SAJILO MART</div>
                <div style={{ fontSize: "5px", color: "#555", letterSpacing: "0.3px", textAlign: "center" }}>SHOP ANYTIME ANYWHERE</div>
              </div>
            </div>

            {/* Nav items */}
            <nav>
              {navItems.map((item) => (
                <div
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    color: "white",
                    fontWeight: "400",
                    fontSize: "13px",
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}

              {/* Logout — active */}
              <div
                onClick={() => { setActiveNav("Logout"); setShowModal(true); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  backgroundColor: "#e8380d",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "13px",
                  marginTop: "4px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </div>
            </nav>
          </div>

          {/* Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 14px 20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#9e9e9e", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "white" }}>Profile Name</div>
              <div style={{ fontSize: "10px", color: "#9baec8" }}>example@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, backgroundColor: "white", display: "flex", flexDirection: "column" }}>
          {/* Top Navbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 18px",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#111" }}>Good Morning, Binita</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  padding: "5px 10px",
                  gap: "6px",
                  backgroundColor: "white",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#e8380d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>Search Product,Order etc.</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>

              {/* Bell */}
              <div style={{ position: "relative", cursor: "pointer" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: "#e8380d",
                    color: "white",
                    fontSize: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  1
                </div>
              </div>

              {/* Avatar */}
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#c8a060", flexShrink: 0 }} />
            </div>
          </div>

          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 18px",
              borderBottom: "1px solid #e5e5e5",
              fontSize: "13px",
              color: "#555",
            }}
          >
            <span>Dashboard</span>
            <span>Logout &gt; Dashboard</span>
          </div>

          {/* Content area with modal */}
          <div style={{ flex: 1, padding: "30px 18px", position: "relative" }}>
            {showModal && (
              <div
                style={{
                  width: "340px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  border: "1px solid #ddd",
                }}
              >
                {/* Modal blue top bar with X */}
                <div
                  style={{
                    backgroundColor: "#4a90b8",
                    height: "52px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "0",
                  }}
                >
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      width: "52px",
                      height: "52px",
                      backgroundColor: "#c0392b",
                      border: "2px solid #e74c3c",
                      color: "white",
                      fontSize: "20px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal body */}
                <div style={{ padding: "24px 24px 28px", textAlign: "center" }}>
                  <p style={{ fontSize: "16px", color: "#111", margin: "0 0 22px", fontWeight: "400" }}>
                    Are you sure you want to logout?
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button
                      style={{
                        padding: "8px 32px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        cursor: "pointer",
                        color: "#111",
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: "8px 32px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        cursor: "pointer",
                        color: "#111",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}