import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

import accessories1 from "../../../assets/accessories1.jpg";
import accessories2 from "../../../assets/accessories2.jpg";

import heroGirl from "../../../assets/bbimg-removebg-preview.png";

/* ───────────────────────────────
   DESIGN TOKENS
────────────────────────────── */
const TOKEN = {
  heroFrom: "#4f0aab",
  heroMid: "#7c3aed",
  heroTo: "#c026d3",
  pageBg: "#f0eff4",
};

/* ───────────────────────────────
   TYPES
────────────────────────────── */
interface Product {
  id: number;
  name: string;
  price: string;
  old: string;
  rating: number;
  reviews: number;
  img: string;
  category: string;
  sold: number;
}

interface ProductCardProps {
  product: Product;
  liked: boolean;
  onLike: () => void;
  onBuy: () => void;
  onAddCart: () => void;
  addedId: number | null;
}

const pickImg = (id: number) =>
  id % 2 === 0 ? accessories2 : accessories1;

/* ───────────────────────────────
   PRODUCTS
────────────────────────────── */
const ALL_PRODUCTS: Product[] = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  name: `Accessories Item ${i + 1}`,
  price: `Rs. ${(1000 + i * 120).toLocaleString()}`,
  old: `Rs. ${(1500 + i * 150).toLocaleString()}`,
  rating: 4,
  reviews: 50 + i * 10,
  img: pickImg(i + 1),
  category: "Accessories",
  sold: 100 + i * 20,
}));

/* ───────────────────────────────
   STARS
────────────────────────────── */
const Stars = ({ n }: { n: number }) => (
  <span className="text-amber-400 text-sm">
    {"★".repeat(n)}
    {"☆".repeat(5 - n)}
  </span>
);

/* ───────────────────────────────
   PRODUCT CARD
────────────────────────────── */
function ProductCard({
  product,
  liked,
  onLike,
  onBuy,
  onAddCart,
  addedId,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
      <div className="relative h-40">
        <img src={product.img} className="w-full h-full object-cover" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="absolute top-2 right-2 bg-white w-7 h-7 rounded-full"
        >
          {liked ? "❤️" : "🤍"}
        </button>

        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
          SALE
        </span>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold">{product.name}</h3>

        <div className="flex items-center gap-1 mt-1">
          <Stars n={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <p className="line-through text-xs text-gray-400 mt-1">
          {product.old}
        </p>

        <p className="text-red-500 font-bold text-sm">{product.price}</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={onBuy}
            className="flex-1 bg-green-500 text-white text-xs py-2 rounded-lg"
          >
            Buy
          </button>

          <button
            onClick={onAddCart}
            className={`flex-1 text-white text-xs py-2 rounded-lg ${
              addedId ? "bg-green-600" : "bg-violet-600"
            }`}
          >
            {addedId ? "Added" : "Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────
   MAIN PAGE
────────────────────────────── */
export default function ViewAllProducts() {
  const navigate = useNavigate();

  const [visibleCnt, setVisibleCnt] = useState(8);
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
  const [addedCart, setAddedCart] = useState<{ [key: number]: boolean }>({});

  const visible = ALL_PRODUCTS.slice(0, visibleCnt);
  const hasMore = visibleCnt < ALL_PRODUCTS.length;

  const handleAddCart = (id: number) => {
    setAddedCart((p) => ({
      ...p,
      [id]: true,
    }));

    setTimeout(() => {
      setAddedCart((p) => ({
        ...p,
        [id]: false,
      }));
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: TOKEN.pageBg }}>
      <BuyerNavbar cartQty={0} />

      {/* ══════════════════════════════════════
          HERO (UPDATED EXACT VERSION)
══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <section
          className="relative flex items-center rounded-2xl"
          style={{
            background: `linear-gradient(120deg, ${TOKEN.heroFrom} 0%, ${TOKEN.heroMid} 55%, ${TOKEN.heroTo} 100%)`,
            minHeight: 320,
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
              Discover stylish accessories, trending fashion items and modern collections at your fingertips.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/accessories")}
                className="bg-yellow-300 hover:bg-yellow-400 text-violet-900 font-extrabold text-sm px-6 py-2.5 rounded-full border-none cursor-pointer transition-all shadow-lg active:scale-95"
              >
                Browse Products →
              </button>

              <button className="bg-transparent hover:bg-white/10 text-white font-semibold text-sm px-6 py-2.5 rounded-full border-2 border-white/60 cursor-pointer transition-colors">
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
              src={heroGirl}
              alt="Hero Visual"
              className="relative z-20 h-[115%] w-auto object-contain drop-shadow-2xl"
              style={{ marginBottom: "-1px" }}
            />
          </div>
        </section>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-extrabold">All Products</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            liked={!!liked[p.id]}
            addedId={addedCart[p.id] ? p.id : null}
            onLike={() =>
              setLiked((prev) => ({
                ...prev,
                [p.id]: !prev[p.id],
              }))
            }
            onBuy={() => navigate(`/product/${p.id}`)}
            onAddCart={() => handleAddCart(p.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center my-8">
          <button
            onClick={() => setVisibleCnt((c) => c + 4)}
            className="bg-violet-600 text-white px-8 py-3 rounded-full"
          >
            Load More
          </button>
        </div>
      )}

      <BuyerFooter />
    </div>
  );
}