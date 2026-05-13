import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import DeliverymanSidebar from "./DeliverymanSidebar";
import DeliverymanNavbar from "./DeliverymanNavbar";

const weeklyData = [
  { day: "Sat", orders: 15 },
  { day: "Sun", orders: 16 },
  { day: "Mon", orders: 10 },
  { day: "Tue", orders: 15 },
  { day: "Wed", orders: 5 },
  { day: "Thu", orders: 5 },
  { day: "Fri", orders: 10 },
];

const DeliverymanDashboard: React.FC = () => {
  const stats = {
    totalAssigned: 64,
    pendingDeliveries: 24,
    totalEarnings: 24000,
    completedDeliveries: 50,
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <DeliverymanSidebar />

      {/* MAIN AREA */}
      <div style={styles.main}>
        {/* NAVBAR */}
        <DeliverymanNavbar />

        {/* CONTENT */}
        <div style={styles.content}>
          <h1 style={styles.title}>Delivery Dashboard</h1>

          {/* STATS CARDS */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3>Total Assigned</h3>
              <h2>{stats.totalAssigned}</h2>
            </div>

            <div style={styles.card}>
              <h3>Pending Deliveries</h3>
              <h2>{stats.pendingDeliveries}</h2>
            </div>

            <div style={styles.card}>
              <h3>Total Earnings</h3>
              <h2>Rs. {stats.totalEarnings}</h2>
            </div>

            <div style={styles.card}>
              <h3>Completed Deliveries</h3>
              <h2>{stats.completedDeliveries}</h2>
            </div>
          </div>

          {/* CHART SECTION */}
          <div style={styles.chartBox}>
            <h2 style={styles.subtitle}>Weekly Orders</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

/* STYLES */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9",
  },
  main: {
    flex: 1,
    minWidth:0,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    padding: "20px",
  },
  title: {
    marginBottom: "25px",
    color: "#1e293b",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#1e293b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  chartBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
};

export default DeliverymanDashboard;