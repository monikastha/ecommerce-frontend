import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

/* ── IMAGES ── */
import greenKurta from "../../../assets/greenKurta.png";
import beigeSari from "../../../assets/beigesari.jpg";
import blackKurta from "../../../assets/black kurta.jpg";
import blueSari from "../../../assets/blue sari.jpg";
import kurta111 from "../../../assets/kurta 111.jpg";
import lightBlue from "../../../assets/light blue.jpeg";
import pinkSari from "../../../assets/pinkSari.jpg";
import purple from "../../../assets/purple.jpeg";
import redSari from "../../../assets/red sari.jpeg";
import trendyOutfit from "../../../assets/trendy outfit.jpg";
import trendy from "../../../assets/trendy.png";
import whiteSleevless from "../../../assets/white sleevless kurta.jpg";
import yellow from "../../../assets/yellow.jpeg";
import shoesImg from "../../../assets/shoes4.jpg";
import Necklace from "../../../assets/accessories2.jpg";
import iphun from "../../../assets/iphun.jpg";
import Headphone from "../../../assets/headphone.jpg";
import laptop from "../../../assets/laptop hp.jpg";
import homeGoods from "../../../assets/home goods.jpg";
import cosmetics from "../../../assets/cosmetics.jpeg";
import medicine from "../../../assets/medicine.jpg";
import studyMat from "../../../assets/study-material.jpg";
import heroGirl from "../../../assets/bbimg-removebg-preview.png";

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (matching screenshot palette)
───────────────────────────────────────────── */
const TOKEN = {
  heroFrom: "#4f0aab",
  heroMid: "#7c3aed",
  heroTo: "#c026d3",
  pageBg: "#f0eff4",
  primary: "#7c3aed",
  navBg: "#ffffff",
  categoryTabBg: "#f3f4f6",
  activeTab: "#7c3aed",
  sidebarBg: "#ffffff",
  cardBg: "#ffffff",
  priceRed: "#ef4444",
  accent: "#22c55e",
};

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Product {
  id: number;
  name: string;
  price: string;
  old: string;
  discountPct: number;
  sold: string;
  img: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  sizes?: string[];
  color?: string;
}

