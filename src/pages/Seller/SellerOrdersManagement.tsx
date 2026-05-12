import { useState } from "react";

interface Order {
  id: string;
  customerName: string;
  deliveryStatus: "Pending" | "Delivered";
}

const allOrders: Order[] = [
  { id: "001", customerName: "Kamala Stha", deliveryStatus: "Pending" },
  { id: "002", customerName: "Princy Bhusal", deliveryStatus: "Delivered" },
];

type FilterTab = "All Orders" | "Pending" | "Completed";

export default function SajiloMartOrdersV2() {
  const [activeNav, setActiveNav] = useState("Orders Management");
  const [activeTab, setActiveTab] = useState<FilterTab>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredOrders = allOrders.filter((o) => {
    const matchesTab =
      activeTab === "All Orders" ||
      (activeTab === "Pending" && o.deliveryStatus === "Pending") ||
      (activeTab === "Completed" && o.deliveryStatus === "Delivered");
    const matchesSearch =
      searchQuery === "" ||
      o.id.includes(searchQuery) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#c8d8e8",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          backgroundColor: "#2c3e60",
          color: "#ccc",
          fontSize: "13px",
          padding: "6px 16px",
        }}
      >
        seller orders management 1
      </div>

      {/* Blue border wrapper */}
      <div
        style={{
          margin: "10px",
          border: "3px solid #3a7bd5",
          borderRadius: "4px",
          display: "flex",
          flex: 1,
          minHeight: "calc(100vh - 54px)",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "220px",
            minWidth: "220px",
            backgroundColor: "#1e3a5f",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <div>
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px 20px" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  overflow: "hidden",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              >
                <svg width="52" height="36" viewBox="0 0 52 36" fill="none">
                  {/* wifi arcs */}
                  <path d="M26 6 Q32 2 40 5" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M26 6 Q20 2 12 5" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M26 6 Q34 10 42 7" stroke="#1e3a5f" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
                  <path d="M26 6 Q18 10 10 7" stroke="#1e3a5f" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
                  {/* cart body */}
                  <path d="M8 12 L12 12 L15 24 L37 24 L40 15 L12 15" stroke="#1e3a5f" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* wheels */}
                  <circle cx="18" cy="28" r="2.5" fill="#1e3a5f"/>
                  <circle cx="32" cy="28" r="2.5" fill="#1e3a5f"/>
                </svg>
                <div style={{ fontSize: "8px", color: "#1e3a5f", fontWeight: "bold", letterSpacing: "1px", textAlign: "center", marginTop: "2px" }}>SAJILO MART</div>
                <div style={{ fontSize: "5.5px", color: "#555", letterSpacing: "0.4px", textAlign: "center" }}>SHOP ANYTIME ANYWHERE</div>
              </div>
            </div>

            {/* Nav */}
            <nav>
              {navItems.map((item) => (
                <div
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "13px 20px",
                    cursor: "pointer",
                    backgroundColor: activeNav === item.label ? "#e8380d" : "transparent",
                    color: "white",
                    fontWeight: activeNav === item.label ? "600" : "400",
                    fontSize: "14px",
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}

              {/* Logout */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "13px 20px",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "14px",
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 18px 24px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                backgroundColor: "#c0c0c0",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>Profile Name</div>
              <div style={{ fontSize: "11px", color: "#9baec8" }}>example@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "white" }}>
          {/* Top Navbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 20px",
              borderBottom: "1px solid #e5e5e5",
              backgroundColor: "white",
            }}
          >
            {/* Greeting */}
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#111" }}>Good Morning, Binita</div>

            {/* Right side: search + bell + avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Search bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  padding: "5px 12px",
                  backgroundColor: "white",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#3a7bd5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search Product,Order etc."
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    color: "#555",
                    width: "160px",
                    backgroundColor: "transparent",
                  }}
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>

              {/* Bell */}
              <div style={{ position: "relative", cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#3a7bd5",
                    color: "white",
                    fontSize: "9px",
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
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#c8a060",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div style={{ width: "100%", height: "100%", backgroundColor: "#c8a060" }} />
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 20px",
              borderBottom: "1px solid #e5e5e5",
              backgroundColor: "white",
            }}
          >
            <span style={{ fontSize: "14px", color: "#333", fontWeight: "500" }}>Orders</span>
            <span style={{ fontSize: "13px", color: "#666" }}>Home &gt; Order</span>
          </div>

          {/* Content */}
          <div style={{ padding: "20px", flex: 1 }}>
            {/* Filter tabs + sort + search */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              {(["All Orders", "Pending", "Completed"] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 18px",
                    border: "1px solid #ccc",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: activeTab === tab ? "600" : "400",
                    cursor: "pointer",
                    backgroundColor: activeTab === tab ? "#1e3a5f" : "white",
                    color: activeTab === tab ? "white" : "#333",
                  }}
                >
                  {tab}
                </button>
              ))}

              {/* Sort by */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#333" }}>Sort by</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Search */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  gap: "8px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    width: "100%",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#d9d9d9" }}>
                  <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#111" }}>Order id</th>
                  <th style={{ padding: "12px 20px", textAlign: "center", fontSize: "14px", fontWeight: "600", color: "#111" }}>Customer Name</th>
                  <th style={{ padding: "12px 20px", textAlign: "center", fontSize: "14px", fontWeight: "600", color: "#111" }}>Delivery Status</th>
                  <th style={{ padding: "12px 20px", textAlign: "center", fontSize: "14px", fontWeight: "600", color: "#111" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "22px 20px", fontSize: "14px", color: "#111" }}>{order.id}</td>
                    <td style={{ padding: "22px 20px", fontSize: "14px", color: "#111", textAlign: "center" }}>{order.customerName}</td>
                    <td style={{ padding: "22px 20px", fontSize: "14px", color: "#111", textAlign: "center" }}>{order.deliveryStatus}</td>
                    <td style={{ padding: "22px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        <button
                          style={{
                            backgroundColor: "#16a34a",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "5px 14px",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                          }}
                        >
                          Accept
                        </button>
                        <button
                          style={{
                            backgroundColor: "#e8380d",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "5px 14px",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "24px" }}>
              <button
                style={{
                  padding: "6px 16px",
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Previous
              </button>
              <button
                style={{
                  padding: "6px 16px",
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}