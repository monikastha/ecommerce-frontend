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
    order.items.some((item: { id?: number }) => Number(item.id) === Number(productId))
  );
};

const ratingText = (rating: number) => `${rating}/5`;

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

  useEffect(() => {
    const syncReviews = () => setReviews(getBuyerProductReviews());
    window.addEventListener("buyer-review-change", syncReviews);
    window.addEventListener("storage", syncReviews);
    return () => {
      window.removeEventListener("buyer-review-change", syncReviews);
      window.removeEventListener("storage", syncReviews);
    };
  }, []);

  const productReviews = useMemo(
    () =>
      reviews
        .filter((review) => Number(review.productId) === Number(productId))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reviews, productId]
  );

  const purchasedOrder = useMemo(() => purchasedOrderForProduct(productId), [productId, reviews]);
  const canReview = !!purchasedOrder;
  const sentiment: ReviewSentiment = rating >= 3 ? "positive" : "negative";
  const averageRating = productReviews.length
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : 0;

  const submitReview = () => {
    if (!isBuyerLoggedIn()) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }

    if (!canReview) {
      alert("You can review this product only after purchasing it.");
      return;
    }

    if (!comment.trim()) {
      alert("Please write your review or comment.");
      return;
    }

    setSubmitting(true);

    const username = localStorage.getItem("username") || "Buyer";
    const nextReview: BuyerProductReview = {
      id: Date.now(),
      productId,
      productName,
      buyerUsername: username,
      rating,
      comment: comment.trim(),
      sentiment,
      createdAt: new Date().toISOString(),
      orderId: purchasedOrder?.id,
    };

    const nextReviews = [nextReview, ...getBuyerProductReviews()];
    saveReviews(nextReviews);
    setReviews(nextReviews);
    setComment("");
    setRating(5);
    setSubmitting(false);
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
              : "No comments yet for this product."}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-amber-500">
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
                <select
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 outline-none focus:border-violet-500"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} Star{value > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <p className={`mt-2 text-xs font-black ${sentiment === "positive" ? "text-green-700" : "text-red-700"}`}>
                  Detected: {sentiment}
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
            You can read earlier buyer reviews before purchase. Only buyers who purchased this product can write a new review.
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
                  <p className="text-sm font-black text-amber-500">{ratingText(review.rating)}</p>
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
            </article>
          ))
        )}
      </div>
    </section>
  );
}