/* ─────────────────────────────────────────────
   ALL PRODUCTS
───────────────────────────────────────────── */
const ALL_PRODUCTS: Product[] = [
  /* FASHION */
  {
    id: 1, name: "Green Kurthi", price: "Rs 1500", old: "Rs 1950",
    discountPct: 23, sold: "1.5k", img: greenKurta, category: "Fashion",
    rating: 5, reviews: 143, description: "Elegant green kurthi with fine embroidery, perfect for festivals and casual outings.",
    sizes: ["S", "M", "L", "XL"], color: "Green",
  },
  {
    id: 2, name: "Light Green Cotton Kurtha", price: "Rs 1050", old: "Rs 1250",
    discountPct: 16, sold: "90", img: lightBlue, category: "Fashion",
    rating: 4, reviews: 88, description: "Breezy light cotton kurtha perfect for summer days. Comfortable A-line cut.",
    sizes: ["S", "M", "L"], color: "Light Green",
  },
  {
    id: 3, name: "Flower Pink Sari", price: "Rs 1050", old: "Rs 1350",
    discountPct: 22, sold: "502", img: pinkSari, category: "Fashion",
    rating: 5, reviews: 265, description: "A dreamy pink sari adorned with floral motifs and a contrasting border.",
    sizes: ["Free Size"], color: "Pink",
  },
  {
    id: 4, name: "Beige Saree", price: "Rs 1050", old: "Rs 1350",
    discountPct: 22, sold: "144", img: beigeSari, category: "Fashion",
    rating: 4, reviews: 98, description: "Timeless beige saree with delicate golden border. Made from soft georgette.",
    sizes: ["Free Size"], color: "Beige",
  },
  {
    id: 5, name: "Black Kurthi", price: "Rs 2400", old: "Rs 3200",
    discountPct: 25, sold: "1.5k", img: blackKurta, category: "Fashion",
    rating: 4, reviews: 212, description: "Sleek black kurthi that pairs effortlessly with churidars, palazzos, or jeans.",
    sizes: ["S", "M", "L", "XL", "XXL"], color: "Black",
  },
  {
    id: 6, name: "Royal Blue Sari", price: "Rs 3799", old: "Rs 4800",
    discountPct: 21, sold: "430", img: blueSari, category: "Fashion",
    rating: 5, reviews: 176, description: "Regal royal blue sari with zari weave patterns, crafted from pure silk.",
    sizes: ["Free Size"], color: "Blue",
  },
  {
    id: 7, name: "Traditional Kurtha", price: "Rs 1799", old: "Rs 2400",
    discountPct: 25, sold: "367", img: kurta111, category: "Fashion",
    rating: 4, reviews: 99, description: "Beautifully embroidered traditional kurtha featuring mirror work.",
    sizes: ["S", "M", "L", "XL"], color: "Multi",
  },
  {
    id: 8, name: "Bridal Red Sari", price: "Rs 5999", old: "Rs 7500",
    discountPct: 20, sold: "1.1k", img: redSari, category: "Fashion",
    rating: 5, reviews: 389, description: "Exquisite bridal red sari woven with gold zari, perfect for weddings.",
    sizes: ["Free Size"], color: "Red",
  },
  {
    id: 9, name: "Trendy Outfit", price: "Rs 1999", old: "Rs 2600",
    discountPct: 23, sold: "610", img: trendyOutfit, category: "Fashion",
    rating: 4, reviews: 158, description: "Trendy western-inspired outfit blending Indo-western aesthetics.",
    sizes: ["XS", "S", "M", "L", "XL"], color: "Multi",
  },
  {
    id: 10, name: "Fusion Kurtha", price: "Rs 1399", old: "Rs 1900",
    discountPct: 26, sold: "275", img: trendy, category: "Fashion",
    rating: 4, reviews: 87, description: "Modern fusion kurtha combining traditional prints with contemporary silhouette.",
    sizes: ["S", "M", "L"], color: "Multi",
  },
  {
    id: 11, name: "White Sleeveless Kurtha", price: "Rs 1150", old: "Rs 1500",
    discountPct: 23, sold: "740", img: whiteSleevless, category: "Fashion",
    rating: 5, reviews: 203, description: "Crisp white sleeveless kurtha perfect for warm days with pintuck details.",
    sizes: ["S", "M", "L", "XL"], color: "White",
  },
  {
    id: 12, name: "Yellow Ethnic Dress", price: "Rs 1750", old: "Rs 2200",
    discountPct: 20, sold: "408", img: yellow, category: "Fashion",
    rating: 4, reviews: 119, description: "Vibrant yellow ethnic dress with handblock print details.",
    sizes: ["S", "M", "L", "XL"], color: "Yellow",
  },
  {
    id: 13, name: "Purple Festive Outfit", price: "Rs 2199", old: "Rs 2900",
    discountPct: 24, sold: "342", img: purple, category: "Fashion",
    rating: 4, reviews: 102, description: "Rich purple festive outfit with lacework and sequin accents.",
    sizes: ["S", "M", "L", "XL"], color: "Purple",
  },

  /* ELECTRONICS */
  {
    id: 14, name: "Apple iPhone 15 Pro", price: "Rs 91,999", old: "Rs 99,999",
    discountPct: 8, sold: "1.2k", img: iphun, category: "Electronics",
    rating: 5, reviews: 251, description: "Latest Apple iPhone 15 Pro with titanium design and 48MP camera system.",
    color: "Black",
  },
  {
    id: 15, name: "Wireless Headphones", price: "Rs 3,499", old: "Rs 4,200",
    discountPct: 17, sold: "560", img: Headphone, category: "Electronics",
    rating: 4, reviews: 183, description: "Premium wireless headphones with active noise cancellation.",
    color: "Black",
  },
  {
    id: 16, name: "HP Laptop 15s", price: "Rs 72,000", old: "Rs 85,000",
    discountPct: 15, sold: "310", img: laptop, category: "Electronics",
    rating: 4, reviews: 98, description: "HP Laptop 15s with Intel Core i5, 8GB RAM and 512GB SSD.",
    color: "Silver",
  },

  /* HOME GOODS */
  {
    id: 17, name: "Home Essentials Kit", price: "Rs 3,200", old: "Rs 4,500",
    discountPct: 29, sold: "640", img: homeGoods, category: "Home Goods",
    rating: 4, reviews: 112, description: "Complete home essentials kit with premium quality products.",
  },

  /* COSMETICS */
  {
    id: 18, name: "Beauty Cosmetics Set", price: "Rs 2,400", old: "Rs 3,200",
    discountPct: 25, sold: "890", img: cosmetics, category: "Cosmetics",
    rating: 5, reviews: 234, description: "Premium beauty cosmetics set with long-lasting formulas.",
    color: "Multi",
  },

  /* MEDICINE */
  {
    id: 19, name: "Healthcare Medicine Pack", price: "Rs 1,440", old: "Rs 1,800",
    discountPct: 20, sold: "350", img: medicine, category: "Medicine",
    rating: 4, reviews: 67, description: "Complete healthcare medicine pack for everyday wellness.",
  },

  /* STUDY MATERIALS */
  {
    id: 20, name: "Study Material Bundle", price: "Rs 1,875", old: "Rs 2,500",
    discountPct: 25, sold: "430", img: studyMat, category: "Study Materials",
    rating: 4, reviews: 89, description: "Comprehensive study material bundle for students.",
  },

  /* SHOES */
  {
    id: 21, name: "Black Leather Shoes", price: "Rs 1,799", old: "Rs 2,120",
    discountPct: 15, sold: "432", img: shoesImg, category: "Shoes",
    rating: 4, reviews: 128, description: "Premium black leather shoes with durable sole and elegant finish.",
    sizes: ["39", "40", "41", "42", "43"], color: "Black",
  },

  /* ACCESSORIES */
  {
    id: 22, name: "Red Emerald Necklace", price: "Rs 2,199", old: "Rs 2,799",
    discountPct: 21, sold: "210", img: Necklace, category: "Others",
    rating: 5, reviews: 97, description: "Stunning red emerald necklace in sterling silver setting.",
    color: "Red",
  },
];

