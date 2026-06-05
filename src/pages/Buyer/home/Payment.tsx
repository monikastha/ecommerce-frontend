import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

// Import your image
import greenKurta from "../../../assets/greenKurta.jpg";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const cartItem = location.state?.items?.[0] || {
    name: "Green Floral Cotton Printed Knee Length Straight Kurti",
    price: 1250,
    img: greenKurta,
  };

  const [formData, setFormData] = useState({
    email: "",
    address: "",
    paymentType: "cash_on_delivery",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitPayment = () => {
    if (!formData.email || !formData.address) {
      alert("Please fill in Email and Delivery Location");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1200);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/home"); // Redirect to Buyer Home
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <BuyerNavbar cartQty={1} />

      <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 30 }}>
          Buyer Proceed to Checkout
        </h1>

        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          {/* Left Side - Product */}
          <div style={{ flex: 1, minWidth: 400 }}>
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              <img
                src={cartItem.img}
                alt={cartItem.name}
                style={{ width: "100%", height: "auto", borderRadius: 12 }}
              />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              {cartItem.name}
            </h2>
            <p style={{ color: "#10b981", marginBottom: 8 }}>
              Brand: Rangita | More Women from Rangita
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#ef4444" }}>
              Rs {cartItem.price}
            </p>
            <p style={{ color: "#6b7280" }}>Color: Olive Green</p>
          </div>

          {/* Right Side - Shipping Form */}
          <div style={{ flex: 1, minWidth: 400 }}>
            <div style={{
              background: "#f0fdf4",
              borderRadius: 12,
              padding: 24,
              border: "1px solid #86efac"
            }}>
              <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>
                Shipping Information
              </h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email here"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #d1d5db" }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Delivery Location</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #d1d5db" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Payment Type</label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #d1d5db" }}
                >
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>

              <div style={{ marginBottom: 20, padding: "16px", background: "white", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 600 }}>
                  <span>Total Payment</span>
                  <span style={{ color: "#ef4444" }}>Rs {cartItem.price}</span>
                </div>
              </div>

              <button
                onClick={handleSubmitPayment}
                disabled={isProcessing}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: isProcessing ? "#86efac" : "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: isProcessing ? "not-allowed" : "pointer",
                }}
              >
                {isProcessing ? "Processing..." : "Submit Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== BEAUTIFUL SUCCESS POPUP ==================== */}
      {showSuccess && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "40px 30px",
            textAlign: "center",
            maxWidth: 400,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontSize: 24, marginBottom: 12, color: "#10b981" }}>
              Order Placed Successfully!
            </h2>
            <p style={{ color: "#6b7280", marginBottom: 30 }}>
              Thank you for shopping at Sajilo Mart.<br />
              Your order has been confirmed.
            </p>
            <button
              onClick={handleSuccessClose}
              style={{
                padding: "14px 40px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 17,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <BuyerFooter />
    </div>
  );
}
