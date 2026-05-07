import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLocation: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div className="wrapper">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <div className="main">
        <AdminNavbar />

        <div className="container">
          {/* HEADER */}
          <div className="headerBox">
            <div>
              <h2 className="title">Location Management</h2>
              <p className="subtitle">
                Manage service locations (Province, City, Status)
              </p>
            </div>

            <div className="actions">
              <input
                type="text"
                placeholder="Search location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />

              <button
                className="addBtn"
                onClick={() => navigate("/admin/location/add")}
              >
                + Add Location
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="tableBox">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Location Name</th>
                  <th>Province</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={6} className="empty">
                    No location data available
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
          margin-left: 0px;
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
        }

        .subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          color: #6b7280;
        }

        .actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .search {
          width: 250px;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          outline: none;
        }

        .addBtn {
          background: #2563eb;
          color: #fff;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .tableBox {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .table th {
          background: #f9fafb;
          text-align: left;
          padding: 12px;
        }

        .table td {
          padding: 12px;
          border-top: 1px solid #eee;
        }

        .empty {
          text-align: center;
          padding: 30px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default AdminLocation;