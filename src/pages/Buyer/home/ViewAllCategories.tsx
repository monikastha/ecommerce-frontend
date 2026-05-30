import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import { getBuyerCartCount } from "../../../utils/buyerCart";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type ApiCategory = {
  id: number;
  name: string;
  description?: string;
  image?: string;
};

const imageUrl = (path?: string) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
};

export default function ViewAllCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartQty, setCartQty] = useState(getBuyerCartCount());

  useEffect(() => {
    const refreshCart = () => setCartQty(getBuyerCartCount());
    window.addEventListener("buyer-cart-change", refreshCart);
    return () => window.removeEventListener("buyer-cart-change", refreshCart);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ORIGIN}/api/productcategory/categories/`);
        if (!res.ok) throw new Error("Unable to load categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Could not load categories right now.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const categoryNames = useMemo(
    () => Array.from(new Set(categories.map((category) => category.name).filter(Boolean))),
    [categories]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={cartQty} categories={categoryNames} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Categories</h1>
            <p className="text-sm text-slate-500">
              Browse categories added by admin and assistant.
            </p>
          </div>
          <button
            onClick={() => navigate("/allproducts")}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-bold text-slate-700 hover:border-teal-400"
          >
            All Products
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-28 bg-white border border-slate-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
            <h2 className="text-lg font-black text-slate-900">No categories available</h2>
            <p className="text-sm text-slate-500 mt-1">
              Categories will appear here after admin or assistant adds them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/allproducts?category=${encodeURIComponent(category.name)}`)}
                className="bg-white border border-slate-200 rounded-lg p-4 text-left flex items-center gap-4 hover:border-teal-400 hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-teal-50 shrink-0">
                  {category.image ? (
                    <img
                      src={imageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-teal-700">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-black text-slate-900">{category.name}</h2>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                    {category.description || "Browse products in this category."}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <BuyerFooter />
    </div>
  );
}
