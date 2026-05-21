import { useState } from "react";
<<<<<<< HEAD

export default function SajiloMartAddProduct() {
  const [activeNav, setActiveNav] = useState("Product Management");
=======
import SellerSidebar from "./SellerSidebar";
import SellerNavbar from "./SellerNavbar";

export default function SellerAddProduct() {
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productCode, setProductCode] = useState("");
  const [price, setPrice] = useState("");
<<<<<<< HEAD
  const [fileName, setFileName] = useState("No File Chosen");

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Product Management",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      label: "Orders Management",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      label: "Customer Engagement",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Logout",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#2c2c2c",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── TOP SYSTEM BAR ── */}
      <div
        style={{
          backgroundColor: "#1a1a1a",
          color: "#ccc",
          fontSize: "14px",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Seller add product 1</span>
        {/* Green code icon top-right */}
        <div
          style={{
            backgroundColor: "#16a34a",
            borderRadius: "6px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* ══════════════ SIDEBAR ══════════════ */}
        <div
          style={{
            width: "175px",
            minWidth: "175px",
            backgroundColor: "#1e3a5f",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            minHeight: "calc(100vh - 48px)",
          }}
        >
          <div>
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 12px 16px" }}>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  padding: "7px",
                  boxSizing: "border-box",
                }}
              >
                <svg width="52" height="37" viewBox="0 0 54 40" fill="none">
                  <path d="M27 7 Q35 2 44 5"  stroke="#1e3a5f" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                  <path d="M27 7 Q19 2 10 5"  stroke="#1e3a5f" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                  <path d="M27 7 Q36 11 45 8" stroke="#1e3a5f" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
                  <path d="M27 7 Q18 11  9 8" stroke="#1e3a5f" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
                  <path d="M7 14 L12 14 L15 26 L39 26 L42 17 L12 17" stroke="#1e3a5f" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="19" cy="30" r="2.6" fill="#1e3a5f"/>
                  <circle cx="34" cy="30" r="2.6" fill="#1e3a5f"/>
                </svg>
                <div style={{ fontSize: "7.5px", color: "#1e3a5f", fontWeight: "bold", letterSpacing: "0.9px", textAlign: "center", marginTop: "2px" }}>SAJILO MART</div>
                <div style={{ fontSize: "5px", color: "#666", letterSpacing: "0.3px", textAlign: "center" }}>SHOP ANYTIME ANYWHERE</div>
              </div>
            </div>

            {/* Nav items */}
            <nav>
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
                    backgroundColor: activeNav === item.label ? "#e8380d" : "transparent",
                    color: "white",
                    fontWeight: activeNav === item.label ? "600" : "400",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* Profile strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "13px 14px 18px",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#9e9e9e", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "white" }}>Profile Name</div>
              <div style={{ fontSize: "10px", color: "#9baec8" }}>example@gmail.com</div>
            </div>
          </div>
        </div>

        {/* ══════════════ MAIN CONTENT ══════════════ */}
        <div style={{ flex: 1, padding: "20px 24px", backgroundColor: "#2c2c2c" }}>

          {/* White card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px 24px 28px",
              maxWidth: "520px",
            }}
          >
            {/* Heading */}
            <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#333", fontWeight: "400" }}>
              Add detail information regarding product
            </p>

            {/* Grey form area */}
            <div
              style={{
                backgroundColor: "#d4d4d4",
                borderRadius: "6px",
                padding: "18px 18px 22px",
              }}
            >
              {/* Title */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#111", marginBottom: "5px" }}>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter your product title here"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #bbb",
                    borderRadius: "4px",
                    fontSize: "13px",
                    backgroundColor: "white",
                    color: "#111",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#111", marginBottom: "5px" }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #bbb",
                    borderRadius: "4px",
                    fontSize: "13px",
                    backgroundColor: "white",
                    color: "#111",
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Category / Product Code / Price — 3 columns */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "14px", alignItems: "flex-start" }}>
                {/* Category */}
                <div style={{ flex: 1.2 }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#111", marginBottom: "5px" }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px 8px",
                      border: "1px solid #bbb",
                      borderRadius: "4px",
                      fontSize: "13px",
                      backgroundColor: "white",
                      color: "#555",
                      outline: "none",
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>

                {/* Product Code */}
                <div style={{ flex: 1.3 }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#111", marginBottom: "5px" }}>
                    Product Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product code"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px 8px",
                      border: "1px solid #bbb",
                      borderRadius: "4px",
                      fontSize: "13px",
                      backgroundColor: "white",
                      color: "#111",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Price */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#111", marginBottom: "5px" }}>
                    Price
                  </label>
                  <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #bbb", borderRadius: "4px", overflow: "hidden" }}>
                    <span style={{ padding: "7px 6px 7px 8px", fontSize: "13px", color: "#111", borderRight: "1px solid #bbb", whiteSpace: "nowrap" }}>Rs.</span>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "7px 6px",
                        border: "none",
                        fontSize: "13px",
                        color: "#111",
                        outline: "none",
                        minWidth: 0,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Product Picture */}
              <div style={{ marginBottom: "4px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#111", marginBottom: "6px" }}>
                  Product Picture
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "7px 14px",
                      backgroundColor: "#3a7bd5",
                      color: "white",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fileName}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Cancel / Save buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                style={{
                  padding: "8px 22px",
                  backgroundColor: "#e8380d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "8px 22px",
                  backgroundColor: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
=======
  const [fileName, setFileName] = useState("Choose File");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-[13px]">
      
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar */}
        <SellerNavbar />

        {/* Page Body */}
        <div className="flex-1 flex items-center justify-center p-4">

          {/* Smaller Form Card */}
          <div className="w-full max-w-[500px] bg-white border border-gray-200 rounded-lg shadow-sm p-5">

            {/* Heading */}
            <h2 className="text-center text-gray-700 text-sm font-semibold mb-4">
              Add Product Information
            </h2>

            {/* Title */}
            <div className="mb-3">
              <label className="block mb-1 text-gray-700">
                Product Title
              </label>

              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-green-500"
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block mb-1 text-gray-700">
                Description
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none resize-none focus:border-green-500"
              />
            </div>

            {/* Category + Code + Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">

              {/* Category */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="food">Food</option>
                </select>
              </div>

              {/* Code */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Code
                </label>

                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Code"
                  className="w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Price
                </label>

                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Rs."
                  className="w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500"
                />
              </div>

            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">
                Product Image
              </label>

              <label className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100">
                <span className="text-gray-600 text-[12px] truncate">
                  {fileName}
                </span>

                <span className="bg-gray-200 px-2 py-1 rounded text-[11px]">
                  Browse
                </span>

                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">

              {/* Cancel */}
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
                Cancel
              </button>

              {/* Save */}
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm">
                Save
              </button>

            </div>

>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
          </div>
        </div>
      </div>
    </div>
  );
}