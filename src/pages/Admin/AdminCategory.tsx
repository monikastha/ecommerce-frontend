import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminCategory: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <>
      {/* CSS IN SAME FILE */}
      <style>{`
        .wrapper {
          display: flex;
        }

        .sidebar {
          width: 260px;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
        }

        .main {
          flex: 1;
          margin-left: 260px;
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
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          outline: none;
          width: 200px;
        }

        .addBtn {
          background: #2563eb;
          color: #fff;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .subBtn {
          background: #10b981;
          color: #fff;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
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

        .empty {
          text-align: center;
          padding: 30px;
          color: #9ca3af;
        }
      `}</style>

      <div className="wrapper">
        {/* Sidebar */}
        <div className="sidebar">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="main">
          <AdminNavbar />

          <div className="container">

            {/* HEADER */}
            <div className="headerBox">
              <div>
                <h2 className="title">Category Management</h2>
                <p className="subtitle">
                  Manage product categories and subcategories
                </p>
              </div>

              <div className="actions">
                <input
                  type="text"
                  placeholder="Search category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search"
                />

                <button
                  className="addBtn"
                  onClick={() => navigate("/admin/category/add")}
                >
                  + Add Category
                </button>

                <button
                  className="subBtn"
                  onClick={() => navigate("/admin/subcategory/add")}
                >
                  + Add Subcategory
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="tableBox">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Subcategory</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan={6} className="empty">
                      No category data available
                    </td>
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

export default AdminCategory;