import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

/* ───────────────────────────────
   PRODUCT IMAGES
────────────────────────────── */
import beigesari from "../../../assets/beigesari.jpg";
import blackKurta from "../../../assets/black kurta.jpg";
import blueSari from "../../../assets/blue sari.jpg";
import greenKurta from "../../../assets/greenKurta.jpg";
import kurta111 from "../../../assets/kurta 111.jpg";
import lightBlue from "../../../assets/light blue.jpeg";
import pinkSari from "../../../assets/pinkSari.jpg";
import purple from "../../../assets/purple.jpeg";
import redSari from "../../../assets/red sari.jpeg";
import trendyOutfit from "../../../assets/trendy outfit.jpg";
import trendy from "../../../assets/trendy.png";
import yellow from "../../../assets/yellow.jpeg";

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

/* ───────────────────────────────
   IMAGE LIST
────────────────────────────── */
const productImages = [
  beigesari,
  blackKurta,
  blueSari,
  greenKurta,
  kurta111,
  lightBlue,
  pinkSari,
  purple,
  redSari,
  trendyOutfit,
  trendy,
  yellow,
];

/* ───────────────────────────────
   UPDATED PRODUCTS
────────────────────────────── */
const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Elegant Beige Saree",
    price: "Rs. 2,499",
    old: "Rs. 3,199",
    rating: 4,
    reviews: 128,
    img: productImages[0],
    category: "Fashion",
    sold: 432,
  },
  {
    id: 2,
    name: "Classic Black Kurta",
    price: "Rs. 1,799",
    old: "Rs. 2,299",
    rating: 5,
    reviews: 97,
    img: productImages[1],
    category: "Fashion",
    sold: 210,
  },
  {
    id: 3,
    name: "Royal Blue Saree",
    price: "Rs. 2,899",
    old: "Rs. 3,699",
    rating: 5,
    reviews: 251,
    img: productImages[2],
    category: "Fashion",
    sold: 1200,
  },
  {
    id: 4,
    name: "Green Traditional Kurta",
    price: "Rs. 1,599",
    old: "Rs. 2,099",
    rating: 4,
    reviews: 183,
    img: productImages[3],
    category: "Fashion",
    sold: 560,
  },
  {
    id: 5,
    name: "Kurta Design 111",
    price: "Rs. 1,899",
    old: "Rs. 2,499",
    rating: 4,
    reviews: 74,
    img: productImages[4],
    category: "Fashion",
    sold: 320,
  },
  {
    id: 6,
    name: "Light Blue Saree",
    price: "Rs. 2,199",
    old: "Rs. 2,899",
    rating: 5,
    reviews: 112,
    img: productImages[5],
    category: "Fashion",
    sold: 185,
  },
  {
    id: 7,
    name: "Pink Party Saree",
    price: "Rs. 2,699",
    old: "Rs. 3,499",
    rating: 5,
    reviews: 198,
    img: productImages[6],
    category: "Fashion",
    sold: 890,
  },
  {
    id: 8,
    name: "Royal Purple Outfit",
    price: "Rs. 1,999",
    old: "Rs. 2,599",
    rating: 4,
    reviews: 145,
    img: productImages[7],
    category: "Fashion",
    sold: 430,
  },
  {
    id: 9,
    name: "Red Bridal Saree",
    price: "Rs. 3,299",
    old: "Rs. 4,199",
    rating: 4,
    reviews: 89,
    img: productImages[8],
    category: "Fashion",
    sold: 670,
  },
  {
    id: 10,
    name: "Trendy Casual Outfit",
    price: "Rs. 1,299",
    old: "Rs. 1,899",
    rating: 4,
    reviews: 98,
    img: productImages[9],
    category: "Fashion",
    sold: 310,
  },
  {
    id: 11,
    name: "Modern Trendy Wear",
    price: "Rs. 1,599",
    old: "Rs. 2,199",
    rating: 4,
    reviews: 112,
    img: productImages[10],
    category: "Fashion",
    sold: 640,
  },
  {
    id: 12,
    name: "Yellow Summer Outfit",
    price: "Rs. 1,399",
    old: "Rs. 1,999",
    rating: 5,
    reviews: 234,
    img: productImages[11],
    category: "Fashion",
    sold: 890,
  },
];

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
   PRODUCT CARD (IMAGE FIXED)
