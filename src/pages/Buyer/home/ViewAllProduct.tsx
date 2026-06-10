import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import bbGirl from "../../../assets/bbimg-removebg-preview.png";
import {
  addBuyerCartItem,
  getBuyerCartCount,
} from "../../../utils/buyerCart";
import { isBuyerLoggedIn } from "../../../utils/buyerAuth";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type ApiProduct = {
  id: number;
  name: string;
  category?: number | { id?: number; name?: string } | null;
  category_name?: string;
  code?: string;
  description?: string;
  price: string;
  quantity: number;
  image?: string;
  status: "pending" | "approved" | "rejected";
  is_published: boolean;
};

type ApiCategory = {
  id: number;
  name: string;
  image?: string;
};

type ApiStock = {
  id: number;
  product: number;
  quantity: number;
  availability_status: "in_stock" | "low_stock" | "out_of_stock";
  available_to_buyers: boolean;
};

type ApiPromotion = {
  id: number;
  name: string;
  d_type: "percentage" | "fixed";
  d_value: number | string | null;
  applies_to: "all" | "category";
  categories: number[];
  start_date: string;
  end_date: string;
  status: string;
};

const TOKEN = {
  heroFrom: "#174ea6",
  heroMid: "#7c3aed",
  heroTo: "#db2777",
  pageBg: "#f6f7fb",
};

const FEATURES = [
  { emoji: "🚚", bg: "bg-emerald-50", title: "Fast Delivery", sub: "Same day or next day delivery" },
  { emoji: "🤖", bg: "bg-violet-50", title: "AI Smart Comparison", sub: "Compare products instantly" },
  { emoji: "🎧", bg: "bg-amber-50", title: "24/7 Support", sub: "Always here to help" },
];

const imageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("/") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
};

const priceNumber = (value: string | number) => Number(String(value).replace(/[^0-9.]/g, "")) || 0;
const currency = (value: string | number) => `Rs. ${priceNumber(value).toLocaleString()}`;

const normalizeText = (value?: string | null) => (value || "").trim().toLowerCase();

const storageKeySearchHistory = "buyer_search_history";
const storageKeyClickCounts = "buyer_product_click_counts";

type PriceQuery = { min: number; max: number };

const parsePriceQuery = (query: string): PriceQuery | null => {
  const value = query.trim().toLowerCase().replace(/[^0-9.\-+to\s]/g, " ").trim();
  if (!value) return null;

  const rangeMatch = value.match(/^(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)$/);
  if (rangeMatch) {
    const min = Number(rangeMatch[1]);
    const max = Number(rangeMatch[2]);
    return { min: Math.min(min, max), max: Math.max(min, max) };
  }

  const plusMatch = value.match(/^(\d+(?:\.\d+)?)\s*\+$/);
  if (plusMatch) {
    const min = Number(plusMatch[1]);
    return { min, max: Number.POSITIVE_INFINITY };
  }

  const lessThanMatch = value.match(/^<\s*(\d+(?:\.\d+)?)$/);
  if (lessThanMatch) {
    return { min: 0, max: Number(lessThanMatch[1]) };
  }

  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  if (!Number.isNaN(numeric) && String(numeric).length > 0) {
    return { min: numeric, max: numeric };
  }

  return null;
};

