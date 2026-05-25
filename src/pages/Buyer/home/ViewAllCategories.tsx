import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerNavbar from "../../../components/BuyerNavbar";
import BuyerFooter from "../../../components/BuyerFooter";

// ── Asset imports from src/assets ─────────────────────────
// Replace these with your actual image imports, e.g.:
// import greenKurthi1 from "../../../assets/green-kurthi1.jpg";
// import lightGreenKurthi from "../../../assets/light-green-kurthi.jpg";
// etc.
// For now we use colored SVG placeholders that match the screenshot's color palette.

const placeholder = (w: number, h: number, color: string, label: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="${color}"/>
    <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle"
      font-family="sans-serif" font-size="13" fill="rgba(255,255,255,0.9)" font-weight="600">${label}</text>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
      font-family="sans-serif" font-size="10" fill="rgba(255,255,255,0.6)">image</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// ── Types ──────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  sold: number;
  image: string;
  liked: boolean;
  category: string;
}

// ── Categories ─────────────────────────────────────────────
const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home Goods",
  "Cosmetics",
  "Medicine",
  "Study Materials",
  "Medicine",   // matches screenshot (duplicate visible)
];

// ── Top nav category pills ─────────────────────────────────
const NAV_CATS = [
  "Fashion", "Electronics", "Home Goods", "Cosmetics",
  "Medicine", "Study Materials", "Shoes", "Others",
];

// ── Products ───────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
  // Fashion
  { id: 1,  name: "Green Kurthi",             price: 1050, originalPrice: 1299, discount: 10, sold: 158, image: placeholder(260, 300, "#7a9e6d", "Green Kurthi"),        liked: false, category: "Fashion" },
  { id: 2,  name: "Light Green Cotton Kurtha", price: 1050, originalPrice: 1299, discount: 10, sold: 90,  image: placeholder(260, 300, "#a8c49a", "Light Kurtha"),        liked: false, category: "Fashion" },
  { id: 3,  name: "Light Green Cotton Kurtha", price: 1050, originalPrice: 1299, discount: 10, sold: 90,  image: placeholder(260, 300, "#8bb87d", "Light Kurtha"),        liked: false, category: "Fashion" },
  { id: 4,  name: "Flower Pink Sari",          price: 1050, originalPrice: 1399, discount: 25, sold: 562, image: placeholder(260, 300, "#e8a0b0", "Pink Sari"),           liked: false, category: "Fashion" },
  { id: 5,  name: "Beige Saree",               price: 1050, originalPrice: 1199, discount: 15, sold: 144, image: placeholder(260, 300, "#c8a882", "Beige Saree"),         liked: false, category: "Fashion" },
  { id: 6,  name: "Green Kurthi",              price: 2060, originalPrice: 2499, discount: 18, sold: 158, image: placeholder(260, 300, "#6b9e5e", "Green Kurthi"),        liked: false, category: "Fashion" },
  { id: 7,  name: "Beige Saree",               price: 1050, originalPrice: 1199, discount: 15, sold: 144, image: placeholder(260, 300, "#d4b896", "Beige Saree"),         liked: false, category: "Fashion" },
  { id: 8,  name: "Flower Pink Sari",          price: 1050, originalPrice: 1399, discount: 25, sold: 562, image: placeholder(260, 300, "#f0b0b8", "Pink Sari"),           liked: false, category: "Fashion" },
  // Electronics
  { id: 9,  name: "Wireless Headphones",       price: 3499, originalPrice: 3999, discount: 12, sold: 210, image: placeholder(260, 300, "#888", "Headphones"),             liked: false, category: "Electronics" },
  { id: 10, name: "iPhone 15 Pro",             price: 31099, originalPrice: 35000, discount: 11, sold: 340, image: placeholder(260, 300, "#a0a0a0", "iPhone"),           liked: false, category: "Electronics" },
  { id: 11, name: "Smart Watch",               price: 4999, originalPrice: 5999, discount: 17, sold: 88,  image: placeholder(260, 300, "#555", "Smart Watch"),            liked: false, category: "Electronics" },
  { id: 12, name: "Bluetooth Speaker",         price: 2299, originalPrice: 2799, discount: 18, sold: 173, image: placeholder(260, 300, "#666", "Speaker"),                liked: false, category: "Electronics" },
  // Home Goods
  { id: 13, name: "Ceramic Dinner Set",        price: 2100, originalPrice: 2499, discount: 16, sold: 65,  image: placeholder(260, 300, "#d4a574", "Dinner Set"),          liked: false, category: "Home Goods" },
  { id: 14, name: "Bamboo Organizer",          price: 899,  originalPrice: 1099, discount: 18, sold: 112, image: placeholder(260, 300, "#c8b878", "Organizer"),           liked: false, category: "Home Goods" },
  // Cosmetics
  { id: 15, name: "Rose Face Cream",           price: 599,  originalPrice: 799,  discount: 25, sold: 230, image: placeholder(260, 300, "#e8c0c0", "Face Cream"),          liked: false, category: "Cosmetics" },
  { id: 16, name: "Lipstick Set",              price: 899,  originalPrice: 1099, discount: 18, sold: 310, image: placeholder(260, 300, "#cc4466", "Lipstick"),            liked: false, category: "Cosmetics" },
  // Medicine
  { id: 17, name: "Vitamin C Tablets",         price: 349,  originalPrice: 449,  discount: 22, sold: 510, image: placeholder(260, 300, "#f0c060", "Vitamin C"),           liked: false, category: "Medicine" },
  { id: 18, name: "Multivitamin Pack",          price: 599,  originalPrice: 749,  discount: 20, sold: 280, image: placeholder(260, 300, "#80c080", "Multivitamin"),        liked: false, category: "Medicine" },
  // Study Materials
  { id: 19, name: "Class 10 Science Book",     price: 450,  originalPrice: 550,  discount: 18, sold: 190, image: placeholder(260, 300, "#7090c0", "Science Book"),        liked: false, category: "Study Materials" },
  { id: 20, name: "Engineering Drawing Set",   price: 699,  originalPrice: 899,  discount: 22, sold: 145, image: placeholder(260, 300, "#9090d0", "Drawing Set"),         liked: false, category: "Study Materials" },
];

