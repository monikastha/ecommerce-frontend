import { useState } from "react";

<<<<<<< HEAD
=======
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
type OrderStatus = "Ready For Shipping" | "Shipped" | "New Order";

interface Order {
  id: string;
  status: OrderStatus;
  customer: string;
  productName: string;
  quantity: number;
  price: number;
}

const initialOrders: Order[] = [
<<<<<<< HEAD
  { id: "01", status: "Ready For Shipping", customer: "Binita", productName: "Diamond Set", quantity: 1, price: 1999 },
  { id: "02", status: "Shipped", customer: "Kabita", productName: "Floral Kurthi", quantity: 1, price: 999 },
  { id: "03", status: "Shipped", customer: "Karuna", productName: "Hand Bag", quantity: 2, price: 1999 },
  { id: "04", status: "Shipped", customer: "Monika", productName: "Simple Watch", quantity: 2, price: 1499 },
  { id: "05", status: "New Order", customer: "Sani", productName: "Casual Slipper", quantity: 1, price: 999 },
];

export default function SajiloMartOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("Orders Management");

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Product Management",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      label: "Orders Management",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      label: "Customer Engagement",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
          <circle cx="12" cy="7" r="4" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#f0f0f0" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "230px",
          minWidth: "230px",
          backgroundColor: "#1a2a4a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        {/* Logo */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px 16px" }}>
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Cart Icon Logo */}
              <div style={{ textAlign: "center" }}>
                <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
                  <ellipse cx="24" cy="20" rx="24" ry="20" fill="white" />
                  {/* wifi signal */}
                  <path d="M24 8 Q30 12 36 10" stroke="#1a2a4a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <path d="M24 8 Q18 12 12 10" stroke="#1a2a4a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  {/* cart */}
                  <path d="M10 16 L14 16 L17 26 L33 26 L36 18 L14 18" stroke="#1a2a4a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="18" cy="29" r="2" fill="#1a2a4a"/>
                  <circle cx="30" cy="29" r="2" fill="#1a2a4a"/>
                </svg>
                <div style={{ fontSize: "9px", color: "#1a2a4a", fontWeight: "bold", marginTop: "-4px", letterSpacing: "1px" }}>SAJILO MART</div>
                <div style={{ fontSize: "6px", color: "#555", letterSpacing: "0.5px" }}>SHOP ANYTIME ANYWHERE</div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav style={{ marginTop: "8px" }}>
            {navItems.map((item) => (
              <div
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "13px 24px",
                  cursor: "pointer",
                  backgroundColor: activeNav === item.label ? "#e8380d" : "transparent",
                  color: "white",
                  fontWeight: activeNav === item.label ? "600" : "400",
                  fontSize: "15px",
                  transition: "background 0.2s",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}

            {/* Logout */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "13px 24px",
                cursor: "pointer",
                color: "white",
                fontSize: "15px",
                marginTop: "8px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </div>
          </nav>
        </div>

        {/* Profile at bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 20px 24px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#ccc",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>Profile Name</div>
            <div style={{ fontSize: "12px", color: "#aab4c8" }}>example@gmail.com</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div
          style={{
            backgroundColor: "#1a2a4a",
            color: "white",
            padding: "10px 20px",
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          Seller Orders Management 1
        </div>

        {/* Content area */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: "#111" }}>Customer orders</h2>
          <p style={{ margin: "0 0 18px", fontSize: "13px", color: "#666" }}>Create, update and review customer orders</p>

          {/* Search and Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, maxWidth: "340px" }}>
              <svg
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#888" }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by order ID, product or cus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 34px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                }}
              />
            </div>

            {/* Filters */}
            {["Product", "Customer", "Status"].map((f) => (
              <select
                key={f}
                style={{
                  padding: "9px 28px 9px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "13px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23333' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  fontWeight: "500",
                }}
              >
                <option>{f}</option>
              </select>
            ))}
          </div>

          {/* Table */}
          <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#d9d9d9" }}>
                  {["Actions", "Order ID", "Status", "Customer", "Product Name", "Quantity", "Price", "Action"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111",
                        borderBottom: "1px solid #bbb",
                      }}
=======
  {
    id: "01",
    status: "Ready For Shipping",
    customer: "Binita",
    productName: "Diamond Set",
    quantity: 1,
    price: 1999,
  },
  {
    id: "02",
    status: "Shipped",
    customer: "Kabita",
    productName: "Floral Kurthi",
    quantity: 1,
    price: 999,
  },
  {
    id: "03",
    status: "Shipped",
    customer: "Karuna",
    productName: "Hand Bag",
    quantity: 2,
    price: 1999,
  },
  {
    id: "04",
    status: "Shipped",
    customer: "Monika",
    productName: "Simple Watch",
    quantity: 2,
    price: 1499,
  },
  {
    id: "05",
    status: "New Order",
    customer: "Sani",
    productName: "Casual Slipper",
    quantity: 1,
    price: 999,
  },
];

export default function SellerOrders() {
  const [orders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] =
    useState<"all" | "pending" | "completed">("all");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.includes(searchQuery) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && o.status === "New Order") ||
      (activeTab === "completed" && o.status === "Shipped");

    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex w-full h-screen bg-gray-100 font-sans text-[13px]">

      <SellerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <SellerNavbar />

        {/* ✅ PUSH CONTENT DOWN */}
        <div className="flex-1 overflow-y-auto p-5 pt-10">

          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-8">

            {/* TABS */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 rounded-md border ${
                  activeTab === "all"
                    ? "bg-gray-800 text-white"
                    : "bg-white"
                }`}
              >
                All Orders
              </button>

              <button
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-2 rounded-md border ${
                  activeTab === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-white"
                }`}
              >
                Pending
              </button>

              <button
                onClick={() => setActiveTab("completed")}
                className={`px-3 py-2 rounded-md border ${
                  activeTab === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-white"
                }`}
              >
                Completed
              </button>
            </div>

            {/* SEARCH (RIGHT) */}
            <div className="w-[380px]">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
              />
            </div>

          </div>

          {/* TABLE (NOW LOWER + CENTER FEEL) */}
          <div className="bg-white rounded-lg overflow-hidden border mt-6">

            <table className="w-full border-collapse">

              <thead className="bg-gray-300">
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Product",
                    "Qty",
                    "Price",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-center font-semibold text-gray-800"
>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
<<<<<<< HEAD
              <tbody>
                {orders
                  .filter((o) =>
                    searchQuery === "" ||
                    o.id.includes(searchQuery) ||
                    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    o.productName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((order, idx) => (
                    <tr
                      key={order.id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#e8e8e8" : "#d9d9d9",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {/* Actions - Update button */}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button
                          style={{
                            backgroundColor: "#9b2fc9",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "5px 14px",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                          }}
                        >
                          Update
                        </button>
                      </td>

                      {/* Order ID */}
                      <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px" }}>{order.id}</td>

                      {/* Status */}
                      <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px" }}>{order.status}</td>

                      {/* Customer */}
                      <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px" }}>{order.customer}</td>

                      {/* Product Name */}
                      <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px" }}>{order.productName}</td>

                      {/* Quantity */}
                      <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px" }}>{order.quantity}</td>

                      {/* Price */}
                      <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px" }}>{order.price}</td>

                      {/* Accept / Reject */}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button
                            style={{
                              backgroundColor: "#16a34a",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px 12px",
                              fontSize: "13px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Accept
                          </button>
                          <button
                            style={{
                              backgroundColor: "#e8380d",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px 12px",
                              fontSize: "13px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
=======

              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                  >
                    <td className="px-4 py-3 text-center">{order.id}</td>
                    <td className="px-4 py-3 text-center">{order.customer}</td>
                    <td className="px-4 py-3 text-center">{order.productName}</td>
                    <td className="px-4 py-3 text-center">{order.quantity}</td>
                    <td className="px-4 py-3 text-center">
                      Rs. {order.price}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="text-gray-800 font-medium">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md">
                          Accept
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

>>>>>>> 4b960a4ed5413eab9f0b20d4a1b6eb4b51942d96
        </div>
      </div>
    </div>
  );
}