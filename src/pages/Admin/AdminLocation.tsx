import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

interface Location {
  id: number;
  name: string;
  province: string;
  city: string;
  status: string;
}

const AdminLocation: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [locations] = useState<Location[]>([
    { id: 1, name: "Bagmati Service Area", province: "Bagmati", city: "Kathmandu", status: "Active" },
    { id: 2, name: "Lumbini Hub", province: "Lumbini", city: "Butwal", status: "Active" },
    { id: 3, name: "Gandaki Zone", province: "Gandaki", city: "Pokhara", status: "Inactive" },
    { id: 4, name: "Koshi Region", province: "Koshi", city: "Biratnagar", status: "Active" },
  ]);

  const filteredData = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.province.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
  );

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
          background:#f4f6f8;
        }

        .wrapper{
          display:flex;
          min-height:100vh;
        }

        .main{
          flex:1;
          display:flex;
          flex-direction:column;
          background:#f4f6f8;
        }

        .container{
          padding:28px;
        }

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
          font-size:18px;
        }

        .title{
          font-size:23px;
          font-weight:700;
          color:#0f172a;
        }

        .subtitle{
          font-size:13px;
          color:#64748b;
        }

        .actions{
          display:flex;
          gap:10px;
          align-items:center;
          flex-wrap:wrap;
        }

        .search{
          width:220px;
          padding:10px 14px;
          border-radius:10px;
          border:1px solid #d1d5db;
          outline:none;
          font-size:13px;
        }

        .addBtn{
          background:linear-gradient(135deg,#16a34a,#22c55e);
          color:#fff;
          border:none;
          padding:10px 14px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          font-size:13px;
        }

        .tableBox{
          background:#fff;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 8px 20px rgba(0,0,0,0.05);
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

        /* ACTION BUTTONS */
        .actionBtn{
          border:none;
          padding:6px 10px;
          border-radius:6px;
          cursor:pointer;
          margin-right:8px;
          color:white;
          transition:0.2s;
        }

        .editBtn{
          background:#2563eb;
        }

        .deleteBtn{
          background:#dc2626;
        }

        .actionBtn:hover{
          transform:translateY(-2px);
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
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h2 className="title">Location Management</h2>
                  <p className="subtitle">Manage provinces, cities and service areas</p>
                </div>

              </div>

              <div className="actions">

                <input
                  className="search"
                  placeholder="Search location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button
                  className="addBtn"
                  onClick={() => navigate("/admin/location/add")}
                >
                  + Add Location
                </button>

              </div>

            </div>

            {/* TABLE */}
            <div className="tableBox">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Location Name</th>
                    <th>Province</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((l) => (
                    <tr key={l.id}>
                      <td>{l.id}</td>
                      <td>{l.name}</td>
                      <td>{l.province}</td>
                      <td>{l.city}</td>
                      <td>{l.status}</td>

                      {/* ✅ ACTIONS ADDED */}
                      <td>
                        <button
                          className="actionBtn editBtn"
                          onClick={() =>
                            navigate(`/admin/location/update/${l.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="actionBtn deleteBtn"
                          onClick={() => alert(`Delete ${l.id}`)}
                        >
                          <FaTrash />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default AdminLocation;