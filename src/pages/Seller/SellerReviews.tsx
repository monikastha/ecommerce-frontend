import { useState } from "react";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

interface Review {
  id: number;
  customerName: string;
  productName: string;
  date: string;
  comment: string;
  status: "Pending" | "Responded";
}

const reviews: Review[] = [
  {
    id: 1,
    customerName: "Monika Shrestha",
    productName: "Wireless Bluetooth Headphones",
    date: "2024-01-15",
    comment:
      "Amazing sound quality! The noise cancellation works perfectly and the battery life is incredible. Highly recommend!",
    status: "Pending",
  },
  {
    id: 2,
    customerName: "Binita Pariyar",
    productName: "Portable Phone Charger",
    date: "2024-01-12",
    comment:
      "Does the job but takes longer to charge than expected. Build quality is decent for the price.",
    status: "Responded",
  },
];

export default function SellerCustomerEngagement() {
  const [reviewList] = useState<Review[]>(reviews);

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
              Customer Engagement
            </h2>

            <p
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Manage customer reviews and respond to feedback
            </p>
          </div>

          {/* Reviews */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {reviewList.map((review) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                {/* Top */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#111827",
                      }}
                    >
                      {review.customerName}
                    </h3>

                    <p
                      style={{
                        margin: "4px 0",
                        fontSize: "14px",
                        color: "#374151",
                      }}
                    >
                      {review.productName}
                    </p>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      {review.date}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor:
                        review.status === "Pending"
                          ? "#f59e0b"
                          : "#10b981",
                      color: "white",
                    }}
                  >
                    {review.status}
                  </div>
                </div>

                {/* Comment */}
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    color: "#374151",
                  }}
                >
                  {review.comment}
                </p>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#1e3a5f",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 18px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Respond
                  </button>

                  <button
                    style={{
                      backgroundColor: "#e5e7eb",
                      color: "#111827",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 18px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Showing 1 to 2 of 4 reviews
            </span>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Previous
              </button>

              <button
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}