// AdminNavbar.tsx

import React from "react";

const AdminNavbar = () => {
  return (
    <>
      <style>{`

        .navbar{
          height:70px;
          background:white;
          border-bottom:1px solid #ddd;
          padding:0 25px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .navbar-left h2{
          color:#444;
          font-size:22px;
          margin:0;
        }

        .navbar-left p{
          font-size:13px;
          color:gray;
          margin-top:5px;
        }

        .navbar-right{
          display:flex;
          align-items:center;
          gap:15px;
        }

        .search-box input{
          width:260px;
          padding:10px;
          border:none;
          outline:none;
          background:#f2f2f2;
          border-radius:6px;
        }

        .notification{
          font-size:22px;
          cursor:pointer;
        }

        .profile{
          width:40px;
          height:40px;
          border-radius:50%;
        }

      `}</style>

      <div className="navbar">

        <div className="navbar-left">
          <h2>Good Morning, Admin</h2>
          <p>Dashboard</p>
        </div>

        <div className="navbar-right">

          <div className="search-box">
            <input
              type="text"
              placeholder="Search Product, Order etc."
            />
          </div>

          <div className="notification">
            🔔
          </div>

          <img
            className="profile"
            src="logo.png"
            alt="profile"
          />

        </div>

      </div>
    </>
  );
};

export default AdminNavbar;