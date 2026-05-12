import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AdminStaff: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div className="wrapper">
      <AdminSidebar />

      <div className="main">
        <AdminNavbar />

        <div className="container">
          {/* HEADER */}
          <div className="headerBox">
            <div>
              <h2 className="title">Staff Management</h2>
              <p className="subtitle">
                Manage staff members, roles, and access control
              </p>
            </div>

            <div className="actions">
              <input
                type="text"
                placeholder="Search staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />

              <button
                className="addBtn"
                onClick={() => navigate("/admin/staff/add")}
              >
                <FontAwesomeIcon icon={faPlus} className="icon" />
                Add Staff
              </button>
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
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={8} className="empty">
                    No staff data available
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
          font-size: 20px;
          font-weight: 600;
        }

        .subtitle {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .search {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          outline: none;
          width: 200px;
        }

        .addBtn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border: none;
          padding: 9px 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          font-weight: 500;
          gap: 6px;
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

        .icon {
          margin-right: 6px;
        }
      `}</style>
    </div>
  );
};

export default AdminStaff;