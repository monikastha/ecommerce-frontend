import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminPromotion: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  return (
    <div className="wrapper">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="main">
        <AdminNavbar />

        <div className="container">

          {/* HEADER */}
          <div className="headerBox">
            <div>
              <h2 className="title">Promotion Management</h2>

              <p className="subtitle">
                Manage discounts, promotional offers and campaigns
              </p>
            </div>

            <div className="actions">

              <input
                type="text"
                placeholder="Search promotion..."
                className="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="addBtn"
                onClick={() => navigate("/admin/promotion/add")}
              >
                + Add Promotion
              </button>

            </div>
          </div>

          {/* TABLE */}
          <div className="tableBox">

            <table className="table">

              <thead>
                <tr>
                  <th>Promotion Name</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Applies To</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={7} className="empty">
                    No promotion data available
                  </td>
                </tr>
              </tbody>

            </table>

          </div>

        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .wrapper{
          display:flex;
        }

        .main{
          flex:1;
          margin-left:0px;
          background:#f4f6f8;
          min-height:100vh;
        }

        .container{
          padding:20px;
        }

        /* HEADER */
        .headerBox{
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:#fff;
          padding:18px 22px;
          border-radius:12px;
          margin-bottom:16px;
          box-shadow:0 2px 10px rgba(0,0,0,0.05);
        }

        .title{
          margin:0;
          font-size:22px;
          font-weight:600;
        }

        .subtitle{
          margin-top:4px;
          font-size:13px;
          color:#6b7280;
        }

        .actions{
          display:flex;
          gap:10px;
          align-items:center;
        }

        .search{
          width:260px;
          padding:10px 14px;
          border:1px solid #d1d5db;
          border-radius:8px;
          outline:none;
        }

        .search:focus{
          border-color:#4f46e5;
        }

        .addBtn{
          background:#4f46e5;
          color:white;
          border:none;
          padding:10px 16px;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        }

        .addBtn:hover{
          background:#4338ca;
        }

        /* TABLE */
        .tableBox{
          background:#fff;
          padding:15px;
          border-radius:12px;
          box-shadow:0 2px 10px rgba(0,0,0,0.05);
          overflow-x:auto;
        }

        .table{
          width:100%;
          border-collapse:collapse;
        }

        .table th{
          background:#f9fafb;
          text-align:left;
          padding:14px;
          font-size:13px;
        }

        .table td{
          padding:14px;
          border-top:1px solid #eee;
          font-size:13px;
        }

        .empty{
          text-align:center;
          padding:35px;
          color:#9ca3af;
        }
      `}</style>
    </div>
  );
};

export default AdminPromotion;