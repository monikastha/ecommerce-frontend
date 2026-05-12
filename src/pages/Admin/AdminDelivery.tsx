import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaSearch, FaTruck } from "react-icons/fa";

const AdminDelivery: React.FC = () => {
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
          background:#f1f5f9;
        }

        .wrapper{
          display:flex;
          min-height:100vh;
        }

        .main{
          flex:1;
          display:flex;
          flex-direction:column;
        }

        .container{
          padding:28px;
        }

        /* HEADER */
        .headerBox{
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:#ffffff;
          padding:22px;
          border-radius:16px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
          margin-bottom:22px;
          flex-wrap:wrap;
          gap:15px;
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
          box-shadow:0 6px 15px rgba(37,99,235,0.25);
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

        /* CATEGORY-STYLE SEARCH (FIXED DESIGN) */
        .search-box{
          display:flex;
          align-items:center;
          gap:10px;
          background:#f8fafc;
          padding:10px 14px;
          border-radius:12px;
          border:1px solid #e2e8f0;
          width:280px;
          transition:0.3s;
        }

        .search-box:focus-within{
          border-color:#2563eb;
          box-shadow:0 0 0 4px rgba(37,99,235,0.1);
          background:#fff;
        }

        .search-box svg{
          color:#94a3b8;
          font-size:14px;
        }

        .search{
          border:none;
          outline:none;
          background:transparent;
          width:100%;
          font-size:13px;
        }

        /* BUTTON */
        .addBtn{
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          color:white;
          border:none;
          padding:10px 14px;
          border-radius:12px;
          cursor:pointer;
          font-weight:600;
          font-size:13px;
          transition:0.2s;
        }

        .addBtn:hover{
          transform:translateY(-2px);
          box-shadow:0 10px 20px rgba(37,99,235,0.25);
        }

        /* TABLE */
        .tableBox{
          background:#fff;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 10px 25px rgba(0,0,0,0.05);
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

        @media(max-width:900px){
          .search-box{
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
                  <FaTruck />
                </div>

                <div>
                  <h2 className="title">Delivery Management</h2>
                  <p className="subtitle">
                    Manage delivery staff and assignments
                  </p>
                </div>
              </div>

              {/* SEARCH + BUTTON */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap:"wrap" }}>

                <div className="search-box">
                  <FaSearch />
                  <input
                    className="search"
                    placeholder="Search delivery staff..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button
                  className="addBtn"
                  onClick={() => navigate("/admin/delivery/add")}
                >
                  + Add Delivery
                </button>

              </div>

            </div>

            {/* TABLE */}
            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan={6} className="empty">
                      No delivery data available
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

export default AdminDelivery;