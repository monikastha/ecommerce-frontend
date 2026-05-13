import React from "react";
import {
  Bell,
  Home,
  User,
  Package,
  LogOut,
  Search,
  Eye,
  CheckCircle,
  Truck,
} from "lucide-react";

import logo from "../../assets/logo.png";

const OrderProcessing: React.FC = () => {
  const orders = [
    {
      id: "#ORD001",
      customer: "Ram Sharma",
      product: "Laptop",
      quantity: 1,
      status: "Pending",
    },
    {
      id: "#ORD002",
      customer: "Sita Rai",
      product: "Beauty Kit",
      quantity: 2,
      status: "Processing",
    },
    {
      id: "#ORD003",
      customer: "Hari Thapa",
      product: "T-Shirt",
      quantity: 3,
      status: "Completed",
    },
  ];

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>

        {/* MENU */}
        <div style={styles.menu}>
          <div style={styles.menuItem}>
            <Home size={22} />
            <span>Dashboard</span>
          </div>

          <div style={styles.menuItem}>
            <User size={22} />
            <span>Inventory management</span>
          </div>

          <div style={styles.activeMenu}>
            <Package size={22} />
            <span>Order processing</span>
          </div>

          <div style={styles.menuItem}>
            <LogOut size={22} />
            <span>Logout</span>
          </div>
        </div>

        {/* PROFILE */}
        <div style={styles.profile}>
          <div style={styles.avatar}></div>

          <div>
            <h3 style={{ margin: 0 }}>Profile Name</h3>
            <p style={styles.email}>example@gmail.com</p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {/* NAVBAR */}
        <div style={styles.navbar}>
          <h1 style={styles.heading}>Order Processing</h1>

          <div style={styles.navRight}>
            <div style={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search orders..."
                style={styles.input}
              />
            </div>

            <div style={styles.iconBox}>
              <Bell size={22} />
              <span style={styles.notification}>4</span>
            </div>

            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              style={styles.topProfile}
            />
          </div>
        </div>

        {/* BREADCRUMB */}
        <div style={styles.breadcrumb}>
          <span>Order Processing</span>

          <span style={{ color: "#666" }}>
            Home &gt; Order Processing
          </span>
        </div>

        {/* TOP CARDS */}
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Total Orders</h2>
            <h1 style={styles.cardValue}>250</h1>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Pending</h2>
            <h1 style={styles.cardValue}>30</h1>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Completed</h2>
            <h1 style={styles.cardValue}>220</h1>
          </div>
        </div>

        {/* ORDER TABLE */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h2 style={{ margin: 0 }}>Recent Orders</h2>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td style={styles.td}>{order.id}</td>
                  <td style={styles.td}>{order.customer}</td>
                  <td style={styles.td}>{order.product}</td>
                  <td style={styles.td}>{order.quantity}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          order.status === "Pending"
                            ? "#fee2e2"
                            : order.status === "Processing"
                            ? "#fef3c7"
                            : "#dcfce7",

                        color:
                          order.status === "Pending"
                            ? "#991b1b"
                            : order.status === "Processing"
                            ? "#92400e"
                            : "#166534",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button style={styles.viewBtn}>
                        <Eye size={16} />
                      </button>

                      <button style={styles.processBtn}>
                        <Truck size={16} />
                      </button>

                      <button style={styles.completeBtn}>
                        <CheckCircle size={16} />
                      </button>
                    </div>
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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#111",
  },

  sidebar: {
    width: "280px",
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
    width: "170px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
  },

  activeMenu: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "red",
    color: "#fff",
    padding: "14px",
    borderRadius: "4px",
    fontWeight: "bold",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "25px",
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#fff",
  },

  email: {
    margin: 0,
    fontSize: "13px",
    color: "#333",
  },

  main: {
    flex: 1,
    background: "#f5f5f5",
    padding: "20px",
  },

  navbar: {
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    borderBottom: "1px solid #ccc",
  },

  heading: {
    margin: 0,
    fontSize: "34px",
    color: "#555",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#ece7ef",
    padding: "10px 15px",
    borderRadius: "20px",
  },

  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    width: "220px",
  },

  iconBox: {
    position: "relative",
  },

  notification: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "#ff6b6b",
    color: "#fff",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  topProfile: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
  },

  breadcrumb: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    fontWeight: "bold",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    background: "#d7ebf6",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
  },

  cardTitle: {
    color: "#2643c4",
    marginBottom: "10px",
    fontSize: "28px",
  },

  cardValue: {
    margin: 0,
    fontSize: "42px",
  },

  tableContainer: {
    marginTop: "40px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
  },

  tableHeader: {
    marginBottom: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#f3f4f6",
    padding: "14px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #eee",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
  },

  actionButtons: {
    display: "flex",
    gap: "10px",
  },

  viewBtn: {
    border: "none",
    background: "#dbeafe",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  processBtn: {
    border: "none",
    background: "#fef3c7",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  completeBtn: {
    border: "none",
    background: "#dcfce7",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default OrderProcessing;