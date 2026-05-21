import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const TOKEN = {
  heroFrom: "#831843",
  heroMid: "#be185d",
  heroTo: "#f472b6",
  pageBg: "#fdf2f8",
};

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface ProductState {
  id: number;
  name: string;
  price: string;
  old: string;
  rating: number;
  reviews: number;
  img: string;
  category: string;
  subcategory?: string;
  sold: number;
  color?: string;
  sizes?: string[];
  description?: string;
}

/* ─────────────────────────────────────────────
   STARS
───────────────────────────────────────────── */
const Stars = ({ n }: { n: number }) => (
  <span className="text-amber-400 text-lg">
    {"★".repeat(n)}{"☆".repeat(5 - n)}
  </span>
);

/* ─────────────────────────────────────────────
   PRODUCT PAGE
───────────────────────────────────────────── */
export default function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  useParams();

  /* Product data passed via navigate state */
  const product = location.state as ProductState | null;

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [addedCart, setAddedCart] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "review" | "delivery">("desc");

  /* If no state was passed (e.g. direct URL), show fallback */
  if (!product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: TOKEN.pageBg }}
      >
        <BuyerNavbar cartQty={0} />
        <div className="text-center py-32">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 text-lg font-semibold">Product not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 px-6 py-2.5 rounded-full text-white font-bold text-sm"
            style={{ background: `linear-gradient(135deg, ${TOKEN.heroFrom}, ${TOKEN.heroMid})` }}
          >
            ← Go Back
          </button>
        </div>
        <BuyerFooter />
      </div>
    );
  }

  const parsePrice = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10);
  const discount = Math.round(
    ((parsePrice(product.old) - parsePrice(product.price)) / parsePrice(product.old)) * 100
  );

  const handleAddCart = () => {
    if (product.sizes?.length && !selectedSize) {
      alert("Please select a size first!");
      return;
    }
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.sizes?.length && !selectedSize) {
      alert("Please select a size first!");
      return;
    }
    navigate("/checkout", {
      state: { product, qty, selectedSize },
    });
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: TOKEN.pageBg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* NAVBAR */}
      <BuyerNavbar cartQty={0} />

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button
            onClick={() => navigate("/")}
            className="hover:text-pink-600 font-medium bg-transparent border-none cursor-pointer"
          >
            Home
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/fashion")}
            className="hover:text-pink-600 font-medium bg-transparent border-none cursor-pointer"
          >
            Fashion
          </button>
          <span>›</span>
          {product.subcategory && (
            <>
              <span className="text-gray-400">{product.subcategory}</span>
              <span>›</span>
            </>
          )}
          <span className="text-pink-700 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      {/* PRODUCT MAIN SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* ── LEFT: IMAGE ── */}
            <div className="relative bg-pink-50 flex items-center justify-center overflow-hidden"
              style={{ minHeight: 420 }}
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover object-top"
                style={{ maxHeight: 520 }}
              />

              {/* DISCOUNT BADGE */}
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                -{discount}% OFF
              </span>

              {/* WISHLIST */}
              <button
                onClick={() => setLiked((prev) => !prev)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform border-none cursor-pointer"
              >
                {liked ? "❤️" : "🤍"}
              </button>

              {/* SUBCATEGORY TAG */}
              {product.subcategory && (
                <span className="absolute bottom-4 left-4 bg-white/90 text-pink-700 text-xs font-bold px-3 py-1 rounded-full border border-pink-200 shadow">
                  👗 {product.subcategory}
                </span>
              )}
            </div>

            {/* ── RIGHT: DETAILS ── */}
            <div className="p-7 flex flex-col justify-center">
              {/* CATEGORY */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                  {product.category}
                </span>
                {product.color && (
                  <span className="text-xs bg-pink-50 text-pink-600 border border-pink-200 px-2 py-0.5 rounded-full font-semibold">
                    {product.color}
                  </span>
                )}
              </div>

              {/* NAME */}
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* RATING + SOLD */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Stars n={product.rating} />
                <span className="text-sm text-gray-500">
                  ({product.reviews} reviews)
                </span>
                <span className="text-xs text-gray-400 border-l border-gray-200 pl-3">
                  {product.sold.toLocaleString()} sold
                </span>
              </div>

              {/* DIVIDER */}
              <div className="h-px bg-pink-100 my-4" />

              {/* PRICE */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-rose-600">
                  {product.price}
                </span>
                <span className="text-base line-through text-gray-400">
                  {product.old}
                </span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              </div>

              {/* SIZES */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">
                    Select Size:
                    {selectedSize && (
                      <span className="text-pink-600 ml-2 font-extrabold">
                        {selectedSize}
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer
                        ${
                          selectedSize === s
                            ? "border-pink-500 bg-pink-500 text-white shadow"
                            : "border-pink-200 text-pink-700 hover:border-pink-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUANTITY */}
              <div className="mt-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Quantity:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full border-2 border-pink-200 text-pink-700 font-extrabold text-lg flex items-center justify-center hover:bg-pink-50 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-lg font-extrabold text-gray-900 w-8 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-9 rounded-full border-2 border-pink-200 text-pink-700 font-extrabold text-lg flex items-center justify-center hover:bg-pink-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="h-px bg-pink-100 my-4" />

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 rounded-xl text-white font-extrabold text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${TOKEN.heroFrom}, ${TOKEN.heroMid})`,
                  }}
                >
                  🛍 Buy Now
                </button>

                <button
                  onClick={handleAddCart}
                  className={`flex-1 py-3 rounded-xl font-extrabold text-sm border-2 transition-all active:scale-95
                  ${
                    addedCart
                      ? "bg-green-500 text-white border-green-500 shadow"
                      : "border-pink-400 text-pink-700 hover:bg-pink-50"
                  }`}
                >
                  {addedCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>
              </div>

              {/* TRUST BADGES */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  { icon: "🚚", text: "Free Delivery" },
                  { icon: "↩️", text: "Easy Return" },
                  { icon: "💯", text: "Authentic" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex flex-col items-center gap-1 bg-pink-50 rounded-xl py-2 px-1"
                  >
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-[10px] font-semibold text-pink-700 text-center">
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
          {/* TAB HEADERS */}
          <div className="flex border-b border-pink-100">
            {[
              { key: "desc", label: "📋 Description" },
              { key: "review", label: "⭐ Reviews" },
              { key: "delivery", label: "🚚 Delivery" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-4 text-sm font-bold transition-all border-none cursor-pointer
                ${
                  activeTab === tab.key
                    ? "text-pink-700 border-b-2 border-pink-500 bg-pink-50"
                    : "text-gray-500 hover:text-pink-600 bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-6">
            {activeTab === "desc" && (
              <div>
                <h3 className="font-extrabold text-gray-900 mb-3">Product Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description ||
                    "This is a beautiful fashion product from Sajilo Mart. Crafted with care and premium materials, it is perfect for all occasions."}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: "Category", value: product.category },
                    { label: "Subcategory", value: product.subcategory || "—" },
                    { label: "Color", value: product.color || "—" },
                    { label: "Available Sizes", value: product.sizes?.join(", ") || "Free Size" },
                  ].map((row) => (
                    <div key={row.label} className="bg-pink-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 font-semibold">{row.label}</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "review" && (
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-center">
                    <p className="text-5xl font-black text-pink-600">{product.rating}.0</p>
                    <Stars n={product.rating} />
                    <p className="text-xs text-gray-400 mt-1">{product.reviews} reviews</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === product.rating ? 70 : star === product.rating - 1 ? 20 : 5;
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1">
                          <span className="text-xs w-2 text-gray-500">{star}</span>
                          <span className="text-amber-400 text-xs">★</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-amber-400 h-2 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-6">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SAMPLE REVIEWS */}
                {[
                  { name: "Priya S.", stars: 5, comment: "Absolutely beautiful! The fabric quality is amazing and the fit is perfect." },
                  { name: "Anita R.", stars: 4, comment: "Love the design. Delivery was quick. Slightly different shade than the photo but still lovely." },
                ].map((r) => (
                  <div key={r.name} className="border-t border-pink-50 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm font-bold text-pink-600">
                        {r.name[0]}
                      </div>
                      <p className="text-sm font-bold text-gray-800">{r.name}</p>
                      <Stars n={r.stars} />
                    </div>
                    <p className="text-sm text-gray-500 ml-10">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-4">
                {[
                  { icon: "⚡", title: "Standard Delivery", detail: "3–5 business days — Free above Rs. 1,500" },
                  { icon: "🚀", title: "Express Delivery", detail: "1–2 business days — Rs. 150 extra" },
                  { icon: "↩️", title: "Return Policy", detail: "7-day easy return. Item must be unused with original tags." },
                  { icon: "🔒", title: "Secure Payment", detail: "Pay via eSewa, Khalti, bank transfer or cash on delivery." },
                ].map((d) => (
                  <div key={d.title} className="flex items-start gap-4 p-4 bg-pink-50 rounded-2xl">
                    <span className="text-2xl">{d.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{d.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{d.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BACK BUTTON */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-pink-600 hover:text-pink-800 bg-white border border-pink-200 px-4 py-2 rounded-xl hover:bg-pink-50 transition-all cursor-pointer"
        >
          ← Back to Fashion
        </button>
      </div>

      {/* FOOTER */}
      <div className="mt-8">
        <BuyerFooter />
      </div>
    </div>
  );
}