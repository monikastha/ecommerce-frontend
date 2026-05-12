import React, { useState } from "react";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaSearch } from "react-icons/fa";

const Seller: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="wrapper">
      <AssistantSidebar />

      <div className="main">
        <AssistantNavbar />

        <div className="container">

          {/* HEADER */}
          <div className="headerBox">
            <div>
              <h2 className="title">Sellers</h2>
              <p className="subtitle">
                Manage all sellers in the system
              </p>
            </div>

            {/* SEARCH BOX WITH ICON */}
            <div className="searchBox">
              <FaSearch className="searchIcon" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="tableBox">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone No</th>
                  <th>Address</th>
                  <th>Citizenship ID</th>
                  <th>Business Register Certificate</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
                    No sellers available
                  </td>
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
          display: flex;
          flex-direction: column;
          background: #f4f6f8;
          min-height: 100vh;
        }

        .container {
          padding: 20px;
        }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          padding: 18px 22px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .title {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          color: #111827;
        }

        .subtitle {
          margin-top: 4px;
          font-size: 13px;
          color: #6b7280;
        }

        /* SEARCH BOX WITH ICON */
        .searchBox {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          width: 240px;
        }

        .searchIcon {
          color: #6b7280;
          margin-right: 8px;
          font-size: 14px;
        }

        .searchBox input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          width: 100%;
        }

        .searchBox input:focus {
          outline: none;
        }

        .tableBox {
          background: #fff;
          padding: 18px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          background: #f9fafb;
          text-align: left;
          padding: 14px;
          font-size: 14px;
          color: #374151;
        }

        .table td {
          padding: 14px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #4b5563;
        }

        .table tr:hover {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default Seller;