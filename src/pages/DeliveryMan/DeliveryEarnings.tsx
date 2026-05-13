import React from "react";
import {
  Home,
  Package,
  DollarSign,
  LogOut,
  Bell,
  Search,
  TrendingUp,
} from "lucide-react";

import logo from "../../assets/logo.png";

const DeliveryEarnings: React.FC = () => {
  const earningsData = [
    {
      id: "#E001",
      orderId: "#ORD101",
      date: "2026-05-10",
      deliveryFee: 120,
      status: "Paid",
    },
    {
      id: "#E002",
      orderId: "#ORD102",
      date: "2026-05-11",
      deliveryFee: 150,
      status: "Pending",
    },
    {
      id: "#E003",
      orderId: "#ORD103",
      date: "2026-05-12",
      deliveryFee: 100,
      status: "Paid",
    },
  ];

  const totalEarnings = earningsData.reduce(
    (sum, item) => sum + item.deliveryFee,
    0
  );

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>

        <div style={styles.menu}>
          <div style={styles.menuItem}>
            <Home size={22} />
            <span>Dashboard</span>
          </div>

          <div style={styles.menuItem}>
            <Package size={22} />
            <span>Orders</span>
          </div>

          <div style={styles.activeMenu}>
            <DollarSign size={22} />
            <span>Earnings</span>
          </div>

          <div style={styles.menuItem}>
            <LogOut size={22} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {/* NAVBAR */}
        <div style={styles.navbar}>
          <h1 style={styles.heading}>Delivery Earnings</h1>

          <div style={styles.navRight}>
            <div style={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search earnings..."
                style={styles.input}
              />
            </div>

            <div style={styles.iconBox}>
              <Bell size={22} />
              <span style={styles.notification}>2</span>
            </div>

            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              style={styles.topProfile}
            />
          </div>
        </div>

        {/* CARDS */}
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <TrendingUp size={28} />
            <h2>Total Earnings</h2>
            <h1>Rs {totalEarnings}</h1>
          </div>

          <div style={styles.card}>
            <DollarSign size={28} />
            <h2>Paid</h2>
            <h1>2 Orders</h1>
          </div>

          <div style={styles.card}>
            <DollarSign size={28} />
            <h2>Pending</h2>
            <h1>1 Order</h1>
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.tableContainer}>
          <h2>Earnings History</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Earning ID</th>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Fee</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {earningsData.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>{item.orderId}</td>
                  <td style={styles.td}>{item.date}</td>
                  <td style={styles.td}>Rs {item.deliveryFee}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          item.status === "Paid" ? "#dcfce7" : "#fef3c7",
                        color: item.status === "Paid" ? "#166534" : "#92400e",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    background: "#f5f5f5",
  },

  sidebar: {
    width: "260px",
    background: "#d8aeb4",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logoSection: {
    background: "#fff",
    padding: "20px",
    textAlign: "center",
  },

  logo: {
    width: "150px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "10px",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  activeMenu: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    fontWeight: "bold",
    background: "#ff4d4d",
    color: "#fff",
    borderRadius: "6px",
  },

  main: {
    flex: 1,
    padding: "20px",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    alignItems: "center",
  },

  heading: {
    margin: 0,
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#eee",
    padding: "8px 12px",
    borderRadius: "20px",
  },

  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    marginLeft: "8px",
  },

  iconBox: {
    position: "relative",
  },

  notification: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    fontSize: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  topProfile: {
    width: "40px",
    borderRadius: "50%",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },

  tableContainer: {
    marginTop: "30px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#f3f4f6",
    padding: "12px",
    textAlign: "left",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },

  status: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
};

export default DeliveryEarnings;