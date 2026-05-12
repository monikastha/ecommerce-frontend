import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";

const Order: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="wrapper">
      <AssistantSidebar />

      <div className="main">
        <AssistantNavbar />

        <div className="container">

          {/* TOP STATS */}
          <div className="statsRow">
            <div className="statBox blue">
              <h3>Total Users</h3>
              <p>1000</p>
            </div>

            <div className="statBox green">
              <h3>Total Paid</h3>
              <p>600</p>
            </div>

            <div className="statBox orange">
              <h3>Total Pending</h3>
              <p>400</p>
            </div>
          </div>

          {/* FILTER SECTION */}
          <div className="filterBox">

            <div className="statusFilter">
              <button className="active">All</button>
              <button>Normal</button>
              <button>Emergency</button>
            </div>

            <div className="sortSearch">

              <select>
                <option>Sort By</option>
                <option>Date</option>
                <option>Amount</option>
                <option>Status</option>
              </select>

              <div className="searchBox">
                <FaSearch className="icon" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

            </div>
          </div>

          {/* TABLE */}
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
                  <td>#1001</td>
                  <td>iPhone 15 Pro</td>
                  <td>Card</td>
                  <td>150000</td>
                  <td>Ram Sharma</td>
                  <td>Normal</td>
                  <td>Paid</td>
                </tr>

                <tr>
                  <td>#1002</td>
                  <td>Laptop HP</td>
                  <td>Cash</td>
                  <td>90000</td>
                  <td>Sita KC</td>
                  <td>Emergency</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* CSS */}
      <style>{`
        .wrapper {
          display: flex;
        }

        .main {
          flex: 1;
          background: #f4f6f8;
          min-height: 100vh;
        }

        .container {
          padding: 20px;
        }

        /* STATS */
        .statsRow {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .statBox {
          flex: 1;
          padding: 20px;
          border-radius: 12px;
          color: white;
        }

        .statBox h3 {
          margin: 0;
          font-size: 14px;
        }

        .statBox p {
          font-size: 22px;
          margin-top: 5px;
          font-weight: bold;
        }

        .blue { background: #3b82f6; }
        .green { background: #22c55e; }
        .orange { background: #f59e0b; }

        /* FILTER */
        .filterBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 15px;
        }

        .statusFilter button {
          margin-right: 10px;
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: #f3f4f6;
        }

        .statusFilter .active {
          background: #E53935;
          color: white;
        }

        .sortSearch {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        select {
          padding: 8px;
          border-radius: 6px;
        }

        .searchBox {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          padding: 6px 10px;
          border-radius: 8px;
        }

        .searchBox input {
          border: none;
          outline: none;
          margin-left: 6px;
        }

        .icon {
          color: gray;
        }

        /* TABLE */
        .tableBox {
          background: white;
          padding: 18px;
          border-radius: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          background: #f9fafb;
          padding: 12px;
        }

        td {
          padding: 12px;
          border-top: 1px solid #eee;
        }
      `}</style>
    </div>
  );
};

export default Order;