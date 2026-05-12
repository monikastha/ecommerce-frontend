import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaBoxOpen } from "react-icons/fa";

const AdminProduct: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <>
      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Poppins',sans-serif;
        }

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
          background: #ffffff;
          min-height: 100vh;
        }

        .container {
          padding: 25px;
        }

        /* HEADER */
        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          padding: 20px 22px;
          border-radius: 14px;
          margin-bottom: 18px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          flex-wrap: wrap;
          gap: 15px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg,#2563eb,#3b82f6);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-size: 20px;
        }

        .title {
          font-size: 22px;
          font-weight: 700;
          color:#0f172a;
        }

        .subtitle {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
        }

        .actions {
          display: flex;
          align-items: center;
        }

        /* ✅ CATEGORY STYLE SEARCH BAR */
        .search {
          width: 200px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          font-size: 13px;
          transition: 0.2s;
        }

        .search:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }

        /* TABLE */
        .tableBox {
          background: #fff;
          padding: 15px;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 14px;
          font-size: 13px;
          background: #f8fafc;
          color: #475569;
        }

        td {
          padding: 14px;
          border-top: 1px solid #f1f5f9;
          font-size: 13px;
          color:#334155;
        }

        tr:hover {
          background: #f9fafb;
        }

        .empty {
          text-align: center;
          padding: 35px;
          color: #94a3b8;
          font-size: 13px;
        }

        /* RESPONSIVE */
        @media(max-width:900px){
          .search{
            width:100%;
          }

          .actions{
            width:100%;
          }
        }

      `}</style>

      <div className="wrapper">

        {/* SIDEBAR */}
        <div className="sidebar">
          <AdminSidebar />
        </div>

        {/* MAIN */}
        <div className="main">

          <AdminNavbar />

          <div className="container">

            {/* HEADER */}
            <div className="headerBox">

              <div className="title-section">

                <div className="header-icon">
                  <FaBoxOpen />
                </div>

                <div>
                  <h2 className="title">Product Management</h2>
                  <p className="subtitle">
                    Manage seller products, pricing, and status
                  </p>
                </div>

              </div>

              {/* SEARCH (CATEGORY STYLE) */}
              <div className="actions">

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search"
                />

              </div>

            </div>

            {/* TABLE */}
            <div className="tableBox">

              <table>

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

      </div>
    </>
  );
};

export default AdminProduct;