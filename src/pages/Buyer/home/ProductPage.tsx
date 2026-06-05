import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import {
  addBuyerCartItem,
  getBuyerCartCount,
} from "../../../utils/buyerCart";
import { isBuyerLoggedIn } from "../../../utils/buyerAuth";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Product = {
  id: number;
  name: string;
  category?: number | { id?: number; name?: string } | null;
  category_name?: string;
  code?: string;
  description?: string;
  price: string;
  quantity: number;
  image?: string;
  status: "pending" | "approved" | "rejected";
  is_published: boolean;
};

type ApiLocation = {
  id: number;
  name: string;
  city: string;
  province: string;
  status: string;
};

type ApiStock = {
  id: number;
  product: number;
  quantity: number;
  available_to_buyers: boolean;
};

type ApiPromotion = {
  id: number;
  name: string;
  d_type: "percentage" | "fixed";
  d_value: number | string | null;
  applies_to: "all" | "category";
  categories: number[];
  start_date: string;
  end_date: string;
  status: string;
};

type Review = {
  id: number;
  product: number;
  buyer_username: string;
  rating: number;
  review_message: string;
  sentiment: "positive" | "negative";
  created_at: string;
};

const imageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("/") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
};

const priceNumber = (value: string | number) => Number(String(value).replace(/[^0-9.]/g, "")) || 0;
const currency = (value: string | number) => `Rs. ${priceNumber(value).toLocaleString()}`;

const productCategoryName = (product?: Product | null) => {
  if (!product) return "All";
  if (product.category_name?.trim()) return product.category_name.trim();
  if (product.category && typeof product.category === "object" && product.category.name?.trim()) {
    return product.category.name.trim();
  }
  return "Product";
};

const productCategoryId = (product?: Product | null) => {
  if (!product) return null;
  if (typeof product.category === "number") return product.category;
  if (product.category && typeof product.category === "object" && product.category.id) return product.category.id;
  return null;
};

const isPromotionActive = (promotion: ApiPromotion) => {
  const now = Date.now();
  return (
    promotion.status === "active" &&
    new Date(promotion.start_date).getTime() <= now &&
    new Date(promotion.end_date).getTime() >= now
  );
};

const promotionForProduct = (product: Product | null, promotions: ApiPromotion[]) => {
  const categoryId = productCategoryId(product);
  const priceAfterPromotion = (promotion: ApiPromotion) => {
    const basePrice = priceNumber(product?.price || 0);
    const value = priceNumber(promotion.d_value || 0);
    return promotion.d_type === "percentage"
      ? Math.max(0, basePrice - (basePrice * value) / 100)
      : Math.max(0, basePrice - value);
  };

  return promotions
    .filter(isPromotionActive)
    .filter((promotion) =>
      promotion.applies_to === "all" ||
      (categoryId !== null && promotion.categories?.includes(categoryId))
    )
    .sort((a, b) => priceAfterPromotion(a) - priceAfterPromotion(b))[0];
};

const discountedPrice = (price: string | number, promotion?: ApiPromotion) => {
  const basePrice = priceNumber(price);
  if (!promotion) return basePrice;
  const value = priceNumber(promotion.d_value || 0);
  if (promotion.d_type === "percentage") return Math.max(0, basePrice - (basePrice * value) / 100);
  return Math.max(0, basePrice - value);
};

