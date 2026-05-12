import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import {
  FaPlus,
  FaSearch,
  FaUserShield,
  // FaEdit,
  // FaTrash,
} from "react-icons/fa";

const AdminStaff: React.FC = () => {
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

        /* ACTIONS */
        .actions{
          display:flex;
          gap:12px;
          align-items:center;
        }

        .search-box{
          position:relative;
        }

        .search-icon{
          position:absolute;
          left:12px;
          top:50%;
          transform:translateY(-50%);
          color:#94a3b8;
          font-size:13px;
        }

        .search{
          left:10px;
          width:260px;
          padding:11px 12px 11px 36px;
          border-radius:12px;
          border:1px solid #e2e8f0;
          font-size:13px;
          outline:none;
          background:#f8fafc;
          transition:0.3s;
        }

        .search:focus{
          background:#fff;
          border-color:#2563eb;
          box-shadow:0 0 0 4px rgba(37,99,235,0.1);
        }

        .addBtn{
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          color:white;
          border:none;
          padding:11px 15px;
          border-radius:12px;
          font-size:14px;
          display:flex;
          align-items:center;
          gap:7px;
          cursor:pointer;
          font-weight:600;
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

        .table{
          width:100%;
          border-collapse:collapse;
        }

        .table th{
          font-size:13px;
          padding:15px;
          text-align:left;
          color:#475569;
          background:#f8fafc;
          font-weight:600;
        }

        .table td{
          font-size:13px;
          padding:15px;
          border-top:1px solid #f1f5f9;
          color:#334155;
        }

        .table tr:hover{
          background:#f9fafb;
        }

        /* ROLE */
        .role{
          font-size:12px;
          padding:5px 10px;
          border-radius:20px;
          font-weight:600;
          display:inline-block;
        }

        .admin{
          background:#ede9fe;
          color:#7c3aed;
        }

        .staff{
          background:#dcfce7;
          color:#16a34a;
        }

        /* ACTION BUTTONS */
        .btns{
          display:flex;
          gap:8px;
        }

        .edit, .delete{
          width:34px;
          height:34px;
          border:none;
          border-radius:10px;
          cursor:pointer;
          transition:0.2s;
        }

        .edit{
          background:#dbeafe;
          color:#2563eb;
        }

        .delete{
          background:#fee2e2;
          color:#dc2626;
        }

        .edit:hover, .delete:hover{
          transform:scale(1.1);
        }

        .empty{
          text-align:center;
          padding:40px;
          color:#94a3b8;
          font-size:13px;
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
                  <FaUserShield />
                </div>

                <div>
                  <h2 className="title">Staff Management</h2>
                  <p className="subtitle">
                    Manage staff roles, permissions and access control
                  </p>
                </div>
              </div>

              <div className="actions">
                <div className="search-box">
                  {/* <FaSearch className="search-icon" /> */}
                  <input
                    type="text"
                    className="search"
                    placeholder="Search staff..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button
                  className="addBtn"
                  onClick={() => navigate("/admin/staff/add")}
                >
                  <FaPlus />
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
      </div>
    </>
  );
};

export default AdminStaff;
