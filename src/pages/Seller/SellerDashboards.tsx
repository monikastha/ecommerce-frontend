import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const monthlyOrdersData = [
  { name: "Saree", value: 60 },
  { name: "Kurti", value: 40 },
  { name: "Shoes", value: 80 },
];

const mostSoldData = [
  { name: "Saree", value: 70 },
  { name: "Kurti", value: 45 },
  { name: "Shoes", value: 85 },
];

export default function SellerDashboard() {
  // Sample stats (you can replace with real data from API later)
  const stats = [
    { title: "Total Products", value: 124, icon: "📦", color: "#3b82f6" },
    { title: "Total Orders", value: 87, icon: "🛒", color: "#10b981" },
    { title: "Pending Orders", value: 14, icon: "⏳", color: "#f59e0b" },
    { title: "Delivered Orders", value: 68, icon: "✅", color: "#8b5cf6" },
  ];

  return (
    <div style={styles.container}>
      <SellerSidebar />

      <div style={styles.main}>
        <SellerNavbar />

        <div style={styles.content}>
          <h1 style={styles.pageTitle}>Dashboard Overview</h1>

          {/* Stats Cards */}
          <div style={styles.cardsWrapper}>
            {stats.map((stat, index) => (
              <div key={index} style={{ ...styles.card, backgroundColor: stat.color }}>
                <div>
                  <div style={styles.cardTitle}>{stat.title}</div>
                  <div style={styles.cardValue}>{stat.value}</div>
                </div>
                <div style={styles.cardIcon}>{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div style={styles.chartsWrapper}>
            {/* Monthly Orders Chart */}
            <div style={styles.chartBox}>
              <div style={styles.chartHeader}>Monthly Orders</div>
              <div style={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 13 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 13 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Sold Products Chart */}
            <div style={styles.chartBox}>
              <div style={styles.chartHeader}>Most Sold Products</div>
              <div style={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mostSoldData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 13 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 13 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================== STYLES ====================== */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
  },

  main: {
    flex: 1,
    marginLeft: "260px", // Matches sidebar width
  },

  content: {
    padding: "28px",
  },

  pageTitle: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1e2937",
    marginBottom: "24px",
  },

  cardsWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },

  card: {
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.2s",
  },

  cardTitle: {
    fontSize: "14px",
    fontWeight: 500,
    opacity: 0.95,
  },

  cardValue: {
    fontSize: "32px",
    fontWeight: 800,
    marginTop: "6px",
  },

  cardIcon: {
    fontSize: "38px",
    opacity: 0.85,
  },

  chartsWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },

  chartBox: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },

  chartHeader: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#1e2937",
    marginBottom: "16px",
  },

  chartArea: {
    width: "100%",
    height: "320px",
  },
};