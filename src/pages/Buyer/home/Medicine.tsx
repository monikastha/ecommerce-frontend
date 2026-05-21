import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

/* ONLY THESE IMAGES */
import paracetamol1 from "../../../assets/paracetamol1.jpg";
import medicine from "../../../assets/medicine.jpg";
import paracetamol from "../../../assets/paracetamol.jpg";

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

/* helper to rotate images */
const pickImg = (id: number) => {
  if (id % 3 === 1) return paracetamol1;
  if (id % 3 === 2) return medicine;
  return paracetamol;
};

/* ───────────────────────────────
   ALL PRODUCTS
────────────────────────────── */
const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: "Rs. 120",
    old: "Rs. 150",
    rating: 4,
    reviews: 128,
    img: pickImg(1),
    category: "Medicine",
    sold: 432,
  },
  {
    id: 2,
    name: "Pain Relief Tablets",
    price: "Rs. 250",
    old: "Rs. 310",
    rating: 5,
    reviews: 97,
    img: pickImg(2),
    category: "Medicine",
    sold: 210,
  },
  {
    id: 3,
    name: "Cold & Flu Medicine",
    price: "Rs. 180",
    old: "Rs. 220",
    rating: 5,
    reviews: 251,
    img: pickImg(3),
    category: "Medicine",
    sold: 1200,
  },
  {
    id: 4,
    name: "Fever Relief Syrup",
    price: "Rs. 349",
    old: "Rs. 420",
    rating: 4,
    reviews: 183,
    img: pickImg(4),
    category: "Medicine",
    sold: 560,
  },
  {
    id: 5,
    name: "Headache Tablets",
    price: "Rs. 299",
    old: "Rs. 350",
    rating: 4,
    reviews: 74,
    img: pickImg(5),
    category: "Medicine",
    sold: 320,
  },
  {
    id: 6,
    name: "Antibiotic Capsules",
    price: "Rs. 519",
    old: "Rs. 600",
    rating: 5,
    reviews: 112,
    img: pickImg(6),
    category: "Medicine",
    sold: 185,
  },
  {
    id: 7,
    name: "Daily Vitamin Tablets",
    price: "Rs. 285",
    old: "Rs. 340",
    rating: 5,
    reviews: 198,
    img: pickImg(7),
    category: "Medicine",
    sold: 890,
  },
  {
    id: 8,
    name: "Energy Booster Medicine",
    price: "Rs. 399",
    old: "Rs. 500",
    rating: 4,
    reviews: 145,
    img: pickImg(8),
    category: "Medicine",
    sold: 430,
  },
  {
    id: 9,
    name: "Herbal Paracetamol",
    price: "Rs. 150",
    old: "Rs. 180",
    rating: 4,
    reviews: 89,
    img: pickImg(9),
    category: "Medicine",
    sold: 670,
  },
  {
    id: 10,
    name: "Premium Pain Killer",
    price: "Rs. 400",
    old: "Rs. 500",
    rating: 4,
    reviews: 98,
    img: pickImg(10),
    category: "Medicine",
    sold: 310,
  },
  {
    id: 11,
    name: "Fast Relief Tablets",
    price: "Rs. 220",
    old: "Rs. 270",
    rating: 4,
    reviews: 112,
    img: pickImg(11),
    category: "Medicine",
    sold: 640,
  },
  {
    id: 12,
    name: "General Health Medicine",
    price: "Rs. 290",
    old: "Rs. 370",
    rating: 5,
    reviews: 234,
    img: pickImg(12),
    category: "Medicine",
    sold: 890,
  },
  {
    id: 13,
    name: "Family Medicine Pack",
    price: "Rs. 500",
    old: "Rs. 650",
    rating: 4,
    reviews: 67,
    img: pickImg(13),
    category: "Medicine",
    sold: 350,
  },
  {
    id: 14,
    name: "Advanced Paracetamol Combo",
    price: "Rs. 380",
    old: "Rs. 490",
    rating: 4,
    reviews: 89,
    img: pickImg(14),
    category: "Medicine",
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
  product: Product;
  liked: boolean;
  onLike: () => void;
  onBuy: () => void;
  onAddCart: () => void;
  addedId: boolean;
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
          className="w-full h-full object-cover"
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

  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
  const [addedCart, setAddedCart] = useState<{ [key: number]: boolean }>({});

  const visibleCnt = 8;

  const visible = ALL_PRODUCTS.slice(0, visibleCnt);

  const handleAddCart = (id: number) => {
    setAddedCart((p) => ({ ...p, [id]: true }));
    setTimeout(() => {
      setAddedCart((p) => ({ ...p, [id]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: TOKEN.pageBg }}>
      <BuyerNavbar cartQty={0} />

      {/* HERO (kept intact) */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <section
          className="relative flex items-center rounded-2xl"
          style={{
            background: `linear-gradient(120deg, ${TOKEN.heroFrom}, ${TOKEN.heroMid}, ${TOKEN.heroTo})`,
            minHeight: 320,
          }}
        >
          <div className="flex-1 px-10 py-10 z-10">
            <h1 className="text-white font-black text-4xl">
              Sajilo Mart
            </h1>
            <p className="text-white/80 mt-2">
              Medicine & Health Care
            </p>

            <button
              onClick={() => navigate("/medicine")}
              className="mt-4 bg-yellow-300 px-5 py-2 rounded-full font-bold"
            >
              Shop Medicine →
            </button>
          </div>

          <div className="w-75">
            <img src={heroGirl} className="h-[115%] object-contain" />
          </div>
        </section>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold">All Products</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            liked={!!liked[p.id]}
            addedId={!!addedCart[p.id]}
            onLike={() =>
              setLiked((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
            }
            onBuy={() => navigate(`/product/${p.id}`)}
            onAddCart={() => handleAddCart(p.id)}
          />
        ))}
      </div>
      

      <BuyerFooter />
    </div>
  );
}