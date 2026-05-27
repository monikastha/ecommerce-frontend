import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar2 from "../../../components/BuyerNavbar2";
import BuyerFooter from "../../../components/BuyerFooter";

import shoesImg from "../../../assets/shoes4.jpg";
import Necklace from "../../../assets/accessories2.jpg";
import iphun from "../../../assets/iphun.jpg";
import Headphone from "../../../assets/headphone.jpg";
import bbGirl from "../../../assets/bbimg-removebg-preview.png";
import trendy from "../../../assets/trendy.png";
import laptop from "../../../assets/laptop hp.jpg";
import homeGoods from "../../../assets/home goods.jpg";
import cosmetics from "../../../assets/cosmetics.jpeg";
import medicine from "../../../assets/medicine.jpg";
import studyMaterial from "../../../assets/study-material.jpg";
import cartoon1 from "../../../assets/cartoon1.png";
import cartoon2 from "../../../assets/cartoon2.png";


/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS  — change these ONE place to retheme the whole site
───────────────────────────────────────────────────────────── */
const TOKEN = {
  // brand
  primary: "#7c3aed", // violet-600
  primaryDark: "#5b21b6", // violet-800
  primaryLight: "#ede9fe", // violet-100
  accent: "#22c55e", // green-500
  accentDark: "#15803d", // green-700
  // hero gradient
  heroFrom: "#4f0aab",
  heroMid: "#7c3aed",
  heroTo: "#c026d3",
  // bg / surface
  pageBg: "#f0eff4",
  cardBg: "#ffffff",
  // text
  textPrimary: "#111827",
  textMuted: "#6b7280",
  textLight: "#9ca3af",
};

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const topProducts = [
  {
    id: 1,
    name: "Black Leather Shoes",
    price: "Rs. 1,799",
    old: "Rs. 2,120",
    rating: 4,
    reviews: 128,
    img: shoesImg,
    category: "Shoes",
    sold: 432,
  },
  {
    id: 2,
    name: "Red Emerald Necklace",
    price: "Rs. 2,199",
    old: "Rs. 2,799",
    rating: 4,
    reviews: 97,
    img: Necklace,
    category: "Accessories",
    sold: 210,
  },
  {
    id: 3,
    name: "Apple iPhone 15 Pro",
    price: "Rs. 91,999",
    old: "Rs. 99,999",
    rating: 5,
    reviews: 251,
    img: iphun,
    category: "Electronics",
    sold: 1200,
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: "Rs. 3,499",
    old: "Rs. 4,200",
    rating: 4,
    reviews: 183,
    img: Headphone,
    category: "Electronics",
    sold: 560,
  },
];

const categories = [
  { id: 1, title: "Fashion", sub: "Trendy Outfits", img: trendy, path: "/fashion" },
  { id: 2, title: "Electronics", sub: "Latest Gadgets", img: laptop, path: "/electronics" },
  { id: 3, title: "Home Goods", sub: "Home Essentials", img: homeGoods, path: "/homegoods" },
  { id: 4, title: "Cosmetics", sub: "Beauty Products", img: cosmetics, path: "/cosmetics" },
  { id: 5, title: "Medicine", sub: "Healthcare", img: medicine, path: "/medicine" },
  {
    id: 6,
    title: "Study Materials",
    sub: "Books & Guides",
    img: studyMaterial,
    path: "/studymaterials",
  },
];

const reviews = [
  {
    id: 1,
    name: "Kabita Kumal",
    text: "Excellent! Fast delivery and very supportive. Will order again definitely.",
    rating: 5,
    img: cartoon1,
  },
  {
    id: 2,
    name: "Kabita Thapa",
    text: "Great products at best prices. Will definitely order again once in a lifetime deals.",
    rating: 5,
    img: cartoon2,
  },
];

const FEATURES = [
  {
    emoji: "🚚",
    bg: "bg-emerald-50 text-emerald-600",
    title: "Emergency Fast Delivery",
    sub: "Fast delivery in your area",
  },
  {
    emoji: "🤖",
    bg: "bg-violet-50 text-violet-600",
    title: "AI Smart Comparison",
    sub: "Compare products instantly",
  },
  {
    emoji: "🎧",
    bg: "bg-amber-50 text-amber-600",
    title: "24/7 Support",
    sub: "We're here to help",
  },
];

const TRUST = [
  {
    emoji: "✅",
    ring: "ring-emerald-200 bg-emerald-50",
    title: "Original Products",
    sub: "100% Authentic Brands",
    tc: "text-emerald-700",
  },
  {
    emoji: "🏷️",
    ring: "ring-yellow-200  bg-yellow-50",
    title: "Best Prices",
    sub: "Unbeatable Deals",
    tc: "text-yellow-700",
    sale: true,
  },
  {
    emoji: "👥",
    ring: "ring-blue-200    bg-blue-50",
    title: "Trusted by 1000+ Customers",
    sub: "Join the Sajilo family today",
    tc: "text-blue-700",
  },
];

