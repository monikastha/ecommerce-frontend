import { useState } from "react";

// SVG Icons
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
    <path d="M9 2L3 8v13h18V8L15 2H9zm0 2h6l4 4H5L9 4zm9 15H6V10h12v9zM8 12h8v2H8zm0 4h5v2H8z" />
  </svg>
);

const CustomerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const CodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
  </svg>
);

export default function SellerAddProduct() {
  const [activeNav, setActiveNav] = useState("Product Management");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productCode, setProductCode] = useState("");
  const [price, setPrice] = useState("");
  const [fileName, setFileName] = useState("No File Chosen");

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon /> },
    { label: "Product Management", icon: <ProductIcon /> },
    { label: "Orders Management", icon: <OrderIcon /> },
    { label: "Customer Engagement", icon: <CustomerIcon /> },
    { label: "Logout", icon: <LogoutIcon /> },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No File Chosen");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#1a1a2e",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "13px",
        color: "#fff",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "180px",
          minWidth: "180px",
          backgroundColor: "#1a1a2e",
          borderRight: "1px solid #2a2a4a",
          display: "flex",
          flexDirection: "column",
          paddingTop: "10px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 10px 24px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#2d6a4f",
              border: "3px solid #40916c",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginBottom: "6px",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#1b4332" />
              <path
                d="M8 12h4l4 16h16l4-12H16"
                stroke="#52b788"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="20" cy="32" r="2" fill="#52b788" />
              <circle cx="30" cy="32" r="2" fill="#52b788" />
              <path
                d="M22 8c1.1-.6 2.9-.6 4 0"
                stroke="#74c69d"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M19 6c2.5-1.4 7.5-1.4 10 0"
                stroke="#74c69d"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div
            style={{
              color: "#52b788",
              fontWeight: "800",
              fontSize: "14px",
              letterSpacing: "1px",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            SAJILO MART
          </div>
          <div
            style={{
              color: "#aaa",
              fontSize: "9px",
              textAlign: "center",
              marginTop: "2px",
              letterSpacing: "0.5px",
            }}
          >
            EASY BETTER SHOPPING
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 16px",
                cursor: "pointer",
                backgroundColor:
                  activeNav === item.label ? "#e74c3c" : "transparent",
                color: activeNav === item.label ? "#fff" : "#ccc",
                fontWeight: activeNav === item.label ? "600" : "400",
                fontSize: "13px",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  color: activeNav === item.label ? "#fff" : "#aaa",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px",
            borderTop: "1px solid #2a2a4a",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#555",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <UserIcon />
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "12px", color: "#fff" }}>
              Profile Name
            </div>
            <div style={{ fontSize: "10px", color: "#aaa" }}>
              example@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div
          style={{
            backgroundColor: "#16213e",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #2a2a4a",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>
            Seller add product 1
          </div>
          {/* Code icon button */}
          <div
            style={{
              backgroundColor: "#27ae60",
              borderRadius: "6px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <CodeIcon />
          </div>
        </div>

        {/* Page content */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#1a1a2e",
            padding: "24px",
          }}
        >
          {/* Form card */}
          <div
            style={{
              backgroundColor: "#c8c8c8",
              borderRadius: "6px",
              padding: "20px 24px 24px",
              maxWidth: "560px",
            }}
          >
            {/* Card heading */}
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#111",
                marginBottom: "16px",
              }}
            >
              Add detail information regarding product
            </div>

            {/* Image placeholder area */}
            <div
              style={{
                backgroundColor: "#b0b0b0",
                borderRadius: "4px",
                height: "90px",
                marginBottom: "16px",
              }}
            />

            {/* Title */}
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#111",
                  marginBottom: "4px",
                }}
              >
                Title
              </label>
              <input
                type="text"
                placeholder="Enter your product title here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  fontSize: "12.5px",
                  border: "1px solid #aaa",
                  borderRadius: "3px",
                  backgroundColor: "#fff",
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#111",
                  marginBottom: "4px",
                }}
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  fontSize: "12.5px",
                  border: "1px solid #aaa",
                  borderRadius: "3px",
                  backgroundColor: "#fff",
                  color: "#333",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Category / Product Code / Price row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              {/* Category */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "#111",
                    marginBottom: "4px",
                  }}
                >
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "5px 8px",
                    fontSize: "12px",
                    border: "1px solid #aaa",
                    borderRadius: "3px",
                    backgroundColor: "#fff",
                    color: "#555",
                    outline: "none",
                    appearance: "auto",
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="footwear">Footwear</option>
                  <option value="bags">Bags</option>
                </select>
              </div>

              {/* Product Code */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "#111",
                    marginBottom: "4px",
                  }}
                >
                  Product Code
                </label>
                <input
                  type="text"
                  placeholder="Enter product code"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "5px 8px",
                    fontSize: "12px",
                    border: "1px solid #aaa",
                    borderRadius: "3px",
                    backgroundColor: "#fff",
                    color: "#333",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Price */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "#111",
                    marginBottom: "4px",
                  }}
                >
                  Price
                </label>
                <input
                  type="text"
                  placeholder="Rs."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "5px 8px",
                    fontSize: "12px",
                    border: "1px solid #aaa",
                    borderRadius: "3px",
                    backgroundColor: "#fff",
                    color: "#333",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Product Picture */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#111",
                  marginBottom: "6px",
                }}
              >
                Product Picture
              </label>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#5b6e8c",
                  color: "#fff",
                  borderRadius: "4px",
                  padding: "6px 14px",
                  fontSize: "12.5px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {fileName}
              </label>
            </div>

            {/* Cancel / Save buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "7px 22px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: "#27ae60",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "7px 22px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}