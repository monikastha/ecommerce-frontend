import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import BuyerFooter from "../../../components/BuyerFooter";
import { getBuyerCartCount } from "../../../utils/buyerCart";
import ReviewComments from "./ReviewComments";

type ApiCategory = {
  id: number;
  name: string;
};

export default function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const orderIdQuery = query.get("orderId");
  const selectedCategory = query.get("category") || "All";

  const [orders, setOrders] = useState<any[]>([]);
  const [order, setOrder] = useState<any | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("buyer_orders") || "[]");
    const loadedOrders = Array.isArray(storedOrders) ? storedOrders : [];
    setOrders(loadedOrders);

    if (orderIdQuery) {
      const found = loadedOrders.find(
        (o) => String(o.id) === orderIdQuery || String(o.orderId) === orderIdQuery
      );
      setOrder(found || null);
    } else {
      setOrder(loadedOrders[0] || null);
    }
  }, [orderIdQuery]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/productcategory/categories/`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategories();
  }, []);

  const timeline = useMemo(() => {
    if (!order) {
      return [];
    }

    const baseStatus = [
      { status: "Order Confirmed", completed: true, date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "" },
      { status: "Processing", completed: order.status !== "confirmed" && order.status !== "pending", date: order.status !== "confirmed" ? "" : "" },
      { status: "Shipped", completed: order.status === "shipped" || order.status === "delivered", date: "" },
      { status: "Out For Delivery", completed: order.status === "out_for_delivery" || order.status === "delivered", date: "" },
      { status: "Delivered", completed: order.status === "delivered", date: order.status === "delivered" ? new Date(order.createdAt).toLocaleDateString() : "" },
    ];

    return baseStatus;
  }, [order]);

  const paymentLabel = order?.paymentType === "esewa" ? "eSewa" : "Cash on Delivery";
  const subtotal = order?.items?.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0) || 0;
  const deliveryFee = order?.deliveryFee || 0;
  const total = order?.total || subtotal + deliveryFee;

  const displayOrder = order || orders[0] || null;
  const orderList = orders.length ? orders : [];

  const categoryNames = useMemo(
    () => Array.from(new Set(categories.map((c) => c.name).filter(Boolean))),
    [categories]
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <BuyerNavbar
        cartQty={getBuyerCartCount()}
        categories={categoryNames}
        activeCat={selectedCategory}
        onCatChange={(category) => {
          if (category === "All") navigate("/allproducts");
          else navigate(`/allproducts?category=${encodeURIComponent(category)}`);
        }}
      />

      <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Track Order</h1>
            <p style={{ color: "#64748b", maxWidth: 640 }}>
              Keep an eye on your order status here. If you purchased with Cash on Delivery, your order status will still appear as soon as it is confirmed.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/ordertracking")}
              style={{ padding: "12px 18px", borderRadius: 14, border: "1px solid #cbd5e1", background: "white", fontWeight: 700, color: "#334155" }}
            >
              Refresh Orders
            </button>
          </div>
        </div>

        {!displayOrder ? (
          <div style={{ marginTop: 40, borderRadius: 20, background: "white", border: "1px solid #e2e8f0", padding: 32, textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>No tracked orders found</p>
            <p style={{ marginTop: 10, color: "#475569" }}>
              You can track your orders here after checkout. If you placed a Cash on Delivery order, it will appear automatically.
            </p>
            <button
              onClick={() => navigate("/allproducts")}
              style={{ marginTop: 24, padding: "12px 20px", borderRadius: 14, border: "none", background: "#4338ca", color: "white", fontWeight: 700 }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 30, borderRadius: 20, background: "white", border: "1px solid #e2e8f0", padding: 28, marginBottom: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <p style={{ fontSize: 14, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Order ID</p>
                  <p style={{ marginTop: 8, fontSize: 20, fontWeight: 700, color: "#111827" }}>{displayOrder.id}</p>
                </div>
                <div>
                  <p style={{ fontSize: 14, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Payment</p>
                  <p style={{ marginTop: 8, fontSize: 18, fontWeight: 700, color: "#0f766e" }}>{paymentLabel}</p>
                </div>
                <div>
                  <p style={{ fontSize: 14, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Status</p>
                  <p style={{ marginTop: 8, fontSize: 18, fontWeight: 700, color: "#1d4ed8" }}>{displayOrder.status ? displayOrder.status.replace(/_/g, " ") : "Confirmed"}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 420 }}>
                <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", marginBottom: 24, background: "white", border: "1px solid #e2e8f0" }}>
                  <div style={{ padding: 28 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Order Details</h2>
                    {displayOrder.items?.map((item: any, index: number) => (
                      <div key={index} style={{ display: "flex", gap: 18, marginBottom: 22, alignItems: "center" }}>
                        <div style={{ width: 110, minWidth: 110, height: 110, borderRadius: 20, overflow: "hidden", background: "#f8fafc" }}>
                          <img src={item.image || "https://via.placeholder.com/220"} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{item.name}</p>
                          <p style={{ fontSize: 14, color: "#475569", marginBottom: 4 }}>Qty: {item.quantity}</p>
                          {item.size && (
                            <p style={{ fontSize: 14, color: "#475569", marginBottom: 4 }}>Size: {item.size}</p>
                          )}
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
                  {displayOrder.items?.map((item: any, index: number) => (
                    <ReviewComments
                      key={`${displayOrder.id}-${item.id}-${index}`}
                      productId={item.id}
                      productName={item.name}
                      compact
                    />
                  ))}
                </div>

                <div style={{ borderRadius: 20, background: "white", border: "1px solid #e2e8f0", padding: 28 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Shipping Timeline</h3>
                  <div style={{ position: "relative", paddingLeft: 32 }}>
                    <div style={{ position: "absolute", left: 16, top: 14, bottom: 14, width: 4, background: "linear-gradient(to bottom, #86efac 70%, #e2e8f0 70%)", borderRadius: 4 }} />
                    {timeline.map((step, index) => (
                      <div key={index} style={{ display: "flex", gap: 14, marginBottom: index === timeline.length - 1 ? 0 : 26, position: "relative" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: step.completed ? "#22c55e" : "#e2e8f0", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}> {step.completed ? "✓" : ""} </div>
                        <div>
                          <p style={{ fontWeight: 700, margin: 0, color: step.completed ? "#0f766e" : "#64748b" }}>{step.status}</p>
                          {step.date && <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 0" }}>{step.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 320 }}>
                <div style={{ borderRadius: 20, background: "white", border: "1px solid #e2e8f0", padding: 28, marginBottom: 24 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Order Summary</h3>
                  <div style={{ display: "grid", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Delivery Fee</span><span>Rs. {deliveryFee.toLocaleString()}</span></div>
                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 14, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#111827" }}><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
                  </div>
                </div>

                <div style={{ borderRadius: 20, background: "white", border: "1px solid #e2e8f0", padding: 28 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Shipping Address</h3>
                  <p style={{ margin: "0 0 10px", color: "#334155" }}><strong>{displayOrder.customerName}</strong></p>
                  <p style={{ margin: "0 0 6px", color: "#475569" }}>{displayOrder.address}</p>
                  <p style={{ margin: 0, color: "#475569" }}>{displayOrder.email}</p>
                  {displayOrder.phone && <p style={{ margin: "6px 0 0", color: "#475569" }}>{displayOrder.phone}</p>}
                </div>
              </div>
            </div>

            {orderList.length > 1 && (
              <div style={{ marginTop: 32, borderRadius: 20, background: "white", border: "1px solid #e2e8f0", padding: 28 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Other Orders</h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {orderList.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/ordertracking?orderId=${item.id}`)}
                      style={{ textAlign: "left", width: "100%", borderRadius: 16, border: item.id === displayOrder.id ? "2px solid #4338ca" : "1px solid #cbd5e1", background: item.id === displayOrder.id ? "#eef2ff" : "white", padding: "16px 18px", cursor: "pointer" }}
                    >
                      <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Order {item.id}</p>
                      <p style={{ margin: "6px 0 0", color: "#475569" }}>Payment: {item.paymentType === "esewa" ? "eSewa" : "Cash on Delivery"}</p>
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
