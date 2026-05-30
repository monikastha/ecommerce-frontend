import { useState, useMemo } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

type OrderStatus = "Ready For Shipping" | "Shipped" | "New Order";

interface Order {
  id: string;
  status: OrderStatus;
  customer: string;
  productName: string;
  quantity: number;
  price: number;
}

export default function SellerOrders() {
  const [orders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
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
  }, [orders, searchQuery, activeTab]);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .wrapper {
          display: flex;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }

        .sidebar {
          width: 260px;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: #445C6D;
          z-index: 100;
        }

        .main {
          margin-left: 260px;
          flex: 1;
          background: #f5f7fa;
          min-height: 100vh;
        }

        .container { 
          padding: 30px; 
        }

        .header {
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 25px; 
          padding: 15px 20px;
          background: white; 
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .titleBox { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .header-icon {
          width: 52px; 
          height: 52px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border-radius: 14px; 
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white; 
          font-size: 22px;
        }
        .titleBox h1 { 
          font-size: 24px; 
          font-weight: 700; 
          margin: 0; 
          color: #0f172a; 
        }
        .titleBox h3 { 
          font-size: 13px; 
          color: #64748b; 
          margin: 4px 0 0 0; 
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .tabs {
          display: flex;
          gap: 8px;
          background: white;
          padding: 6px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        .tab {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab.active {
          background: #ef4444;
          color: white;
        }

        .search-container {
          display: flex; 
          align-items: center; 
          gap: 8px;
          background: white; 
          padding: 8px 14px; 
          border-radius: 10px;
          border: 1px solid #e2e8f0; 
          width: 340px;
        }
        .searchInput {
          border: none; 
          outline: none; 
          width: 100%; 
          font-size: 14px;
        }

        table {
          width: 100%; 
          border-collapse: collapse; 
          background: white;
          border-radius: 10px; 
          overflow: hidden; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        th, td {
          padding: 14px; 
          font-size: 14px; 
          color: #475569;
          border-bottom: 1px solid #e5e7eb; 
          text-align: center;
        }
        th { 
          background: #f8fafc; 
          font-weight: 600; 
        }

        .status {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .actions button {
          padding: 7px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          margin: 0 4px;
          transition: 0.2s;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <SellerSidebar />
        </div>

        <div className="main">
          <SellerNavbar />

          <div className="container">
            <div className="header">
              <div className="titleBox">
                <div className="header-icon">
                  <FaShoppingCart />
                </div>
                <div>
                  <h1>Order Management</h1>
                  <h3>Track and manage customer orders</h3>
                </div>
              </div>
            </div>

            {/* Tabs + Search Bar (Side by Side) */}
            <div className="controls">
              <div className="tabs">
                <div
                  className={`tab ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  All Orders
                </div>
                <div
                  className={`tab ${activeTab === "pending" ? "active" : ""}`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending
                </div>
                <div
                  className={`tab ${activeTab === "completed" ? "active" : ""}`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed
                </div>
              </div>

              <div className="search-container">
                <FaSearch style={{ color: "#94a3b8" }} />
                <input
                  type="text"
                  className="searchInput"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Orders Table */}
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "100px 20px", textAlign: "center", color: "#64748b" }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>#{order.id}</strong></td>
                      <td>{order.customer}</td>
                      <td>{order.productName}</td>
                      <td>{order.quantity}</td>
                      <td>Rs. {order.price}</td>
                      <td>
                        <span className="status" style={{
                          background: order.status === "New Order" ? "#fef3c7" :
                                     order.status === "Ready For Shipping" ? "#dbeafe" : "#dcfce7",
                          color: order.status === "New Order" ? "#854d0e" :
                                order.status === "Ready For Shipping" ? "#1e40af" : "#166534",
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button style={{ background: "#16a34a", color: "white" }}>
                          Accept
                        </button>
                        <button style={{ background: "#dc2626", color: "white" }}>
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
