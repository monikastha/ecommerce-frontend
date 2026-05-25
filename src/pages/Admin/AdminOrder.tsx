import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaShoppingBag } from "react-icons/fa";

const AdminOrder: React.FC = () => {
  const [search, setSearch] = useState("");

  // SAMPLE DATA
  const orders = [
    {
      id: "#ORD1001",
      customer: "Ram Sharma",
      product: "iPhone 15 Pro",
      delivery: "Emergency",
      payment: "COD",
      status: "Pending",
    },
    {
      id: "#ORD1002",
      customer: "Sita Karki",
      product: "Samsung TV",
      delivery: "Normal",
      payment: "Online",
      status: "Pending",
    },
  ];

  const filteredOrders = orders.filter(
    (item) =>
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase())
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
          background:#f8fafc;
        }

        .wrapper{
          display:flex;
          min-height:100vh;
        }

        .main{
          flex:1;
          display:flex;
          flex-direction:column;
          background:#f8fafc;
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
          box-shadow:0 8px 20px rgba(0,0,0,0.05);
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

        /* SEARCH */
        .actions{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .search{
          width:240px;
          padding:10px 14px;
          border-radius:10px;
          border:1px solid #d1d5db;
          outline:none;
          font-size:13px;
        }

        .search:focus{
          border-color:#2563eb;
          box-shadow:0 0 0 3px rgba(37,99,235,0.15);
        }

        /* TABLE */
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
          background:#f8fafc;
          padding:15px;
          text-align:left;
          font-size:13px;
          color:#475569;
          font-weight:600;
        }

        td{
          padding:15px;
          border-top:1px solid #f1f5f9;
          font-size:13px;
          color:#334155;
        }

        tr:hover{
          background:#f9fafb;
        }

        /* DELIVERY BADGE */
        .delivery{
          padding:6px 10px;
          border-radius:20px;
          font-size:12px;
          font-weight:600;
        }

        .emergency{
          background:#fee2e2;
          color:#dc2626;
        }

        .normal{
          background:#dcfce7;
          color:#16a34a;
        }

        /* ACTION BUTTONS */
        .actionBtns{
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        }

        .btn{
          border:none;
          padding:7px 12px;
          border-radius:8px;
          font-size:12px;
          cursor:pointer;
          font-weight:600;
        }

        .assign{
          background:#2563eb;
          color:#fff;
        }

        .process{
          background:#16a34a;
          color:#fff;
        }

        .cancel{
          background:#dc2626;
          color:#fff;
        }

        .empty{
          text-align:center;
          padding:40px;
          color:#94a3b8;
          font-size:13px;
        }

        @media(max-width:1000px){

          .tableBox{
            overflow-x:auto;
          }

          table{
            min-width:1000px;
          }

          .search{
            width:100%;
          }

          .actions{
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
                  <FaShoppingBag />
                </div>

                <div>
                  <h2 className="title">Order Management</h2>
                  <p className="subtitle">
                    Manage customer orders and delivery process
                  </p>
                </div>

              </div>

              <div className="actions">

                <input
                  type="text"
                  placeholder="Search orders..."
                  className="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

            </div>

            {/* TABLE */}
            <div className="tableBox">

              <table>

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Product Name</th>
                    <th>Delivery Type</th>
                    <th>Payment Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr key={index}>

                        <td>{order.id}</td>

                        <td>{order.customer}</td>

                        <td>{order.product}</td>

                        <td>
                          <span
                            className={`delivery ${
                              order.delivery === "Emergency"
                                ? "emergency"
                                : "normal"
                            }`}
                          >
                            {order.delivery}
                          </span>
                        </td>

                        <td>{order.payment}</td>

                        <td>
                          <div className="actionBtns">

                            <button className="btn assign">
                              Assign
                            </button>

                            <button className="btn process">
                              Process
                            </button>

                            <button className="btn cancel">
                              Cancel
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="empty">
                        No order data available
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default AdminOrder;
