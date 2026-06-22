import { useEffect, useMemo, useState } from "react";
import { FaComments, FaSearch } from "react-icons/fa";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";
import type { BuyerProductReview } from "../Buyer/home/ReviewComments";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const REVIEWS_KEY = "buyer_product_reviews";

type SellerProduct = {
  id: number;
  name: string;
};

const getStoredReviews = (): BuyerProductReview[] => {
  try {
    const saved = localStorage.getItem(REVIEWS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStoredReviews = (reviews: BuyerProductReview[]) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new Event("buyer-review-change"));
};

export default function SellerCustomerEngagement() {
  const [reviews, setReviews] = useState<BuyerProductReview[]>(() => getStoredReviews());
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const syncReviews = () => setReviews(getStoredReviews());
    window.addEventListener("buyer-review-change", syncReviews);
    window.addEventListener("storage", syncReviews);
    return () => {
      window.removeEventListener("buyer-review-change", syncReviews);
      window.removeEventListener("storage", syncReviews);
    };
  }, []);

  useEffect(() => {
    const loadSellerProducts = async () => {
      const sellerId = localStorage.getItem("seller_id");
      if (!sellerId) return;

      try {
        const res = await fetch(`${API_ORIGIN}/api/products/?seller=${sellerId}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load seller products", error);
      }
    };

    loadSellerProducts();
  }, []);

  const productIds = useMemo(() => new Set(products.map((product) => Number(product.id))), [products]);

  const sellerReviews = useMemo(() => {
    const scopedReviews = productIds.size
      ? reviews.filter((review) => productIds.has(Number(review.productId)))
      : reviews;

    return scopedReviews.sort((a, b) => {
      if (a.sellerReply?.message && !b.sellerReply?.message) return 1;
      if (!a.sellerReply?.message && b.sellerReply?.message) return -1;
      if (a.sentiment !== b.sentiment) return a.sentiment === "positive" ? -1 : 1;
      if (a.rating !== b.rating) return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [productIds, reviews]);

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sellerReviews;

    return sellerReviews.filter((review) =>
      review.buyerUsername.toLowerCase().includes(query) ||
      review.productName.toLowerCase().includes(query) ||
      review.comment.toLowerCase().includes(query) ||
      (review.sellerReply?.message || "").toLowerCase().includes(query)
    );
  }, [sellerReviews, searchQuery]);

  const startReply = (review: BuyerProductReview) => {
    setActiveReplyId(review.id);
    setReplyText(review.sellerReply?.message || "");
  };

  const cancelReply = () => {
    setActiveReplyId(null);
    setReplyText("");
  };

  const saveReply = (reviewId: number) => {
    const message = replyText.trim();
    if (!message) {
      alert("Please write a reply before saving.");
      return;
    }

    const sellerName =
      localStorage.getItem("seller_name") ||
      localStorage.getItem("username") ||
      "Seller";

    const nextReviews = getStoredReviews().map((review) =>
      review.id === reviewId
        ? {
            ...review,
            sellerReply: {
              message,
              sellerName,
              createdAt: new Date().toISOString(),
            },
          }
        : review
    );

    saveStoredReviews(nextReviews);
    setReviews(nextReviews);
    cancelReply();
  };

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

        .container { padding: 30px; }

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
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .status {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 700;
          white-space: nowrap;
        }

        .actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .reply-box {
          margin-top: 16px;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          background: #eff6ff;
          padding: 14px;
        }

        .reply-box textarea {
          width: 100%;
          min-height: 96px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 12px;
          outline: none;
          resize: vertical;
          font-size: 14px;
        }

        .seller-reply {
          margin-top: 16px;
          border-left: 4px solid #10b981;
          background: #ecfdf5;
          border-radius: 8px;
          padding: 12px;
        }

        @media (max-width: 820px) {
          .main { margin-left: 0; }
          .sidebar { display: none; }
          .header { align-items: stretch; flex-direction: column; }
          .search-container { width: 100%; }
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
                  <h3>Reply to buyer reviews and customer feedback</h3>
                </div>
              </div>

              <div className="search-container">
                <FaSearch style={{ color: "#94a3b8" }} />
                <input
                  type="text"
                  className="searchInput"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>

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
                    Buyer reviews for your products will appear here.
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => {
                  const responded = Boolean(review.sellerReply?.message);

                  return (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div>
                          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>
                            {review.buyerUsername}
                          </h3>
                          <p style={{ margin: "4px 0", color: "#374151" }}>
                            {review.productName}
                          </p>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>
                            {new Date(review.createdAt).toLocaleString()} · Rating {review.rating}/5
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <span
                            className="status"
                            style={{
                              background: review.sentiment === "positive" ? "#dcfce7" : "#fee2e2",
                              color: review.sentiment === "positive" ? "#166534" : "#991b1b",
                            }}
                          >
                            {review.sentiment}
                          </span>
                          <span
                            className="status"
                            style={{
                              background: responded ? "#dbeafe" : "#fef3c7",
                              color: responded ? "#1e40af" : "#854d0e",
                            }}
                          >
                            {responded ? "Responded" : "Pending Reply"}
                          </span>
                        </div>
                      </div>

                      <p style={{
                        margin: "16px 0",
                        lineHeight: "1.7",
                        color: "#374151",
                        fontSize: "14.5px"
                      }}>
                        "{review.comment}"
                      </p>

                      {review.sellerReply?.message && (
                        <div className="seller-reply">
                          <p style={{ color: "#047857", fontSize: "12px", fontWeight: 900, textTransform: "uppercase" }}>
                            Your Reply
                          </p>
                          <p style={{ marginTop: "8px", color: "#334155", lineHeight: 1.6 }}>
                            {review.sellerReply.message}
                          </p>
                          <p style={{ marginTop: "8px", color: "#047857", fontSize: "12px", fontWeight: 700 }}>
                            {new Date(review.sellerReply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {activeReplyId === review.id && (
                        <div className="reply-box">
                          <textarea
                            value={replyText}
                            onChange={(event) => setReplyText(event.target.value)}
                            placeholder="Write a helpful seller reply..."
                          />
                          <div className="actions" style={{ marginTop: "12px" }}>
                            <button
                              style={{ background: "#1e40af", color: "white" }}
                              onClick={() => saveReply(review.id)}
                            >
                              Save Reply
                            </button>
                            <button
                              style={{ background: "#e2e8f0", color: "#1e2937" }}
                              onClick={cancelReply}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {activeReplyId !== review.id && (
                        <div className="actions" style={{ marginTop: "16px" }}>
                          <button
                            style={{ background: responded ? "#0f766e" : "#1e40af", color: "white" }}
                            onClick={() => startReply(review)}
                          >
                            {responded ? "Edit Reply" : "Reply"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
