import { useEffect, useMemo, useState } from "react";
import WarehouseStaffSidebar from "./WarehouseStaffSidebar";
import WarehouseStaffNavbar from "./WarehouseStaffNavbar";
import { FaBoxOpen, FaCheck, FaClipboardList, FaSearch, FaSyncAlt } from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type OrderItem = {
  id: number;
  product_name?: string;
  selected_size?: string;
  quantity?: number;
  price?: string | number;
  subtotal?: string | number;
};

type WarehouseOrder = {
  id: number;
  order_number: string;
  customer_name: string;
  phone?: string;
  address?: string;
  city?: string;
  delivery_type?: string;
  delivery_location_name?: string;
  total?: string | number;
  status: string;
  assigned_deliveryman?: number | null;
  assigned_deliveryman_detail?: {
    name?: string;
    phone?: string;
  } | null;
  created_at?: string;
  items?: OrderItem[];
};

const currency = (value?: string | number) => `Rs. ${Number(value || 0).toLocaleString()}`;

const orderProducts = (order: WarehouseOrder) =>
  order.items?.length
    ? order.items
        .map((item) => {
          const size = item.selected_size ? ` (${item.selected_size})` : "";
          return `${item.product_name || "Product"}${size} x${item.quantity || 1}`;
        })
        .join(", ")
    : "No products";