/* ─────────────────────────────────────────────
   TOP NAV CATEGORIES
───────────────────────────────────────────── */
const TOP_CATS = [
  "Fashion", "Electronics", "Home Goods",
  "Cosmetics", "Medicine", "Study Materials", "Shoes", "Others",
];

/* ─────────────────────────────────────────────
   LEFT SIDEBAR CATEGORIES (with checkbox)
───────────────────────────────────────────── */
const SIDE_CATS = [
  "Electronics", "Fashion", "Home Goods",
  "Cosmetics", "Medicine", "Study Materials",
];

/* ─────────────────────────────────────────────
   STARS
───────────────────────────────────────────── */
const Stars = ({ n }: { n: number }) => (
  <span style={{ color: "#f59e0b", fontSize: 11 }}>
    {"★".repeat(n)}{"☆".repeat(5 - n)}
  </span>
);

/* ─────────────────────────────────────────────
   PRODUCT CARD  (exact screenshot style)
───────────────────────────────────────────── */
function ProductCard({
  product,
  liked,
  onLike,
  onClick,
}: {
  product: Product;
  liked: boolean;
  onLike: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: TOKEN.cardBg,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
        border: "1px solid #f0f0f0",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(124,58,237,0.13)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 6px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* IMAGE */}
      <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#fafafa" }}>
        <img
          src={product.img}
          alt={product.name}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top center",
            display: "block",
          }}
        />
        {/* HEART */}
        <button
          onClick={(e) => { e.stopPropagation(); onLike(); }}
          style={{
            position: "absolute", top: 7, right: 7,
            width: 26, height: 26, borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          {liked ? "❤️" : "♡"}
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#1f2937",
          lineHeight: 1.35, marginBottom: 4,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
          <Stars n={product.rating} />
          <span style={{ fontSize: 10, color: "#9ca3af" }}>({product.reviews})</span>
        </div>

        {/* PRICE LINE */}
        <div style={{ fontSize: 11, color: TOKEN.priceRed, fontWeight: 700 }}>
          Price: {product.price}
        </div>
        <div style={{ fontSize: 10, color: "#9ca3af", textDecoration: "line-through" }}>
          {product.old}
        </div>
        <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>
          {product.discountPct}% off
        </div>
        <div style={{ fontSize: 10, color: "#6b7280" }}>
          {product.sold} sold
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Others() {
  const navigate = useNavigate();
  const productsRef = useRef<HTMLDivElement | null>(null);

  /* top-nav active tab */
  const [activeTopCat, setActiveTopCat] = useState("Fashion");

  /* sidebar checked categories */
  const [checkedCats, setCheckedCats] = useState<Record<string, boolean>>({
    Fashion: true,
  });

  /* search */
  const [searchQuery, setSearchQuery] = useState("");

  /* wishlist */
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  /* ── FILTER LOGIC ── */
  // Top-cat filter
  let filtered =
    activeTopCat === "Others"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === activeTopCat);

  // Sidebar checked filter (if any checked)
  const anySideChecked = Object.values(checkedCats).some(Boolean);
  if (anySideChecked) {
    filtered = filtered.filter((p) => checkedCats[p.category]);
  }

  // Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.color || "").toLowerCase().includes(q)
    );
  }

  /* handle top-cat click */
  const handleTopCat = (cat: string) => {
    setActiveTopCat(cat);
    setCheckedCats({});
    setSearchQuery("");
    setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  /* handle sidebar checkbox */
  const toggleSide = (cat: string) => {
    setCheckedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
    setTimeout(() => productsRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  /* navigate to product detail */
  const goToProduct = (p: Product) => {
    navigate(`/product/${p.id}`, { state: { ...p } });
  };

  return (
    <div style={{ minHeight: "100vh", background: TOKEN.pageBg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ══ NAVBAR ══ */}
      <BuyerNavbar cartQty={0} />

      {/* ══ TOP CATEGORY TABS ══ */}
      <div style={{
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        position: "sticky", top: 0, zIndex: 20,
        borderBottom: "1px solid #e5e7eb",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 16px",
          display: "flex", gap: 4, overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {TOP_CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTopCat(cat)}
              style={{
                padding: "10px 16px",
                background: "none",
                border: "none",
                borderBottom: activeTopCat === cat ? `2px solid ${TOKEN.primary}` : "2px solid transparent",
                color: activeTopCat === cat ? TOKEN.primary : "#374151",
                fontWeight: activeTopCat === cat ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ══ HERO BANNER ══ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 16px 0" }}>
        <section style={{
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
          background: `linear-gradient(120deg, ${TOKEN.heroFrom} 0%, ${TOKEN.heroMid} 55%, ${TOKEN.heroTo} 100%)`,
          minHeight: 220,
          display: "flex",
          alignItems: "center",
        }}>
          {/* BG CIRCLES */}
          <div style={{
            position: "absolute", right: 160, top: 10,
            width: 180, height: 180, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{
            position: "absolute", left: "38%", bottom: 8,
            width: 110, height: 110, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }} />

          {/* TEXT SIDE */}
          <div style={{ position: "relative", zIndex: 10, padding: "28px 32px", color: "#fff", flex: 1 }}>
            <span style={{
              fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
              background: "rgba(255,255,255,0.18)", padding: "3px 10px",
              borderRadius: 20, fontWeight: 700,
            }}>
              ✨ New Arrivals
            </span>

            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 900, margin: "10px 0 4px",
              lineHeight: 1.15,
            }}>
              Sajilo Mart
            </h1>

            <p style={{
              color: "#fde68a",
              fontWeight: 600,
              fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)",
              marginBottom: 10,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
            }}>
              Shop Anytime, Anywhere
            </p>

            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.80)", maxWidth: 340, lineHeight: 1.6 }}>
              Discover thousands of products across fashion, electronics,
              home essentials and more — all at your fingertips.
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button
                onClick={() => handleTopCat("Fashion")}
                style={{
                  background: "#fde68a", color: "#4f0aab",
                  fontWeight: 800, fontSize: 12,
                  padding: "10px 20px", borderRadius: 24,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                }}
              >
                Browse Products →
              </button>
              <button
                onClick={() => navigate("/offers")}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff", fontWeight: 600, fontSize: 12,
                  padding: "10px 20px", borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.35)", cursor: "pointer",
                }}
              >
                View Offers
              </button>
            </div>
          </div>

          {/* HERO GIRL */}
          <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "flex-end", height: "100%",
            paddingRight: 24, position: "relative", zIndex: 10,
          }}
            className="hidden md:flex"
          >
            <img
              src={heroGirl}
              alt="Hero"
              style={{ height: 320, objectFit: "contain", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))" }}
            />
          </div>
        </section>
      </div>

      {/* ══ FEATURE STRIP ══ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div style={{
          background: "#fff",
          borderRadius: "0 0 14px 14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: "12px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          borderTop: "none",
          border: "1px solid #e5e7eb",
    
        }}>
          {[
            { emoji: "⚡", bg: "#ecfdf5", clr: "#059669", title: "Emergency Fast Delivery", sub: "Fast delivery in your area" },
            { emoji: "🤖", bg: "#f5f3ff", clr: "#7c3aed", title: "AI Smart Comparison", sub: "Compare products instantly" },
            { emoji: "🎧", bg: "#fffbeb", clr: "#d97706", title: "24/7 Support", sub: "We're here to help" },
          ].map((f) => (
            <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: f.bg, color: f.clr,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>
                {f.emoji}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937" }}>{f.title}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MAIN CONTENT: SIDEBAR + PRODUCTS ══ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 16px 0" }}>

        {/* SECTION TITLE */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>
            Based on Category
          </h2>
        </div>

        {/* SEARCH BAR */}
        <div style={{
          display: "flex", alignItems: "center",
          background: "#fff", borderRadius: 10,
          border: "1px solid #e5e7eb",
          padding: "8px 14px", marginBottom: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <span style={{ color: "#9ca3af", marginRight: 8, fontSize: 14 }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            style={{
              border: "none", outline: "none", fontSize: 13,
              color: "#374151", background: "transparent", flex: 1,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}
            >
              ×
            </button>
          )}
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16 }} ref={productsRef}>

          {/* ── LEFT SIDEBAR ── */}
          <div>
            <div style={{
              background: TOKEN.sidebarBg,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              padding: "14px 12px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              position: "sticky",
              top: 56,
            }}>
              {/* TITLE */}
              <div style={{
                fontSize: 12, fontWeight: 800,
                color: "#22c55e",
                marginBottom: 12,
                letterSpacing: "0.02em",
              }}>
                Select Category
              </div>

              {/* CHECKBOXES */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SIDE_CATS.map((cat) => (
                  <label
                    key={cat}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      cursor: "pointer", fontSize: 12,
                      color: checkedCats[cat] ? TOKEN.primary : "#374151",
                      fontWeight: checkedCats[cat] ? 700 : 500,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedCats[cat]}
                      onChange={() => toggleSide(cat)}
                      style={{
                        accentColor: TOKEN.primary,
                        width: 14, height: 14, cursor: "pointer",
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>

              {/* CLEAR */}
              {anySideChecked && (
                <button
                  onClick={() => setCheckedCats({})}
                  style={{
                    marginTop: 12, fontSize: 10, color: "#ef4444",
                    background: "none", border: "none", cursor: "pointer",
                    fontWeight: 600, padding: 0,
                  }}
                >
                  Clear filters
                </button>
              )}

              {/* RESULT COUNT */}
              <div style={{
                marginTop: 12, paddingTop: 10,
                borderTop: "1px solid #f0f0f0",
                fontSize: 10, color: "#9ca3af",
              }}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
              </div>
            </div>
          </div>

          {/* ── PRODUCT GRID ── */}
          <div>
            {filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px 0",
                color: "#9ca3af",
              }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>🛒</div>
                <p style={{ fontSize: 14 }}>No products found. Try a different category or search.</p>
                <button
                  onClick={() => { setCheckedCats({}); setSearchQuery(""); }}
                  style={{
                    marginTop: 10, fontSize: 12, color: TOKEN.primary,
                    background: "none", border: `1px solid ${TOKEN.primary}`,
                    borderRadius: 20, padding: "6px 16px", cursor: "pointer", fontWeight: 600,
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}>
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    liked={!!liked[p.id]}
                    onLike={() => setLiked((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                    onClick={() => goToProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 40 }}>
        <BuyerFooter />
      </div>
    </div>
  );
}