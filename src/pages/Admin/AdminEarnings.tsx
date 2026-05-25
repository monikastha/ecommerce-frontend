import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaMoneyBillWave } from "react-icons/fa";

const AdminEarnings: React.FC = () => {
  const [search, setSearch] = useState("");

  // SAMPLE DATA
  const earnings = [
    {
      id: "#ORD1001",
      total: 180000,
      commissionRate: 10,
      deliveryCharge: 200,
      emergencyCharge: 500,
    },
    {
      id: "#ORD1002",
      total: 50000,
      commissionRate: 8,
      deliveryCharge: 150,
      emergencyCharge: 0,
    },
  ];

  const data = earnings.map((item) => {
    const commissionAmount = (item.total * item.commissionRate) / 100;
    const earnings =
      commissionAmount + item.deliveryCharge + item.emergencyCharge;

    return {
      ...item,
      commissionAmount,
      earnings,
    };
  });

  const filtered = data.filter((item) =>
    item.id.toLowerCase().includes(search.toLowerCase())
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

        .wrapper{
          display:flex;
          min-height:100vh;
          background:#f8fafc;
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
          background:linear-gradient(135deg,#16a34a,#22c55e);
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
        .search{
          width:240px;
          padding:10px 14px;
          border-radius:10px;
          border:1px solid #d1d5db;
          outline:none;
        }

        .search:focus{
          border-color:#16a34a;
          box-shadow:0 0 0 3px rgba(34,197,94,0.15);
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
          padding:14px;
          text-align:left;
          font-size:13px;
          color:#475569;
        }

        td{
          padding:14px;
          border-top:1px solid #f1f5f9;
          font-size:13px;
          color:#334155;
        }

        tr:hover{
          background:#f9fafb;
        }

        /* BADGE */
        .badge{
          padding:5px 10px;
          border-radius:20px;
          font-size:12px;
          font-weight:600;
        }

        .green{
          background:#dcfce7;
          color:#16a34a;
        }

        /* EARNINGS */
        .earn{
          font-weight:700;
          color:#16a34a;
        }

        .empty{
          text-align:center;
          padding:40px;
          color:#94a3b8;
        }

        @media(max-width:900px){
          .search{
            width:100%;
          }

          .tableBox{
            overflow-x:auto;
          }

          table{
            min-width:900px;
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
                  <FaMoneyBillWave />
                </div>

                <div>
                  <h2 className="title">Admin Earnings</h2>
                  <p className="subtitle">
                    Track commissions, delivery charges & total earnings
                  </p>
                </div>

              </div>

              <input
                type="text"
                className="search"
                placeholder="Search order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            {/* TABLE */}
            <div className="tableBox">

              <table>

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total Amount</th>
                    <th>Commission %</th>
                    <th>Commission Amount</th>
                    <th>Delivery Charge</th>
                    <th>Emergency Charge</th>
                    <th>Total Earnings</th>
                  </tr>
                </thead>

                <tbody>

                  {filtered.length > 0 ? (
                    filtered.map((item, index) => (
                      <tr key={index}>

                        <td>{item.id}</td>

                        <td>Rs. {item.total}</td>

                        <td>
                          <span className="badge green">
                            {item.commissionRate}%
                          </span>
                        </td>

                        <td>Rs. {item.commissionAmount.toFixed(0)}</td>

                        <td>Rs. {item.deliveryCharge}</td>

                        <td>Rs. {item.emergencyCharge}</td>

                        <td className="earn">
                          Rs. {item.earnings.toFixed(0)}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="empty">
                        No earnings data found
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

export default AdminEarnings;