/* ─────────────────────────────────────────────────────────────
   TINY HELPERS
───────────────────────────────────────────────────────── */
const Stars = ({ n }: { n: number }) => (
  <span aria-label={`${n} stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={i <= n ? "text-amber-400" : "text-gray-200"}>
        ★
      </span>
    ))}
  </span>
);

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function SajiloMart() {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [cartQty, setCartQty] = useState(0);
  const navigate = useNavigate();

  const openProduct = (product: (typeof topProducts)[number]) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  /* ── shared tw snippets ── */
  const sectionHead = "flex items-center justify-between mb-5";
  const h2Class = "text-xl font-extrabold text-gray-900 tracking-tight";
  const viewAll =
    "text-sm font-semibold text-violet-600 hover:text-violet-800 hover:underline cursor-pointer bg-transparent border-none transition-colors";

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: TOKEN.pageBg,
        fontFamily: "'Segoe UI',system-ui,sans-serif",
      }}
    >
      <BuyerNavbar2 cartQty={cartQty} />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <section
          className="relative flex items-center rounded-2xl"
          style={{
            background: `linear-gradient(120deg, ${TOKEN.heroFrom} 0%, ${TOKEN.heroMid} 55%, ${TOKEN.heroTo} 100%)`,
            minHeight: 320,
            /* Note: overflow-hidden removed to allow image to sit 'on top' */
          }}
        >
          {/* Decorative Background Circles */}
          <div className="absolute right-64 top-15 w-72 h-72 rounded-full opacity-10 bg-white pointer-events-none" />
          <div className="absolute left-[40%] bottom-10 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none" />

          {/* Text Content */}
          <div className="flex-1 px-10 py-10 z-10">
            <span className="inline-block bg-white/20 text-white/90 text-[10px] font-bold tracking-[.15em] uppercase px-3 py-1 rounded-full mb-4">
              New Arrivals
            </span>
            <h1
              className="text-white font-black leading-none mb-2"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontFamily: "Georgia, serif",
                textShadow: "0 2px 16px rgba(0,0,0,.25)",
              }}
            >
              Sajilo Mart
            </h1>
            <p
              className="text-yellow-300 font-medium mb-4"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
                fontFamily: "cursive",
              }}
            >
              Shop Anytime, Anywhere
            </p>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-6">
              Discover thousands of products across fashion, electronics, home
              essentials, and more — all at your fingertips.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/buyer/products")}
                className="bg-yellow-300 hover:bg-yellow-400 text-violet-900 font-extrabold text-sm px-6 py-2.5 rounded-full border-none cursor-pointer transition-all shadow-lg active:scale-95"
              >
                Browse Products →
              </button>
              <button
                onClick={() => navigate("/buyer/categories")}
                className="bg-transparent hover:bg-white/10 text-white font-semibold text-sm px-6 py-2.5 rounded-full border-2 border-white/60 cursor-pointer transition-colors"
              >
                View Offers
              </button>
            </div>
          </div>

          {/* Hero Image Container */}
          <div
            className="relative h-full shrink-0 self-end flex items-end justify-end"
            style={{ width: "clamp(200px, 32%, 400px)" }}
          >
            <img
              src={bbGirl}
              alt="Hero Visual"
              className="relative z-20 h-[115%] w-auto object-contain drop-shadow-2xl"
              style={{ marginBottom: "-1px" }} // Ensures it sits flush on the bottom edge
            />
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════
          FEATURE STRIP
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-100 px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${f.bg}`}
              >
                {f.emoji}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  {f.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          TOP SELLS
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className={sectionHead}>
          <h2 className={h2Class}>Top sells</h2>
          <button onClick={() => navigate("/buyer/products")} className={viewAll}>
            View All Products →
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => openProduct(p)}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-1 transition-all duration-200 group"
            >
              {/* image area */}
              <div
                className="relative overflow-hidden bg-gray-50"
                style={{ height: 200 }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* wishlist */}
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setLiked((l) => ({ ...l, [p.id]: !l[p.id] }));
                  }}
                  className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center border-none cursor-pointer text-sm transition-colors
                    ${liked[p.id] ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
                >
                  {liked[p.id] ? "♥" : "♡"}
                </button>
              </div>

              {/* info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 min-h-10">
                  {p.name}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Stars n={p.rating} />
                  <span className="text-xs text-gray-400">({p.reviews})</span>
                </div>
                <div className="mt-1.5">
                  <span className="text-base font-extrabold text-gray-900">
                    {p.price}
                  </span>
                  <span className="text-xs text-gray-300 line-through ml-2">
                    {p.old}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      openProduct(p);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg border-none cursor-pointer transition-colors"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setCartQty((c) => c + 1);
                    }}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-2 rounded-lg border-none cursor-pointer transition-colors"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          SHOP BY CATEGORY
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className={sectionHead}>
          <h2 className={h2Class}>Shop by Category</h2>
          <button onClick={() => navigate("/buyer/categories")} className={viewAll}>
            View All Categories →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(c.path)}
              className="bg-white rounded-xl border border-gray-100 flex items-center gap-4 p-3 cursor-pointer hover:shadow-md hover:shadow-violet-100 hover:border-violet-200 transition-all duration-200 group"
            >
              <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{c.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRUST.map((t) => (
            <div
              key={t.title}
              className="flex items-center gap-3 justify-center"
            >
              <div
                className={`w-12 h-12 rounded-full ${t.ring} ring-2 flex items-center justify-center text-2xl shrink-0 relative`}
              >
                {t.emoji}
                {t.sale && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[7px] font-black px-1 py-0.5 rounded uppercase tracking-wide">
                    SALE
                  </span>
                )}
              </div>
              <div>
                <p className={`text-sm font-bold ${t.tc}`}>{t.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          REVIEWS
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className={sectionHead}>
          <h2 className={h2Class}>What Our Customers Say</h2>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={viewAll}>
            Back to Top ↑
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={r.img}
                alt={r.name}
                className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-violet-100"
              />
              <div>
                <p className="text-sm font-bold text-gray-900">{r.name}</p>
                <Stars n={r.rating} />
                <p className="text-xs text-gray-500 leading-relaxed mt-1.5">
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BuyerFooter />
    </div>
  );
}
