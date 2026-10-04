/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isBuyerLoggedIn } from "../../../utils/buyerAuth";

type ReviewSentiment = "positive" | "negative";

export type BuyerProductReview = {
  id: number;
  productId: number;
  productName: string;
  buyerUsername: string;
  rating: number;
  comment: string;
  sentiment: ReviewSentiment;
  createdAt: string;
  orderId?: string;
  sellerReply?: {
    message: string;
    sellerName: string;
    createdAt: string;
  };
};

type ReviewCommentsProps = {
  productId: number;
  productName: string;
  className?: string;
  compact?: boolean;
  showForm?: boolean;
};

const REVIEWS_KEY = "buyer_product_reviews";
const ORDERS_KEY = "buyer_orders";
const STAR_VALUES = [1, 2, 3, 4, 5];
const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getBuyerProductReviews = (): BuyerProductReview[] => {
  try {
    const saved = localStorage.getItem(REVIEWS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveReviews = (reviews: BuyerProductReview[]) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new Event("buyer-review-change"));
};

const mapApiReview = (review: any): BuyerProductReview => ({
  id: Number(review.id),
  productId: Number(review.product),
  productName: review.product_name || "Product",
  buyerUsername: review.buyer_username || "Buyer",
  rating: Number(review.rating || 0),
  comment: review.review_message || "",
  sentiment: review.sentiment === "negative" ? "negative" : "positive",
  createdAt: review.created_at || review.date || new Date().toISOString(),
  sellerReply: review.seller_reply_message
    ? {
        message: review.seller_reply_message,
        sellerName: review.seller_reply_name || "Seller",
        createdAt: review.seller_reply_at || review.updated_at || new Date().toISOString(),
      }
    : undefined,
});

const readOrders = (): any[] => {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const purchasedOrderForProduct = (productId: number) => {
  return readOrders().find((order) =>
    Array.isArray(order.items) &&
    (order.status === "delivered" || order.status === "completed") &&
    order.items.some((item: { id?: number; product?: number }) =>
      Number(item.product || item.id) === Number(productId)
    )
  );
};

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  sizeClass?: string;
  className?: string;
};

const StarRating = ({
  value,
  onChange,
  sizeClass = "text-lg",
  className = "",
}: StarRatingProps) => {
  const roundedValue = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${roundedValue} out of 5 stars`}>
      {STAR_VALUES.map((star) => {
        const isFilled = star <= roundedValue;
        const starIcon = (
          <span className={`${sizeClass} leading-none ${isFilled ? "text-amber-400" : "text-slate-300"}`}>
            {isFilled ? "★" : "☆"}
          </span>
        );

        if (!onChange) {
          return <span key={star}>{starIcon}</span>;
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded px-0.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            {starIcon}
          </button>
        );
      })}
    </div>
  );
};

export default function ReviewComments({
  productId,
  productName,
  className = "",
  compact = false,
  showForm = true,
}: ReviewCommentsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [reviews, setReviews] = useState<BuyerProductReview[]>(() => getBuyerProductReviews());
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [deliveredOrder, setDeliveredOrder] = useState<any | null>(() => purchasedOrderForProduct(productId) || null);

  useEffect(() => {
    const syncReviews = () => setReviews(getBuyerProductReviews());
    window.addEventListener("buyer-review-change", syncReviews);
    window.addEventListener("storage", syncReviews);
    return () => {
      window.removeEventListener("buyer-review-change", syncReviews);
      window.removeEventListener("storage", syncReviews);
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadBackendData = async () => {
      setLoadingReviews(true);
      const username = localStorage.getItem("username") || "";
      const userId = localStorage.getItem("user_id") || "";
      const orderQuery = userId
        ? `user_id=${encodeURIComponent(userId)}`
        : `username=${encodeURIComponent(username)}`;

      try {
        const [reviewsRes, ordersRes] = await Promise.all([
          fetch(`${API_ORIGIN}/api/reviews/?product=${productId}`),
          fetch(`${API_ORIGIN}/api/orders/?${orderQuery}`),
        ]);

        const reviewsData = await reviewsRes.json();
        const ordersData = await ordersRes.json();

        if (!ignore && reviewsRes.ok && Array.isArray(reviewsData)) {
          const backendReviews = reviewsData.map(mapApiReview);
          const localOtherReviews = getBuyerProductReviews().filter(
            (review) => Number(review.productId) !== Number(productId)
          );
          const nextReviews = [...backendReviews, ...localOtherReviews];
          saveReviews(nextReviews);
          setReviews(nextReviews);
        }

        if (!ignore && ordersRes.ok && Array.isArray(ordersData)) {
          const delivered = ordersData.find((order: any) =>
            (order.status === "delivered" || order.status === "completed") &&
            Array.isArray(order.items) &&
            order.items.some((item: any) => Number(item.product) === Number(productId))
          );
          setDeliveredOrder(delivered || purchasedOrderForProduct(productId) || null);
        }
      } catch (error) {
        if (!ignore) {
          setDeliveredOrder(purchasedOrderForProduct(productId) || null);
        }
        console.error("Failed to load product reviews", error);
      } finally {
        if (!ignore) setLoadingReviews(false);
      }
    };

    loadBackendData();

    return () => {
      ignore = true;
    };
  }, [productId]);

  const productReviews = useMemo(
    () =>
      reviews
        .filter((review) => Number(review.productId) === Number(productId))
        .sort((a, b) => {
          if (a.sentiment !== b.sentiment) {
            return a.sentiment === "positive" ? -1 : 1;
          }
          if (a.rating !== b.rating) {
            return b.rating - a.rating;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
    [reviews, productId]
  );

  const purchasedOrder = deliveredOrder || purchasedOrderForProduct(productId);
  const canReview = !!purchasedOrder;
  const sentiment: ReviewSentiment = rating >= 3 ? "positive" : "negative";
  const averageRating = productReviews.length
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : 0;

  const submitReview = async () => {
    if (!isBuyerLoggedIn()) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }

    if (!canReview) {
      alert("You can review this product only after the order is delivered.");
      return;
    }

    if (!comment.trim()) {
      alert("Please write your review or comment.");
      return;
    }

    setSubmitting(true);

    const username = localStorage.getItem("username") || "Buyer";
    try {
      const res = await fetch(`${API_ORIGIN}/api/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productId,
          buyer_username: username,
          rating,
          review_message: comment.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.detail || data.error || data.non_field_errors?.[0] || "Review submission failed.";
        throw new Error(message);
      }

      const nextReview = { ...mapApiReview(data), productName, orderId: purchasedOrder?.id };
      const nextReviews = [nextReview, ...getBuyerProductReviews().filter((review) => review.id !== nextReview.id)];
      saveReviews(nextReviews);
      setReviews(nextReviews);
      setComment("");
      setRating(5);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Review submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`bg-white border border-slate-200 rounded-lg ${compact ? "p-4" : "p-6"} ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`${compact ? "text-lg" : "text-xl"} font-black text-slate-900`}>
            Reviews & Comments
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {productReviews.length
              ? `${productReviews.length} earlier buyer review${productReviews.length > 1 ? "s" : ""} for ${productName}.`
              : loadingReviews
              ? "Loading buyer reviews..."
              : "No comments yet for this product."}
          </p>
        </div>
        <div className="text-right">
          <div className="flex justify-end">
            <StarRating value={averageRating} sizeClass="text-base" />
          </div>
          <p className="mt-1 text-sm font-black text-amber-500">
            {productReviews.length ? averageRating.toFixed(1) : "0.0"} / 5
          </p>
          <p className="text-xs font-bold text-slate-500">{productReviews.length} reviews</p>
        </div>
      </div>

      {showForm && (
        canReview ? (
          <div className="mt-5 rounded-lg border border-violet-100 bg-violet-50/40 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Rating</span>
                <div className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
                  <StarRating value={rating} onChange={setRating} sizeClass="text-2xl" />
                </div>
                <p className={`mt-2 text-xs font-black ${sentiment === "positive" ? "text-green-700" : "text-red-700"}`}>
                  {rating} Star{rating > 1 ? "s" : ""} · Detected: {sentiment}
                </p>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Review / Comment</span>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  className="mt-1 w-full min-h-[110px] rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500"
                  placeholder="Share the product condition, quality, delivery experience, and whether it is worth buying..."
                />
              </label>
            </div>
            <button
              onClick={submitReview}
              disabled={submitting}
              className="mt-4 rounded-lg bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-700 disabled:bg-violet-300"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
            You can read earlier buyer reviews before delivery. Only buyers with a delivered order can write a new review.
          </div>
        )
      )}

      <div className="mt-5 space-y-4">
        {productReviews.length === 0 ? (
          <p className="text-sm text-slate-500">
            There is no comment yet. You can continue checkout normally.
          </p>
        ) : (
          productReviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-black text-slate-900">{review.buyerUsername}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating value={review.rating} sizeClass="text-base" />
                    <span className="text-xs font-black text-slate-500">{review.rating}/5</span>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                  review.sentiment === "positive"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {review.sentiment}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
              <p className="mt-3 text-xs font-semibold text-slate-400">
                {new Date(review.createdAt).toLocaleString()}
              </p>
              {review.sellerReply?.message && (
                <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-xs font-black uppercase text-emerald-700">
                    Seller Reply
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {review.sellerReply.message}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-emerald-700">
                    {review.sellerReply.sellerName} · {new Date(review.sellerReply.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
