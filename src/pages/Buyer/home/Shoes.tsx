import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

/* ONLY THESE IMAGES */
import sandal1 from "../../../assets/sandal1.jpeg";
import sandal2 from "../../../assets/sandal2.jpeg";
import sandal3 from "../../../assets/sandal3.jpeg";

import shoes1 from "../../../assets/shoes1.jpg";
import shoes2 from "../../../assets/shoes2.jpg";
import shoes3 from "../../../assets/shoes3.jpg";
import shoes4 from "../../../assets/shoes4.jpg";
import shoes5 from "../../../assets/shoes5.jpg";

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
   ALL PRODUCTS
────────────────────────────── */
const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Classic Brown Sandal",
    price: "Rs. 1,200",
    old: "Rs. 1,500",
    rating: 4,
    reviews: 128,
    img: sandal1,
    category: "Footwear",
    sold: 432,
  },
  {
    id: 2,
    name: "Premium Black Sandal",
    price: "Rs. 1,450",
    old: "Rs. 1,800",
    rating: 5,
    reviews: 97,
    img: sandal2,
    category: "Footwear",
    sold: 210,
  },
  {
    id: 3,
    name: "Comfort Summer Sandal",
    price: "Rs. 1,350",
    old: "Rs. 1,700",
    rating: 5,
    reviews: 251,
    img: sandal3,
    category: "Footwear",
    sold: 1200,
  },
  {
    id: 4,
    name: "Running Shoes Pro",
    price: "Rs. 3,499",
    old: "Rs. 4,200",
    rating: 4,
    reviews: 183,
    img: shoes1,
    category: "Shoes",
    sold: 560,
  },
  {
    id: 5,
    name: "Sporty Sneakers",
    price: "Rs. 2,999",
    old: "Rs. 3,500",
    rating: 4,
    reviews: 74,
    img: shoes2,
    category: "Shoes",
    sold: 320,
  },
  {
    id: 6,
    name: "Luxury Walking Shoes",
    price: "Rs. 4,199",
    old: "Rs. 5,000",
    rating: 5,
    reviews: 112,
    img: shoes3,
    category: "Shoes",
    sold: 185,
  },
  {
    id: 7,
    name: "Casual Sneakers",
    price: "Rs. 2,850",
    old: "Rs. 3,400",
    rating: 5,
    reviews: 198,
    img: shoes4,
    category: "Shoes",
    sold: 890,
  },
  {
    id: 8,
    name: "Modern Running Shoes",
    price: "Rs. 3,999",
    old: "Rs. 5,000",
    rating: 4,
    reviews: 145,
    img: shoes5,
    category: "Shoes",
    sold: 430,
  },
  {
    id: 9,
    name: "Elegant Sandal",
    price: "Rs. 1,150",
    old: "Rs. 1,450",
    rating: 4,
    reviews: 89,
    img: sandal1,
    category: "Footwear",
    sold: 670,
  },
  {
    id: 10,
    name: "Premium Sports Shoes",
    price: "Rs. 4,000",
    old: "Rs. 5,000",
    rating: 4,
    reviews: 98,
    img: shoes2,
    category: "Shoes",
    sold: 310,
  },
  {
    id: 11,
    name: "Daily Wear Sandal",
    price: "Rs. 1,420",
    old: "Rs. 1,720",
    rating: 4,
    reviews: 112,
    img: sandal2,
    category: "Footwear",
    sold: 640,
  },
  {
    id: 12,
    name: "Athletic Shoes",
    price: "Rs. 3,900",
    old: "Rs. 4,700",
    rating: 5,
    reviews: 234,
    img: shoes3,
    category: "Shoes",
    sold: 890,
  },
  {
    id: 13,
    name: "Family Comfort Shoes",
    price: "Rs. 3,500",
    old: "Rs. 4,200",
    rating: 4,
    reviews: 67,
    img: shoes4,
    category: "Shoes",
    sold: 350,
  },
  {
    id: 14,
    name: "Stylish Sandal Collection",
    price: "Rs. 1,800",
    old: "Rs. 2,300",
    rating: 4,
    reviews: 89,
    img: sandal3,
    category: "Footwear",
    sold: 430,
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
   PRODUCT CARD
────────────────────────────── */
interface ProductCardProps {
  product: {
    img: string;
    name: string;
    rating: number;
    reviews: number;
    old: string;
    price: string;
    id: string | number;
  };
  liked: boolean;
  onLike: () => void;
  onBuy: () => void;
  onAddCart: () => void;
  addedId: string | number | null;
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden group">
      <div className="relative h-40 overflow-hidden">
        <img
          src={product.img}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="absolute top-2 right-2 bg-white/90 w-7 h-7 rounded-full flex items-center justify-center"
        >
          {liked ? "❤️" : "🤍"}
        </button>

        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
          SALE
        </span>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-1 flex items-center gap-1">
          <Stars n={product.rating} />

          <span className="text-xs text-gray-400">
            ({product.reviews})
          </span>
        </div>

        <p className="line-through text-xs text-gray-400 mt-1">
          {product.old}
        </p>

        <p className="text-red-500 font-bold text-sm">
          {product.price}
        </p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onBuy()}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 rounded-lg transition-all"
          >
            Buy
          </button>

          <button
            onClick={() => onAddCart()}
            className={`flex-1 text-white text-xs py-2 rounded-lg transition-all ${
              addedId
                ? "bg-green-600"
                : "bg-violet-600 hover:bg-violet-700"
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
  const productsRef = useRef<HTMLDivElement | null>(null);

  const PAGE_SIZE = 8;

  const [visibleCnt, setVisibleCnt] =
    useState(PAGE_SIZE);

  const [liked, setLiked] = useState<{
    [key: number]: boolean;
  }>({});

  const [addedCart, setAddedCart] = useState<{
    [key: number]: boolean;
  }>({});

  const visible = ALL_PRODUCTS.slice(
    0,
    visibleCnt
  );

  const hasMore =
    visibleCnt < ALL_PRODUCTS.length;

  const handleAddCart = (id: number) => {
    setAddedCart((p) => ({ ...p, [id]: true }));

    setTimeout(() => {
      setAddedCart((p) => ({
        ...p,
        [id]: false,
      }));
    }, 1500);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: TOKEN.pageBg }}
    >
      <BuyerNavbar cartQty={0} />

      {/* ══════════════════════════════════════
          HERO
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
                textShadow:
                  "0 2px 16px rgba(0,0,0,.25)",
              }}
            >
              Sajilo Mart
            </h1>

            <p
              className="text-yellow-300 font-medium mb-4"
              style={{
                fontSize:
                  "clamp(1.1rem, 2.5vw, 1.8rem)",
                fontFamily: "cursive",
              }}
            >
              Shop Anytime, Anywhere
            </p>

            <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-6">
              Discover thousands of products
              across fashion, electronics,
              home essentials, and more —
              all at your fingertips.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  navigate("/products")
                }
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
            style={{
              width: "clamp(200px, 32%, 400px)",
            }}
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

      {/* TITLE */}
      <div
        ref={productsRef}
        className="max-w-7xl mx-auto px-4 mt-8 flex justify-between"
      >
        <h2 className="font-extrabold text-2xl text-gray-900">
          All Products
        </h2>
      </div>

      {/* GRID */}
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
            onBuy={() =>
              navigate(`/product/${p.id}`)
            }
            onAddCart={() =>
              handleAddCart(p.id)
            }
          />
        ))}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="text-center my-8">
          <button
            onClick={() =>
              setVisibleCnt((c) => c + 4)
            }
            className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-full font-bold transition-all"
          >
            Load More
          </button>
        </div>
      )}

      <BuyerFooter />
    </div>
  );
}