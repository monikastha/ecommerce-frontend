import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const AdminProduct: React.FC = () => {
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
              <h2 className="title">Product Management</h2>
              <p className="subtitle">
                Manage seller products, pricing, and status
              </p>
            </div>

            {/* SEARCH */}
            <div className="actions">
              <div className="searchBox">
                <FontAwesomeIcon icon={faSearch} className="icon" />
                <input
                  type="text"
                  placeholder="Search product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="tableBox">
            <table className="table">
              <thead>
                <tr>
                  <th>Seller ID</th>
                  <th>Seller Name</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={8} className="empty">
                    No product data available
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
          background: #ffffff;
          padding: 18px 22px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          flex-wrap: wrap;
          gap: 10px;
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
          align-items: center;
        }

        .searchBox {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0 10px;
          width: 380px;
          background: #fff;
        }

        .icon {
          color: #9ca3af;
          margin-right: 8px;
        }

        .search {
          border: none;
          outline: none;
          padding: 10px 0;
          width: 100%;
          font-size: 14px;
        }

        .tableBox {
          background: #ffffff;
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

export default AdminProduct;