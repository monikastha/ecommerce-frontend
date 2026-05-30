import { useParams } from "react-router-dom";
import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

import greenKurta from "../../../assets/greenKurta.jpg";

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();

  const timeline = [
    { status: "Order Confirmed", date: "April 5, 2026", completed: true },
    { status: "Shipped", date: "January 18, 2026", completed: true },
    { status: "Out For Delivery", date: "", completed: true },
    { status: "Delivery", date: "January 21, 2026 By 1 PM", completed: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <BuyerNavbar cartQty={1} />

      <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
          Track Order
        </h1>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
          Order ID: <strong>{orderId || "ORD-784392"}</strong>
        </p>

        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          {/* Left - Product Info */}
          <div style={{ flex: 1, minWidth: 420 }}>
            <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", marginBottom: 20 }}>
              <img
                src={greenKurta}
                alt="Product"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
              Green Floral Cotton Printed Knee Length Straight Kurti
            </h2>
            <p style={{ color: "#10b981", fontWeight: 500, marginBottom: 6 }}>
              Brand : Rangita | More Women from Rangita
            </p>
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#fbbf24", fontSize: 18 }}>★</span>
              ))}
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#ef4444" }}>
              Price: Rs 2500
            </p>
            <p style={{ color: "#334155" }}>Color: Olive Green</p>
          </div>

          {/* Right - Shipping Timeline */}
          <div style={{ flex: 1, minWidth: 420 }}>
            <div style={{
              background: "#f0fdf4",
              borderRadius: 16,
              padding: 28,
              border: "1px solid #86efac",
              boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
            }}>
              <h3 style={{ marginBottom: 24, fontSize: 19, fontWeight: 600, color: "#166534" }}>
                Shipping Information
              </h3>

              <div style={{ position: "relative", paddingLeft: 36 }}>
                {/* Vertical Line */}
                <div style={{
                  position: "absolute",
                  left: "13px",
                  top: "8px",
                  bottom: "8px",
                  width: "4px",
                  background: "linear-gradient(to bottom, #86efac 70%, #e2e8f0 70%)",
                  borderRadius: 4
                }} />

                {timeline.map((step, index) => (
                  <div key={index} style={{ marginBottom: index === timeline.length - 1 ? 0 : 32, position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: "-6px",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: step.completed ? "#22c55e" : "#e2e8f0",
                      border: "3px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 16,
                      fontWeight: 700,
                      boxShadow: step.completed ? "0 0 0 4px rgba(134, 239, 172, 0.3)" : "none"
                    }}>
                      {step.completed ? "✓" : ""}
                    </div>

                    <div style={{ marginLeft: "12px" }}>
                      <p style={{
                        fontWeight: 600,
                        margin: "2px 0",
                        color: step.completed ? "#166534" : "#64748b"
                      }}>
                        {step.status}
                      </p>
                      {step.date && (
                        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                          {step.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BuyerFooter />
    </div>
  );
}
