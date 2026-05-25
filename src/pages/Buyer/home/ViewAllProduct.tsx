import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

import shoesImg from "../../../assets/shoes4.jpg";
import shoesImg2 from "../../../assets/shoes4.jpg";
import Necklace from "../../../assets/accessories2.jpg";
import Necklace2 from "../../../assets/accessories2.jpg";
import iphun from "../../../assets/iphun.jpg";
import Headphone from "../../../assets/headphone.jpg";
import Headphone2 from "../../../assets/headphone.jpg";
import trendy from "../../../assets/trendy.png";
import laptop from "../../../assets/laptop hp.jpg";
import homeGoods from "../../../assets/home goods.jpg";
import cosmetics from "../../../assets/cosmetics.jpeg";
import medicine from "../../../assets/medicine.jpg";
import studyMat from "../../../assets/study-material.jpg";

/* HERO GIRL IMAGE */
import bbGirl from "../../../assets/bbimg-removebg-preview.png";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const TOKEN = {
  heroFrom: "#4f0aab",
  heroMid: "#7c3aed",
  heroTo: "#c026d3",
  pageBg: "#f0eff4",
};

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   PRODUCTS
───────────────────────────────────────────── */
const ALL_PRODUCTS: Product[] = [
  { id: 1, name: "Black Leather Shoes", price: "Rs. 1,799", old: "Rs. 2,120", rating: 4, reviews: 128, img: shoesImg, category: "Shoes", sold: 432 },
  { id: 2, name: "Red Emerald Necklace", price: "Rs. 2,199", old: "Rs. 2,799", rating: 5, reviews: 97, img: Necklace, category: "Accessories", sold: 210 },
  { id: 3, name: "Apple iPhone 15 Pro", price: "Rs. 91,999", old: "Rs. 99,999", rating: 5, reviews: 251, img: iphun, category: "Electronics", sold: 1200 },
  { id: 4, name: "Wireless Headphones", price: "Rs. 3,499", old: "Rs. 4,200", rating: 4, reviews: 183, img: Headphone, category: "Electronics", sold: 560 },
  { id: 5, name: "Running Shoes", price: "Rs. 1,599", old: "Rs. 2,000", rating: 4, reviews: 74, img: shoesImg2, category: "Shoes", sold: 320 },
  { id: 6, name: "Gold Chain Necklace", price: "Rs. 3,199", old: "Rs. 3,900", rating: 5, reviews: 112, img: Necklace2, category: "Accessories", sold: 185 },
  { id: 7, name: "Apple iPhone 15 Pro Max", price: "Rs. 99,999", old: "Rs. 1,09,999", rating: 5, reviews: 198, img: iphun, category: "Electronics", sold: 890 },
  { id: 8, name: "Wireless Headphones Pro", price: "Rs. 3,999", old: "Rs. 5,000", rating: 4, reviews: 145, img: Headphone2, category: "Electronics", sold: 430 },
  { id: 9, name: "Trendy Fashion Kurta", price: "Rs. 1,299", old: "Rs. 1,799", rating: 4, reviews: 89, img: trendy, category: "Fashion", sold: 670 },
  { id: 10, name: "HP Laptop 15s", price: "Rs. 72,000", old: "Rs. 85,000", rating: 4, reviews: 98, img: laptop, category: "Electronics", sold: 310 },
  { id: 11, name: "Home Essentials Kit", price: "Rs. 3,200", old: "Rs. 4,500", rating: 4, reviews: 112, img: homeGoods, category: "Home Goods", sold: 640 },
  { id: 12, name: "Beauty Cosmetics Set", price: "Rs. 2,400", old: "Rs. 3,200", rating: 5, reviews: 234, img: cosmetics, category: "Cosmetics", sold: 890 },
  { id: 13, name: "Healthcare Medicine Pack", price: "Rs. 1,440", old: "Rs. 1,800", rating: 4, reviews: 67, img: medicine, category: "Medicine", sold: 350 },
  { id: 14, name: "Study Material Bundle", price: "Rs. 1,875", old: "Rs. 2,500", rating: 4, reviews: 89, img: studyMat, category: "Study Materials", sold: 430 },
];

const PAGE_SIZE = 8;

