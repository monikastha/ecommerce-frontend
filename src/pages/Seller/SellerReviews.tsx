import React, { useState, useMemo } from "react";
import { FaComments, FaSearch } from "react-icons/fa";

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

// Empty for now (as per your previous requests)
const initialReviews: Review[] = [];

export default function SellerCustomerEngagement() {
  const [reviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) =>
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reviews, searchQuery]);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .wrapper {
          display: flex;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }

        .sidebar {
          width: 260px;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: #445C6D;
          z-index: 100;
        }

        .main {
          margin-left: 260px;
          flex: 1;
          background: #f5f7fa;
          min-height: 100vh;
        }

        .container { 
          padding: 30px; 
        }

        .header {
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 25px; 
          padding: 15px 20px;
          background: white; 
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .titleBox { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .header-icon {
          width: 52px; 
          height: 52px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border-radius: 14px; 
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          color: white; 
          font-size: 22px;
        }
        .titleBox h1 { 
          font-size: 24px; 
          font-weight: 700; 
          margin: 0; 
          color: #0f172a; 
        }
        .titleBox h3 { 
          font-size: 13px; 
          color: #64748b; 
          margin: 4px 0 0 0; 
        }

        .search-container {
          display: flex; 
          align-items: center; 
          gap: 8px;
          background: white; 
          padding: 10px 14px; 
          border-radius: 10px;
          border: 1px solid #e2e8f0; 
          width: 340px;
        }
        .searchInput {
          border: none; 
          outline: none; 
          width: 100%; 
          font-size: 14px;
        }

        .review-card {
          background: white;
          border-radius: 12px;
          padding: 22px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 18px;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .status {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 600;
        }

        .actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
      `}</style>

      <div className="wrapper">
        <div className="sidebar">
          <SellerSidebar />
        </div>

        <div className="main">
          <SellerNavbar />

          <div className="container">
            <div className="header">
              <div className="titleBox">
                <div className="header-icon">
                  <FaComments />
                </div>
                <div>
                  <h1>Customer Engagement</h1>
                  <h3>Manage reviews and customer feedback</h3>
                </div>
              </div>

              <div className="search-container">
                <FaSearch style={{ color: "#94a3b8" }} />
                <input
                  type="text"
                  className="searchInput"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Reviews List */}
            <div>
              {filteredReviews.length === 0 ? (
                <div style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "80px 20px",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
                }}>
                  <FaComments style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
                  <h3>No reviews found</h3>
                  <p style={{ color: "#64748b", marginTop: "8px" }}>
                    Customer reviews will appear here
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div>
                        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>
                          {review.customerName}
                        </h3>
                        <p style={{ margin: "4px 0", color: "#374151" }}>
                          {review.productName}
                        </p>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          {review.date}
                        </span>
                      </div>

                      <span
                        className="status"
                        style={{
                          background: review.status === "Pending" ? "#fef3c7" : "#dcfce7",
                          color: review.status === "Pending" ? "#854d0e" : "#166534",
                        }}
                      >
                        {review.status}
                      </span>
                    </div>

                    <p style={{
                      margin: "16px 0",
                      lineHeight: "1.7",
                      color: "#374151",
                      fontSize: "14.5px"
                    }}>
                      "{review.comment}"
                    </p>

                    <div className="actions" style={{ display: "flex", gap: "12px" }}>
                      <button
                        style={{ background: "#1e40af", color: "white" }}
                        onClick={() => alert("Respond feature coming soon")}
                      >
                        Respond
                      </button>
                      <button
                        style={{ background: "#e2e8f0", color: "#1e2937" }}
                        onClick={() => alert("View details feature coming soon")}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}