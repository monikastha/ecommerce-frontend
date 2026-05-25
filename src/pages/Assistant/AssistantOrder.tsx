import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";

const Order: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .dashboard-container {
          background: #f4f6f8;
          min-height: 100vh;
        }

        .main-content {
          margin-left: 250px;
          width: calc(100% - 250px);
          min-height: 100vh;
        }

        .container {
          padding: 25px 30px;
        }

        /* STATS */
        .statsRow {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
        }

        .statBox {
          flex: 1;
          padding: 22px 20px;
          border-radius: 14px;
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .statBox h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          opacity: 0.9;
        }

        .statBox p {
          font-size: 26px;
          margin-top: 6px;
          font-weight: 700;
        }

        .blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .green { background: linear-gradient(135deg, #22c55e, #16a34a); }
        .orange { background: linear-gradient(135deg, #f59e0b, #d97706); }

        /* FILTER SECTION */
        .filterBox {
          background: white;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .statusFilter {
          display: flex;
          gap: 8px;
        }

        .statusFilter button {
          padding: 9px 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          background: #f3f4f6;
          color: #475569;
          transition: all 0.2s;
        }

        .statusFilter button.active {
          background: #5BBF9A;
          color: white;
        }

        .sortSearch {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        select {
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }

        .searchBox {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 14px;
          width: 280px;
        }

        .searchBox input {
          border: none;
          outline: none;
          margin-left: 10px;
          width: 100%;
          font-size: 14px;
        }

        /* TABLE */
        .tableBox {
          background: white;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f8fafc;
          padding: 16px 14px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          font-size: 14px;
        }

        td {
          padding: 16px 14px;
          border-top: 1px solid #f1f5f9;
          font-size: 14.5px;
          color: #334155;
        }

        tr:hover {
          background: #f8fafc;
        }

        .priority-normal { color: #22c55e; font-weight: 500; }
        .priority-emergency { color: #ef4444; font-weight: 600; }

        .status-paid { color: #22c55e; font-weight: 500; }
        .status-pending { color: #f59e0b; font-weight: 500; }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            {/* Top Stats */}
            <div className="statsRow">
              <div className="statBox blue">
                <h3>Total Orders</h3>
                <p>1,245</p>
              </div>
              <div className="statBox green">
                <h3>Total Paid</h3>
                <p>892</p>
              </div>
              <div className="statBox orange">
                <h3>Pending Orders</h3>
                <p>353</p>
              </div>
            </div>

            {/* Filter Section */}
            <div className="filterBox">
              <div className="statusFilter">
                <button 
                  className={statusFilter === "All" ? "active" : ""} 
                  onClick={() => setStatusFilter("All")}
                >
                  All
                </button>
                <button 
                  className={statusFilter === "Normal" ? "active" : ""} 
                  onClick={() => setStatusFilter("Normal")}
                >
                  Normal
                </button>
                <button 
                  className={statusFilter === "Emergency" ? "active" : ""} 
                  onClick={() => setStatusFilter("Emergency")}
                >
                  Emergency
                </button>
              </div>

              <div className="sortSearch">
                <select>
                  <option>Sort By: Latest</option>
                  <option>Date (Oldest)</option>
                  <option>Amount (High)</option>
                  <option>Amount (Low)</option>
                </select>

                <div className="searchBox">
                  <FaSearch className="icon" />
                  <input
                    type="text"
                    placeholder="Search orders by ID or buyer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product Info</th>
                    <th>Payment Method</th>
                    <th>Total Amount</th>
                    <th>Buyer Name</th>
                    <th>Priority</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>#1001</strong></td>
                    <td>iPhone 15 Pro (2)</td>
                    <td>Card</td>
                    <td><strong>₹1,50,000</strong></td>
                    <td>Ram Sharma</td>
                    <td className="priority-normal">Normal</td>
                    <td className="status-paid">Paid</td>
                  </tr>
                  <tr>
                    <td><strong>#1002</strong></td>
                    <td>HP Laptop Pavilion</td>
                    <td>Cash on Delivery</td>
                    <td><strong>₹92,000</strong></td>
                    <td>Sita KC</td>
                    <td className="priority-emergency">Emergency</td>
                    <td className="status-pending">Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;