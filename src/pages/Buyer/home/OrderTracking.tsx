/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import BuyerFooter from "../../../components/BuyerFooter";
import { getBuyerCartCount } from "../../../utils/buyerCart";
import ReviewComments from "./ReviewComments";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type TrackingItem = {
  id: number;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  size?: string;
  subtotal: number;
};

type TrackingOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentType: string;
  deliveryType: string;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
  items: TrackingItem[];
};

const currency = (value?: number) => `Rs. ${Number(value || 0).toLocaleString()}`;

const normalizeLookupValue = (value?: string | number | null) =>
  String(value ?? "").trim().toLowerCase();

const normalizeStatus = (status?: string | null) => {
  const normalized = normalizeLookupValue(status).replace(/[\s-]+/g, "_");
  const statusAliases: Record<string, string> = {
    accepted: "seller_accepted",
    confirmed: "seller_accepted",
    packed: "warehouse_processing",
    ready: "ready_for_delivery",
    ready_for_shipping: "ready_for_delivery",
    shipped: "delivery_accepted",
    delivery_assigned: "delivery_assigned",
    delivery_accepted: "delivery_accepted",
    picked_up: "picked_up",
    out_for_delivery: "out_for_delivery",
    delivered_product: "delivered",
    delivery_completed: "delivered",
    completed: "delivered",
  };

  return statusAliases[normalized] || normalized || "confirmed";
};

const statusLabel = (status?: string) =>
  normalizeStatus(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const orderMatchesQuery = (order: TrackingOrder, orderId?: string | null) => {
  if (!orderId) return true;
  const query = normalizeLookupValue(orderId);
  return [order.id, order.orderNumber].some((value) => normalizeLookupValue(value) === query);
};

const paymentLabel = (paymentType?: string) => {
  if (paymentType === "khalti") return "Khalti";
  if (paymentType === "esewa") return "eSewa";
  return "Cash on Delivery";
};

const normalizeOrder = (raw: any): TrackingOrder => {
  const items = Array.isArray(raw.items) ? raw.items : [];
  return {
    id: String(raw.id || raw.order_number || raw.orderId || ""),
    orderNumber: String(raw.order_number || raw.id || raw.orderId || ""),
    customerName: raw.customer_name || raw.customerName || "",
    email: raw.email || "",
    phone: raw.phone || "",
    address: [raw.address, raw.city].filter(Boolean).join(", ") || raw.address || "",
    paymentType: raw.payment_type || raw.paymentType || "cash_on_delivery",
    deliveryType: raw.delivery_type || raw.deliveryType || "normal",
    deliveryFee: Number(raw.delivery_fee ?? raw.deliveryFee ?? 0),
    total: Number(raw.total || 0),
    status: normalizeStatus(raw.status),
    createdAt: raw.created_at || raw.createdAt || "",
    items: items.map((item: any) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      return {
        id: Number(item.product || item.id || 0),
        name: item.product_name || item.name || "Product",
        image: item.product_image || item.image || "",
        quantity,
        price,
        size: item.selected_size || item.size || "",
        subtotal: Number(item.subtotal || price * quantity),
      };
    }),
  };
};

