import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaEdit, FaTrash, FaPlus, FaUsersCog } from "react-icons/fa";

const AdminStaff: React.FC = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/staff/");
      setStaff(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this staff?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/staff/${id}/`);
      fetchStaff();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FIXED: ASC ORDER (ID 1 TOP → ID 9 BOTTOM)
  const filteredStaff = [...staff]
    .sort((a: any, b: any) => a.id - b.id)
    .filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.username?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.role?.toLowerCase().includes(search.toLowerCase())
    );

  const totalStaff = staff.length;

  const totalAssistant = staff.filter(
    (s) => s.role === "assistant"
  ).length;

  const totalWarehouse = staff.filter(
    (s) => s.role === "warehousestaff"
  ).length;

  return (
    <>
      <style>{`
        .wrapper { display:flex; }

        .sidebar {
          width:260px;
          position:fixed;
          height:100vh;
          background:#1e293b;
        }

        .main {
          margin-left:260px;
          width:100%;
          background:#f5f7fa;
          min-height:100vh;
        }

        .container { padding:30px; }

        .header-icon{
          width:52px;
          height:52px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:14px;
          background:linear-gradient(135deg,#2563eb,#3b82f6);
          color:white;
          font-size:22px;
          box-shadow:0 6px 15px rgba(37,99,235,0.25);
        }

        .header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:25px;
          padding:15px 20px;
          background:white;
          border-radius:12px;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
        }

        .titleBox{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .titleBox h1 {
          font-size:24px;
          font-weight:700;
          margin:0;
          color:#0f172a;
        }

        .titleBox h3 {
          font-size:13px;
          font-weight:400;
          margin:4px 0 0 0;
          color:#64748b;
        }

        .headerRight {
          display:flex;
          align-items:center;
          gap:10px;
        }

        .searchInput {
          padding:10px 12px;
          border:1px solid #d1d5db;
          border-radius:10px;
          outline:none;
          width:220px;
        }

        .addBtn {
          background:linear-gradient(135deg,#16a34a,#22c55e);
          color:white;
          border:none;
          padding:10px 16px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          display:flex;
          align-items:center;
          gap:6px;
        }

        .stats {
          display:flex;
          gap:15px;
          margin-bottom:20px;
        }

        .card {
          flex:1;
          background:white;
          padding:15px;
          border-radius:10px;
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
        }

        .card h3 {
          font-size:14px;
          color:#64748b;
        }

        .card p {
          font-size:22px;
          font-weight:bold;
        }

        table {
          width:100%;
          border-collapse:collapse;
          background:white;
          border-radius:10px;
          overflow:hidden;
        }

        th, td {
          padding:12px;
          color:#475569;
          border-bottom:1px solid #e5e7eb;
          text-align:left;
          font-size:14px;
        }

        th {
          background:#f8fafc;
        }

        .actions{
          display:flex;
          gap:8px;
        }

        .iconBtn{
          width:34px;
          height:34px;
          border:none;
          border-radius:8px;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
        }

        .iconBtn.edit{
          background:#2563eb;
          color:white;
        }

        .iconBtn.delete{
          background:#dc2626;
          color:white;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <AdminSidebar />
        </div>

        <div className="main">
          <AdminNavbar />

          <div className="container">

            {/* HEADER */}
            <div className="header">

              <div>
                <div className="titleBox">
                  <div className="header-icon">
                    <FaUsersCog />
                  </div>
                  <h1>Staff Management</h1>
                </div>
                <h3>Manage all staff, assistants & warehouse team</h3>
              </div>

              <div className="headerRight">
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="searchInput"
                />

                <button
                  className="addBtn"
                  onClick={() => navigate("/admin/staff/add")}
                >
                  <FaPlus /> Add Staff
                </button>
              </div>

            </div>

            {/* STATS */}
            <div className="stats">
              <div className="card">
                <h3>Total Staff</h3>
                <p>{totalStaff}</p>
              </div>

              <div className="card">
                <h3>Assistants</h3>
                <p>{totalAssistant}</p>
              </div>

              <div className="card">
                <h3>Warehouse Staff</h3>
                <p>{totalWarehouse}</p>
              </div>
            </div>

            {/* TABLE */}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.username}</td>
                    <td>{s.password || "N/A"}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td>{s.address}</td>
                    <td>{s.role}</td>

                    <td className="actions">
                      <button
                        className="iconBtn edit"
                        onClick={() =>
                          navigate(`/admin/staff/update/${s.id}`)
                        }
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="iconBtn delete"
                        onClick={() => handleDelete(s.id)}
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
    </>
  );
};

export default AdminStaff;