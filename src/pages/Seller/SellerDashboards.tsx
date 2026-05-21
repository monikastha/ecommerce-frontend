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
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      background: "#f3f4f6",
      fontFamily: "Arial, sans-serif",
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    content: {
      padding: "24px", // slightly more breathing
    },
    cardsWrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px", // increased spacing
      marginBottom: "28px",
    },
    card: {
      background: "#60a5fa",
      padding: "18px", // slight breathing
      borderRadius: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#fff",
    },
    chartsWrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px", // more breathing between charts
    },
    chartBox: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "18px", // keep same height feel, just cleaner spacing
      minHeight: "350px",
    },
    chartArea: {
      width: "100%",
      height: "300px",
    },
  };

  return (
    <div style={styles.container}>
      <SellerSidebar />

      <div style={styles.main}>
        <SellerNavbar />

        <div style={styles.content}>
          
          <div style={styles.cardsWrapper}>
            {["Total Products", "Total Orders", "Pending Orders", "Delivered Orders"].map((title, i) => (
              <div key={i} style={styles.card}>
                <div>
                  <div style={{ fontWeight: "bold", color: "#1e293b" }}>{title}</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b" }}>
                    20
                  </div>
                </div>
                <div style={{ fontSize: "24px" }}>📊</div>
              </div>
            ))}
          </div>

          <div style={styles.chartsWrapper}>
            
            <div style={styles.chartBox}>
              <div style={{ marginBottom: "12px", fontWeight: "bold" }}>
                Monthly Orders
              </div>
              <div style={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.chartBox}>
              <div style={{ marginBottom: "12px", fontWeight: "bold" }}>
                Most Sold
              </div>
              <div style={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mostSoldData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
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