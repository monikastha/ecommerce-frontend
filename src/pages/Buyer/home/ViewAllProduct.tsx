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

const imageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("/") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
};

const priceNumber = (value: string | number) => Number(String(value).replace(/[^0-9.]/g, "")) || 0;
const currency = (value: string | number) => `Rs. ${priceNumber(value).toLocaleString()}`;

const normalizeText = (value?: string | null) => (value || "").trim().toLowerCase();

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
  const [visibleCount, setVisibleCount] = useState(12);

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

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchQuery]);

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

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      if (!stockByProduct.has(product.id)) return false;

      const categoryName = productCategoryName(product);
      const categoryMatch = selectedCategory === "All" || normalizeText(categoryName) === normalizeText(selectedCategory);
      const searchMatch = !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query) ||
        (product.code || "").toLowerCase().includes(query);

      return categoryMatch && searchMatch && product.is_published && product.status === "approved";
    });
  }, [products, searchQuery, selectedCategory, stockByProduct]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const updateSearchParams = (next: { category?: string; search?: string }) => {
    const newParams = new URLSearchParams(params);
    if (next.category !== undefined) {
      if (next.category === "All") newParams.delete("category");
      else newParams.set("category", next.category);
    }
    if (next.search !== undefined) {
      if (next.search.trim()) newParams.set("search", next.search.trim());
      else newParams.delete("search");
    }
    setParams(newParams);
  };

  const requireBuyerLogin = () => {
    if (isBuyerLoggedIn()) return true;
    navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
    return false;
  };

  const addToCart = (product: ApiProduct) => {
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
        {/* FULL WIDTH HERO - Matching Screenshot */}
        <section
          className="relative w-full min-h-[420px] flex items-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${TOKEN.heroFrom} 0%, ${TOKEN.heroMid} 50%, ${TOKEN.heroTo} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
            {/* Left Content */}
            <div className="space-y-6">
              <span className="inline-block bg-white/20 text-white text-sm font-bold tracking-widest px-5 py-2 rounded-full">
                BUYER STORE
              </span>

              <h1 className="text-white text-5xl lg:text-6xl font-black leading-none">
                Sajilo Mart
              </h1>
              <p className="text-yellow-300 text-3xl font-medium">
                Shop Anytime, Anywhere
              </p>

              <p className="text-white/90 text-lg max-w-lg">
                Discover thousands of products across fashion, electronics, 
                home essentials, and more — all at your fingertips.
              </p>

              <button
                onClick={() => updateSearchParams({ category: "All", search: "" })}
                className="bg-yellow-300 hover:bg-yellow-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg"
              >
                View All Products →
              </button>
            </div>

            {/* Right Image */}
            <div className="hidden lg:flex justify-end">
              <img
                src={bbGirl}
                alt="Shopping"
                className="h-[400px] lg:h-[620px] xl:h-[700px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
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
                return (
                <article key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                  <button onClick={() => navigate(`/product/${product.id}`, { state: product })} className="block w-full h-48 bg-slate-100 overflow-hidden">
                    {product.image ? (
                      <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                    )}
                  </button>

                  <div className="p-5">
                    <p className="text-xs font-bold text-violet-600 uppercase">{productCategoryName(product)}</p>
                    <h3 className="mt-2 font-bold text-lg line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-2">{product.description || "High quality product"}</p>
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
                        {`${stockByProduct.get(product.id)?.quantity || 0} available`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button onClick={() => buyNow(product)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl">Buy Now</button>
                      <button onClick={() => addToCart(product)} className={`font-bold py-3 rounded-xl ${addedId === product.id ? "bg-green-600" : "bg-violet-600 hover:bg-violet-700"} text-white`}>
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
