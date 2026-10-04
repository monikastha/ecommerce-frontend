/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import axios from "axios";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WarehouseStaff: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const fetchWarehouseStaff = async () => {
    try {
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

  const filteredStaff = staff
    .filter((s) => s.role === "warehousestaff")
    .filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.username?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / itemsPerPage));
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          background: #f4f6f8;
          min-height: 100vh;
        }

        .main-content {
          margin-left: 250px;
          width: calc(100% - 250px);
          min-height: 100vh;
        }

        .container {
          padding: 20px 30px;
        }

        .headerBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 18px 24px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
        }

        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }

        .searchBox {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 14px;
          width: 260px;
        }

        .searchBox input {
          border: none;
          outline: none;
          background: transparent;
          margin-left: 10px;
          width: 100%;
          font-size: 15px;
        }

        .searchIcon {
          color: #6b7280;
        }

        .tableBox {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 15px 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .table th {
          background: #f9fafb;
          font-weight: 500;
          color: #374151;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .iconBtn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .iconBtn.edit {
          background: #3b82f6;
          color: white;
        }

        .iconBtn.delete {
          background: #ef4444;
          color: white;
        }

        .iconBtn:hover {
          transform: scale(1.05);
        }

        .emptyState {
          padding: 40px;
          text-align: center;
          color: #6b7280;
          font-size: 15px;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding-top: 14px;
        }

        .pagination-info {
          color: #64748b;
          font-size: 11px;
        }

        .pagination-actions {
          display: flex;
          gap: 10px;
        }

        .pagination button {
          padding: 6px 12px;
          border: none;
          border-radius: 0;
          background: #1598ad;
          color: white;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .pagination button:disabled {
          background: #cbd5e1;
          color: #64748b;
          cursor: not-allowed;
        }
      `}</style>

      <div className="dashboard-container">
        <AssistantSidebar />

        <div className="main-content">
          <AssistantNavbar />

          <div className="container">
            <div className="headerBox">
              <div>
                <h2 className="title">Warehouse Staff</h2>
                <p className="subtitle">Manage all warehouse staff in the system</p>
              </div>

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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStaff.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.name}</td>
                      <td>{s.username}</td>
                      <td>{s.email}</td>
                      <td>{s.phone || "N/A"}</td>
                      <td>{s.address || "N/A"}</td>
                      <td className="actions">
                        <button
                          className="iconBtn edit"
                          onClick={() => navigate(`/assistant/warehouse/staff/update/${s.id}`)}
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

              {filteredStaff.length === 0 && (
                <div className="emptyState">No warehouse staff available</div>
              )}
              {filteredStaff.length > 0 && (
                <div className="pagination">
                  <span className="pagination-info">Showing page {currentPage} out of {totalPages} pages</span>
                  <div className="pagination-actions">
                    <button type="button" onClick={() => setCurrentPage((page) => page - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <button type="button" onClick={() => setCurrentPage((page) => page + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WarehouseStaff;
