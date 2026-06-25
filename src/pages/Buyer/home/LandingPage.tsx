/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";
import {
  addBuyerCartItem,
  getBuyerCartCount,
} from "../../../utils/buyerCart";
import { isBuyerLoggedIn } from "../../../utils/buyerAuth";
import {
  getBuyerWishlistItems,
  toggleBuyerWishlistItem,
} from "../../../utils/buyerWishlist";

import shoesImg from "../../../assets/shoes4.jpg";
import Necklace from "../../../assets/accessories2.jpg";
import iphun from "../../../assets/iphun.jpg";
import Headphone from "../../../assets/headphone.jpg";
import bbGirl from "../../../assets/bbimg-removebg-preview.png";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type ApiCategory = {
  id: number;
  name: string;
  description?: string;
  image?: string;
};

const TOKEN = {
  heroFrom: "#4f0aab",
  heroMid: "#7c3aed",
  heroTo: "#c026d3",
  pageBg: "#f8fafc",
};

const topProducts = [
  { id: 1, name: "Black Leather Shoes", price: "Rs. 1,799", old: "Rs. 2,120", rating: 4, reviews: 128, img: shoesImg, category: "Shoes" },
  { id: 2, name: "Red Emerald Necklace", price: "Rs. 2,199", old: "Rs. 2,799", rating: 4, reviews: 97, img: Necklace, category: "Accessories" },
  { id: 3, name: "Apple iPhone 15 Pro", price: "Rs. 91,999", old: "Rs. 99,999", rating: 5, reviews: 251, img: iphun, category: "Electronics" },
  { id: 4, name: "Wireless Headphones", price: "Rs. 3,499", old: "Rs. 4,200", rating: 4, reviews: 183, img: Headphone, category: "Electronics" },
];

const FEATURES = [
  { emoji: "🚚", bg: "bg-emerald-50", title: "Fast Delivery", sub: "Same day or next day delivery" },
  { emoji: "🤖", bg: "bg-violet-50", title: "AI Smart Comparison", sub: "Compare products instantly" },
  { emoji: "🎧", bg: "bg-amber-50", title: "24/7 Support", sub: "Always here to help" },
];

const imageUrl = (path?: string) =>
  !path ? "" : path.startsWith("http") ? path : `${API_ORIGIN}${path}`;


function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}


function ProductCard({
  product,
  liked,
  onLike,
  onBuy,
  onCart,
}: {
  product: (typeof topProducts)[0];
  liked: boolean;
  onLike: () => void;
  onBuy: () => void;
  onCart: () => void;
}) {
  return (
    <div
      onClick={onBuy}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-full transition-shadow duration-300 hover:shadow-xl border border-gray-100 hover:border-violet-200"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)" }}
    >

      <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-100">
        <img
          src={product.img}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={(e) => { e.stopPropagation(); onLike(); }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-lg hover:scale-110 transition-transform z-10 hover:bg-white"
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>


      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold tracking-widest text-violet-500 uppercase">
          {product.category}
        </span>
        
        <h3 className="mt-1.5 text-sm font-semibold text-gray-900 leading-tight line-clamp-2 h-9">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-2">
          <Stars rating={product.rating || 4} />
          <span className="text-xs text-gray-500 font-medium">({product.reviews || 0})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="text-lg font-bold text-rose-600">{product.price}</span>
          {product.old && <span className="text-xs text-gray-400 line-through">{product.old}</span>}
        </div>

    
        <div className="flex-1" />

    
        <div className="mt-3 flex flex-col gap-2.5 pt-2 border-t border-gray-100">
          <button
            onClick={(e) => { e.stopPropagation(); onBuy(); }}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-95 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg"
          >
            Buy Now
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCart(); }}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 active:scale-95 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}


