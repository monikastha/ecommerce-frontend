import React, { useState } from "react";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaSearch } from "react-icons/fa";

const WarehouseStaff: React.FC = () => {
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
              <h2 className="title">Warehouse Staff</h2>
              <p className="subtitle">
                Manage all warehouse staff in the system
              </p>
            </div>

            {/* SEARCH BOX */}
            <div className="searchBox">
              <FaSearch className="searchIcon" />
              <input
                type="text"
                placeholder="Search staff..."
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
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>

            {/* EMPTY STATE */}
            <div className="emptyState">
              No warehouse staff available
            </div>
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

        /* SEARCH BOX */
        .searchBox {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          width: 240px;
        }

        .searchBox input {
          border: none;
          outline: none;
          background: transparent;
          margin-left: 8px;
          width: 100%;
          font-size: 14px;
        }

        .searchIcon {
          color: #6b7280;
          font-size: 14px;
        }

        .tableBox {
          background: #fff;
          padding: 18px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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

        .emptyState {
          padding: 20px;
          text-align: center;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default WarehouseStaff;