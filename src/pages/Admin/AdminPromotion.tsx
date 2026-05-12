import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaGift } from "react-icons/fa";

const AdminPromotion: React.FC = () => {
  const navigate = useNavigate();
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

        body{
          background:#ffffff;
        }

        .wrapper{
          display:flex;
          min-height:100vh;
        }

        .main{
          flex:1;
          display:flex;
          flex-direction:column;
          background:#ffffff;
        }

        .container{
          padding:28px;
        }

        /* HEADER */
        .headerBox{
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:#fff;
          padding:22px;
          border-radius:16px;
          box-shadow:0 8px 20px rgba(0,0,0,0.06);
          margin-bottom:22px;
          flex-wrap:wrap;
          gap:15px;
          border:1px solid #f1f5f9;
        }

        .title-section{
          display:flex;
          align-items:center;
          gap:14px;
        }

        .header-icon{
          width:52px;
          height:52px;
          background:linear-gradient(135deg,#2563eb,#3b82f6);
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:14px;
          font-size:20px;
        }

        .title{
          font-size:23px;
          font-weight:700;
          color:#0f172a;
        }

        .subtitle{
          font-size:13px;
          color:#64748b;
          margin-top:3px;
        }

        /* ACTIONS */
        .actions{
          display:flex;
          gap:10px;
          align-items:center;
        }

        /* ✅ CATEGORY STYLE SEARCH BAR */
        .search{
          width:200px;
          padding:10px 14px;
          border-radius:10px;
          border:1px solid #d1d5db;
          outline:none;
          font-size:13px;
          transition:0.2s;
        }

        .search:focus{
          border-color:#2563eb;
          box-shadow:0 0 0 3px rgba(37,99,235,0.15);
        }

        /* BUTTON */
        .addBtn{
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          color:#fff;
          border:none;
          padding:10px 14px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          font-size:13px;
        }

        .addBtn:hover{
          transform:translateY(-2px);
        }

        /* TABLE */
        .tableBox{
          background:#fff;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 8px 20px rgba(0,0,0,0.05);
          border:1px solid #f1f5f9;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        th{
          font-size:13px;
          padding:15px;
          text-align:left;
          color:#475569;
          background:#f8fafc;
          font-weight:600;
        }

        td{
          font-size:13px;
          padding:15px;
          border-top:1px solid #f1f5f9;
          color:#334155;
        }

        tr:hover{
          background:#f9fafb;
        }

        .empty{
          text-align:center;
          padding:40px;
          color:#94a3b8;
          font-size:13px;
        }

        /* RESPONSIVE */
        @media(max-width:900px){
          .actions{
            width:100%;
          }

          .search{
            width:100%;
          }
        }

      `}</style>

      <div className="wrapper">

        <AdminSidebar />

        <div className="main">

          <AdminNavbar />

          <div className="container">

            {/* HEADER */}
            <div className="headerBox">

              <div className="title-section">

                <div className="header-icon">
                  <FaGift />
                </div>

                <div>
                  <h2 className="title">Promotion Management</h2>
                  <p className="subtitle">
                    Manage discounts, offers and campaigns
                  </p>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="actions">

                {/* ✅ CATEGORY STYLE SEARCH */}
                <input
                  type="text"
                  placeholder="Search promotion..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search"
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

              <table>

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

      </div>
    </>
  );
};

export default AdminPromotion;