export default function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>((location.state as Product) || null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(!location.state);
  const [cartQty, setCartQty] = useState(getBuyerCartCount());
  const [added, setAdded] = useState(false);
  const [locations, setLocations] = useState<ApiLocation[]>([]);
  const [stocks, setStocks] = useState<ApiStock[]>([]);
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_message: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("buyer_delivery_location") || ""
  );

  useEffect(() => {
    const refreshCart = () => setCartQty(getBuyerCartCount());
    window.addEventListener("buyer-cart-change", refreshCart);
    return () => window.removeEventListener("buyer-cart-change", refreshCart);
  }, []);

  useEffect(() => {
    if (product || !id) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_ORIGIN}/api/products/${id}/`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, product]);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const [locationRes, stockRes, promotionRes] = await Promise.all([
          fetch(`${API_ORIGIN}/api/locations/`),
          fetch(`${API_ORIGIN}/api/warehouse/stock/?available=true${id ? `&product=${id}` : ""}`),
          fetch(`${API_ORIGIN}/api/admin/promotions/`),
        ]);
        const [locationData, stockData, promotionData] = await Promise.all([
          locationRes.json(),
          stockRes.json(),
          promotionRes.json(),
        ]);
        setLocations(Array.isArray(locationData) ? locationData : []);
        setStocks(Array.isArray(stockData) ? stockData : []);
        setPromotions(Array.isArray(promotionData) ? promotionData : []);
      } catch (error) {
        console.error(error);
      }
    };
    loadAvailability();
  }, [id]);

  const loadReviews = async () => {
    if (!id) return;
    try {
      const res = await fetch(`${API_ORIGIN}/api/reviews/?product=${id}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  const activeLocations = locations.filter((loc) => {
    const status = String(loc.status || "").trim().toLowerCase();
    return !status || status === "active";
  });
  const selectedLocationName = (() => {
    const loc = locations.find((item) => String(item.id) === selectedLocation);
    return loc ? `${loc.name} - ${loc.city}` : "";
  })();
  const productStock = stocks.find(
    (stock) =>
      stock.quantity > 0 &&
      stock.available_to_buyers &&
      (!product || stock.product === product.id)
  );
  const availableQuantity = productStock?.quantity || 0;
  const activePromotion = promotionForProduct(product, promotions);
  const finalPrice = product ? discountedPrice(product.price, activePromotion) : 0;
  const hasPurchasedProduct = (() => {
    if (!product) return false;
    try {
      const orders = JSON.parse(localStorage.getItem("buyer_orders") || "[]");
      return Array.isArray(orders) && orders.some((order) =>
        Array.isArray(order.items) && order.items.some((item: { id: number }) => item.id === product.id)
      );
    } catch {
      return false;
    }
  })();
  const reviewSentiment = reviewForm.rating >= 3 ? "positive" : "negative";

  const requireBuyerLogin = () => {
    if (isBuyerLoggedIn()) return true;
    navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
    return false;
  };

  const requireDeliveryLocation = () => {
    if (selectedLocation) return true;
    alert("Please select your delivery location first.");
    return false;
  };

  const addToCart = () => {
    if (!product) return;
    if (!requireBuyerLogin()) return;
    if (!requireDeliveryLocation()) return;
    if (!productStock) {
      alert("Out of Stock.");
      return;
    }
    const category = productCategoryName(product);
    addBuyerCartItem(
      {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: imageUrl(product.image),
        category,
        description: product.description,
        stock: productStock.quantity,
        locationId: Number(selectedLocation),
        locationName: selectedLocationName,
      },
      qty
    );
    setCartQty(getBuyerCartCount());
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const buyNow = () => {
    if (!product) return;
    if (!requireBuyerLogin()) return;
    if (!requireDeliveryLocation()) return;
    if (!productStock) {
      alert("Out of Stock.");
      return;
    }
    const category = productCategoryName(product);
    navigate("/checkout", {
      state: {
        buyNow: true,
        items: [
          {
            id: product.id,
            name: product.name,
            price: finalPrice,
            image: imageUrl(product.image),
            category,
            description: product.description,
            quantity: qty,
            stock: productStock.quantity,
            locationId: Number(selectedLocation),
            locationName: selectedLocationName,
          },
        ],
      },
    });
  };

  const submitReview = async () => {
    if (!product) return;
    if (!isBuyerLoggedIn()) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    if (!hasPurchasedProduct) {
      alert("You can review this product after purchasing it.");
      return;
    }
    if (!reviewForm.review_message.trim()) {
      alert("Please write your review or comment.");
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API_ORIGIN}/api/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.id,
          buyer_username: localStorage.getItem("username") || "Buyer",
          rating: reviewForm.rating,
          review_message: reviewForm.review_message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setReviewForm({ rating: 5, review_message: "" });
      await loadReviews();
    } catch (error) {
      console.error(error);
      alert("Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={cartQty} activeCat={productCategoryName(product)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center font-bold text-slate-500">
            Loading product...
          </div>
        ) : !product || !product.is_published || product.status !== "approved" ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
            <h1 className="text-xl font-black text-slate-900">Product not available</h1>
            <button
              onClick={() => navigate("/allproducts")}
              className="mt-5 px-6 py-3 rounded-lg bg-violet-600 text-white font-bold"
            >
              Back to Products
            </button>
          </div>
        ) : (
          <>
            <div className="text-xs text-slate-500 mb-4">
              <button onClick={() => navigate("/allproducts")} className="font-bold hover:text-violet-700">
                Products
              </button>
              <span className="mx-2">/</span>
              <span>{productCategoryName(product)}</span>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 min-h-[360px] flex items-center justify-center">
                {product.image ? (
                  <img
                    src={imageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full max-h-[560px] object-cover"
                  />
                ) : (
                  <span className="text-slate-400 font-bold">No Image</span>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-xs font-black text-violet-600 uppercase">
                  {productCategoryName(product)}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {product.name}
                </h1>
                {product.code && (
                  <p className="text-sm text-slate-500 mt-2">Code: {product.code}</p>
                )}
                <div className="mt-5">
                  {activePromotion && (
                    <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">
                      {activePromotion.name}
                    </span>
                  )}
                  <p className="text-3xl font-black text-rose-600 mt-2">
                    {currency(finalPrice)}
                  </p>
                  {activePromotion && (
                    <p className="text-sm font-bold text-slate-400 line-through">
                      {currency(product.price)}
                    </p>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {availableQuantity > 0
                    ? `${availableQuantity} items available`
                    : "Out of Stock"}
                </p>

                <label className="block mt-5">
                  <span className="text-sm font-black text-slate-900">Delivery Location</span>
                  <select
                    value={selectedLocation}
                    onChange={(event) => {
                      setSelectedLocation(event.target.value);
                      if (event.target.value) localStorage.setItem("buyer_delivery_location", event.target.value);
                      else localStorage.removeItem("buyer_delivery_location");
                    }}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 outline-none focus:border-violet-500"
                  >
                    <option value="">Select delivery location</option>
                    {activeLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} - {loc.city}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-6">
                  <h2 className="text-sm font-black text-slate-900">Key Specifications:</h2>
                  <p className="text-sm text-slate-600 mt-2 leading-6">
                    {product.description || "No product description provided."}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900">Quantity</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty((value) => Math.max(1, value - 1))}
                      className="w-10 h-10 bg-white text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold">{qty}</span>
                    <button
                      onClick={() => setQty((value) => Math.min(availableQuantity || 1, value + 1))}
                      className="w-10 h-10 bg-white text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
                    <button
                      onClick={buyNow}
                    disabled={availableQuantity === 0}
                      className="py-3 rounded-lg bg-green-600 text-white font-black hover:bg-green-700 disabled:bg-slate-300"
                    >
                    Buy Now
                  </button>
                    <button
                      onClick={addToCart}
                    disabled={availableQuantity === 0}
                      className={`py-3 rounded-lg text-white font-black disabled:bg-slate-300 ${
                      added ? "bg-green-600" : "bg-violet-600 hover:bg-violet-700"
                    }`}
                  >
                    {added ? "Added to Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-lg mt-6 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Reviews & Comments</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Buyers can comment after purchasing this product.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {reviews.length} reviews
                </span>
              </div>

              {hasPurchasedProduct ? (
                <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4">
                    <label className="block">
                      <span className="text-sm font-bold text-slate-700">Rating</span>
                      <select
                        value={reviewForm.rating}
                        onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 outline-none focus:border-violet-500"
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>{rating} Star{rating > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                      <p className={`mt-2 text-xs font-black ${reviewSentiment === "positive" ? "text-green-700" : "text-red-700"}`}>
                        Detected: {reviewSentiment}
                      </p>
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-slate-700">Review / Comment</span>
                      <textarea
                        value={reviewForm.review_message}
                        onChange={(event) => setReviewForm({ ...reviewForm, review_message: event.target.value })}
                        className="mt-1 w-full min-h-[110px] rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500"
                        placeholder="Share your product experience..."
                      />
                    </label>
                  </div>
                  <button
                    onClick={submitReview}
                    disabled={reviewSubmitting}
                    className="mt-4 rounded-lg bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-700 disabled:bg-violet-300"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
                  Purchase this product first to write a review or comment.
                </div>
              )}

              <div className="mt-6 space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-500">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <article key={review.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-black text-slate-900">{review.buyer_username || "Buyer"}</p>
                          <p className="text-sm text-amber-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${
                          review.sentiment === "positive"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {review.sentiment}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{review.review_message}</p>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <BuyerFooter />
    </div>
  );
}
