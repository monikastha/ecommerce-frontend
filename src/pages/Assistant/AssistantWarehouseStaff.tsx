import React, { useEffect, useState } from "react";
import axios from "axios";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaSearch } from "react-icons/fa";

const WarehouseStaff: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchWarehouseStaff = async () => {
    try {
      // Axios request to your Django backend
      const res = await axios.get("http://127.0.0.1:8000/api/staff/");
      setStaff(res.data);
    } catch (err) {
      console.error("Error fetching staff records:", err);
    }
  };

  useEffect(() => {
    fetchWarehouseStaff();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this warehouse staff record?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/staff/${id}/`);
      fetchWarehouseStaff();
    } catch (err) {
      console.error("Error deleting staff record:", err);
    }
  };

  // Filter backend response for role 'warehousestaff' and process search match
  const filteredStaff = staff
    .filter((s) => s.role === "warehousestaff")
    .filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.username?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  return (
    <div className="wrapper">
      <AssistantSidebar />

      <div className="main">
        <AssistantNavbar />

        <div className="container">
          {/* HEADER */}
          <div className="headerBox">
            <div>
              <h2 className="title">Warehouse Staff</h2>
              <p className="subtitle">
                Manage all warehouse staff in the system
              </p>
            </div>

            {/* SEARCH BOX */}
            <div className="searchBox">
              <FaSearch className="searchIcon" />
              <input
                type="text"
                placeholder="Search staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
          
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.username}</td>
                    <td>{s.email}</td>
                    <td>{s.phone || "N/A"}</td>
                    <td>{s.address || "N/A"}</td>
                    <td>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* EMPTY STATE */}
            {filteredStaff.length === 0 && (
              <div className="emptyState">
                No warehouse staff available
              </div>
            )}
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
          background: #fff;
          padding: 18px 22px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .title {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          color: #111827;
        }

        .subtitle {
          margin-top: 4px;
          font-size: 13px;
          color: #6b7280;
        }

        /* SEARCH BOX */
        .searchBox {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          width: 240px;
        }

        .searchBox input {
          border: none;
          outline: none;
          background: transparent;
          margin-left: 8px;
          width: 100%;
          font-size: 14px;
        }

        .searchIcon {
          color: #6b7280;
          font-size: 14px;
        }

        .tableBox {
          background: #fff;
          padding: 18px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th, .table td {
          padding: 14px;
          font-size: 14px;
          text-align: left;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .table th {
          background: #f9fafb;
          color: #374151;
          font-weight: 600;
        }

        .iconBtn {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .iconBtn.delete {
          background: #dc2626;
          color: white;
        }

        .emptyState {
          padding: 20px;
          text-align: center;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default WarehouseStaff;