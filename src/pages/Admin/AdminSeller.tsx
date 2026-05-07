import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminSeller: React.FC = () => {
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
              <h2 className="title">Seller Management</h2>
              <p className="subtitle">
                Manage sellers and verification documents
              </p>
            </div>

            {/* BIG SEARCH ONLY */}
            <div className="actions">
              <input
                className="searchBig"
                placeholder="Search sellers by name, email, phone..."
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
                  <th>Email</th>
                  <th>Phone No</th>
                  <th>Address</th>
                  <th>Username</th>
                  <th>Citizenship ID</th>
                  <th>Business Certificate</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={9} className="empty">
                    No seller data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* STYLES */}
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

        /* BIG SEARCH */
        .actions {
          width: 50%;
          display: flex;
          justify-content: flex-end;
        }

        .searchBig {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 15px;
          transition: 0.3s;
        }

        .searchBig:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.15);
        }

        .tableBox {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow-x: auto;
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
          font-size: 13px;
        }

        .table td {
          padding: 12px;
          border-top: 1px solid #eee;
          font-size: 13px;
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

export default AdminSeller;