/* eslint-disable react-hooks/set-state-in-effect */
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

const normalizeText = (value?: string | null) => (value || "").trim().toLowerCase();
const priceNumber = (value: string | number) => Number(String(value).replace(/[^0-9.]/g, "")) || 0;
const currency = (value: string | number) => `Rs. ${priceNumber(value).toLocaleString()}`;

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
  const finalPrice = (promotion: ApiPromotion) => {
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
    .sort((a, b) => finalPrice(a) - finalPrice(b))[0];
};

const discountedPrice = (price: string | number, promotion?: ApiPromotion) => {
  const basePrice = priceNumber(price);
  if (!promotion) return basePrice;
  const value = priceNumber(promotion.d_value || 0);
  if (promotion.d_type === "percentage") return Math.max(0, basePrice - (basePrice * value) / 100);
  return Math.max(0, basePrice - value);
};

const comparisonValue = (isBetter: boolean) => (
  <span className={`font-black ${isBetter ? "text-emerald-600" : "text-slate-400"}`}>
    {isBetter ? "Better" : "No"}
  </span>
);

export default function AiSmartComparison() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [stocks, setStocks] = useState<ApiStock[]>([]);
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartQty, setCartQty] = useState(getBuyerCartCount());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Could not load products for AI comparison. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, []);

  const stockByProduct = useMemo(() => {
    const map = new Map<number, ApiStock>();
    stocks
      .filter((stock) => stock.quantity > 0 && stock.available_to_buyers)
      .forEach((stock) => map.set(stock.product, stock));
    return map;
  }, [stocks]);

  const categoryNames = useMemo(
    () => Array.from(new Set(categories.map((category) => category.name).filter(Boolean))),
    [categories]
  );

  const availableProducts = useMemo(
    () => products.filter((product) => (
      product.is_published &&
      product.status === "approved" &&
      stockByProduct.has(product.id)
    )),
    [products, stockByProduct]
  );

  useEffect(() => {
    if (!availableProducts.length) return;

    const routeIds = [Number(params.get("product1") || 0), Number(params.get("product2") || 0)]
      .filter((id) => availableProducts.some((product) => product.id === id))
      .slice(0, 2);

    if (routeIds.length) {
      setSelectedIds(routeIds);
      const routedProduct = availableProducts.find((product) => product.id === routeIds[0]);
      if (routedProduct) setActiveCategory(productCategoryName(routedProduct));
      return;
    }

    if (!activeCategory) setActiveCategory(productCategoryName(availableProducts[0]));
  }, [availableProducts, params, activeCategory]);

  const selectedProducts = useMemo(
    () => selectedIds
      .map((id) => availableProducts.find((product) => product.id === id))
      .filter((product): product is ApiProduct => !!product),
    [availableProducts, selectedIds]
  );

  const visibleProducts = useMemo(() => {
    const query = normalizeText(searchQuery);
    return availableProducts.filter((product) => {
      const categoryMatch = normalizeText(productCategoryName(product)) === normalizeText(activeCategory);
      const searchMatch =
        !query ||
        normalizeText(product.name).includes(query) ||
        normalizeText(product.description).includes(query) ||
        normalizeText(product.code).includes(query);
      return categoryMatch && searchMatch;
    });
  }, [availableProducts, activeCategory, searchQuery]);

  const updateCategory = (category: string) => {
    setActiveCategory(category);
    setSelectedIds((prev) =>
      prev.filter((id) => {
        const product = availableProducts.find((item) => item.id === id);
        return product && normalizeText(productCategoryName(product)) === normalizeText(category);
      })
    );
  };

  const toggleProduct = (product: ApiProduct) => {
    if (selectedIds.includes(product.id)) {
      setSelectedIds((prev) => prev.filter((id) => id !== product.id));
      return;
    }

    if (selectedIds.length === 2) {
      alert("You can compare only two products at a time.");
      return;
    }

    if (selectedProducts.length) {
      const selectedCategory = productCategoryName(selectedProducts[0]);
      if (normalizeText(selectedCategory) !== normalizeText(productCategoryName(product))) {
        alert("Please compare products from the same category only.");
        return;
      }
    }

    setSelectedIds((prev) => [...prev, product.id]);
  };

  const comparisonResult = useMemo(() => {
    if (selectedProducts.length !== 2) return null;

    const [first, second] = selectedProducts;
    const firstPromotion = promotionForProduct(first, promotions);
    const secondPromotion = promotionForProduct(second, promotions);
    const firstPrice = discountedPrice(first.price, firstPromotion);
    const secondPrice = discountedPrice(second.price, secondPromotion);
    const firstStock = stockByProduct.get(first.id)?.quantity || 0;
    const secondStock = stockByProduct.get(second.id)?.quantity || 0;

    let firstScore = 0;
    let secondScore = 0;

    if (firstPrice < secondPrice) firstScore += 4;
    if (secondPrice < firstPrice) secondScore += 4;
    if (firstPromotion && !secondPromotion) firstScore += 2;
    if (secondPromotion && !firstPromotion) secondScore += 2;
    if (firstStock > secondStock) firstScore += 1;
    if (secondStock > firstStock) secondScore += 1;
    if ((first.description || "").length > (second.description || "").length) firstScore += 1;
    if ((second.description || "").length > (first.description || "").length) secondScore += 1;

    const winner = firstScore === secondScore ? null : firstScore > secondScore ? first : second;
    const loser = winner === first ? second : first;
    const reasons: string[] = [];

    if (winner && loser) {
      const winnerPromotion = winner === first ? firstPromotion : secondPromotion;
      const loserPromotion = winner === first ? secondPromotion : firstPromotion;
      const winnerPrice = winner === first ? firstPrice : secondPrice;
      const loserPrice = winner === first ? secondPrice : firstPrice;
      const winnerStock = winner === first ? firstStock : secondStock;
      const loserStock = winner === first ? secondStock : firstStock;

      if (winnerPrice < loserPrice) reasons.push("lower final price");
      if (winnerPromotion && !loserPromotion) reasons.push("better active promotion");
      if (winnerStock > loserStock) reasons.push("higher available stock");
      if (!reasons.length) reasons.push("stronger overall value");
    }

    return {
      first,
      second,
      firstPromotion,
      secondPromotion,
      firstPrice,
      secondPrice,
      firstStock,
      secondStock,
      winner,
      summary: winner
        ? `AI suggests ${winner.name} because it has ${reasons.join(", ")}.`
        : "AI found both products very close. Choose the one that best matches your personal preference.",
    };
  }, [selectedProducts, promotions, stockByProduct]);

  const requireBuyerLogin = () => {
    if (isBuyerLoggedIn()) return true;
    navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
    return false;
  };

  const proceedToCheckout = (product: ApiProduct) => {
    const stock = stockByProduct.get(product.id);
    if (!stock || stock.quantity <= 0) {
      alert("This product is not available right now.");
      return;
    }

    if (!requireBuyerLogin()) return;

    navigate("/checkout", {
      state: {
        items: [{
          id: product.id,
          name: product.name,
          quantity: 1,
          price: discountedPrice(product.price, promotionForProduct(product, promotions)),
          image: imageUrl(product.image),
          category: productCategoryName(product),
          description: product.description,
          stock: stock.quantity,
        }],
        buyNow: true,
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <BuyerNavbar
        cartQty={cartQty}
        categories={categoryNames}
        activeCat={activeCategory}
        searchQuery={searchQuery}
        onCatChange={updateCategory}
        onSearchChange={setSearchQuery}
        showAllCategory={false}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-700">
            AI Smart Comparison
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Compare two products before purchase
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Pick one category, add exactly two products, then review their specifications and AI purchase suggestion.
          </p>
        </section>

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center font-semibold text-slate-600">
            Loading AI comparison products...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 font-semibold text-red-700">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-lg border border-slate-200 bg-white p-4 h-fit">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Categories
              </h2>
              <div className="mt-4 space-y-2">
                {categoryNames.map((category) => (
                  <button
                    key={category}
                    onClick={() => updateCategory(category)}
                    className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
                      normalizeText(activeCategory) === normalizeText(category)
                        ? "bg-slate-900 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </aside>

            <div className="space-y-6">
              <section className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {activeCategory || "Choose a category"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Selected {selectedProducts.length} of 2 products for comparison.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    disabled={!selectedIds.length}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
                  >
                    Clear selection
                  </button>
                </div>

                {/*
                  Fix: cards are now `flex flex-col` and the price/stock/button
                  block is wrapped in `mt-auto`, so that block always sits at the
                  bottom of the card no matter how long the description/title is.
                  This keeps "Add to compare" buttons aligned across the row.
                */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleProducts.length ? visibleProducts.map((product) => {
                    const promotion = promotionForProduct(product, promotions);
                    const finalPrice = discountedPrice(product.price, promotion);
                    const selected = selectedIds.includes(product.id);

                    return (
                      <article
                        key={product.id}
                        className={`flex flex-col rounded-lg border bg-white p-4 transition ${
                          selected ? "border-teal-500 shadow-md" : "border-slate-200 hover:shadow-md"
                        }`}
                      >
                        <div className="h-36 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img src={imageUrl(product.image)} alt={product.name} className="h-full w-full object-contain" />
                          ) : (
                            <span className="text-sm font-bold text-slate-400">No image</span>
                          )}
                        </div>
                        <p className="mt-4 text-xs font-black uppercase text-teal-700">
                          {productCategoryName(product)}
                        </p>
                        <h3 className="mt-2 min-h-12 text-base font-black text-slate-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                          {product.description || "No specification details available."}
                        </p>

                        <div className="mt-auto">
                          <div className="mt-4 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-lg font-black text-rose-600">{currency(finalPrice)}</p>
                              {promotion && (
                                <p className="text-xs font-bold text-slate-400 line-through">
                                  {currency(product.price)}
                                </p>
                              )}
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                              {stockByProduct.get(product.id)?.quantity || 0} stock
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleProduct(product)}
                            disabled={selectedIds.length === 2 && !selected}
                            className={`mt-4 w-full rounded-lg py-3 text-sm font-black transition ${
                              selected
                                ? "bg-slate-900 text-white"
                                : "bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-300"
                            }`}
                          >
                            {selected ? "Remove from compare" : "Add to compare"}
                          </button>
                        </div>
                      </article>
                    );
                  }) : (
                    <div className="sm:col-span-2 lg:col-span-3 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                      <h3 className="font-black text-slate-900">No products in this category</h3>
                      <p className="mt-2 text-sm text-slate-500">Choose another category from the list.</p>
                    </div>
                  )}
                </div>
              </section>

              {comparisonResult && (
                <>
                  <section className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-5">
                    <h2 className="mb-5 text-xl font-black text-slate-900">Specification comparison</h2>
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="py-3 pr-4 text-sm font-black text-slate-700">Specification</th>
                          <th className="py-3 pr-4 text-sm font-black text-slate-900">{comparisonResult.first.name}</th>
                          <th className="py-3 text-sm font-black text-slate-900">{comparisonResult.second.name}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        <tr>
                          <td className="py-4 pr-4 font-bold text-slate-600">Image</td>
                          <td className="py-4 pr-4">
                            <img src={imageUrl(comparisonResult.first.image)} alt={comparisonResult.first.name} className="h-32 w-40 rounded-lg bg-slate-100 object-contain" />
                          </td>
                          <td className="py-4">
                            <img src={imageUrl(comparisonResult.second.image)} alt={comparisonResult.second.name} className="h-32 w-40 rounded-lg bg-slate-100 object-contain" />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-bold text-slate-600">Final price</td>
                          <td className="py-4 pr-4 font-black text-rose-600">{currency(comparisonResult.firstPrice)}</td>
                          <td className="py-4 font-black text-rose-600">{currency(comparisonResult.secondPrice)}</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-bold text-slate-600">Product code</td>
                          <td className="py-4 pr-4 text-slate-700">{comparisonResult.first.code || "Not available"}</td>
                          <td className="py-4 text-slate-700">{comparisonResult.second.code || "Not available"}</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-bold text-slate-600">Available stock</td>
                          <td className="py-4 pr-4 text-slate-700">{comparisonResult.firstStock}</td>
                          <td className="py-4 text-slate-700">{comparisonResult.secondStock}</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-bold text-slate-600">Promotion</td>
                          <td className="py-4 pr-4 text-slate-700">{comparisonResult.firstPromotion?.name || "No promotion"}</td>
                          <td className="py-4 text-slate-700">{comparisonResult.secondPromotion?.name || "No promotion"}</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-bold text-slate-600">Better price</td>
                          <td className="py-4 pr-4">{comparisonValue(comparisonResult.firstPrice <= comparisonResult.secondPrice)}</td>
                          <td className="py-4">{comparisonValue(comparisonResult.secondPrice <= comparisonResult.firstPrice)}</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-bold text-slate-600">Better stock</td>
                          <td className="py-4 pr-4">{comparisonValue(comparisonResult.firstStock >= comparisonResult.secondStock)}</td>
                          <td className="py-4">{comparisonValue(comparisonResult.secondStock >= comparisonResult.firstStock)}</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-bold text-slate-600">Description</td>
                          <td className="py-4 pr-4 max-w-xs leading-6 text-slate-700">{comparisonResult.first.description || "No description available."}</td>
                          <td className="py-4 max-w-xs leading-6 text-slate-700">{comparisonResult.second.description || "No description available."}</td>
                        </tr>
                      </tbody>
                    </table>
                  </section>

                  <section className="rounded-lg border border-slate-200 bg-white p-6">
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-700">AI result</p>
                    <h2 className="mt-3 text-2xl font-black text-slate-900">
                      {comparisonResult.winner ? comparisonResult.winner.name : "No clear winner"}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{comparisonResult.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={!comparisonResult.winner}
                        onClick={() => comparisonResult.winner && proceedToCheckout(comparisonResult.winner)}
                        className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:bg-slate-300"
                      >
                        Proceed to purchase suggested product
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-black text-slate-700 hover:border-slate-400"
                      >
                        Compare another pair
                      </button>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <BuyerFooter />
    </div>
  );
}