// ── Star Rating ────────────────────────────────────────────
function Stars({ count = 4 }: { count?: number }) {
  return (
    <span style={{ color: "#f5a623", fontSize: 12, letterSpacing: 0.5 }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

// ── Product Card ───────────────────────────────────────────
function ProductCard({
  product,
  onToggleLike,
  onProductClick,
}: {
  product: Product;
  onToggleLike: (id: number) => void;
  onProductClick: (id: number) => void;
}) {
  return (
    <div
      className="product-card"
      style={pc.card}
      onClick={() => onProductClick(product.id)}
    >
      <div style={pc.imgWrap}>
        <img src={product.image} alt={product.name} style={pc.img} />
        <button
          style={pc.heartBtn}
          onClick={(e) => { e.stopPropagation(); onToggleLike(product.id); }}
          aria-label="wishlist"
        >
          {product.liked ? "❤️" : "🤍"}
        </button>
      </div>
      <div style={pc.info}>
        <p style={pc.name}>{product.name}</p>
        <Stars />
        <p style={pc.price}>
          Price: <span style={{ color: "#e53935" }}>Rs {product.price.toLocaleString()}</span>{" "}
          <span style={pc.strikethrough}>Rs {product.originalPrice.toLocaleString()}</span>
        </p>
        <p style={pc.meta}>{product.discount}% off</p>
        <p style={pc.meta}>{product.sold} sold</p>
      </div>
    </div>
  );
}

const pc: Record<string, React.CSSProperties> = {
  card: {
    background: "white", borderRadius: 10, overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0,0,0,0.09)", cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    display: "flex", flexDirection: "column",
  },
  imgWrap: { position: "relative", width: "100%", aspectRatio: "4/5", overflow: "hidden" },
  img:     { width: "100%", height: "100%", objectFit: "cover" },
  heartBtn: {
    position: "absolute", top: 8, right: 8,
    background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%",
    width: 28, height: 28, cursor: "pointer", fontSize: 13,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(4px)",
  },
  info:         { padding: "10px 10px 12px", flex: 1 },
  name:         { fontSize: 13, fontWeight: 700, color: "#222", marginBottom: 3, lineHeight: 1.3 },
  price:        { fontSize: 12.5, fontWeight: 700, color: "#333", margin: "4px 0 2px" },
  strikethrough:{ fontSize: 11, color: "#aaa", textDecoration: "line-through", fontWeight: 400 },
  meta:         { fontSize: 11.5, color: "#666", fontWeight: 600 },
};

// ── Main Page ──────────────────────────────────────────────
export default function ViewAllCategories() {
  const navigate = useNavigate();

  const [products, setProducts]           = useState<Product[]>(ALL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("Fashion");
  const [checkedCats, setCheckedCats]     = useState<string[]>(["Fashion"]);
  const [visibleCount, setVisibleCount]   = useState(9);

  // ── Filter products by checked categories ──
  const filtered = products.filter((p) => checkedCats.includes(p.category));
  const visible  = filtered.slice(0, visibleCount);

  // ── Handlers ──
  const toggleLike = (id: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)));

  const handleCheckbox = (cat: string) => {
    setCheckedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setVisibleCount(9);
  };

  const handleNavCat = (cat: string) => {
    setActiveCategory(cat);
    setCheckedCats([cat]);
    setVisibleCount(9);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToProduct  = (id: number) => navigate(`/product/${id}`);
  const goToHome     = ()           => navigate("/buyer/home");
  const goToBrowse   = ()           => navigate("/buyer/view-all-products");
  const goToOffers   = ()           => navigate("/buyer/offers");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #f5f6fa; color: #222; }

        /* ── Top category pill strip ── */
        .nav-cat-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 12.5px; font-weight: 700;
          color: #444; padding: 8px 14px;
          border-bottom: 2.5px solid transparent;
          transition: color .15s, border-color .15s;
          white-space: nowrap;
        }
        .nav-cat-btn:hover  { color: #2962ff; }
        .nav-cat-btn.active { color: #2962ff; border-bottom-color: #2962ff; }

        /* ── Sidebar checkbox ── */
        .cat-checkbox-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; color: #333;
          cursor: pointer; padding: 6px 0;
          transition: color .12s;
        }
        .cat-checkbox-label:hover { color: #2962ff; }
        .cat-checkbox {
          width: 16px; height: 16px; accent-color: #27ae60;
          cursor: pointer; flex-shrink: 0;
        }

        /* ── Product card hover ── */
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.13) !important;
        }

        /* ── Buttons ── */
        .browse-btn {
          background: linear-gradient(135deg,#27ae60,#1e8449);
          color: white; border: none; border-radius: 20px;
          padding: 9px 20px; font-size: 13px; font-weight: 800;
          cursor: pointer; font-family: 'Nunito', sans-serif;
          box-shadow: 0 3px 10px rgba(39,174,96,0.35);
          transition: opacity .15s, transform .12s;
        }
        .browse-btn:hover { opacity: .9; transform: translateY(-1px); }

        .offers-btn {
          background: transparent; color: white;
          border: 2px solid white; border-radius: 20px;
          padding: 9px 20px; font-size: 13px; font-weight: 800;
          cursor: pointer; font-family: 'Nunito', sans-serif;
          transition: background .15s, color .15s;
        }
        .offers-btn:hover { background: white; color: #6c3fc5; }

        .load-btn {
          background: linear-gradient(135deg,#9b59b6,#8e44ad);
          color: white; border: none; border-radius: 24px;
          padding: 11px 38px; font-size: 14px; font-weight: 800;
          cursor: pointer; font-family: 'Nunito', sans-serif;
          box-shadow: 0 4px 16px rgba(142,68,173,0.35);
          transition: opacity .15s, transform .12s;
        }
        .load-btn:hover { opacity: .9; transform: translateY(-1px); }

        /* ── Animations ── */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .page-in { animation: fadeIn .35s ease both; }

        @keyframes bannerSlide { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
        .banner-text { animation: bannerSlide .5s ease both; }
      `}</style>

      {/* ══ NAVBAR (imported) ══ */}
      <BuyerNavbar cartQty={0}/>

      {/* ══ CATEGORY PILL STRIP ══ */}
      <div style={{ background: "white", borderBottom: "1px solid #e8e8e8", overflowX: "auto" }}>
        <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          {NAV_CATS.map((cat) => (
            <button
              key={cat}
              className={`nav-cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleNavCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ══ HERO BANNER ══ */}
      <div style={{
        background: "linear-gradient(120deg, #6c3fc5 0%, #9b59b6 60%, #c0392b 100%)",
        padding: "32px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 80, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div className="banner-text">
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "3px 12px", fontSize: 11, fontWeight: 800, color: "white", letterSpacing: 1, marginBottom: 10 }}>
              NEW ARRIVALS
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 6 }}>
              Sajilo Mart
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", fontWeight: 700, marginBottom: 6, fontStyle: "italic" }}>
              Shop Anytime, Anywhere
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 20, maxWidth: 300, lineHeight: 1.5 }}>
              Discover thousands of products across fashion, electronics, home essentials, and more.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="browse-btn" onClick={goToBrowse}>Browse Products →</button>
              <button className="offers-btn" onClick={goToOffers}>View Offers</button>
            </div>
          </div>
          {/* Banner illustration placeholder */}
          <div style={{
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 64, flexShrink: 0,
          }}>
            🛍️
          </div>
        </div>
      </div>

      {/* ══ FEATURE BADGES ══ */}
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { icon: "🚚", title: "Emergency Fast Delivery", sub: "Fast delivery to your door" },
            { icon: "🤖", title: "AI Smart Comparison",     sub: "Compare Products Smartly" },
            { icon: "🎧", title: "24/7 Support",            sub: "We're here to help you" },
          ].map((f) => (
            <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={goToHome}>
              <span style={{ fontSize: 24 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#1a1a2e" }}>{f.title}</p>
                <p style={{ fontSize: 11, color: "#888" }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="page-in" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 48px" }}>

        {/* Section header */}
        <div style={{ marginBottom: 6 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e" }}>Based on Category</h2>
        </div>
        <p style={{ fontSize: 14, fontWeight: 800, color: "#27ae60", marginBottom: 20 }}>Select Category</p>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* ── SIDEBAR: Checkbox filters ── */}
          <div style={{
            flexShrink: 0, width: 170,
            background: "white", borderRadius: 10,
            padding: "16px 18px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            position: "sticky", top: 80,
          }}>
            {CATEGORIES.map((cat, i) => (
              <label key={`${cat}-${i}`} className="cat-checkbox-label">
                <input
                  type="checkbox"
                  className="cat-checkbox"
                  checked={checkedCats.includes(cat)}
                  onChange={() => handleCheckbox(cat)}
                />
                {cat}
              </label>
            ))}
          </div>

          {/* ── PRODUCT GRID ── */}
          <div style={{ flex: 1 }}>
            {visible.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                <p style={{ fontSize: 18, fontWeight: 700 }}>No products found.</p>
                <p style={{ fontSize: 13, marginTop: 6 }}>Try selecting a different category from the left.</p>
              </div>
            ) : (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                  marginBottom: 28,
                }}>
                  {visible.map((p) => (
                    <div key={p.id} className="product-card" style={{ borderRadius: 10 }}>
                      <ProductCard
                        product={p}
                        onToggleLike={toggleLike}
                        onProductClick={goToProduct}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {visibleCount < filtered.length && (
                  <div style={{ textAlign: "center" }}>
                    <button
                      className="load-btn"
                      onClick={() => setVisibleCount((v) => v + 9)}
                    >
                      Load More...
                    </button>
                  </div>
                )}

                {/* All loaded */}
                {visibleCount >= filtered.length && filtered.length > 0 && (
                  <p style={{ textAlign: "center", color: "#aaa", fontSize: 13, fontWeight: 600 }}>
                    All {filtered.length} products shown
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══ FOOTER (imported) ══ */}
      <BuyerFooter />
    </>
  );
}