import React, { useState } from "react";
import logoImg from "../../assets/logo.png"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weeklyData = [
  { day: "Sat", orders: 15 },
  { day: "Sun", orders: 16 },
  { day: "Mon", orders: 10 },
  { day: "Tue", orders: 15 },
  { day: "Wed", orders: 5 },
  { day: "Thu", orders: 5 },
  { day: "Fri", orders: 10 },
];

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");

  const stats = {
    totalAssigned: 64,
    pendingDeliveries: 24,
    totalEarnings: 24000,
    completedDeliveries: 50,
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
    },
    {
      label: "Orders Tracking",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a3 3 0 110 6 3 3 0 010-6zm6 14H6v-.6c0-2 4-3.1 6-3.1s6 1.1 6 3.1V20z" />
        </svg>
      ),
    },
    {
      label: "Earnings",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      ),
    },
    {
      label: "Logout",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0f4f8" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: "240px",
          background: "#b0bec5",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", padding: "10px 60px 100px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              margin: "0 auto 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            <img 
            src={logoImg} 
            alt="Logo"
            className="w-[40px] h-[60px] object-contain "
            />
          </div>
          <div style={{ color: "#1a237e", fontWeight: "bold", fontSize: "16px" }}>SAJILO MART</div>
          <div style={{ color: "#37474f", fontSize: "10px", letterSpacing: "1px" }}>SHOP ANYTIME ANYWHERE</div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "14px 24px",
                border: "none",
                cursor: "pointer",
                fontWeight: activeNav === item.label ? "700" : "500",
                fontSize: "14px",
                background: activeNav === item.label ? "#e53935" : "transparent",
                color: activeNav === item.label ? "white" : "#37474f",
                transition: "background 0.2s",
                textAlign: "left",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile at bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderTop: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#e53935",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            👤
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "13px", color: "#1a237e" }}>Profile Name</div>
            <div style={{ fontSize: "11px", color: "#546e7a" }}>example@gmail.com</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 28px",
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: "600", color: "#1a237e" }}>
            Good Morning, Sani ☀️
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <input
              type="text"
              placeholder="Search Product, Order etc."
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid #cfd8dc",
                fontSize: "13px",
                width: "220px",
                outline: "none",
              }}
            />
            <div style={{ position: "relative", cursor: "pointer" }}>
              🔔
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "#e53935",
                  color: "white",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                4
              </span>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#e53935",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              S
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div style={{ padding: "8px 28px", fontSize: "12px", color: "#78909c" }}>
          Home &gt; Dashboard
        </div>

        {/* Dashboard Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 28px 28px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "16px", color: "#37474f" }}>Dashboard</h2>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            {/* Total Assigned */}
            <div style={cardStyle("#e3f2fd")}>
              <div>
                <div style={cardLabel}>Total Assigned Deliveries</div>
                <div style={cardNumber}>{stats.totalAssigned}</div>
              </div>
              <span style={{ fontSize: "28px" }}>👤</span>
            </div>

            {/* Pending */}
            <div style={cardStyle("#e3f2fd")}>
              <div>
                <div style={cardLabel}>Pending Deliveries</div>
                <div style={cardNumber}>{stats.pendingDeliveries}</div>
              </div>
              <span style={{ fontSize: "28px" }}>📦</span>
            </div>

            {/* Earnings */}
            <div style={cardStyle("#e3f2fd")}>
              <div>
                <div style={cardLabel}>Total Earnings</div>
                <div style={cardNumber}>Rs.{stats.totalEarnings.toLocaleString()}</div>
              </div>
              <span style={{ fontSize: "28px" }}>💵</span>
            </div>

            {/* Completed */}
            <div style={cardStyle("#e3f2fd")}>
              <div>
                <div style={cardLabel}>Completed Deliveries</div>
                <div style={cardNumber}>{stats.completedDeliveries}</div>
              </div>
              <span style={{ fontSize: "28px" }}>✅</span>
            </div>
          </div>

          {/* Chart */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "15px", color: "#37474f" }}>No of Orders</h3>
              <select style={{ border: "1px solid #cfd8dc", borderRadius: "1px", padding: "4px 8px", fontSize: "13px" }}>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <ResponsiveContainer width="50%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#90a4ae" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#90a4ae" }} />
                <Tooltip cursor={{ fill: "rgba(229,57,53,0.05)" }} />
                <Bar dataKey="orders" fill="#e53935" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

// Inline styles helpers
const cardStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  borderRadius: "12px",
  padding: "20px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
});

const cardLabel: React.CSSProperties = {
  fontSize: "13px",
  color: "#1565c0",
  fontWeight: "600",
  marginBottom: "6px",
};

const cardNumber: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#1a237e",
};

export default Dashboard;