/* ─────────────────────────────────────────────
   STARS
───────────────────────────────────────────── */
const Stars = ({ n }: { n: number }) => (
  <span className="text-amber-400 text-sm">
    {"★".repeat(n)}
    {"☆".repeat(5 - n)}
  </span>
);

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
interface ProductCardProps {
  product: Product;
  liked: boolean;
  onLike: () => void;
  onBuy: () => void;
  onAddCart: () => void;
  addedId: number | null;
}

function ProductCard({
  product,
  liked,
  onLike,
  onBuy,
  onAddCart,
  addedId,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
      <div className="relative h-40 overflow-hidden">
        <img src={product.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center"
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

        <p className="text-xs line-through text-gray-400 mt-1">{product.old}</p>
        <p className="text-sm font-extrabold text-red-500">{product.price}</p>
        <p className="text-xs text-gray-400">{product.sold.toLocaleString()} sold</p>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onBuy}
            className="flex-1 bg-green-500 text-white text-xs font-bold py-1.5 rounded-lg"
          >
            Buy Now
          </button>

          <button
            onClick={onAddCart}
            className={`flex-1 text-white text-xs font-bold py-1.5 rounded-lg ${
              addedId ? "bg-green-600" : "bg-violet-600"
            }`}
          >
            {addedId ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ViewAllProducts() {
  const navigate = useNavigate();

  const fileRef = useRef<HTMLInputElement>(null);

  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [addedCart, setAddedCart] = useState<Record<number, boolean>>({});
  const [visibleCnt, setVisibleCnt] = useState(PAGE_SIZE);

  const handleAddCart = (id: number) => {
    setAddedCart((p) => ({ ...p, [id]: true }));
    setTimeout(() => setAddedCart((p) => ({ ...p, [id]: false })), 1800);
  };

  const filtered = ALL_PRODUCTS;
  const visible = filtered.slice(0, visibleCnt);
  const hasMore = visibleCnt < filtered.length;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.readAsDataURL(f);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: TOKEN.pageBg }}>
      <BuyerNavbar cartQty={0} />

      {/* ───────── HERO (UPDATED EXACT STYLE) ───────── */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <section
          className="relative flex items-center rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(120deg, ${TOKEN.heroFrom} 0%, ${TOKEN.heroMid} 55%, ${TOKEN.heroTo} 100%)`,
            minHeight: 320,
          }}
        >
          <div className="absolute right-64 top-15 w-72 h-72 rounded-full opacity-10 bg-white" />
          <div className="absolute left-[40%] bottom-10 w-48 h-48 rounded-full opacity-10 bg-white" />

          <div className="flex-1 px-10 py-10 z-10">
            <span className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full mb-4">
              New Arrivals
            </span>

            <h1 className="text-white font-black text-4xl mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Sajilo Mart
            </h1>

            <p className="text-yellow-300 text-xl mb-4">Shop Anytime, Anywhere</p>

            <p className="text-white/80 text-sm max-w-sm mb-6">
              Discover thousands of products across fashion, electronics, home essentials, and more.
            </p>

            <div className="flex gap-3">
              <button className="bg-yellow-300 text-violet-900 font-bold px-6 py-2 rounded-full">
                Browse Products →
              </button>

              <button className="bg-white/10 text-white border border-white px-6 py-2 rounded-full">
                View Offers
              </button>
            </div>
          </div>

          <div className="relative h-full flex items-end justify-end" style={{ width: "35%" }}>
            <img
              src={bbGirl}
              className="h-[115%] object-contain drop-shadow-2xl"
              alt="hero"
            />

            <input ref={fileRef} type="file" hidden onChange={onFile} />
          </div>
        </section>
      </div>

      {/* ───────── PRODUCTS ───────── */}
      <div className="max-w-7xl mx-auto px-4 mt-7">
        <h2 className="text-xl font-extrabold">Top Sells</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            liked={!!liked[p.id]}
            addedId={addedCart[p.id] ? 1 : 0}
            onLike={() =>
              setLiked((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
            }
            onBuy={() => navigate(`/product/${p.id}`)}
            onAddCart={() => handleAddCart(p.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCnt((c) => c + 4)}
            className="px-10 py-3 rounded-full text-white font-bold"
            style={{
              background: `linear-gradient(135deg, ${TOKEN.heroFrom}, ${TOKEN.heroMid})`,
            }}
          >
            Load More...
          </button>
        </div>
      )}

      <BuyerFooter />
    </div>
  );
}