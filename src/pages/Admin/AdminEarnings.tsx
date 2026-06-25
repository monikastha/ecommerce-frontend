import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaMoneyBillWave, FaSave } from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const moneyText = (amount: number) => `Rs. ${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const percentText = (rate: number) => `${rate.toLocaleString("en-IN", { maximumFractionDigits: 2 })}%`;

interface Order {
  id: number;
  order_number: string;
  total: number;
  delivery_fee: number;
  delivery_type: "normal" | "emergency";
  commission_rate?: number | string;
  status: string;
}

interface CommissionSettings {
  commission_rate: number | string;
  normal_delivery_charge: number | string;
  emergency_delivery_charge: number | string;
}

interface EarningData {
  id: string;
  total: number;
  commissionRate: number;
  commissionAmount: number;
  deliveryCharge: number;
  emergencyCharge: number;
  earnings: number;
}

const AdminEarnings: React.FC = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<CommissionSettings>({
    commission_rate: 10,
    normal_delivery_charge: 200,
    emergency_delivery_charge: 500,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const commissionRate = Number(settings.commission_rate || 0);

  // Fetch commission settings
  const fetchCommissionSettings = async () => {
    try {
      const response = await axios.get(`${API_ORIGIN}/api/earnings/commission/current/`);
      setSettings(response.data);
    } catch (err) {
      console.error("Failed to fetch commission settings:", err);
      // Use default settings if API fails
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ORIGIN}/api/orders/`);
      setOrders(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load earnings data");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionSettings();
    fetchOrders();
  }, []);

  const handleCommissionRateChange = (value: string) => {
    setSaveMessage("");
    setSettings((current) => ({
      ...current,
      commission_rate: value,
    }));
  };

  const saveCommissionSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaveMessage("");

    const nextCommissionRate = Number(settings.commission_rate);

    if (Number.isNaN(nextCommissionRate)) {
      setSaveMessage("Please enter valid numbers.");
      return;
    }

    if (nextCommissionRate < 0 || nextCommissionRate > 100) {
      setSaveMessage("Commission rate must be between 0 and 100.");
      return;
    }

    try {
      setSaving(true);
      const response = await axios.post(`${API_ORIGIN}/api/earnings/commission/update_settings/`, {
        commission_rate: nextCommissionRate,
      });
      setSettings(response.data.data);
      setSaveMessage("Commission settings updated successfully.");
    } catch (err) {
      console.error("Failed to update commission settings:", err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          err.response?.data?.commission_rate?.[0] ||
          err.response?.data?.detail ||
          "Failed to update commission settings."
        : "Failed to update commission settings.";
      setSaveMessage(message);
    } finally {
      setSaving(false);
    }
  };

  // Calculate earnings for each order
  const data: EarningData[] = orders.map((order) => {
    const orderTotal = Number(order.total || 0);
    const commissionRate = Number(order.commission_rate ?? settings.commission_rate ?? 0);
    const normalDeliveryCharge = Number(settings.normal_delivery_charge || 0);
    const emergencyDeliveryCharge = Number(settings.emergency_delivery_charge || 0);
    const commissionAmount = (orderTotal * commissionRate) / 100;
    const deliveryCharge = normalDeliveryCharge;
    const emergencyCharge = order.delivery_type === "emergency" ? emergencyDeliveryCharge : 0;
    const totalEarnings = commissionAmount + deliveryCharge + emergencyCharge;

    return {
      id: order.order_number,
      total: orderTotal,
      commissionRate,
      commissionAmount,
      deliveryCharge,
      emergencyCharge,
      earnings: totalEarnings,
    };
  });

  const filtered = data.filter((item) =>
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate totals
  const totalOrderAmount = data.reduce((sum, item) => sum + item.total, 0);
  const totalCommission = data.reduce((sum, item) => sum + item.commissionAmount, 0);
  const totalDeliveryCharges = data.reduce((sum, item) => sum + item.deliveryCharge, 0);
  const totalEmergencyCharges = data.reduce((sum, item) => sum + item.emergencyCharge, 0);
  const totalEarnings = data.reduce((sum, item) => sum + item.earnings, 0);

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

        .summaryGrid{
          display:grid;
          grid-template-columns:repeat(6,minmax(140px,1fr));
          gap:14px;
          margin-bottom:22px;
        }

        .summaryCard{
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:8px;
          padding:16px;
          box-shadow:0 6px 16px rgba(15,23,42,0.05);
        }

        .summaryCard span{
          display:block;
          color:#64748b;
          font-size:12px;
          font-weight:600;
          margin-bottom:8px;
        }

        .summaryCard strong{
          color:#0f172a;
          font-size:18px;
        }

        .summaryCard.highlight strong{
          color:#16a34a;
        }

        .settingsBox{
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:8px;
          padding:18px;
          box-shadow:0 6px 16px rgba(15,23,42,0.05);
          margin-bottom:22px;
        }

        .settingsTitle{
          font-size:16px;
          color:#0f172a;
          margin-bottom:14px;
        }

        .settingsForm{
          display:grid;
          grid-template-columns:minmax(180px,320px) auto;
          gap:14px;
          align-items:end;
        }

        .fieldGroup label{
          display:block;
          color:#475569;
          font-size:12px;
          font-weight:700;
          margin-bottom:6px;
        }

        .fieldGroup input{
          width:100%;
          padding:10px 12px;
          border:1px solid #d1d5db;
          border-radius:8px;
          outline:none;
          font-size:14px;
        }

        .fieldGroup input:focus{
          border-color:#16a34a;
          box-shadow:0 0 0 3px rgba(34,197,94,0.15);
        }

        .saveButton{
          height:40px;
          border:none;
          border-radius:8px;
          background:#16a34a;
          color:#fff;
          font-weight:700;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
        }

        .saveButton:disabled{
          background:#86efac;
          cursor:not-allowed;
        }

        .saveMessage{
          margin-top:12px;
          color:#475569;
          font-size:13px;
          font-weight:600;
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

        .error{
          color:#dc2626;
        }

        @media(max-width:900px){
          .search{
            width:100%;
          }

          .summaryGrid{
            grid-template-columns:1fr 1fr;
          }

          .settingsForm{
            grid-template-columns:1fr;
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

            <div className="summaryGrid">
              <div className="summaryCard">
                <span>Total Orders</span>
                <strong>{data.length}</strong>
              </div>
              <div className="summaryCard highlight">
                <span>Commission Rate</span>
                <strong>{percentText(commissionRate)}</strong>
              </div>
              <div className="summaryCard">
                <span>Order Amount</span>
                <strong>{moneyText(totalOrderAmount)}</strong>
              </div>
              <div className="summaryCard">
                <span>Commission</span>
                <strong>{moneyText(totalCommission)}</strong>
              </div>
              <div className="summaryCard">
                <span>Delivery Charges</span>
                <strong>{moneyText(totalDeliveryCharges + totalEmergencyCharges)}</strong>
              </div>
              <div className="summaryCard highlight">
                <span>Total Earnings</span>
                <strong>{moneyText(totalEarnings)}</strong>
              </div>
            </div>

            <div className="settingsBox">
              <h3 className="settingsTitle">Earnings Settings</h3>
              <form className="settingsForm" onSubmit={saveCommissionSettings}>
                <div className="fieldGroup">
                  <label>Commission Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={settings.commission_rate}
                    onChange={(e) => handleCommissionRateChange(e.target.value)}
                  />
                </div>
                <button type="submit" className="saveButton" disabled={saving}>
                  <FaSave />
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </form>
              {saveMessage && <p className="saveMessage">{saveMessage}</p>}
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

                  {loading ? (
                    <tr>
                      <td colSpan={7} className="empty">
                        Loading earnings data...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="empty error">
                        {error}
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((item, index) => (
                      <tr key={index}>

                        <td>{item.id}</td>

                        <td>{moneyText(item.total)}</td>

                        <td>
                          <span className="badge green">
                            {percentText(item.commissionRate)}
                          </span>
                        </td>

                        <td>{moneyText(item.commissionAmount)}</td>

                        <td>{moneyText(item.deliveryCharge)}</td>

                        <td>{moneyText(item.emergencyCharge)}</td>

                        <td className="earn">
                          {moneyText(item.earnings)}
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
