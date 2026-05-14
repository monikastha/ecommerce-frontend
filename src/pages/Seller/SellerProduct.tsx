import { useState } from "react";

const products = [
  { name: "Partywear Blue Saree", price: "Rs. 2299", status: "Published" },
  { name: "Diamond Set", price: "Rs.1999", status: "Unpublished" },
  { name: "Casual Slipper", price: "Rs. 999", status: "Published" },
  { name: "Shoulder Bag", price: "Rs. 799", status: "Published" },
  { name: "Floral Kurti", price: "Rs. 1599", status: "Published" },
  { name: "Pearl Earring", price: "Rs. 499", status: "Published" },
  { name: "UGG Boot", price: "Rs. 2499", status: "Published" },
  { name: "Large Capacity Bag", price: "Rs. 1199", status: "Published" },
  { name: "Diamond Work Saree", price: "Rs. 2999", status: "Published" },
  { name: "Peacock Design", price: "Rs. 449", status: "Published" },
];

// Icons
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ProductIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12H4V9h16v10zM12 2L4 7h16L12 2z" />
  </svg>
);

const OrderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 2L3 8v13h18V8L15 2H9zm0 2h6l4 4H5L9 4zm9 15H6V10h12v9z" />
  </svg>
);

const CustomerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#888">
    <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

export default function SellerProductManagement() {
  const [activeNav, setActiveNav] = useState("Product Management");

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon /> },
    { label: "Product Management", icon: <ProductIcon /> },
    { label: "Orders Management", icon: <OrderIcon /> },
    { label: "Customer Engagement", icon: <CustomerIcon /> },
    { label: "Logout", icon: <LogoutIcon /> },
  ];

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "#f4f4f4",
        fontFamily: "Segoe UI",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#1a1a2e",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: "center",
            padding: "25px 10px",
            borderBottom: "1px solid #2f2f48",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#2d6a4f",
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            SM
          </div>

          <div style={{ fontWeight: "700", color: "#52b788" }}>
            SAJILO MART
          </div>

          <div style={{ fontSize: "10px", color: "#aaa" }}>
            EASY BETTER SHOPPING
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1 }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                cursor: "pointer",
                background:
                  activeNav === item.label ? "#e74c3c" : "transparent",
                borderBottom: "1px solid #2f2f48",
                transition: "0.2s",
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Profile */}
        <div
          style={{
            padding: "18px",
            borderTop: "1px solid #2f2f48",
          }}
        >
          <div style={{ fontWeight: "600" }}>Profile Name</div>
          <div style={{ fontSize: "11px", color: "#aaa" }}>
            example@gmail.com
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Topbar */}
        <div
          style={{
            background: "#fff",
            padding: "15px 25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#222",
            }}
          >
            Product Management
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f1f1f1",
                padding: "8px 14px",
                borderRadius: "20px",
                gap: "8px",
              }}
            >
              <SearchIcon />

              <input
                placeholder="Search Product..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "13px",
                }}
              />
            </div>

            <div
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                background: "#e74c3c",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "30px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            {/* Add Button */}
            <button
              style={{
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              + Add Product
            </button>

            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                background: "#e5e5e5",
                padding: "14px 18px",
                borderRadius: "5px",
                fontWeight: "700",
                color: "#222",
                marginBottom: "10px",
                columnGap: "30px",
              }}
            >
              <span>Product List</span>
              <span>Price</span>
              <span>Action</span>
              <span>Status</span>
            </div>

            {/* Table Rows */}
            {products.map((product, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  padding: "14px 18px",
                  background: "#fff",
                  borderBottom: "1px solid #ddd",
                  alignItems: "center",
                  columnGap: "30px",
                }}
              >
                <span style={{ color: "#222", fontWeight: "500" }}>
                  {product.name}
                </span>

                <span style={{ color: "#444" }}>{product.price}</span>

                <button
                  style={{
                    width: "70px",
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    padding: "7px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Edit
                </button>

                <span>
                  <span
                    style={{
                      background:
                        product.status === "Published"
                          ? "#27ae60"
                          : "#e74c3c",
                      color: "#fff",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {product.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}