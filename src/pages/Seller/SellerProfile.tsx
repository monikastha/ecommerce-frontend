import { useState } from "react";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

export default function SellerProfile() {
  const [name, setName] = useState("Binita Pariyar");
  const [address, setAddress] = useState("Vyas-3, Tanahun");
  const [contactNo, setContactNo] = useState("0000000000");
  const [email, setEmail] = useState("example@gmail.com");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        fontFamily: "sans-serif",
      }}
    >
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Navbar */}
        <SellerNavbar />

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
          }}
        >
          {/* Heading */}
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Seller Profile
            </h2>

            <p
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Manage your personal information and account settings
            </p>
          </div>

          {/* Profile Card */}
          <div
            style={{
              maxWidth: "520px",
              margin: "0 auto",
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "32px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            {/* Profile Image */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "95px",
                    height: "95px",
                    borderRadius: "50%",
                    backgroundColor: "#d1d5db",
                  }}
                />

                {/* Edit Icon */}
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    bottom: "0",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "#1e3a5f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "3px solid white",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </div>
              </div>

              <h3
                style={{
                  marginTop: "14px",
                  marginBottom: "4px",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                Binita Pariyar
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Seller Account
              </p>
            </div>

            {/* Form */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Address */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Contact */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Contact Number
                </label>

                <input
                  type="text"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                style={{
                  marginTop: "12px",
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}