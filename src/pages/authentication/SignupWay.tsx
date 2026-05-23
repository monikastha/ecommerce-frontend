import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStore } from "react-icons/fa";
import React, { useEffect } from "react";

const SignupWay: React.FC = () => {
  const navigate = useNavigate();

  // 🔒 Prevent scroll ONLY on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg,#f8fafc,#e0f2fe)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* MAIN CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          background: "white",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* TITLE */}
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 30,
            color: "#1f2937",
          }}
        >
          Create your account to get started
        </h2>

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: 30,
          }}
        >
          {/* BUYER */}
          <div
            style={{
              padding: 30,
              borderRadius: 20,
              border: "1px solid #eee",
              background: "#fff7ed",
              transition: "0.3s",
              cursor: "pointer",
            }}
          >
            <FaShoppingCart
              style={{
                fontSize: 60,
                color: "#ea580c",
                marginBottom: 15,
              }}
            />

            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#ea580c",
                marginBottom: 10,
              }}
            >
              Register as Buyer
            </h3>

            <p style={{ color: "#666", marginBottom: 20 }}>
              Shop for the best products.
            </p>

            <button
              onClick={() => navigate("/buyer/signup")}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "none",
                background: "#ea580c",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Up as Buyer
            </button>
          </div>

          {/* SELLER */}
          <div
            style={{
              padding: 30,
              borderRadius: 20,
              border: "1px solid #eee",
              background: "#ecfdf5",
              cursor: "pointer",
            }}
          >
            <FaStore
              style={{
                fontSize: 60,
                color: "#16a34a",
                marginBottom: 15,
              }}
            />

            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#16a34a",
                marginBottom: 10,
              }}
            >
              Register as Seller
            </h3>

            <p style={{ color: "#666", marginBottom: 20 }}>
              Start selling your products.
            </p>

            <button
              onClick={() => navigate("/seller/signup")}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "none",
                background: "#16a34a",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Up as Seller
            </button>
          </div>
        </div>

        {/* LOGIN LINK */}
        <p
          style={{
            marginTop: 25,
            color: "#555",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#2563eb",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupWay;