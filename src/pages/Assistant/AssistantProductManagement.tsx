import React, { useState } from "react";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const ProductManagement: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial, sans-serif;
        }

        .wrapper{
          display:flex;
          background:#f4f6f9;
          min-height:100vh;
        }

        .main{
          flex:1;
          display:flex;
          flex-direction:column;
        }

        .container{
          padding:25px;
        }

        .headerBox{
          background:white;
          padding:20px;
          border-radius:12px;
          box-shadow:0 2px 8px rgba(0,0,0,0.08);
        }

        .title{
          font-size:28px;
          color:#1e293b;
          margin-bottom:5px;
        }

        .subtitle{
          color:#64748b;
          font-size:15px;
          margin-bottom:25px;
        }

        .topBar{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:15px;
          flex-wrap:wrap;
          margin-bottom:25px;
        }

        .searchBox{
          display:flex;
          align-items:center;
          background:#f1f5f9;
          padding:10px 15px;
          border-radius:8px;
          width:300px;
        }

        .searchBox input{
          border:none;
          outline:none;
          background:transparent;
          width:100%;
          margin-left:10px;
          font-size:14px;
        }

        .buttonGroup{
          display:flex;
          gap:12px;
        }

        .btn{
          border:none;
          padding:11px 18px;
          border-radius:8px;
          cursor:pointer;
          font-size:14px;
          font-weight:bold;
          display:flex;
          align-items:center;
          gap:8px;
          transition:0.3s;
        }

        .categoryBtn{
          background:#2563eb;
          color:white;
        }

        .categoryBtn:hover{
          background:#1d4ed8;
        }

        .subcategoryBtn{
          background:#10b981;
          color:white;
        }

        .subcategoryBtn:hover{
          background:#059669;
        }

        .tableContainer{
          overflow-x:auto;
        }

        table{
          width:100%;
          border-collapse:collapse;
          background:white;
          border-radius:12px;
          overflow:hidden;
          box-shadow:0 2px 8px rgba(0,0,0,0.08);
        }

        thead{
          background:#1e293b;
          color:white;
        }

        th{
          padding:16px;
          text-align:left;
          border-bottom:1px solid #e2e8f0;
        }

        tbody tr{
          height:70px;
        }

        tbody tr:hover{
          background:#f8fafc;
        }

        @media(max-width:768px){
          .topBar{
            flex-direction:column;
            align-items:flex-start;
          }

          .searchBox{
            width:100%;
          }

          .buttonGroup{
            width:100%;
            flex-wrap:wrap;
          }

          .btn{
            width:100%;
            justify-content:center;
          }
        }
      `}</style>

      <div className="wrapper">
        {/* Sidebar */}
        <AssistantSidebar />

        {/* Main */}
        <div className="main">
          <AssistantNavbar />

          <div className="container">
            <div className="headerBox">
              {/* Title */}
              <h2 className="title">Category</h2>

              {/* Subtitle */}
              <p className="subtitle">
                Manage all the category products
              </p>

              {/* Search & Buttons */}
              <div className="topBar">
                {/* Search */}
                <div className="searchBox">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="buttonGroup">
                  <button className="btn categoryBtn">
                    <FontAwesomeIcon icon={faPlus} />
                    Add Category
                  </button>

                  <button className="btn subcategoryBtn">
                    <FontAwesomeIcon icon={faPlus} />
                    Add Subcategory
                  </button>
                </div>
              </div>

              {/* Empty Table */}
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Categories</th>
                      <th>Subcategory</th>
                      <th>Description</th>
                      <th>Image</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductManagement;