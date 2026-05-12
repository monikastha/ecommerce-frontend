import { useState, useRef } from "react";

/* ── placeholder helper ─────────────────────────────────── */
const ph = (w: number, h: number, label: string, bg: string) =>
  `https://placehold.co/${w}x${h}/${bg}/ffffff?text=${encodeURIComponent(label)}`;

/* ── data ────────────────────────────────────────────────── */
const topProducts = [
  { id: 1, name: "Black Leather Shoes",   price: "Rs. 1,799",  old: "Rs. 2,120",  rating: 4, reviews: 128, img: ph(220,180,"Shoes","5c3317") },
  { id: 2, name: "Red Emerald Necklace",  price: "Rs. 2,199",  old: "Rs. 2,799",  rating: 4, reviews: 97,  img: ph(220,180,"Necklace","8B0000") },
  { id: 3, name: "Apple iPhone 15 Pro",   price: "Rs. 91,999", old: "Rs. 99,999", rating: 5, reviews: 251, img: ph(220,180,"iPhone+15+Pro","1c1c1e") },
  { id: 4, name: "Wireless Headphones",   price: "Rs. 3,499",  old: "Rs. 4,200",  rating: 4, reviews: 183, img: ph(220,180,"Headphones","2d2d2d") },
];

const categories = [
  { id:1, title:"Fashion",        sub:"Trendy Outfits",    img: ph(90,65,"Fashion","7c3aed") },
  { id:2, title:"Electronics",    sub:"Latest Gadgets",    img: ph(90,65,"Electronics","1d4ed8") },
  { id:3, title:"Home Goods",     sub:"Home Essentials",   img: ph(90,65,"HomeGoods","b45309") },
  { id:4, title:"Cosmetics",      sub:"Beauty Products",   img: ph(90,65,"Cosmetics","be185d") },
  { id:5, title:"Medicine",       sub:"Healthcare",        img: ph(90,65,"Medicine","15803d") },
  { id:6, title:"Study Materials",sub:"Books & Guides",    img: ph(90,65,"StudyMat","0e7490") },
];

const reviews = [
  { id:1, name:"Kabita Kumal", text:"Excellent! Fast delivery and very supportive. Will order again definitely.", rating:5, img: ph(70,70,"KK","e879a0") },
  { id:2, name:"Kabita Thapa", text:"Great products at best prices. Will definitely order again once in a lifetime deals.", rating:5, img: ph(70,70,"KT","34d399") },
];

