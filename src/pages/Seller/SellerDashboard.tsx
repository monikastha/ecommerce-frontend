import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";

const monthlyOrdersData = [
  { name: "Saree", value: 60, fill: "#e74c3c" },
  { name: "Saree", value: 40, fill: "#e67e22" },
  { name: "Saree", value: 80, fill: "#f39c12" },
];

const mostSoldData = [
  { name: "Saree", value: 70, fill: "#e74c3c" },
  { name: "Saree", value: 45, fill: "#e67e22" },
  { name: "Saree", value: 85, fill: "#f39c12" },
];

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={2} />;
};

export default function SellerDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      label: "Product Management",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
        </svg>
      ),
    },
    {
      label: "Orders Management",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
    },
    {
      label: "Customer Engagement",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      label: "Logout",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        width: "760px",
        height: "540px",
        fontFamily: "Segoe UI, sans-serif",
        fontSize: "13px",
        background: "#f0f0f0",
        overflow: "hidden",
        borderRadius: "6px",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "210px",
          minWidth: "210px",
          background: "#1a2a4a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "18px",
          border: "3px solid #3a7bd5",
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "18px",
            overflow: "hidden",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #1a2a4a",
              }}
            >
              {/* Cart icon SVG */}
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                {/* WiFi signal arcs */}
                <ellipse cx="24" cy="10" rx="14" ry="5" stroke="#2196F3" strokeWidth="2" fill="none" />
                <ellipse cx="24" cy="10" rx="9" ry="3.5" stroke="#2196F3" strokeWidth="1.5" fill="none" />
                {/* Cart body */}
                <rect x="10" y="20" width="28" height="16" rx="3" fill="#2196F3" />
                <rect x="13" y="23" width="22" height="10" rx="2" fill="#fff" />
                {/* Wheels */}
                <circle cx="17" cy="39" r="3" fill="#1a2a4a" />
                <circle cx="31" cy="39" r="3" fill="#1a2a4a" />
                {/* Handle */}
                <path d="M8 20 L10 20" stroke="#2196F3" strokeWidth="2" />
              </svg>
              <div style={{ fontSize: "6px", color: "#1a2a4a", fontWeight: "700", marginTop: "1px", letterSpacing: "0.5px" }}>
                SAJILO MART
              </div>
              <div style={{ fontSize: "4px", color: "#666", letterSpacing: "0.3px" }}>SHOP ANYTIME ANYWHERE</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ width: "100%", marginTop: "4px" }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 18px",
                cursor: "pointer",
                background:
                  activeNav === item.label ? "#e53935" : "transparent",
                color: "#fff",
                fontWeight: activeNav === item.label ? "600" : "400",
                fontSize: "13px",
                transition: "background 0.15s",
              }}
            >
              <span style={{ opacity: 0.9 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px 18px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#ccc",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>
              Profile Name
            </div>
            <div style={{ color: "#aaa", fontSize: "11px" }}>
              example@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#f5f6fa",
          overflow: "hidden",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px",
            background: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ fontSize: "17px", fontWeight: "600", color: "#222" }}>
            Good Morning, Binita
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Search bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#e8f4fd",
                borderRadius: "20px",
                padding: "5px 12px",
                gap: "6px",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#555">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <span style={{ fontSize: "12px", color: "#555" }}>
                Search Product,Order etc..
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#999">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </div>
            {/* Bell */}
            <div
              style={{
                position: "relative",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#555">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  background: "#e53935",
                  borderRadius: "50%",
                }}
              />
            </div>
            {/* Avatar */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#e67e22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              B
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 20px",
            background: "#f5f6fa",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <span>Dashboard</span>
          <span>Home &gt; Dashboard</span>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            padding: "10px 20px 0 20px",
          }}
        >
          {/* Total Products */}
          <div
            style={{
              background: "#64b5f6",
              borderRadius: "8px",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#1a237e",
                  fontWeight: "700",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                Total Products
              </div>
              <div style={{ color: "#1a237e", fontWeight: "800", fontSize: "22px" }}>
                23
              </div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a237e" opacity="0.7">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
            </svg>
          </div>

          {/* Total Orders */}
          <div
            style={{
              background: "#64b5f6",
              borderRadius: "8px",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#1a237e",
                  fontWeight: "700",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                Total Orders
              </div>
              <div style={{ color: "#1a237e", fontWeight: "800", fontSize: "22px" }}>
                20
              </div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a237e" opacity="0.7">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>

          {/* Pending Orders */}
          <div
            style={{
              background: "#64b5f6",
              borderRadius: "8px",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#1a237e",
                  fontWeight: "700",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                Pending Orders
              </div>
              <div style={{ color: "#1a237e", fontWeight: "800", fontSize: "22px" }}>
                20
              </div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a237e" opacity="0.7">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>

          {/* Delivered Orders */}
          <div
            style={{
              background: "#64b5f6",
              borderRadius: "8px",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#1a237e",
                  fontWeight: "700",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                Delivered Orders
              </div>
              <div style={{ color: "#1a237e", fontWeight: "800", fontSize: "22px" }}>
                20
              </div>
            </div>
            <svg width="32" height="28" viewBox="0 0 32 24" fill="#1a237e" opacity="0.7">
              <path d="M18 3h-4.18C13.4 1.84 12.3 1 11 1 9.7 1 8.6 1.84 8.18 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 11l-5 5-3-3 1.41-1.41L11 16.17l3.59-3.58L16 14z" />
              <circle cx="26" cy="16" r="5" fill="#1a237e" opacity="0.9" />
              <path d="M25 13v4l3 2-1 1.5-3.5-2.5V13h1.5z" fill="#64b5f6" />
            </svg>
          </div>
        </div>

        {/* Overview Section */}
        <div style={{ padding: "12px 20px 0 20px" }}>
          <div
            style={{
              fontWeight: "700",
              fontSize: "15px",
              color: "#222",
              marginBottom: "10px",
            }}
          >
            Overview
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {/* Top 3 Monthly Orders */}
            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "12px 14px",
                border: "1px solid #e0e0e0",
              }}
            >
              <div style={{ fontSize: "11px", color: "#555", marginBottom: "2px" }}>
                Top 3
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#222",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Monthly Orders
              </div>
              <ResponsiveContainer width="100%" height={90}>
                <BarChart
                  data={monthlyOrdersData}
                  barSize={22}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "#666" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="value" shape={<CustomBar />} />
                </BarChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  marginTop: "4px",
                }}
              >
                {monthlyOrdersData.map((d, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: d.fill,
                      }}
                    />
                    <span style={{ fontSize: "10px", color: "#555" }}>
                      {d.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Most Sold Products */}
            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "12px 14px",
                border: "1px solid #e0e0e0",
              }}
            >
              <div style={{ fontSize: "11px", color: "#555", marginBottom: "2px" }}>
                Top 3
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#222",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Most Sold Products
              </div>
              <ResponsiveContainer width="100%" height={90}>
                <BarChart
                  data={mostSoldData}
                  barSize={22}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "#666" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="value" shape={<CustomBar />} />
                </BarChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  marginTop: "4px",
                }}
              >
                {mostSoldData.map((d, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: d.fill,
                      }}
                    />
                    <span style={{ fontSize: "10px", color: "#555" }}>
                      {d.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}