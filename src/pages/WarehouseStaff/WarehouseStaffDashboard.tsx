import React from "react";
import {
  Bell,
  Home,
  User,
  Package,
  LogOut,
  Search,
} from "lucide-react";

import logo from "../../assets/logo.png";

const WarehouseStaffDashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>

        {/* Menu */}
        <div style={styles.menu}>
          <div style={styles.activeMenu}>
            <Home size={22} />
            <span>Dashboard</span>
          </div>

          <div style={styles.menuItem}>
            <User size={22} />
            <span>Inventory management</span>
          </div>

          <div style={styles.menuItem}>
            <Package size={22} />
            <span>Order processing</span>
          </div>

          <div style={styles.menuItem}>
            <LogOut size={22} />
            <span>Logout</span>
          </div>
        </div>

        {/* Profile */}
        <div style={styles.profile}>
          <div style={styles.avatar}></div>

          <div>
            <h3 style={{ margin: 0 }}>Profile Name</h3>
            <p style={styles.email}>example@gmail.com</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        {/* TOP NAVBAR */}
        <div style={styles.navbar}>
          <div>
            <h1 style={styles.heading}>Good Morning, Staff</h1>
          </div>

          <div style={styles.navRight}>
            {/* Search */}
            <div style={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search Product,Order etc."
                style={styles.input}
              />
            </div>

            {/* Notification */}
            <div style={styles.iconBox}>
              <Bell size={22} />
              <span style={styles.notification}>4</span>
            </div>

            {/* Profile */}
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              style={styles.topProfile}
            />
          </div>
        </div>

        {/* BREADCRUMB */}
        <div style={styles.breadcrumb}>
          <span>Dashboard</span>

          <span style={{ color: "#666" }}>Home &gt; Dashboard</span>
        </div>

        {/* STAT CARDS */}
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Total stock</h2>
            <h1 style={styles.cardValue}>45</h1>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>In stock</h2>
            <h1 style={styles.cardValue}>30</h1>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Out of stock</h2>
            <h1 style={styles.cardValue}>15</h1>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Total orders</h2>
            <h1 style={styles.cardValue}>200</h1>
          </div>
        </div>

        {/* PRODUCT SECTION */}
        <div style={styles.productBox}>
          <div style={styles.productHeading}>
            Top 3 products stock this month
          </div>

          <div style={styles.productGrid}>
            {/* Product 1 */}
            <div style={styles.productCard}>
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                alt="Electronics"
                style={styles.productImage}
              />
              <h3>Electronics</h3>
            </div>

            {/* Product 2 */}
            <div style={styles.productCard}>
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
                alt="Beauty"
                style={styles.productImage}
              />
              <h3>Beauty Products</h3>
            </div>

            {/* Product 3 */}
            <div style={styles.productCard}>
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
                alt="Clothes"
                style={styles.productImage}
              />
              <h3>Clothes</h3>
            </div>
          </div>
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
  padding: "10px",
  textAlign: "left" as const,   // moves logo section to left
  paddingLeft: "1px",          // extra left spacing
},

logo: {
  width: "350px",               // increase logo size
  height: "auto",
  display: "block",
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
    fontSize: "40px",
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
    fontSize: "34px",
  },

  cardValue: {
    margin: 0,
    fontSize: "48px",
  },

  productBox: {
    marginTop: "40px",
    border: "1px solid #777",
    padding: "40px",
    background: "#fff",
  },

  productHeading: {
    background: "#ef4444",
    color: "#fff",
    width: "fit-content",
    margin: "0 auto 40px auto",
    padding: "15px 25px",
    fontWeight: "bold",
    fontSize: "32px",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "25px",
  },

  productCard: {
    textAlign: "center",
  },

  productImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    border: "1px solid #999",
  },
};

export default WarehouseStaffDashboard;