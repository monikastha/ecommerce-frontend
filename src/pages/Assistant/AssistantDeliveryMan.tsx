import React, { useState } from "react";
import AssistantSidebar from "./AssistantSidebar";
import AssistantNavbar from "./AssistantNavbar";
import { FaSearch } from "react-icons/fa";

const DeliveryMan: React.FC = () => {
  const [search, setSearch] = useState("");

  const deliveryData = [
    {
      id: 1,
      name: "Ram Shrestha",
      email: "ram@example.com",
      phone: "9812345678",
      address: "Kathmandu",
      status: "Active",
    },
    {
      id: 2,
      name: "Sita Rai",
      email: "sita@example.com",
      phone: "9801122334",
      address: "Lalitpur",
      status: "Inactive",
    },
  ];

  return (
    <div className="wrapper">
      <AssistantSidebar />

      <div className="main">
        <AssistantNavbar />

        <div className="container">

          {/* HEADER */}
          <div className="headerBox">
            <div>
              <h2 className="title">Delivery Man</h2>
              <p className="subtitle">
                Manage all delivery personnel in the system
              </p>
            </div>

            {/* SEARCH BOX */}
            <div className="searchBox">
              <FaSearch className="searchIcon" />
              <input
                type="text"
                placeholder="Search delivery man..."
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
                  <th>Email</th>
                  <th>Phone No</th>
                  <th>Address</th>

                  {/* NEW DETAIL COLUMN */}
                  <th>Status (Detail)</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {deliveryData
                  .filter((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>

                      {/* DETAIL COLUMN */}
                      <td>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            background:
                              item.status === "Active" ? "#dcfce7" : "#fee2e2",
                            color:
                              item.status === "Active" ? "#166534" : "#991b1b",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTION COLUMN */}
                      <td>
                        <button
                          style={{
                            background: "red",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                          onClick={() => alert(`Update ${item.name}`)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}

                {deliveryData.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#6b7280",
                      }}
                    >
                      No delivery man available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

        .searchBox {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          width: 240px;
        }

        .searchIcon {
          color: #6b7280;
          margin-right: 8px;
          font-size: 14px;
        }

        .searchBox input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          width: 100%;
        }

        .tableBox {
          background: #fff;
          padding: 18px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          background: #f9fafb;
          text-align: left;
          padding: 14px;
          font-size: 14px;
          color: #374151;
        }

        .table td {
          padding: 14px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #4b5563;
        }

        .table tr:hover {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default DeliveryMan;