/* ── star component ─────────────────────────────────────── */
const Stars = ({ n }: { n: number }) => (
  <span>{[1,2,3,4,5].map(i => (
    <span key={i} style={{ color: i<=n ? "#f59e0b" : "#d1d5db", fontSize: 11 }}>★</span>
  ))}</span>
);

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function SajiloMart() {
  const [heroImg, setHeroImg]     = useState(ph(380,420,"Shopping+Girl","9333ea"));
  const [activeCat, setActiveCat] = useState("Fashion");
  const [activeNav, setActiveNav] = useState("Home");
  const [liked, setLiked]         = useState<Record<number,boolean>>({});
  const [cartQty, setCartQty]     = useState(0);
  const [email, setEmail]         = useState("");
  const [subbed, setSubbed]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => setHeroImg(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const navItems = [
    { label:"Home",    icon:"🏠" },
    { label:"Login",   icon:"🔑" },
    { label:"SignUp",  icon:"👤" },
    { label:"Account", icon:"👤" },
    { label:"Logout",  icon:"🚪" },
    { label:"Cart",    icon:"🛒", badge: cartQty },
  ];

  const catTabs = ["Fashion","Electronics","Home Goods","Cosmetics","Medicine","Study Materials","Shoes","Others"];

  return (
    <>
      {/* ── global styles ───────────────────────────────── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body { background: #f3f4f6; font-family: 'Segoe UI', sans-serif; }

        .sm-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* scrollbar hide */
        .no-scroll::-webkit-scrollbar { display: none; }
        .no-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* nav icons */
        .nav-btn {
          display: flex; flex-direction: column; align-items: center;
          gap: 2px; padding: 4px 10px; border-radius: 6px;
          cursor: pointer; border: none; background: transparent;
          font-size: 10px; color: #555; transition: all .15s;
          white-space: nowrap;
        }
        .nav-btn:hover { background: #ede9fe; color: #5b21b6; }
        .nav-btn.active { color: #5b21b6; font-weight: 700; }
        .nav-btn .icon { font-size: 18px; line-height: 1; }

        /* category tabs */
        .cat-tab {
          padding: 5px 14px; border-radius: 20px; border: 1px solid #ddd;
          background: #fff; cursor: pointer; font-size: 12px; white-space: nowrap;
          transition: all .15s; color: #444;
        }
        .cat-tab:hover { background: #7c3aed; color: #fff; border-color: #7c3aed; }
        .cat-tab.active { background: #7c3aed; color: #fff; border-color: #7c3aed; }

        /* product card */
        .p-card {
          background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
          overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.07);
          transition: box-shadow .2s, transform .2s; position: relative;
        }
        .p-card:hover { box-shadow: 0 6px 20px rgba(91,33,182,.15); transform: translateY(-3px); }

        .btn-buy {
          flex: 1; background: #22c55e; color: #fff; font-size: 10px;
          font-weight: 700; padding: 5px 0; border-radius: 5px; border: none;
          cursor: pointer; transition: background .15s;
        }
        .btn-buy:hover { background: #16a34a; }
        .btn-add {
          flex: 1; background: #7c3aed; color: #fff; font-size: 10px;
          font-weight: 700; padding: 5px 0; border-radius: 5px; border: none;
          cursor: pointer; transition: background .15s;
        }
        .btn-add:hover { background: #6d28d9; }

        .heart {
          position: absolute; top: 6px; right: 6px;
          background: rgba(255,255,255,.9); border: none;
          border-radius: 50%; width: 24px; height: 24px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 13px; color: #ccc; transition: color .15s;
        }
        .heart.liked { color: #ef4444; }

        /* category card */
        .cat-card {
          background: #fff; border-radius: 10px; border: 1px solid #e5e7eb;
          display: flex; align-items: center; gap: 12px; padding: 10px 14px;
          cursor: pointer; transition: box-shadow .15s;
        }
        .cat-card:hover { box-shadow: 0 4px 14px rgba(91,33,182,.13); }

        /* footer link hover */
        .f-link { font-size: 12px; color: #9ca3af; cursor: pointer; transition: color .15s; display: block; margin-bottom: 5px; }
        .f-link:hover { color: #c4b5fd; }

        /* responsive */
        @media (max-width: 768px) {
          .hero-text h1 { font-size: 28px !important; }
          .hero-text .script { font-size: 20px !important; }
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .feat-strip { flex-direction: column; gap: 10px !important; }
          .trust-strip { flex-direction: column; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
          .hero-section { min-height: 200px !important; }
          .nav-btn .icon { font-size: 14px; }
        }
      `}</style>

      <div style={{ width:"100%", minHeight:"100vh", background:"#f3f4f6" }}>

        {/* ══════════════ STICKY HEADER ══════════════ */}
        <header style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", position:"sticky", top:0, zIndex:200, boxShadow:"0 2px 8px rgba(0,0,0,.08)" }}>
          <div className="sm-container">

            {/* Row 1: Logo + Search + Nav icons */}
            <div style={{ display:"flex", alignItems:"center", gap:16, padding:"10px 0 6px" }}>

              {/* LOGO */}
              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#15803d)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 8px rgba(34,197,94,.35)" }}>
                  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                    <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize:16, fontWeight:900, color:"#0c5f35", fontFamily:"Georgia,serif", lineHeight:1.1 }}>Sajilo Mart</div>
                  <div style={{ fontSize:9, color:"#888", fontStyle:"italic" }}>Shop Anytime, Anywhere</div>
                </div>
              </div>

              {/* SEARCH */}
              <div style={{ flex:1, display:"flex", alignItems:"center", border:"2px solid #e0d6ff", borderRadius:25, overflow:"hidden", height:38, background:"#fafafa", maxWidth:600 }}>
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  style={{ flex:1, height:"100%", padding:"0 14px", fontSize:12, outline:"none", background:"transparent", border:"none" }}
                />
                <button style={{ width:42, height:38, background:"#7c3aed", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </button>
              </div>

              {/* NAV ICONS */}
              <div style={{ display:"flex", alignItems:"center", gap:2, flexShrink:0 }}>
                {navItems.map(item => (
                  <button
                    key={item.label}
                    className={`nav-btn ${activeNav===item.label?"active":""}`}
                    onClick={() => setActiveNav(item.label)}
                    style={{ position:"relative" }}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {(item as any).badge > 0 && (
                      <span style={{ position:"absolute", top:0, right:4, background:"#ef4444", color:"#fff", borderRadius:"50%", width:15, height:15, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>
                        {(item as any).badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Category Tabs */}
            <div className="no-scroll" style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8 }}>
              {catTabs.map(c => (
                <button key={c} className={`cat-tab ${activeCat===c?"active":""}`} onClick={() => setActiveCat(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ══════════════ HERO ══════════════ */}
        <div className="sm-container" style={{ paddingTop:20 }}>
          <section
            className="hero-section"
            style={{
              background:"linear-gradient(110deg,#5b21b6 0%,#7c3aed 45%,#a855f7 75%,#c026d3 100%)",
              borderRadius:18, overflow:"hidden", position:"relative",
              minHeight:260, display:"flex", alignItems:"stretch"
            }}
          >
            {/* Left text */}
            <div className="hero-text" style={{ flex:1, padding:"32px 40px", display:"flex", flexDirection:"column", justifyContent:"center", zIndex:2 }}>
              <div style={{ display:"inline-block", background:"rgba(255,255,255,.2)", color:"#fff", fontSize:11, padding:"4px 14px", borderRadius:20, marginBottom:12, fontWeight:600, letterSpacing:1, width:"fit-content" }}>
                NEW ARRIVALS
              </div>
              <h1 style={{ color:"#fff", fontSize:48, fontWeight:900, lineHeight:1.1, fontFamily:"Georgia,serif", textShadow:"0 2px 12px rgba(0,0,0,.2)" }}>
                Sajilo Mart
              </h1>
              <p className="script" style={{ color:"#fde68a", fontSize:28, fontFamily:"cursive", lineHeight:1.3, marginTop:4 }}>
                Shop Anytime, Anywhere
              </p>
              <p style={{ color:"rgba(255,255,255,.88)", fontSize:13, marginTop:10, lineHeight:1.6, maxWidth:420 }}>
                Discover thousands of products across fashion, electronics, home essentials, and more — all at your fingertips.
              </p>
              <div style={{ display:"flex", gap:12, marginTop:20 }}>
                <button style={{ background:"#fde68a", color:"#4c1d95", fontSize:13, fontWeight:800, padding:"10px 22px", borderRadius:25, border:"none", cursor:"pointer", boxShadow:"0 4px 12px rgba(0,0,0,.15)" }}>
                  Browse Products →
                </button>
                <button style={{ background:"transparent", color:"#fff", fontSize:13, fontWeight:600, padding:"10px 22px", borderRadius:25, border:"2px solid rgba(255,255,255,.7)", cursor:"pointer" }}>
                  View Offers
                </button>
              </div>
            </div>

            {/* Right image */}
            <div style={{ position:"relative", flexShrink:0, width:300, overflow:"hidden" }}>
              <img src={heroImg} alt="Hero" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              <button
                onClick={() => fileRef.current?.click()}
                style={{ position:"absolute", top:10, right:10, background:"rgba(255,255,255,.9)", fontSize:10, padding:"4px 10px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:700, color:"#7c3aed" }}
              >
                📷 Change Image
              </button>
              <input ref={fileRef} type="file" hidden onChange={onFile} accept="image/*" />
            </div>
          </section>
        </div>

        {/* ══════════════ FEATURES STRIP ══════════════ */}
        <div className="sm-container" style={{ marginTop:0 }}>
          <div
            className="feat-strip"
            style={{ background:"#fff", borderRadius:"0 0 16px 16px", padding:"14px 30px", display:"flex", justifyContent:"space-around", boxShadow:"0 3px 10px rgba(0,0,0,.07)", borderTop:"1px solid #f0f0f0" }}
          >
            {[
              { emoji:"🚚", bg:"#dcfce7", title:"Emergency Fast Delivery", sub:"Fast delivery in your area" },
              { emoji:"🤖", bg:"#ede9fe", title:"AI Smart Comparison",     sub:"Compare products instantly" },
              { emoji:"🎧", bg:"#fff7ed", title:"24/7 Support",             sub:"We're here to help" },
            ].map(f => (
              <div key={f.title} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:f.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {f.emoji}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1f2937", lineHeight:1.3 }}>{f.title}</div>
                  <div style={{ fontSize:11, color:"#9ca3af" }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ TOP SELLS ══════════════ */}
        <div className="sm-container" style={{ marginTop:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#111" }}>Top sells</h2>
            <button style={{ fontSize:13, color:"#7c3aed", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
              View All Products →
            </button>
          </div>
          <div className="grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {topProducts.map(p => (
              <div key={p.id} className="p-card">
                <div style={{ position:"relative" }}>
                  <img src={p.img} alt={p.name} style={{ width:"100%", height:160, objectFit:"cover" }} />
                  <button className={`heart ${liked[p.id]?"liked":""}`} onClick={() => setLiked(l => ({...l,[p.id]:!l[p.id]}))}>
                    {liked[p.id] ? "♥" : "♡"}
                  </button>
                </div>
                <div style={{ padding:"10px 10px 12px" }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#1f2937", lineHeight:1.4, minHeight:32 }}>{p.name}</div>
                  <div style={{ marginTop:3 }}>
                    <Stars n={p.rating} />
                    <span style={{ fontSize:10, color:"#9ca3af", marginLeft:3 }}>({p.reviews})</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#111", marginTop:5 }}>{p.price}</div>
                  <div style={{ fontSize:10, color:"#d1d5db", textDecoration:"line-through" }}>{p.old}</div>
                  <div style={{ display:"flex", gap:6, marginTop:8 }}>
                    <button className="btn-buy">Buy Now</button>
                    <button className="btn-add" onClick={() => setCartQty(c => c+1)}>Add to cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ SHOP BY CATEGORY ══════════════ */}
        <div className="sm-container" style={{ marginTop:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#111" }}>Shop by Category</h2>
            <button style={{ fontSize:13, color:"#7c3aed", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
              View All Categories →
            </button>
          </div>
          <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {categories.map(c => (
              <div key={c.id} className="cat-card">
                <img src={c.img} alt={c.title} style={{ width:70, height:52, objectFit:"cover", borderRadius:8, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1f2937" }}>{c.title}</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ TRUST STRIP ══════════════ */}
        <div className="sm-container" style={{ marginTop:28 }}>
          <div
            className="trust-strip"
            style={{ background:"#f0fdf4", borderRadius:14, padding:"18px 30px", display:"flex", justifyContent:"space-between", alignItems:"center", border:"1px solid #d1fae5" }}
          >
            {[
              { emoji:"✅", bg:"#d1fae5", title:"Original Products",          sub:"100% Authentic Brands",      textColor:"#166534" },
              { emoji:"🏷️", bg:"#fef9c3", title:"Best Prices",                sub:"Unbeatable Deals",            textColor:"#92400e", sale:true },
              { emoji:"👥", bg:"#dbeafe", title:"Trusted by 1000+ Customers", sub:"Join the Sajilo family today", textColor:"#1e40af" },
            ].map(t => (
              <div key={t.title} style={{ display:"flex", alignItems:"center", gap:12, flex:1, justifyContent:"center" }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, position:"relative" }}>
                  {t.emoji}
                  {t.sale && (
                    <span style={{ position:"absolute", top:-5, right:-5, background:"#ef4444", color:"#fff", fontSize:8, padding:"2px 5px", borderRadius:6, fontWeight:700 }}>SALE</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:t.textColor }}>{t.title}</div>
                  <div style={{ fontSize:11, color:"#555" }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ REVIEWS ══════════════ */}
        <div className="sm-container" style={{ marginTop:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#111" }}>What Our Customers Say</h2>
            <button style={{ fontSize:13, color:"#7c3aed", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
              View All Reviews →
            </button>
          </div>
          <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
            {reviews.map(r => (
              <div key={r.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", padding:"16px 16px", display:"flex", gap:14, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                <img src={r.img} alt={r.name} style={{ width:60, height:60, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#111" }}>{r.name}</div>
                  <Stars n={r.rating} />
                  <p style={{ fontSize:11, color:"#6b7280", lineHeight:1.5, marginTop:5 }}>{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer style={{ background:"#0f0028", color:"#fff", marginTop:36, paddingTop:36, paddingBottom:16 }}>
          <div className="sm-container">
            <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1.5fr 1.5fr", gap:32 }}>

              {/* Brand */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                      <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize:18, fontWeight:900, fontFamily:"Georgia,serif" }}>Sajilo Mart</div>
                    <div style={{ fontSize:9, color:"#9ca3af", fontStyle:"italic" }}>Shop Anytime, Anywhere</div>
                  </div>
                </div>
                <p style={{ fontSize:12, color:"#9ca3af", lineHeight:1.7 }}>
                  Your trusted online shopping partner for fashion, electronics, home goods and more.
                </p>
                <div style={{ display:"flex", gap:8, marginTop:14 }}>
                  {[
                    { bg:"linear-gradient(45deg,#f09433,#dc2743,#bc1888)", label:"📷" },
                    { bg:"#1877f2", label:"f" },
                    { bg:"#1da1f2", label:"𝕏" },
                  ].map(s => (
                    <button key={s.label} style={{ width:32, height:32, borderRadius:"50%", background:s.bg, color:"#fff", border:"none", cursor:"pointer", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", transition:"opacity .15s" }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = ".75")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Quick Links</div>
                {["Home","About Us","Products","Offers","Contact"].map(l => (
                  <a key={l} className="f-link">{l}</a>
                ))}
              </div>

              {/* Customer Service */}
              <div>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Customer Service</div>
                {["My Account","Track Order","Wishlist","Emergency Fast Delivery","AI Smart Comparison","Help Center"].map(l => (
                  <a key={l} className="f-link">{l}</a>
                ))}
              </div>

              {/* Newsletter */}
              <div>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Newsletter</div>
                <p style={{ fontSize:11, color:"#9ca3af", lineHeight:1.6, marginBottom:10 }}>
                  Subscribe to get special offers, free giveaways and once-in-a-lifetime deals.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:"1px solid #374151", background:"#1a0050", color:"#fff", fontSize:12, outline:"none" }}
                />
                <button
                  onClick={() => { if (email) setSubbed(true); }}
                  style={{ width:"100%", marginTop:8, padding:"8px 0", borderRadius:8, background:"#7c3aed", color:"#fff", fontSize:12, fontWeight:700, border:"none", cursor:"pointer", transition:"background .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#6d28d9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#7c3aed")}
                >
                  {subbed ? "✓ Subscribed!" : "Subscribe"}
                </button>
                <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                  {["VISA","MC","PayPal","UPI"].map(p => (
                    <div key={p} style={{ background:"#fff", borderRadius:5, padding:"3px 8px", fontSize:9, color:"#333", fontWeight:800 }}>{p}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop:"1px solid #1f1040", marginTop:28, paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
              <span style={{ fontSize:11, color:"#6b7280" }}>© 2026 Sajilo Mart. All rights reserved</span>
              <div style={{ display:"flex", gap:16 }}>
                {["Privacy Policy","Terms of Service","Accessibility Statement"].map(l => (
                  <span key={l} style={{ fontSize:11, color:"#6b7280", cursor:"pointer", transition:"color .15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#c4b5fd")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
                  >{l}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}