const getSearchHistory = (): string[] => {
  try {
    const saved = localStorage.getItem(storageKeySearchHistory);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
};

const saveSearchHistory = (term: string): string[] => {
  const normalized = normalizeText(term);
  if (!normalized) return [];
  const history = getSearchHistory();
  const next = [term.trim(), ...history.filter((item) => normalizeText(item) !== normalized)].slice(0, 8);
  localStorage.setItem(storageKeySearchHistory, JSON.stringify(next));
  return next;
};

const getClickCounts = (): Record<number, number> => {
  try {
    const saved = localStorage.getItem(storageKeyClickCounts);
    return saved ? (JSON.parse(saved) as Record<number, number>) : {};
  } catch {
    return {};
  }
};

const productCategoryName = (product: ApiProduct) => {
  if (product.category_name?.trim()) return product.category_name.trim();
  if (product.category && typeof product.category === "object" && product.category.name?.trim()) {
    return product.category.name.trim();
  }
  return "Uncategorized";
};

const productCategoryId = (product: ApiProduct) => {
  if (typeof product.category === "number") return product.category;
  if (product.category && typeof product.category === "object" && product.category.id) return product.category.id;
  return null;
};

const isPromotionActive = (promotion: ApiPromotion) => {
  const now = Date.now();
  return (
    promotion.status === "active" &&
    new Date(promotion.start_date).getTime() <= now &&
    new Date(promotion.end_date).getTime() >= now
  );
};

const promotionForProduct = (product: ApiProduct, promotions: ApiPromotion[]) => {
  const categoryId = productCategoryId(product);
  const priceAfterPromotion = (promotion: ApiPromotion) => {
    const basePrice = priceNumber(product.price);
    const value = priceNumber(promotion.d_value || 0);
    return promotion.d_type === "percentage"
      ? Math.max(0, basePrice - (basePrice * value) / 100)
      : Math.max(0, basePrice - value);
  };

  return promotions
    .filter(isPromotionActive)
    .filter((promotion) =>
      promotion.applies_to === "all" ||
      (categoryId !== null && promotion.categories?.includes(categoryId))
    )
    .sort((a, b) => priceAfterPromotion(a) - priceAfterPromotion(b))[0];
};

const discountedPrice = (price: string | number, promotion?: ApiPromotion) => {
  const basePrice = priceNumber(price);
  if (!promotion) return basePrice;
  const value = priceNumber(promotion.d_value || 0);
  if (promotion.d_type === "percentage") return Math.max(0, basePrice - (basePrice * value) / 100);
  return Math.max(0, basePrice - value);
};

const keySpecifications = (description?: string) =>
  (description || "")
    .split(/\r?\n|[;•]+/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

const ProductSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-100 rounded" />
      <div className="h-4 bg-slate-100 rounded w-2/3" />
      <div className="h-9 bg-slate-100 rounded" />
    </div>
  </div>
);

export default function ViewAllProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [stocks, setStocks] = useState<ApiStock[]>([]);
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartQty, setCartQty] = useState(getBuyerCartCount());
  const [addedId, setAddedId] = useState<number | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => getSearchHistory());
  const [productClicks, setProductClicks] = useState<Record<number, number>>(() => getClickCounts());

  const selectedCategory = params.get("category") || "All";
  const searchQuery = params.get("search") || "";

  useEffect(() => {
    const refreshCart = () => setCartQty(getBuyerCartCount());
    window.addEventListener("buyer-cart-change", refreshCart);
    return () => window.removeEventListener("buyer-cart-change", refreshCart);
  }, []);

  useEffect(() => {
    const loadStore = async () => {
      setLoading(true);
      setError("");
      try {
        const [productRes, categoryRes, stockRes, promotionRes] = await Promise.all([
          fetch(`${API_ORIGIN}/api/products/?status=approved&is_published=true`),
          fetch(`${API_ORIGIN}/api/productcategory/categories/`),
          fetch(`${API_ORIGIN}/api/warehouse/stock/?available=true`),
          fetch(`${API_ORIGIN}/api/admin/promotions/`),
        ]);

        if (!productRes.ok || !categoryRes.ok || !stockRes.ok || !promotionRes.ok) throw new Error("Unable to load store");

        const [productData, categoryData, stockData, promotionData] = await Promise.all([
          productRes.json(),
          categoryRes.json(),
          stockRes.json(),
          promotionRes.json(),
        ]);

        setProducts(Array.isArray(productData) ? productData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setStocks(Array.isArray(stockData) ? stockData : []);
        setPromotions(Array.isArray(promotionData) ? promotionData : []);
      } catch (err) {
        console.error(err);
        setError("Could not load products right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, []);

  const categoryNames = useMemo(
    () => Array.from(new Set(categories.map((c) => c.name).filter(Boolean))),
    [categories]
  );

  const stockByProduct = useMemo(() => {
    const map = new Map<number, ApiStock>();

    stocks
      .filter((stock) => {
        return stock.quantity > 0 && stock.available_to_buyers;
      })
      .forEach((stock) => map.set(stock.product, stock));

    return map;
  }, [stocks]);

  const trackProductClick = (productId: number) => {
    setProductClicks((prev) => {
      const next = { ...prev, [productId]: (prev[productId] || 0) + 1 };
      localStorage.setItem(storageKeyClickCounts, JSON.stringify(next));
      return next;
    });
  };

  const recommendationProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const clickEntries = Object.entries(productClicks)
      .map(([key, count]) => ({ id: Number(key), count }))
      .sort((a, b) => b.count - a.count);

    const topClickedIds = new Set(clickEntries.slice(0, 5).map((item) => item.id));

    const topCategories = clickEntries
      .map((entry) => products.find((product) => product.id === entry.id))
      .filter((product): product is ApiProduct => !!product)
      .reduce<Record<string, number>>((acc, product) => {
        const category = productCategoryName(product);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

    const topCategoryNames = new Set(
      Object.entries(topCategories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name)
    );

    const terms = [query, ...searchHistory.map(normalizeText)].filter(Boolean);

    return products
      .filter((product) => stockByProduct.has(product.id) && product.is_published && product.status === "approved")
      .map((product) => {
        let score = 0;
        const normalizedName = product.name.toLowerCase();
        const normalizedDesc = (product.description || "").toLowerCase();
        const categoryName = productCategoryName(product).toLowerCase();

        if (topClickedIds.has(product.id)) score += 50;
        if (topCategoryNames.has(categoryName)) score += 25;
        if (terms.some((term) => normalizedName.includes(term))) score += 30;
        if (terms.some((term) => normalizedDesc.includes(term))) score += 12;
        if (terms.some((term) => categoryName.includes(term))) score += 18;
        score += (productClicks[product.id] || 0) * 6;

        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .map((item) => item.product)
      .slice(0, 6);
  }, [products, productClicks, searchQuery, searchHistory, stockByProduct]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const priceQuery = parsePriceQuery(query);

    return products.filter((product) => {
      const categoryName = productCategoryName(product);
      const categoryMatch = selectedCategory === "All" || normalizeText(categoryName) === normalizeText(selectedCategory);
      const nameMatch = product.name.toLowerCase().includes(query);
      const descriptionMatch = (product.description || "").toLowerCase().includes(query);
      const categoryMatchQuery = categoryName.toLowerCase().includes(query);
      const codeMatch = (product.code || "").toLowerCase().includes(query);

      const productPrice = priceNumber(product.price);
      const priceMatch = priceQuery
        ? productPrice >= priceQuery.min && productPrice <= priceQuery.max
        : query && /\d/.test(query)
          ? String(productPrice).includes(query.replace(/[^0-9.]/g, ""))
          : false;

      const searchMatch = !query || nameMatch || descriptionMatch || categoryMatchQuery || codeMatch || priceMatch;

      return categoryMatch && searchMatch && product.is_published && product.status === "approved";
    });
  }, [products, searchQuery, selectedCategory, stockByProduct]);

  const visibleProducts = filteredProducts.slice(0, 12);

  const updateSearchParams = (next: { category?: string; search?: string }) => {
    const newParams = new URLSearchParams(params);
    if (next.category !== undefined) {
      if (next.category === "All") newParams.delete("category");
      else newParams.set("category", next.category);
    }
    if (next.search !== undefined) {
      const trimmedSearch = next.search.trim();
      if (trimmedSearch) {
        newParams.set("search", trimmedSearch);
        setSearchHistory(saveSearchHistory(trimmedSearch));
      } else {
        newParams.delete("search");
      }
    }
    setParams(newParams);
  };

  const requireBuyerLogin = () => {
    if (isBuyerLoggedIn()) return true;
    navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
    return false;
  };

  const addToCart = (product: ApiProduct) => {
    trackProductClick(product.id);
    if (!requireBuyerLogin()) return;
    const productStock = stockByProduct.get(product.id);
    if (!productStock) {
      alert("Out of Stock.");
      return;
    }
    const category = productCategoryName(product);
    const promotion = promotionForProduct(product, promotions);
    addBuyerCartItem({
      id: product.id,
      name: product.name,
      price: discountedPrice(product.price, promotion),
      image: imageUrl(product.image),
      category,
      description: product.description,
      stock: productStock.quantity,
    });
    setCartQty(getBuyerCartCount());
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const buyNow = (product: ApiProduct) => {
    trackProductClick(product.id);
    if (!requireBuyerLogin()) return;
    const productStock = stockByProduct.get(product.id);
    if (!productStock) {
      alert("Out of Stock.");
      return;
    }
    const category = productCategoryName(product);
    const promotion = promotionForProduct(product, promotions);
    navigate("/checkout", {
      state: {
        items: [{
          id: product.id,
          name: product.name,
          quantity: 1,
          price: discountedPrice(product.price, promotion),
          image: imageUrl(product.image),
          category,
          description: product.description,
          stock: productStock.quantity,
        }],
        buyNow: true,
      }
    });
  };

  return (
    <div className="min-h-screen w-full" style={{ background: TOKEN.pageBg }}>
      <BuyerNavbar
        cartQty={cartQty}
        categories={categoryNames}
        activeCat={selectedCategory}
        searchQuery={searchQuery}
        onCatChange={(category) => updateSearchParams({ category })}
        onSearchChange={(query) => updateSearchParams({ search: query })}
      />

      <main>
        {/* FULL WIDTH HERO - Optimized height with rounded borders */}
        <section
          className="relative w-full flex items-center overflow-hidden rounded-3xl mx-4 sm:mx-6 mt-6 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: `linear-gradient(135deg, ${TOKEN.heroFrom} 0%, ${TOKEN.heroMid} 50%, ${TOKEN.heroTo} 100%)`,
            minHeight: "300px",
          }}
          onClick={() => navigate("/allproducts")}
        >
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-8 lg:py-10">
            {/* Left Content */}
            <div className="space-y-4">
              <span className="inline-block bg-white/20 text-white text-xs font-bold tracking-widest px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/30 transition-colors" onClick={(e) => { e.stopPropagation(); updateSearchParams({ category: "All", search: "" }); }}>
                BUYER STORE
              </span>

              <h1 className="text-white text-4xl lg:text-5xl font-black leading-tight cursor-pointer hover:text-yellow-100 transition-colors" onClick={(e) => { e.stopPropagation(); navigate("/allproducts"); }}>
                Sajilo Mart
              </h1>
              <p className="text-yellow-300 text-2xl lg:text-3xl font-bold cursor-pointer hover:text-yellow-100 transition-colors" onClick={(e) => { e.stopPropagation(); navigate("/allproducts"); }}>
                Shop Anytime, Anywhere
              </p>

              <p className="text-white/90 text-base lg:text-lg max-w-lg line-clamp-2">
                Discover thousands of products — shop now!
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); updateSearchParams({ category: "All", search: "" }); }}
                  className="bg-yellow-300 hover:bg-yellow-400 active:scale-95 text-slate-950 font-bold px-6 py-3 rounded-xl text-base transition-all shadow-lg"
                >
                  View All →
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate("/allproducts"); }}
                  className="border-2 border-yellow-300 hover:bg-yellow-300/20 active:scale-95 text-white font-bold px-6 py-3 rounded-xl text-base transition-all"
                >
                  Browse
                </button>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <img
                src={bbGirl}
                alt="Shopping"
                className="h-[320px] xl:h-[380px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ── FEATURE STRIP ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-5 relative z-10 mb-10">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {FEATURES.map((f, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => navigate(f.title === "AI Smart Comparison" ? "/aismartcomparison" : "/allproducts")}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${f.bg}`}>
                  {f.emoji}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{f.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {loading
                  ? "Loading catalog..."
                  : `${filteredProducts.length} products found`}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => updateSearchParams({ search: "" })}
                className="text-sm font-bold text-violet-700 hover:text-violet-800"
              >
                Clear search
              </button>
            )}
          </div>

          {searchHistory.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchHistory.map((term) => (
                <button
                  key={term}
                  onClick={() => updateSearchParams({ search: term })}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:border-teal-300 hover:text-teal-700 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {recommendationProducts.length > 0 && (
            <section className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-700">Smart Recommendations</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-900">
                    Products chosen from your search history and clicks
                  </h3>
                </div>
                <p className="text-sm text-slate-500 max-w-xl">
                  We analyze your recent searches and most clicked products to surface items you may love.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendationProducts.map((product) => {
                  const promotion = promotionForProduct(product, promotions);
                  const finalPrice = discountedPrice(product.price, promotion);
                  return (
                    <button
                      key={product.id}
                      onClick={() => {
                        trackProductClick(product.id);
                        navigate(`/product/${product.id}`, { state: product });
                      }}
                      className="group rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="h-28 w-full overflow-hidden rounded-3xl bg-slate-100 mb-4 flex items-center justify-center">
                        {product.image ? (
                          <img src={imageUrl(product.image)} alt={product.name} className="h-full w-full object-contain" />
                        ) : (
                          <div className="text-slate-400">No image</div>
                        )}
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">{productCategoryName(product)}</p>
                      <h4 className="mt-2 text-sm font-black text-slate-900 line-clamp-2">{product.name}</h4>
                      <p className="mt-3 text-sm text-slate-500 line-clamp-2">{product.description || "Recommended for you"}</p>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-base font-black text-rose-600">{currency(finalPrice)}</span>
                        {promotion && (
                          <span className="text-xs font-bold uppercase text-slate-400 line-through">
                            {currency(product.price)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <h3 className="text-xl font-black">
                No matching products
              </h3>
              <p className="text-slate-500 mt-2">
                Try another category or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => {
                const promotion = promotionForProduct(product, promotions);
                const finalPrice = discountedPrice(product.price, promotion);
                const productStock = stockByProduct.get(product.id);
                const isAvailable = Boolean(productStock);
                return (
                <article key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full">
                  {/* Image Container - Fixed height with proper fit */}
                  <button 
                    onClick={() => {
                      trackProductClick(product.id);
                      navigate(`/product/${product.id}`, { state: product });
                    }} 
                    className="block w-full h-48 bg-slate-100 overflow-hidden flex-shrink-0"
                  >
                    {product.image ? (
                      <img 
                        src={imageUrl(product.image)} 
                        alt={product.name} 
                        className="w-full h-full object-contain hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">No Image</div>
                    )}
                  </button>

                  {/* Card Content - Flex grow to push buttons to bottom */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-bold text-violet-600 uppercase">{productCategoryName(product)}</p>
                    <h3 className="mt-2 font-bold text-lg line-clamp-2">{product.name}</h3>
                    {keySpecifications(product.description).length > 0 ? (
                      <ul className="mt-3 space-y-1 text-sm text-slate-500">
                        {keySpecifications(product.description).slice(0, 3).map((spec) => (
                          <li key={spec} className="flex gap-2 leading-5">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                            <span className="line-clamp-1">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 line-clamp-2 mt-2">High quality product</p>
                    )}
                    {promotion && (
                      <span className="inline-flex mt-3 rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">
                        {promotion.name}
                      </span>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-xl text-rose-600">
                        {currency(finalPrice)}
                        {promotion && (
                          <span className="block text-xs font-bold text-slate-400 line-through">
                            {currency(product.price)}
                          </span>
                        )}
                      </span>
                      <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                        {isAvailable ? `${productStock?.quantity || 0} available` : "Out of Stock"}
                      </span>
                    </div>

                    {/* Spacer to push buttons to bottom */}
                    <div className="flex-1" />

                    {/* Button Container - Even height and alignment */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => buyNow(product)}
                        className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3 rounded-lg transition-all"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className={`font-bold py-3 rounded-lg transition-all active:scale-95 ${addedId === product.id ? "bg-green-600" : "bg-violet-600 hover:bg-violet-700"} text-white`}
                      >
                        {addedId === product.id ? "Added ✓" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </article>
              )})}
            </div>
          )}
        </section>
      </main>

      <BuyerFooter />
    </div>
  );
}
