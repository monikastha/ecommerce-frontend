// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import { getBuyerCartCount } from "../../../utils/buyerCart";
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

const isPromotionActive = (promotion: ApiPromotion) => {
  const now = Date.now();
  return (
    promotion.status === "active" &&
    new Date(promotion.start_date).getTime() <= now &&
    new Date(promotion.end_date).getTime() >= now
  );
};

const promotionForProduct = (product: ApiProduct, promotions: ApiPromotion[]) => {
  const categoryId = typeof product.category === "number"
    ? product.category
    : product.category && typeof product.category === "object"
      ? product.category.id
      : null;

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

const comparisonBoolean = (value: boolean) => (
  <span className={`text-xl font-black ${value ? "text-emerald-600" : "text-rose-600"}`}>
    {value ? "✓" : "✕"}
  </span>
);

export default function SmartComparison() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [stocks, setStocks] = useState<ApiStock[]>([]);
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartQty, setCartQty] = useState(getBuyerCartCount());

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

        if (!productRes.ok || !categoryRes.ok || !stockRes.ok || !promotionRes.ok) {
          throw new Error("Unable to load comparison data");
        }

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
        setError("Unable to load comparison page. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, []);

  const product1Id = Number(params.get("product1") || 0);
  const product2Id = Number(params.get("product2") || 0);

  const product1 = products.find((product) => product.id === product1Id);
  const product2 = products.find((product) => product.id === product2Id);

  const stockByProduct = useMemo(() => {
    const map = new Map<number, ApiStock>();
    stocks
      .filter((stock) => stock.quantity >= 0 && stock.available_to_buyers)
      .forEach((stock) => map.set(stock.product, stock));
    return map;
  }, [stocks]);

  const categoryNames = useMemo(
    () => Array.from(new Set(categories.map((c) => c.name).filter(Boolean))),
    [categories]
  );

  const promotion1 = product1 ? promotionForProduct(product1, promotions) : undefined;
  const promotion2 = product2 ? promotionForProduct(product2, promotions) : undefined;

  const finalPrice1 = product1 ? discountedPrice(product1.price, promotion1) : 0;
  const finalPrice2 = product2 ? discountedPrice(product2.price, promotion2) : 0;

  const comparisonResult = useMemo(() => {
    if (!product1 || !product2) return null;

    const stock1 = stockByProduct.get(product1.id)?.quantity || 0;
    const stock2 = stockByProduct.get(product2.id)?.quantity || 0;

    let score1 = 0;
    let score2 = 0;

    if (finalPrice1 < finalPrice2) score1 += 3;
    if (finalPrice2 < finalPrice1) score2 += 3;
    if (promotion1 && !promotion2) score1 += 2;
    if (promotion2 && !promotion1) score2 += 2;
    if (stock1 > stock2) score1 += 1;
    if (stock2 > stock1) score2 += 1;
    if ((product1.description || "").length > (product2.description || "").length) score1 += 0.5;
    if ((product2.description || "").length > (product1.description || "").length) score2 += 0.5;

    const winner = score1 === score2 ? null : score1 > score2 ? product1 : product2;
    const loser = winner === product1 ? product2 : product1;
    const isTie = winner === null;

    const reasons: string[] = [];
    if (!isTie) {
      const winnerPrice = winner === product1 ? finalPrice1 : finalPrice2;
      const loserPrice = winner === product1 ? finalPrice2 : finalPrice1;
      const winnerStock = winner === product1 ? stock1 : stock2;
      const loserStock = winner === product1 ? stock2 : stock1;
      const winnerPromotion = winner === product1 ? promotion1 : promotion2;
      const loserPromotion = winner === product1 ? promotion2 : promotion1;

      if (winnerPrice < loserPrice) reasons.push("a lower final price");
      if (winnerPromotion && !loserPromotion) reasons.push("a better promotion");
      if (winnerStock > loserStock) reasons.push("more available stock");
      if (!reasons.length) reasons.push("better overall value");
    }

    const summary = isTie
      ? "The two products are closely matched. Choose the one that fits your preferences best, or browse for more options."
      : `Our AI smart comparison suggests ${winner?.name} because it offers ${reasons.join(" and ")}. It is currently the better choice between the two.`;

    return { winner, loser, isTie, summary };
  }, [product1, product2, finalPrice1, finalPrice2, stockByProduct, promotion1, promotion2]);

  const requireBuyerLogin = () => {
    if (isBuyerLoggedIn()) return true;
    navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
    return false;
  };

  const proceedToCheckout = (chosenProduct: ApiProduct) => {
    const stockRecord = stockByProduct.get(chosenProduct.id);
    if (!stockRecord || stockRecord.quantity <= 0) {
      alert("This product is currently unavailable for checkout.");
      return;
    }

    if (!requireBuyerLogin()) return;

    navigate("/checkout", {
      state: {
        items: [
          {
            id: chosenProduct.id,
            name: chosenProduct.name,
            quantity: 1,
            price: discountedPrice(chosenProduct.price, promotionForProduct(chosenProduct, promotions)),
            image: imageUrl(chosenProduct.image),
            category: productCategoryName(chosenProduct),
            description: chosenProduct.description,
            stock: stockRecord.quantity,
          },
        ],
        buyNow: true,
      },
    });
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#f6f7fb" }}>
      <BuyerNavbar
        cartQty={cartQty}
        categories={categoryNames}
        activeCat="All"
        searchQuery=""
        onCatChange={() => undefined}
        onSearchChange={() => undefined}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">AI Smart Comparison</p>
          <h1 className="mt-4 text-4xl font-black text-slate-900">Compare two products side by side</h1>
          <p className="mt-3 text-slate-600 max-w-3xl leading-7">
            Select exactly two products from the same category to compare their images, prices, availability, promotions,
            and smart recommendations. Then choose the best product and proceed directly to checkout.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">
            Loading comparison data...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
        ) : (!product1 && !product2) ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-slate-900">Choose two products to compare</h2>
            <p className="mt-3 text-slate-500">
              Please select two products from the same category on the product list page, then use the compare link.
            </p>
            <button
              onClick={() => navigate("/allproducts")}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-white font-bold hover:bg-violet-700"
            >
              Browse Products
            </button>
          </div>
        ) : product1 && !product2 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-black text-slate-900">Select a second product to compare</h2>
            <p className="mt-2 text-slate-500">Showing products from {productCategoryName(product1)}</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {products
                .filter((p) => p.id !== product1.id && normalizeText(productCategoryName(p)) === normalizeText(productCategoryName(product1)) && p.is_published && p.status === "approved")
                .map((p) => {
                  const promo = promotionForProduct(p, promotions);
                  const final = discountedPrice(p.price, promo);
                  return (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/compare?product1=${product1.id}&product2=${p.id}`)}
                      className="group rounded-2xl border bg-white p-4 text-left hover:shadow-md"
                    >
                      <div className="h-28 w-full overflow-hidden rounded-3xl bg-slate-100 mb-4 flex items-center justify-center">
                        {p.image ? (
                          <img src={imageUrl(p.image)} alt={p.name} className="h-full w-full object-contain" />
                        ) : (
                          <div className="text-slate-400">No image</div>
                        )}
                      </div>
                      <p className="text-xs font-black uppercase text-teal-700">{productCategoryName(p)}</p>
                      <h4 className="mt-2 text-sm font-black text-slate-900 line-clamp-2">{p.name}</h4>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-base font-black text-rose-600">{currency(final)}</span>
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="mt-6">
              <button onClick={() => navigate("/allproducts")} className="rounded-full bg-violet-600 px-6 py-3 text-white font-bold hover:bg-violet-700">
                Browse all products
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <table className="min-w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr>
                    <th className="pb-4 text-sm font-black text-slate-900">Feature</th>
                    <th className="pb-4 text-sm font-black text-slate-900">{product1.name}</th>
                    <th className="pb-4 text-sm font-black text-slate-900">{product2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Image</td>
                    <td className="py-5">
                      <img src={imageUrl(product1.image)} alt={product1.name} className="h-40 w-full max-w-[220px] object-contain rounded-3xl bg-slate-100" />
                    </td>
                    <td className="py-5">
                      <img src={imageUrl(product2.image)} alt={product2.name} className="h-40 w-full max-w-[220px] object-contain rounded-3xl bg-slate-100" />
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Price</td>
                    <td className="py-5 text-slate-900 font-black">{currency(finalPrice1)}</td>
                    <td className="py-5 text-slate-900 font-black">{currency(finalPrice2)}</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Category</td>
                    <td className="py-5 text-slate-700">{productCategoryName(product1)}</td>
                    <td className="py-5 text-slate-700">{productCategoryName(product2)}</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Available Stock</td>
                    <td className="py-5 text-slate-700">{stockByProduct.get(product1.id)?.quantity ?? 0}</td>
                    <td className="py-5 text-slate-700">{stockByProduct.get(product2.id)?.quantity ?? 0}</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Promotion</td>
                    <td className="py-5 text-slate-700">{promotion1 ? promotion1.name : "None"}</td>
                    <td className="py-5 text-slate-700">{promotion2 ? promotion2.name : "None"}</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Better Price</td>
                    <td className="py-5">{comparisonBoolean(finalPrice1 <= finalPrice2)}</td>
                    <td className="py-5">{comparisonBoolean(finalPrice2 <= finalPrice1)}</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Best Stock</td>
                    <td className="py-5">{comparisonBoolean((stockByProduct.get(product1.id)?.quantity || 0) >= (stockByProduct.get(product2.id)?.quantity || 0))}</td>
                    <td className="py-5">{comparisonBoolean((stockByProduct.get(product2.id)?.quantity || 0) >= (stockByProduct.get(product1.id)?.quantity || 0))}</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Has Promotion</td>
                    <td className="py-5">{comparisonBoolean(!!promotion1)}</td>
                    <td className="py-5">{comparisonBoolean(!!promotion2)}</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="py-5 font-semibold text-slate-700">Description</td>
                    <td className="py-5 text-slate-700 max-w-xs text-sm leading-6">{product1.description || "No details available."}</td>
                    <td className="py-5 text-slate-700 max-w-xs text-sm leading-6">{product2.description || "No details available."}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-teal-700">Result</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-900">AI smart recommendation</h2>
                  <p className="mt-4 text-slate-600 leading-7">{comparisonResult?.summary}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700">Recommended product</p>
                  <p className="mt-2 text-xl font-black text-slate-900">{comparisonResult?.isTie ? "No clear winner" : comparisonResult?.winner?.name}</p>
                  <p className="mt-2 text-sm text-slate-500">Select the recommended item to checkout faster.</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={!comparisonResult?.winner}
                  onClick={() => comparisonResult?.winner && proceedToCheckout(comparisonResult.winner)}
                  className="rounded-3xl bg-emerald-600 px-6 py-4 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-600 transition"
                >
                  Proceed to Checkout with {comparisonResult?.winner?.name || "Product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/allproducts")}
                  className="rounded-3xl border border-slate-300 bg-white px-6 py-4 text-slate-900 font-bold hover:border-slate-400"
                >
                  Compare different products
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BuyerFooter />
    </div>
  );
}
