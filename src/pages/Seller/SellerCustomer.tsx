import { useState } from "react";

interface Review {
  id: number;
  customerName: string;
  productName: string;
  date: string;
  comment: string;
  status: "Pending" | "Responded";
}

const reviews: Review[] = [
  {
    id: 1,
    customerName: "Monika Shrestha",
    productName: "Wireless Bluetooth Headphones",
    date: "2024-01-15",
    comment:
      "Amazing sound quality! The noise cancellation works perfectly and the battery life is incredible. Highly recommend!",
    status: "Pending",
  },
  {
    id: 2,
    customerName: "Binita pariyar",
    productName: "Portable Phone Charger",
    date: "2024-01-12",
    comment:
      "Does the job but takes longer to charge than expected. Build quality is decent for the price.",
    status: "Responded",
  },
];

export default function SajiloMartCustomerEngagement() {
  const [activeNav, setActiveNav] = useState("Customer Engagement");

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
    <div style={{ minHeight: "100vh", backgroundColor: "#b0bec5", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Top system bar */}
      <div style={{ backgroundColor: "#2c3e50", color: "#ccc", fontSize: "13px", padding: "7px 16px" }}>
        Seller Customer Engagement 1
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
                    backgroundColor: activeNav === item.label ? "#e8380d" : "transparent",
                    color: "white",
                    fontWeight: activeNav === item.label ? "600" : "400",
                    fontSize: "13px",
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
                  gap: "10px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  color: "white",
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
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#c8a060",
                  flexShrink: 0,
                }}
              />
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
            <span>Review &gt; Dashboard</span>
          </div>

          {/* Content */}
          <div style={{ padding: "18px 18px", flex: 1 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "700", color: "#111" }}>Product Reviews</h2>
            <p style={{ margin: "0 0 18px", fontSize: "13px", color: "#666" }}>Engage with your customers.</p>

            {/* Review Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    backgroundColor: "#d9d9d9",
                    borderRadius: "8px",
                    padding: "14px 16px",
                  }}
                >
                  {/* Card header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#111" }}>{review.customerName}</div>
                      <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{review.productName}</div>
                      <div style={{ fontSize: "12px", color: "#555" }}>{review.date}</div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      {review.status === "Pending" && (
                        <div
                          style={{
                            backgroundColor: "#f59e0b",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "3px 10px",
                            borderRadius: "4px",
                          }}
                        >
                          Update
                        </div>
                      )}
                      <div
                        style={{
                          backgroundColor: review.status === "Pending" ? "#374151" : "#374151",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        {review.status}
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p style={{ margin: "10px 0 12px", fontSize: "13px", color: "#222", lineHeight: "1.5" }}>
                    {review.comment}
                  </p>

                  {/* Respond button */}
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#374151",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "6px 14px",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    Respond
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#555" }}>Showing page 1 out of 4 pages</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    padding: "5px 14px",
                    backgroundColor: "#1e3a5f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Previous
                </button>
                <button
                  style={{
                    padding: "5px 14px",
                    backgroundColor: "#1e3a5f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
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
    </div>
  );
}