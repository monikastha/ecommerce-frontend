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

type ApiLocation = {
  id: number;
  name: string;
  city: string;
  province: string;
  status: string;
};

type ApiStock = {
  id: number;
  product: number;
  location: number;
  location_name: string;
  quantity: number;
  availability_status: "in_stock" | "low_stock" | "out_of_stock";
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
  const [locations, setLocations] = useState<ApiLocation[]>([]);
  const [stocks, setStocks] = useState<ApiStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartQty, setCartQty] = useState(getBuyerCartCount());
  const [addedId, setAddedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("buyer_delivery_location") || ""
  );

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
        const [productRes, categoryRes, locationRes, stockRes] = await Promise.all([
          fetch(`${API_ORIGIN}/api/products/?status=approved&is_published=true`),
          fetch(`${API_ORIGIN}/api/productcategory/categories/`),
          fetch(`${API_ORIGIN}/api/locations/`),
          fetch(`${API_ORIGIN}/api/warehouse/stock/?available=true`),
        ]);

        if (!productRes.ok || !categoryRes.ok || !locationRes.ok || !stockRes.ok) throw new Error("Unable to load store");

        const [productData, categoryData, locationData, stockData] = await Promise.all([
          productRes.json(),
          categoryRes.json(),
          locationRes.json(),
          stockRes.json(),
        ]);

        setProducts(Array.isArray(productData) ? productData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setLocations(Array.isArray(locationData) ? locationData : []);
        setStocks(Array.isArray(stockData) ? stockData : []);
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

  const activeLocations = useMemo(
    () =>
      locations.filter((loc) => {
        const status = String(loc.status || "").trim().toLowerCase();
        return !status || status === "active";
      }),
    [locations]
  );

  const stockByProduct = useMemo(() => {
    const map = new Map<number, ApiStock>();
    if (!selectedLocation) return map;

    stocks
      .filter((stock) => String(stock.location) === selectedLocation && stock.quantity > 0)
      .forEach((stock) => map.set(stock.product, stock));

    return map;
  }, [selectedLocation, stocks]);

  const selectedLocationName = useMemo(() => {
    const location = locations.find((loc) => String(loc.id) === selectedLocation);
    return location ? `${location.name} - ${location.city}` : "";
  }, [locations, selectedLocation]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      if (selectedLocation && !stockByProduct.has(product.id)) return false;

      const categoryName = productCategoryName(product);
      const categoryMatch = selectedCategory === "All" || normalizeText(categoryName) === normalizeText(selectedCategory);
      const searchMatch = !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query) ||
        (product.code || "").toLowerCase().includes(query);

      return categoryMatch && searchMatch && product.is_published && product.status === "approved";
    });
  }, [products, searchQuery, selectedCategory, selectedLocation, stockByProduct]);

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

  const requireDeliveryLocation = () => {
    if (selectedLocation) return true;
    alert("Please select your delivery location first.");
    return false;
  };

  const addToCart = (product: ApiProduct) => {
    if (!requireBuyerLogin()) return;
    if (!requireDeliveryLocation()) return;
    const locationStock = stockByProduct.get(product.id);
    if (!locationStock) {
      alert("Out of Stock in Your Area.");
      return;
    }
    const category = productCategoryName(product);
    addBuyerCartItem({
      id: product.id,
      name: product.name,
      price: priceNumber(product.price),
      image: imageUrl(product.image),
      category,
      description: product.description,
      stock: locationStock.quantity,
      locationId: Number(selectedLocation),
      locationName: selectedLocationName,
    });
    setCartQty(getBuyerCartCount());
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const buyNow = (product: ApiProduct) => {
    if (!requireBuyerLogin()) return;
    if (!requireDeliveryLocation()) return;
    const locationStock = stockByProduct.get(product.id);
    if (!locationStock) {
      alert("Out of Stock in Your Area.");
      return;
    }
    const category = productCategoryName(product);
    navigate("/checkout", {
      state: {
        items: [{
          id: product.id,
          name: product.name,
          quantity: 1,
          price: priceNumber(product.price),
          image: imageUrl(product.image),
          category,
          description: product.description,
          stock: locationStock.quantity,
          locationId: Number(selectedLocation),
          locationName: selectedLocationName,
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
                  : selectedLocation
                    ? `${filteredProducts.length} products available in ${selectedLocationName}`
                    : `${filteredProducts.length} products found`}
              </p>
            </div>
            <select
              value={selectedLocation}
              onChange={(event) => {
                setSelectedLocation(event.target.value);
                if (event.target.value) localStorage.setItem("buyer_delivery_location", event.target.value);
                else localStorage.removeItem("buyer_delivery_location");
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-violet-500"
            >
              <option value="">Select delivery location</option>
              {activeLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} - {loc.city}
                </option>
              ))}
            </select>
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
                {selectedLocation ? "Out of Stock in Your Area" : "No matching products"}
              </h3>
              <p className="text-slate-500 mt-2">
                {selectedLocation
                  ? "Try another delivery location or check again later."
                  : "Try another category or search term."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
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
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-xl text-rose-600">{currency(product.price)}</span>
                      <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                        {selectedLocation ? `${stockByProduct.get(product.id)?.quantity || 0} in your area` : "Select area for stock"}
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
              ))}
            </div>
          )}
        </section>
      </main>

      <BuyerFooter />
    </div>
  );
}