────────────────────────────── */
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
      
      {/* IMAGE FIX */}
      <div className="relative h-40 flex items-center justify-center bg-gray-50 p-2">
        <img
          src={product.img}
          className="h-full w-full object-contain"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="absolute top-2 right-2 bg-white/90 w-7 h-7 rounded-full"
        >
          {liked ? "❤️" : "🤍"}
        </button>

        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
          SALE
        </span>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold">{product.name}</h3>

        <div className="mt-1">
          <Stars n={product.rating} />
          <span className="text-xs text-gray-400 ml-1">
            ({product.reviews})
          </span>
        </div>

        <p className="line-through text-xs text-gray-400">{product.old}</p>
        <p className="text-red-500 font-bold text-sm">{product.price}</p>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onBuy}
            className="flex-1 bg-green-500 text-white text-xs py-1.5 rounded-lg"
          >
            Buy
          </button>

          <button
            onClick={onAddCart}
            className={`flex-1 text-white text-xs py-1.5 rounded-lg ${
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
    setAddedCart((p) => ({ ...p, [id]: true }));
    setTimeout(() => {
      setAddedCart((p) => ({ ...p, [id]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: TOKEN.pageBg }}>
      <BuyerNavbar cartQty={0} />

      {/* ───────── HERO (REPLACED EXACTLY) ───────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <section
          className="relative flex items-center rounded-2xl"
          style={{
            background: `linear-gradient(120deg, ${TOKEN.heroFrom} 0%, ${TOKEN.heroMid} 55%, ${TOKEN.heroTo} 100%)`,
            minHeight: 320,
          }}
        >
          <div className="absolute right-64 top-15 w-72 h-72 rounded-full opacity-10 bg-white pointer-events-none" />
          <div className="absolute left-[40%] bottom-10 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none" />

          <div className="flex-1 px-10 py-10 z-10">
            <span className="inline-block bg-white/20 text-white/90 text-[10px] font-bold tracking-[.15em] uppercase px-3 py-1 rounded-full mb-4">
              New Arrivals
            </span>

            <h1 className="text-white font-black leading-none mb-2"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", textShadow: "0 2px 16px rgba(0,0,0,.25)" }}>
              Sajilo Mart
            </h1>

            <p className="text-yellow-300 font-medium mb-4"
              style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)" }}>
              Shop Anytime, Anywhere
            </p>

            <p className="text-white/80 text-sm max-w-sm mb-6">
              Discover thousands of fashion products across all categories.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/products")}
                className="bg-yellow-300 text-violet-900 font-bold px-6 py-2 rounded-full"
              >
                Browse Products →
              </button>

              <button className="border border-white/60 text-white px-6 py-2 rounded-full">
                View Offers
              </button>
            </div>
          </div>

          <div className="relative h-full flex items-end justify-end"
               style={{ width: "clamp(200px, 32%, 400px)" }}>
            <img
              src={heroGirl}
              className="relative z-20 h-[115%] w-auto object-contain drop-shadow-2xl"
            />
          </div>
        </section>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            liked={!!liked[p.id]}
            addedId={addedCart[p.id] ? p.id : null}
            onLike={() =>
              setLiked((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
            }
            onBuy={() => navigate(`/product/${p.id}`)}
            onAddCart={() => handleAddCart(p.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center my-6">
          <button
            onClick={() => setVisibleCnt((c) => c + 4)}
            className="bg-violet-600 text-white px-8 py-2 rounded-full"
          >
            Load More
          </button>
        </div>
      )}

      <BuyerFooter />
    </div>
  );
}