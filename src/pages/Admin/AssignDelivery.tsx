import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSearch,
  FaTruck,
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Deliveryman = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  profile_image?: string | null;
};

type OrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  price: string | number;
  subtotal: string | number;
};

type OrderRecord = {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  delivery_type: string;
  delivery_location_name?: string;
  delivery_fee: string | number;
  total: string | number;
  status: string;
  assigned_deliveryman?: number | null;
  assigned_deliveryman_detail?: Deliveryman | null;
  items: OrderItem[];
};

const currency = (value?: string | number) =>
  `Rs. ${Number(value || 0).toLocaleString()}`;

const canAssignDelivery = (status?: string) => ["confirmed", "processing"].includes(status || "");

const imageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

const AssignDelivery: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [deliverymen, setDeliverymen] = useState<Deliveryman[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (!orderId) {
        const ordersRes = await fetch(`${API_ORIGIN}/api/orders/`);
        const ordersData = await ordersRes.json();
        if (!ordersRes.ok) throw new Error(ordersData.error || "Failed to load orders");
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setOrder(null);
        setDeliverymen([]);
        return;
      }

      const [orderRes, deliveryRes] = await Promise.all([
        fetch(`${API_ORIGIN}/api/orders/${orderId}/`),
        fetch(`${API_ORIGIN}/api/deliveryman/delivery/`),
      ]);
      const orderData = await orderRes.json();
      const deliveryData = await deliveryRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || "Failed to load order");
      if (!deliveryRes.ok) throw new Error(deliveryData.error || "Failed to load deliverymen");

      setOrder(orderData);
      setDeliverymen(Array.isArray(deliveryData) ? deliveryData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assign delivery page");
      setOrder(null);
      setDeliverymen([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orderId]);

  const filteredDeliverymen = useMemo(() => {
    const baseDeliverymen = order?.assigned_deliveryman
      ? deliverymen.filter((person) => person.id === order.assigned_deliveryman)
      : deliverymen;
    const query = search.trim().toLowerCase();
    if (!query) return baseDeliverymen;
    return baseDeliverymen.filter((person) =>
      [person.name, person.username, person.email, person.phone, person.address]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [deliverymen, order?.assigned_deliveryman, search]);

  const productSummary = order?.items?.length
    ? order.items.map((item) => `${item.product_name} x${item.quantity}`).join(", ")
    : "No products";

  const assignedOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders
      .filter((item) => item.assigned_deliveryman || item.assigned_deliveryman_detail)
      .filter((item) => {
        if (!query) return true;
        return [
          item.order_number,
          item.customer_name,
          item.phone,
          item.address,
          item.city,
          item.assigned_deliveryman_detail?.name,
          item.status,
        ].join(" ").toLowerCase().includes(query);
      });
  }, [orders, search]);

  const assignDeliveryman = async (deliverymanId: number) => {
    if (!order) return;
    setAssigningId(deliverymanId);
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/${order.id}/assign-deliveryman/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryman_id: deliverymanId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign deliveryman");
      setOrder(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign deliveryman");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif;}
        .wrapper{display:flex;min-height:100vh;background:#f8fafc;}
        .main{flex:1;display:flex;flex-direction:column;}
        .container{padding:28px;}
        .topBar{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:18px;}
        .titleWrap{display:flex;align-items:center;gap:14px;}
        .titleIcon{width:52px;height:52px;border-radius:10px;background:#7c3aed;color:white;display:flex;align-items:center;justify-content:center;font-size:20px;}
        .title{font-size:24px;font-weight:900;color:#0f172a;}
        .subtitle{font-size:13px;color:#64748b;margin-top:3px;}
        .backBtn{border:none;border-radius:8px;background:#0f172a;color:white;padding:11px 14px;font-size:13px;font-weight:800;display:flex;align-items:center;gap:8px;cursor:pointer;}
        .error{margin-bottom:16px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;padding:12px;border-radius:8px;font-size:13px;font-weight:800;}
        .summary{display:grid;grid-template-columns:minmax(280px,1.2fr) repeat(3,minmax(160px,0.8fr));gap:14px;margin-bottom:18px;}
        .summaryCard{background:white;border:1px solid #e2e8f0;border-radius:10px;padding:16px;box-shadow:0 8px 20px rgba(15,23,42,0.06);}
        .summaryLabel{font-size:11px;color:#64748b;text-transform:uppercase;font-weight:900;margin-bottom:7px;}
        .summaryValue{font-size:15px;color:#0f172a;font-weight:900;line-height:1.45;}
        .muted{font-size:12px;color:#64748b;margin-top:5px;line-height:1.5;}
        .deliveryType{display:inline-flex;margin-top:8px;padding:6px 10px;border-radius:999px;font-size:11px;font-weight:900;text-transform:capitalize;}
        .deliveryType.normal{background:#dcfce7;color:#166534;}
        .deliveryType.emergency{background:#fee2e2;color:#991b1b;}
        .toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:20px 0 14px;flex-wrap:wrap;}
        .sectionTitle{font-size:18px;color:#0f172a;font-weight:900;}
        .searchBox{width:min(420px,100%);display:flex;align-items:center;gap:10px;border:1px solid #d1d5db;background:white;border-radius:8px;padding:10px 13px;}
        .searchBox input{border:none;outline:none;width:100%;font-size:13px;background:transparent;}
        .cardGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:16px;}
        .deliveryCard{background:white;border:1px solid #e2e8f0;border-radius:10px;padding:18px;box-shadow:0 8px 20px rgba(15,23,42,0.06);display:grid;grid-template-columns:72px 1fr auto;gap:16px;align-items:center;text-align:left;transition:0.2s;}
        .deliveryCard:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(15,23,42,0.1);border-color:#7c3aed;}
        .deliveryCard.assigned{border-color:#16a34a;background:#f0fdf4;}
        .avatar{width:72px;height:72px;border-radius:10px;background:#ede9fe;color:#5b21b6;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;overflow:hidden;}
        .avatar img{width:100%;height:100%;object-fit:cover;}
        .cardName{font-size:17px;font-weight:900;color:#0f172a;}
        .cardUsername{font-size:12px;color:#7c3aed;font-weight:800;margin-top:3px;}
        .infoGrid{display:grid;grid-template-columns:1fr 1fr;gap:7px 14px;margin-top:12px;}
        .infoLine{font-size:12px;color:#475569;display:flex;align-items:center;gap:7px;min-width:0;}
        .infoLine span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .assignBtn{border:none;border-radius:8px;background:#7c3aed;color:white;padding:11px 14px;font-size:13px;font-weight:900;display:flex;align-items:center;gap:8px;cursor:pointer;white-space:nowrap;}
        .assignBtn.assigned{background:#16a34a;}
        .assignBtn:disabled{opacity:.65;cursor:not-allowed;}
        .empty{background:white;border:1px solid #e2e8f0;border-radius:10px;padding:36px;text-align:center;color:#94a3b8;font-weight:800;}
        .orderGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px;}
        .orderCard{background:white;border:1px solid #e2e8f0;border-radius:10px;padding:18px;box-shadow:0 8px 20px rgba(15,23,42,0.06);display:flex;flex-direction:column;gap:14px;}
        .orderCard:hover{border-color:#7c3aed;box-shadow:0 14px 30px rgba(15,23,42,0.1);}
        .orderHead{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
        .orderNo{font-size:16px;font-weight:900;color:#0f172a;}
        .statusPill{display:inline-flex;padding:6px 10px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:900;text-transform:capitalize;}
        .orderMeta{display:grid;gap:8px;font-size:13px;color:#475569;}
        .orderMetaLine{display:flex;gap:8px;align-items:flex-start;}
        .selectOrderBtn{border:none;border-radius:8px;background:#7c3aed;color:white;padding:11px 14px;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;}
        @media(max-width:1120px){.summary{grid-template-columns:1fr 1fr;}.cardGrid{grid-template-columns:1fr;}.deliveryCard{grid-template-columns:64px 1fr;}.assignBtn{grid-column:1 / -1;justify-content:center;}.avatar{width:64px;height:64px;}}
        @media(max-width:640px){.container{padding:16px;}.summary{grid-template-columns:1fr;}.infoGrid{grid-template-columns:1fr;}.deliveryCard{grid-template-columns:1fr;}.avatar{width:64px;height:64px;}}
      `}</style>

      <div className="wrapper">
        <AdminSidebar />
        <div className="main">
          <AdminNavbar />
          <div className="container">
            <div className="topBar">
              <div className="titleWrap">
                <div className="titleIcon"><FaTruck /></div>
                <div>
                  <h2 className="title">Assign Delivery</h2>
                  <p className="subtitle">{orderId ? "Choose a deliveryman from wide cards for this order" : "Select an order, then assign a deliveryman"}</p>
                </div>
              </div>
              <button className="backBtn" onClick={() => navigate("/admin/order")}>
                <FaArrowLeft /> Back to Orders
              </button>
            </div>

            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="empty">Loading assignment details...</div>
            ) : !orderId ? (
              <>
                <div className="toolbar">
                  <h3 className="sectionTitle">Assigned Delivery Orders</h3>
                  <div className="searchBox">
                    <FaSearch color="#64748b" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search order, customer, phone..."
                    />
                  </div>
                </div>

                {assignedOrders.length ? (
                  <div className="orderGrid">
                    {assignedOrders.map((item) => (
                        <div className="orderCard" key={item.id}>
                          <div className="orderHead">
                            <div>
                              <div className="orderNo">{item.order_number}</div>
                              <div className="muted">{item.items?.map((product) => `${product.product_name} x${product.quantity}`).join(", ") || "No products"}</div>
                            </div>
                            <span className="statusPill">{item.status}</span>
                          </div>
                          <div className="orderMeta">
                            <div className="orderMetaLine"><FaUser color="#7c3aed" /> <strong>{item.customer_name || "Customer"}</strong></div>
                            <div className="orderMetaLine"><FaPhone color="#2563eb" /> {item.phone || "-"}</div>
                            <div className="orderMetaLine"><FaMapMarkerAlt color="#dc2626" /> {item.address}{item.city ? `, ${item.city}` : ""}</div>
                            <div className="orderMetaLine"><FaTruck color="#16a34a" /> {item.assigned_deliveryman_detail?.name || "Assigned deliveryman"}</div>
                          </div>
                          <button className="selectOrderBtn" onClick={() => navigate(`/admin/assign-delivery/${item.id}`)}>
                            <FaTruck /> View Assigned Person
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="empty">No assigned delivery orders found.</div>
                )}
              </>
            ) : order ? (
              <>
                <div className="summary">
                  <div className="summaryCard">
                    <div className="summaryLabel">Order</div>
                    <div className="summaryValue">{order.order_number}</div>
                    <div className="muted">{productSummary}</div>
                    <span className={`deliveryType ${order.delivery_type === "emergency" ? "emergency" : "normal"}`}>
                      {order.delivery_type || "normal"}
                    </span>
                  </div>
                  <div className="summaryCard">
                    <div className="summaryLabel">Customer</div>
                    <div className="summaryValue">{order.customer_name || "Customer"}</div>
                    <div className="muted">{order.phone || "-"}<br />{order.email || "-"}</div>
                  </div>
                  <div className="summaryCard">
                    <div className="summaryLabel">Address</div>
                    <div className="summaryValue">{order.address}{order.city ? `, ${order.city}` : ""}</div>
                    <div className="muted">Postal: {order.postal_code || "-"}<br />{order.delivery_location_name || "-"}</div>
                  </div>
                  <div className="summaryCard">
                    <div className="summaryLabel">Amount</div>
                    <div className="summaryValue">{currency(order.total)}</div>
                    <div className="muted">Delivery fee: {currency(order.delivery_fee)}<br />Status: {order.status}</div>
                  </div>
                </div>

                <div className="toolbar">
                  <h3 className="sectionTitle">{order.assigned_deliveryman ? "Assigned Deliveryman" : "Deliveryman Cards"}</h3>
                  <div className="searchBox">
                    <FaSearch color="#64748b" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search deliveryman..."
                    />
                  </div>
                </div>

                {!canAssignDelivery(order.status) && !order.assigned_deliveryman && (
                  <div className="error">Confirm and process this order before assigning a deliveryman.</div>
                )}

                {filteredDeliverymen.length ? (
                  <div className="cardGrid">
                    {filteredDeliverymen.map((person) => {
                      const isAssigned = order.assigned_deliveryman === person.id;
                      const initials = (person.name || person.username || "D").slice(0, 2).toUpperCase();
                      return (
                        <div className={`deliveryCard ${isAssigned ? "assigned" : ""}`} key={person.id}>
                          <div className="avatar">
                            {person.profile_image ? (
                              <img src={imageUrl(person.profile_image)} alt={person.name} />
                            ) : (
                              initials || <FaUser />
                            )}
                          </div>

                          <div>
                            <div className="cardName">{person.name || "Deliveryman"}</div>
                            <div className="cardUsername">@{person.username || "username"}</div>
                            <div className="infoGrid">
                              <div className="infoLine"><FaPhone color="#2563eb" /><span>{person.phone || "No phone"}</span></div>
                              <div className="infoLine"><FaEnvelope color="#7c3aed" /><span>{person.email || "No email"}</span></div>
                              <div className="infoLine"><FaMapMarkerAlt color="#dc2626" /><span>{person.address || "No address"}</span></div>
                              <div className="infoLine"><FaUserCheck color="#16a34a" /><span>{isAssigned ? "Assigned now" : "Available"}</span></div>
                            </div>
                          </div>

                          <button
                            className={`assignBtn ${isAssigned ? "assigned" : ""}`}
                            disabled={assigningId === person.id || (!isAssigned && !canAssignDelivery(order.status))}
                            onClick={() => assignDeliveryman(person.id)}
                          >
                            {isAssigned ? <FaCheck /> : <FaTruck />}
                            {assigningId === person.id ? "Assigning..." : isAssigned ? "Assigned" : "Assign"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty">No deliveryman found.</div>
                )}
              </>
            ) : (
              <div className="empty">Order not found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignDelivery;
