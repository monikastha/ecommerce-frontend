import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";
import {
  addBuyerCartItem,
  getBuyerCartCount,
} from "../../../utils/buyerCart";

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

/* DATA */
const topProducts = [
  { id: 1, name: "Black Leather Shoes", price: "Rs. 1,799", old: "Rs. 2,120", rating: 4, reviews: 128, img: shoesImg, category: "Shoes" },
  { id: 2, name: "Red Emerald Necklace", price: "Rs. 2,199", old: "Rs. 2,799", rating: 4, reviews: 97, img: Necklace, category: "Accessories" },
  { id: 3, name: "Apple iPhone 15 Pro", price: "Rs. 91,999", old: "Rs. 99,999", rating: 5, reviews: 251, img: iphun, category: "Electronics" },
  { id: 4, name: "Wireless Headphones", price: "Rs. 3,499", old: "Rs. 4,200", rating: 4, reviews: 183, img: Headphone, category: "Electronics" },
];

const FEATURES = [
  { emoji: "🚚", bg: "bg-emerald-50 text-emerald-600", title: "Emergency Fast Delivery", sub: "Same day or next day delivery" },
  { emoji: "🤖", bg: "bg-violet-50 text-violet-600", title: "AI Smart Comparison", sub: "Compare products instantly" },
  { emoji: "🎧", bg: "bg-amber-50 text-amber-600", title: "24/7 Customer Support", sub: "Always here to help" },
];

const imageUrl = (path?: string) => !path ? "" : path.startsWith("http") ? path : `${API_ORIGIN}${path}`;

export default function SajiloMart() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Record<number, boolean>>({});
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

  const categoryNames = useMemo(() => 
    Array.from(new Set(categories.map(c => c.name).filter(Boolean))), 
    [categories]
  );

  const openProduct = (product: any) => {
    navigate(`/product/${product.id}`, { state: product });
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

      {/* HERO */}
      <section className="relative w-full min-h-[460px] flex items-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${TOKEN.heroFrom}, ${TOKEN.heroMid}, ${TOKEN.heroTo})` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          <div className="space-y-6 text-white">
            <div className="inline-block bg-white/20 px-5 py-2 rounded-full text-sm font-bold tracking-wider">NEW ARRIVALS</div>
            <h1 className="text-6xl lg:text-7xl font-black leading-none">Sajilo Mart</h1>
            <p className="text-yellow-300 text-3xl font-medium">Shop Anytime, Anywhere</p>
            <p className="text-white/90 text-lg max-w-md">
              Discover thousands of quality products at the best prices with smart delivery options.
            </p>
            <div className="flex gap-4 pt-4">
              <button onClick={() => navigate("/allproducts")} className="bg-yellow-300 hover:bg-yellow-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-lg shadow-lg transition-all">
                Browse Products →
              </button>
              <button onClick={() => navigate("/allproducts")} className="border-2 border-white/70 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all">
                View Offers
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <img
              src={bbGirl}
              alt="Shopping"
              className="h-[400px] lg:h-[620px] xl:h-[700px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 lg:p-10">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex gap-5 items-start group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-transform group-hover:scale-110 ${f.bg}`}>
                {f.emoji}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{f.title}</h3>
                <p className="text-gray-600 mt-1 leading-relaxed">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black text-gray-900">Top Selling Products</h2>
          <button onClick={() => navigate("/allproducts")} className="text-violet-600 font-medium hover:underline">View All →</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map((p) => (
            <div key={p.id} onClick={() => openProduct(p)} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button onClick={(e) => { e.stopPropagation(); setLiked(l => ({ ...l, [p.id]: !l[p.id] })); }} className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-xl">
                  {liked[p.id] ? "❤️" : "♡"}
                </button>
              </div>
              <div className="p-5">
                <p className="text-xs text-violet-600 font-semibold uppercase">{p.category}</p>
                <h3 className="font-bold mt-1 line-clamp-2 min-h-[48px]">{p.name}</h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className="font-bold text-xl text-rose-600">{p.price}</span>
                  <span className="text-xs line-through text-gray-400">{p.old}</span>
                </div>
                <div className="flex gap-2 mt-5">
                  <button onClick={(e) => { e.stopPropagation(); openProduct(p); }} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl text-sm font-bold">Buy Now</button>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-2xl text-sm font-bold">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <h2 className="text-3xl font-black text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.length > 0 ? categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/allproducts?category=${encodeURIComponent(cat.name)}`)}
              className="bg-white rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-all border border-gray-100 hover:border-violet-200 group"
            >
              <div className="h-40 bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                {cat.image && <img src={imageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
              </div>
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.description || "Explore products"}</p>
            </div>
          )) : (
            <p className="text-gray-500 col-span-full text-center py-10">No categories available yet.</p>
          )}
        </div>
      </div>

      <BuyerFooter />
    </div>
  );
}