export default function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const orderIdQuery = query.get("orderId");

  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const localOrders = JSON.parse(localStorage.getItem("buyer_orders") || "[]");
    const localList = Array.isArray(localOrders) ? localOrders.map(normalizeOrder) : [];

    setLoading(true);
    setError("");
    try {
      const params = userId
        ? `user_id=${encodeURIComponent(userId)}`
        : username
        ? `username=${encodeURIComponent(username)}`
        : "";
      const res = await fetch(`${API_ORIGIN}/api/orders/${params ? `?${params}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      let apiList = Array.isArray(data) ? data.map(normalizeOrder) : [];

      if (orderIdQuery && apiList.length && !apiList.some((order) => orderMatchesQuery(order, orderIdQuery))) {
        const allRes = await fetch(`${API_ORIGIN}/api/orders/`);
        const allData = await allRes.json();
        if (allRes.ok && Array.isArray(allData)) {
          const directOrder = allData.map(normalizeOrder).find((order) => orderMatchesQuery(order, orderIdQuery));
          if (directOrder) apiList = [directOrder, ...apiList.filter((order) => order.id !== directOrder.id)];
        }
      }

      setOrders(apiList.length ? apiList : localList);
    } catch (err) {
      setOrders(localList);
      setError(localList.length ? "" : err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [orderIdQuery]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const displayOrder = useMemo(() => {
    if (!orders.length) return null;
    if (!orderIdQuery) return orders[0];
    return orders.find((order) => orderMatchesQuery(order, orderIdQuery)) || null;
  }, [orderIdQuery, orders]);

  const timeline = useMemo(() => {
    if (!displayOrder) return [];
    const status = normalizeStatus(displayOrder.status);
    const createdDate = displayOrder.createdAt ? new Date(displayOrder.createdAt).toLocaleDateString() : "";
    const statusOrder = [
      "pending",
      "seller_accepted",
      "preparing",
      "warehouse_processing",
      "ready_for_delivery",
      "delivery_assigned",
      "delivery_accepted",
      "picked_up",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(status);
    const completedThrough = currentIndex >= 0 ? currentIndex : 0;
    const emergency = displayOrder.deliveryType === "emergency";
    const steps = emergency
      ? [
          ["pending", "Order Placed"],
          ["seller_accepted", "Emergency Priority"],
          ["preparing", "Fast Preparation"],
          ["warehouse_processing", "Warehouse Processing"],
          ["ready_for_delivery", "Priority Delivery Ready"],
          ["delivery_assigned", "Priority Delivery Assigned"],
          ["delivery_accepted", "Delivery Accepted"],
          ["picked_up", "Picked Up"],
          ["out_for_delivery", "Out For Delivery"],
          ["delivered", "Delivered"],
        ]
      : [
          ["pending", "Order Placed"],
          ["seller_accepted", "Seller Accepted"],
          ["preparing", "Preparing"],
          ["warehouse_processing", "Warehouse Processing"],
          ["ready_for_delivery", "Ready For Delivery"],
          ["delivery_assigned", "Delivery Assigned"],
          ["delivery_accepted", "Delivery Accepted"],
          ["picked_up", "Picked Up"],
          ["out_for_delivery", "Out For Delivery"],
          ["delivered", "Delivered"],
        ];

    return steps.map(([stepStatus, label]) => ({
      status: label,
      completed: completedThrough >= statusOrder.indexOf(stepStatus),
      date: stepStatus === "pending" || (stepStatus === "delivered" && status === "delivered") ? createdDate : "",
    }));
  }, [displayOrder]);

  const subtotal = displayOrder?.items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;
  const deliveryFee = displayOrder?.deliveryFee || 0;
  const total = displayOrder?.total || subtotal + deliveryFee;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <BuyerNavbar
        cartQty={getBuyerCartCount()}
        showAllCategory={false}
      />

      <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Track Order</h1>
            <p style={{ color: "#64748b", maxWidth: 640 }}>
              Keep an eye on your order status here. Your latest order appears automatically.
            </p>
          </div>
          <button
            onClick={loadOrders}
            style={{ padding: "12px 18px", borderRadius: 10, border: "1px solid #cbd5e1", background: "white", fontWeight: 700, color: "#334155" }}
          >
            Refresh Orders
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 18, border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", borderRadius: 10, padding: 12, fontWeight: 700 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ marginTop: 40, borderRadius: 12, background: "white", border: "1px solid #e2e8f0", padding: 32, textAlign: "center", color: "#64748b", fontWeight: 700 }}>
            Loading your order tracking...
          </div>
        ) : !displayOrder ? (
          <div style={{ marginTop: 40, borderRadius: 12, background: "white", border: "1px solid #e2e8f0", padding: 32, textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>No tracked orders found</p>
            <p style={{ marginTop: 10, color: "#475569" }}>
              You can track your orders here after checkout.
            </p>
            <button
              onClick={() => navigate("/allproducts")}
              style={{ marginTop: 24, padding: "12px 20px", borderRadius: 10, border: "none", background: "#4338ca", color: "white", fontWeight: 700 }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 30, borderRadius: 12, background: "white", border: "1px solid #e2e8f0", padding: 24, marginBottom: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <p style={{ fontSize: 12, color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>Order ID</p>
                  <p style={{ marginTop: 8, fontSize: 20, fontWeight: 800, color: "#111827" }}>{displayOrder.orderNumber}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>Payment</p>
                  <p style={{ marginTop: 8, fontSize: 18, fontWeight: 800, color: "#0f766e" }}>{paymentLabel(displayOrder.paymentType)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>Status</p>
                  <p style={{ marginTop: 8, fontSize: 18, fontWeight: 800, color: "#1d4ed8", textTransform: "capitalize" }}>
                    {statusLabel(displayOrder.status)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 360 }}>
                <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", marginBottom: 24, background: "white", border: "1px solid #e2e8f0" }}>
                  <div style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>Order Details</h2>
                    {displayOrder.items.map((item, index) => (
                      <div key={`${item.id}-${index}`} style={{ display: "flex", gap: 16, marginBottom: 18, alignItems: "center" }}>
                        <div style={{ width: 96, minWidth: 96, height: 96, borderRadius: 12, overflow: "hidden", background: "#f8fafc" }}>
                          <img src={item.image || "https://via.placeholder.com/220"} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 6 }}>{item.name}</p>
                          <p style={{ fontSize: 14, color: "#475569", marginBottom: 4 }}>Qty: {item.quantity}</p>
                          {item.size && <p style={{ fontSize: 14, color: "#475569", marginBottom: 4 }}>Size: {item.size}</p>}
                          <p style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{currency(item.subtotal)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
                  {displayOrder.items.map((item, index) => (
                    <ReviewComments
                      key={`${displayOrder.id}-${item.id}-${index}`}
                      productId={item.id}
                      productName={item.name}
                      compact
                    />
                  ))}
                </div>

                <div style={{ borderRadius: 12, background: "white", border: "1px solid #e2e8f0", padding: 24 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>Shipping Timeline</h3>
                  <div style={{ position: "relative", paddingLeft: 32 }}>
                    <div style={{ position: "absolute", left: 16, top: 14, bottom: 14, width: 4, background: "#e2e8f0", borderRadius: 4 }} />
                    {timeline.map((step, index) => (
                      <div key={step.status} style={{ display: "flex", gap: 14, marginBottom: index === timeline.length - 1 ? 0 : 26, position: "relative" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: step.completed ? "#22c55e" : "#e2e8f0", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                          {step.completed ? "✓" : ""}
                        </div>
                        <div>
                          <p style={{ fontWeight: 800, margin: 0, color: step.completed ? "#0f766e" : "#64748b" }}>{step.status}</p>
                          {step.date && <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 0" }}>{step.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ borderRadius: 12, background: "white", border: "1px solid #e2e8f0", padding: 24, marginBottom: 24 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>Order Summary</h3>
                  <div style={{ display: "grid", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Subtotal</span><span>{currency(subtotal)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Delivery Fee</span><span>{currency(deliveryFee)}</span></div>
                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 14, display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#111827" }}><span>Total</span><span>{currency(total)}</span></div>
                  </div>
                </div>

                <div style={{ borderRadius: 12, background: "white", border: "1px solid #e2e8f0", padding: 24 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>Shipping Address</h3>
                  <p style={{ margin: "0 0 10px", color: "#334155" }}><strong>{displayOrder.customerName}</strong></p>
                  <p style={{ margin: "0 0 6px", color: "#475569" }}>{displayOrder.address || "Address not provided"}</p>
                  <p style={{ margin: 0, color: "#475569" }}>{displayOrder.email || "Email not provided"}</p>
                  {displayOrder.phone && <p style={{ margin: "6px 0 0", color: "#475569" }}>{displayOrder.phone}</p>}
                </div>
              </div>
            </div>

            {orders.length > 1 && (
              <div style={{ marginTop: 32, borderRadius: 12, background: "white", border: "1px solid #e2e8f0", padding: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>Other Orders</h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {orders.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/ordertracking?orderId=${encodeURIComponent(item.orderNumber || item.id)}`)}
                      style={{ textAlign: "left", width: "100%", borderRadius: 10, border: item.id === displayOrder.id ? "2px solid #4338ca" : "1px solid #cbd5e1", background: item.id === displayOrder.id ? "#eef2ff" : "white", padding: "16px 18px", cursor: "pointer" }}
                    >
                      <p style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>Order {item.orderNumber}</p>
                      <p style={{ margin: "6px 0 0", color: "#475569" }}>Payment: {paymentLabel(item.paymentType)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BuyerFooter />
    </div>
  );
}