export default function SajiloMart() {
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(
    () => new Set(getBuyerWishlistItems().map((item) => String(item.id)))
  );
  const [cartQty, setCartQty] = useState(getBuyerCartCount());
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/api/productcategory/categories/`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategories();
  }, []);

  const categoryNames = useMemo(
    () => Array.from(new Set(categories.map((c) => c.name).filter(Boolean))),
    [categories]
  );

  const openProduct = (product: any) => navigate(`/product/${product.id}`, { state: product });

  const toggleWishlist = (product: (typeof topProducts)[0]) => {
    if (!isBuyerLoggedIn()) {
      navigate("/login", { state: { from: "/" } });
      return;
    }

    const result = toggleBuyerWishlistItem({
      id: product.id,
      name: product.name,
      price: Number(product.price.replace(/[^0-9.]/g, "")) || 0,
      originalPrice: product.old,
      image: product.img,
      category: product.category,
      description: `${product.category} product`,
      stock: 99,
    });
    setWishlistIds(new Set(result.items.map((item) => String(item.id))));
  };

  const addToCart = (product: any) => {
    addBuyerCartItem({
      id: product.id,
      name: product.name,
      price: Number(product.price.replace(/[^0-9.]/g, "")) || 0,
      image: product.img,
      category: product.category,
      description: `${product.category} product`,
      stock: 99,
    });
    setCartQty(getBuyerCartCount());
  };

  return (
    <div className="min-h-screen" style={{ background: TOKEN.pageBg }}>
      <BuyerNavbar cartQty={cartQty} categories={categoryNames} />

      {/* ── HERO ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${TOKEN.heroFrom} 0%, ${TOKEN.heroMid} 50%, ${TOKEN.heroTo} 100%)`,
          minHeight: 440,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-14">
          <div className="space-y-5 text-white">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase">
              ✨ New Arrivals 2025
            </span>
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
              Sajilo<br />
              <span className="text-yellow-300">Mart</span>
            </h1>
            <p className="text-white/80 text-lg max-w-sm leading-relaxed">
              Discover thousands of quality products at the best prices with smart delivery options.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate("/allproducts")}
                className="bg-yellow-300 hover:bg-yellow-400 active:scale-95 text-slate-900 font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg transition-all"
              >
                Browse Products →
              </button>
              <button
                onClick={() => navigate("/allproducts")}
                className="border-2 border-white/50 hover:bg-white/10 active:scale-95 text-white font-semibold px-7 py-3.5 rounded-2xl text-base transition-all"
              >
                View Offers
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end items-end">
            <img
              src={bbGirl}
              alt="Shopping"
              className="h-[380px] xl:h-[460px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {FEATURES.map((f, i) => (
            <button
              key={i}
              onClick={() => {
                if (f.title === "AI Smart Comparison") navigate("/aismartcomparison");
              }}
              className="flex items-center gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${f.bg}`}>
                {f.emoji}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{f.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-14">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Top Selling Products</h2>
            <p className="text-sm text-gray-400 mt-0.5">Handpicked favourites this week</p>
          </div>
          <button
            onClick={() => navigate("/allproducts")}
            className="text-sm text-violet-600 font-semibold hover:text-violet-800 transition-colors"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {topProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              liked={wishlistIds.has(String(p.id))}
              onLike={() => toggleWishlist(p)}
              onBuy={() => openProduct(p)}
              onCart={() => addToCart(p)}
            />
          ))}
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-14 mb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
          <p className="text-sm text-gray-400 mt-0.5">Find what you're looking for</p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/allproducts?category=${encodeURIComponent(cat.name)}`)}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer group border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all"
              >
                <div className="relative w-full bg-gray-100 overflow-hidden" style={{ paddingBottom: "66.67%" }}>
                  {cat.image ? (
                    <img
                      src={imageUrl(cat.image)}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🛍️</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                    {cat.description || "Explore products"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-sm">No categories available yet.</p>
          </div>
        )}
      </div>

      <BuyerFooter />
    </div>
  );
}