const OrderProcessing = () => {
  const [orders, setOrders] = useState<WarehouseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Failed to load assigned orders.");
      const warehouseOrders = Array.isArray(data)
        ? data.filter(
            (order: WarehouseOrder) =>
              order.status === "warehouse_processing"
          )
          .sort((a: WarehouseOrder, b: WarehouseOrder) => {
            if (a.delivery_type !== b.delivery_type) return a.delivery_type === "emergency" ? -1 : 1;
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          })
        : [];
      setOrders(warehouseOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assigned orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) =>
      [
        order.order_number,
        order.customer_name,
        order.phone,
        order.address,
        order.city,
        order.delivery_location_name,
        order.delivery_type,
        orderProducts(order),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [orders, search]);

  const updateWarehouseStatus = async (order: WarehouseOrder) => {
    setUpdatingId(order.id);
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/${order.id}/set-status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ready_for_delivery" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Failed to update warehouse order.");
      setOrders((prev) =>
        prev.filter((item) => item.id !== data.id)
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update warehouse order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusText = (status: string) => {
    if (status === "warehouse_processing") return "Needs Packing";
    if (status === "ready_for_delivery") return "Ready For Delivery";
    return status.replace(/_/g, " ");
  };

  return (
    <>
      <style>{`
        .layout{display:flex;min-height:100vh;background:#f1f5f9;font-family:'Poppins',sans-serif;}
        .main{flex:1;display:flex;flex-direction:column;}
        .content{padding:24px;}
        .pageHead{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:18px;}
        .titleWrap{display:flex;align-items:center;gap:12px;}
        .titleIcon{width:48px;height:48px;border-radius:10px;background:#2563eb;color:white;display:flex;align-items:center;justify-content:center;font-size:19px;}
        .title{font-size:24px;font-weight:900;color:#0f172a;margin:0;}
        .subtitle{font-size:13px;color:#64748b;margin-top:4px;}
        .toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .searchBox{width:320px;max-width:100%;display:flex;align-items:center;gap:9px;background:white;border:1px solid #d1d5db;border-radius:8px;padding:10px 12px;}
        .searchBox input{border:none;outline:none;width:100%;font-size:13px;background:transparent;}
        .refreshBtn{height:40px;width:40px;border:none;border-radius:8px;background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .stats{display:grid;grid-template-columns:repeat(3,minmax(160px,1fr));gap:14px;margin-bottom:18px;}
        .stat{background:white;border:1px solid #e2e8f0;border-radius:10px;padding:16px;box-shadow:0 8px 20px rgba(15,23,42,0.06);}
        .statLabel{font-size:12px;color:#64748b;text-transform:uppercase;font-weight:900;}
        .statValue{font-size:28px;color:#0f172a;font-weight:900;margin-top:8px;}
        .tableWrap{background:white;border-radius:10px;box-shadow:0 8px 20px rgba(15,23,42,0.06);overflow:hidden;}
        table{width:100%;border-collapse:collapse;}
        th{background:#f8fafc;padding:14px;text-align:left;font-size:12px;color:#475569;font-weight:900;}
        td{padding:14px;border-top:1px solid #f1f5f9;font-size:13px;color:#334155;vertical-align:top;}
        .muted{font-size:12px;color:#64748b;margin-top:4px;line-height:1.5;}
        .status{display:inline-flex;border-radius:999px;padding:6px 10px;background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:900;text-transform:capitalize;}
        .delivery{display:inline-flex;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:900;text-transform:capitalize;}
        .normal{background:#dcfce7;color:#166534;}
        .emergency{background:#fee2e2;color:#991b1b;}
        .packBtn{border:none;border-radius:8px;background:#16a34a;color:white;padding:10px 12px;font-size:12px;font-weight:900;display:inline-flex;align-items:center;gap:7px;cursor:pointer;white-space:nowrap;}
        .packBtn:disabled{opacity:.65;cursor:not-allowed;}
        .empty,.error{padding:24px;text-align:center;font-size:13px;font-weight:800;}
        .empty{color:#94a3b8;}
        .error{margin-bottom:14px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;border-radius:8px;text-align:left;}
        @media(max-width:900px){.stats{grid-template-columns:1fr;}.tableWrap{overflow-x:auto;}table{min-width:960px;}.content{padding:16px;}}
      `}</style>

      <div className="layout">
        <WarehouseStaffSidebar />
        <div className="main">
          <WarehouseStaffNavbar />
          <div className="content">
            <div className="pageHead">
              <div className="titleWrap">
                <div className="titleIcon"><FaClipboardList /></div>
                <div>
                  <h2 className="title">Order Processing</h2>
                  <p className="subtitle">Verify, pack, and mark seller-prepared orders as ready for delivery</p>
                </div>
              </div>
              <div className="toolbar">
                <div className="searchBox">
                  <FaSearch color="#64748b" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, product..." />
                </div>
                <button className="refreshBtn" onClick={loadOrders} title="Refresh assigned orders" aria-label="Refresh assigned orders">
                  <FaSyncAlt />
                </button>
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="stats">
              <div className="stat">
                <div className="statLabel">Assigned To Pack</div>
                <div className="statValue">{orders.length}</div>
              </div>
              <div className="stat">
                <div className="statLabel">Emergency Priority</div>
                <div className="statValue">{orders.filter((order) => order.delivery_type === "emergency").length}</div>
              </div>
              <div className="stat">
                <div className="statLabel">Visible Results</div>
                <div className="statValue">{filteredOrders.length}</div>
              </div>
            </div>

            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items To Pack</th>
                    <th>Delivery</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="empty">Loading assigned orders...</td></tr>
                  ) : filteredOrders.length ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.order_number}</strong>
                          <div className="muted">{order.created_at ? new Date(order.created_at).toLocaleString() : ""}</div>
                        </td>
                        <td>
                          <strong>{order.customer_name || "Customer"}</strong>
                          <div className="muted">{order.phone || "-"}</div>
                          <div className="muted">{order.address || "-"}{order.city ? `, ${order.city}` : ""}</div>
                        </td>
                        <td><strong>{orderProducts(order)}</strong></td>
                        <td>
                          <span className={`delivery ${order.delivery_type === "emergency" ? "emergency" : "normal"}`}>
                            {order.delivery_type || "normal"}
                          </span>
                          <div className="muted">{order.delivery_location_name || "-"}</div>
                        </td>
                        <td><strong>{currency(order.total)}</strong></td>
                        <td>
                          <span className="status">{statusText(order.status)}</span>
                          <div className="muted">
                            {order.delivery_type === "emergency" ? "Emergency priority order" : "Normal delivery order"}
                          </div>
                        </td>
                        <td>
                          <button
                            className="packBtn"
                            disabled={updatingId === order.id}
                            onClick={() => void updateWarehouseStatus(order)}
                          >
                            {updatingId === order.id ? <FaBoxOpen /> : <FaCheck />}
                            {updatingId === order.id ? "Updating..." : "Ready For Delivery"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7} className="empty">No seller-prepared orders need warehouse processing right now.</td></tr>
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

export default OrderProcessing;
