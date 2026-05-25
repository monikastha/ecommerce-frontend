import React, { useState } from "react";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaUsers, FaSearch } from "react-icons/fa";

const Buyer: React.FC = () => {
  const [search, setSearch] = useState("");

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

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 22px 26px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 25px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #5BBF9A, #4DA88A);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 22px;
        }

        .title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .subtitle {
          font-size: 14px;
          color: #64748b;
          margin-top: 3px;
        }

        .search {
          width: 320px;
          padding: 11px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
          font-size: 14px;
        }

        .search:focus {
          border-color: #5BBF9A;
          box-shadow: 0 0 0 3px rgba(91,191,154,0.15);
        }

        .tableBox {
          background: white;
          border-radius: 16px;
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
        }

        td {
          padding: 16px 14px;
          border-top: 1px solid #f1f5f9;
          color: #334155;
        }

        tr:hover {
          background: #f8fafc;
        }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            {/* Header */}
            <div className="headerBox">
              <div className="title-section">
                <div className="header-icon">
                  <FaUsers />
                </div>
                <div>
                  <h2 className="title">Buyers</h2>
                  <p className="subtitle">Manage all buyers in the system</p>
                </div>
              </div>

              <input
                type="text"
                className="search"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>Address</th>
                    <th>Product Purchase</th>
                    <th>Price Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1</strong></td>
                    <td>John Doe</td>
                    <td>john@example.com</td>
                    <td>9800000000</td>
                    <td>Kathmandu</td>
                    <td>Smartphone</td>
                    <td><strong>Rs. 25,000</strong></td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buyer;