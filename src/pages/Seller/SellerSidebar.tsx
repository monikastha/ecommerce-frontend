import { useState } from "react";
import logo from "../../assets/logo.png";

interface NavItem {
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>,
  },
  {
    label: "Products",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.1-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" /></svg>,
  },
  {
    label: "Orders",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>,
  },
  {
    label: "Customers",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>,
  },
  {
    label: "Logout",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>,
  },
];

export default function SellerSidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div
      style={{
        width: "230px",
        height: "100vh",
        background: "#1b2d4f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        fontFamily: "Segoe UI",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          width: "90px",
          height: "90px",
          background: "#fff",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: "80%", height: "80%", objectFit: "contain" }}
        />
      </div>

      {/* NAV */}
      <div style={{ width: "100%" }}>
        {navItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActive(item.label)}
            style={{
              display: "flex",
              gap: "10px",
              padding: "12px 18px",
              cursor: "pointer",
              color: "#fff",
              background: active === item.label ? "#e53935" : "transparent",
              fontSize: "14px",
            }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>

      {/* PROFILE */}
      <div style={{ marginTop: "auto", padding: "15px", color: "#fff" }}>
        <div style={{ fontSize: "13px", fontWeight: 600 }}>Seller Name</div>
        <div style={{ fontSize: "11px", color: "#aaa" }}>
          seller@email.com
        </div>
      </div>
    </div>
  );
}