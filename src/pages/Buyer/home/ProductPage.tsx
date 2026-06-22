/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import ReviewComments from "./ReviewComments";
import {
  addBuyerCartItem,
  getBuyerCartCount,
} from "../../../utils/buyerCart";
import { isBuyerLoggedIn } from "../../../utils/buyerAuth";
import {
  getBuyerWishlistItems,
  toggleBuyerWishlistItem,
} from "../../../utils/buyerWishlist";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type ProductImage = {
  id: number;
  product: number;
  image: string;
  image_type: string;
  view_number: number;
  is_primary: boolean;
};

type ProductColor = {
  id: number;
  product: number;
  color_name: string;
  color_code: string;
  quantity: number;
  price_adjustment: number;
  is_available: boolean;
};

type Product = {
  id: number;
  name: string;
  category?: number | { id?: number; name?: string } | null;
  category_name?: string;
  code?: string;
  description?: string;
  size?: string;
  price: string;
  quantity: number;
  image?: string;
  product_images?: ProductImage[];
  colors?: ProductColor[];
  status: "pending" | "approved" | "rejected";
  is_published: boolean;
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
  quantity: number;
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

const productCategoryName = (product?: Product | null) => {
  if (!product) return "All";
  if (product.category_name?.trim()) return product.category_name.trim();
  if (product.category && typeof product.category === "object" && product.category.name?.trim()) {
    return product.category.name.trim();
  }
  return "Product";
};

const productCategoryId = (product?: Product | null) => {
  if (!product) return null;
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

const promotionForProduct = (product: Product | null, promotions: ApiPromotion[]) => {
  const categoryId = productCategoryId(product);
  const priceAfterPromotion = (promotion: ApiPromotion) => {
    const basePrice = priceNumber(product?.price || 0);
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

const productSizes = (size?: string) =>
  (size || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>((location.state as Product) || null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(!location.state);
  const [cartQty, setCartQty] = useState(getBuyerCartCount());
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(
    () => new Set(getBuyerWishlistItems().map((item) => String(item.id)))
  );
  const [added, setAdded] = useState(false);
  const [locations, setLocations] = useState<ApiLocation[]>([]);
  const [stocks, setStocks] = useState<ApiStock[]>([]);
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("buyer_delivery_location") || ""
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const refreshCart = () => setCartQty(getBuyerCartCount());
    window.addEventListener("buyer-cart-change", refreshCart);
    return () => window.removeEventListener("buyer-cart-change", refreshCart);
  }, []);

  useEffect(() => {
    const refreshWishlist = () => {
      setWishlistIds(new Set(getBuyerWishlistItems().map((item) => String(item.id))));
    };
    window.addEventListener("buyer-wishlist-change", refreshWishlist);
    window.addEventListener("storage", refreshWishlist);
    return () => {
      window.removeEventListener("buyer-wishlist-change", refreshWishlist);
      window.removeEventListener("storage", refreshWishlist);
    };
  }, []);

  useEffect(() => {
    if (product || !id) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_ORIGIN}/api/products/${id}/`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, product]);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const [locationRes, stockRes, promotionRes] = await Promise.all([
          fetch(`${API_ORIGIN}/api/locations/`),
          fetch(`${API_ORIGIN}/api/warehouse/stock/?available=true${id ? `&product=${id}` : ""}`),
          fetch(`${API_ORIGIN}/api/admin/promotions/`),
        ]);
        const [locationData, stockData, promotionData] = await Promise.all([
          locationRes.json(),
          stockRes.json(),
          promotionRes.json(),
        ]);
        setLocations(Array.isArray(locationData) ? locationData : []);
        setStocks(Array.isArray(stockData) ? stockData : []);
        setPromotions(Array.isArray(promotionData) ? promotionData : []);
      } catch (error) {
        console.error(error);
      }
    };
    loadAvailability();
  }, [id]);

  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      const availableColor = product.colors.find(c => c.is_available) || product.colors[0];
      setSelectedColor(availableColor);
    }
  }, [product, selectedColor]);

  useEffect(() => {
    const sizes = productSizes(product?.size);
    if (sizes.length === 1) setSelectedSize(sizes[0]);
    if (sizes.length === 0) setSelectedSize("");
  }, [product?.size]);

  const activeLocations = locations.filter((loc) => {
    const status = String(loc.status || "").trim().toLowerCase();
    return !status || status === "active";
  });
  const selectedLocationName = (() => {
    const loc = locations.find((item) => String(item.id) === selectedLocation);
    return loc ? `${loc.name} - ${loc.city}` : "";
  })();
  const productStock = stocks.find(
    (stock) =>
      stock.quantity > 0 &&
      stock.available_to_buyers &&
      (!product || stock.product === product.id)
  );
  const availableQuantity = productStock?.quantity || 0;
  const activePromotion = promotionForProduct(product, promotions);
  const finalPrice = product ? discountedPrice(product.price, activePromotion) : 0;
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

  const requireSize = () => {
    const sizes = productSizes(product?.size);
    if (sizes.length === 0 || selectedSize) return true;
    alert("Please select a size first.");
    return false;
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (!requireBuyerLogin()) return;
    const category = productCategoryName(product);
    const sizes = productSizes(product.size);
    const result = toggleBuyerWishlistItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: product.price,
      image: imageUrl(product.image),
      category,
      description: product.description,
      size: selectedSize || product.size,
      sizes,
      stock: productStock?.quantity,
    });
    setWishlistIds(new Set(result.items.map((item) => String(item.id))));
  };

  const addToCart = () => {
    if (!product) return;
    if (!requireBuyerLogin()) return;
    if (!requireDeliveryLocation()) return;
    if (!requireSize()) return;
    if (!productStock) {
      alert("Out of Stock.");
      return;
    }
    const category = productCategoryName(product);
    const sizes = productSizes(product.size);
    addBuyerCartItem(
      {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: imageUrl(product.image),
        category,
        description: product.description,
        size: selectedSize,
        sizes,
        stock: productStock.quantity,
        locationId: Number(selectedLocation),
        locationName: selectedLocationName,
      },
      qty
    );
    setCartQty(getBuyerCartCount());
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const buyNow = () => {
    if (!product) return;
    if (!requireBuyerLogin()) return;
    if (!requireDeliveryLocation()) return;
    if (!requireSize()) return;
    if (!productStock) {
      alert("Out of Stock.");
      return;
    }
    const category = productCategoryName(product);
    const sizes = productSizes(product.size);
    navigate("/checkout", {
      state: {
        buyNow: true,
        items: [
          {
            id: product.id,
            name: product.name,
            price: finalPrice,
            image: imageUrl(product.image),
            category,
            description: product.description,
            size: selectedSize,
            sizes,
            quantity: qty,
            stock: productStock.quantity,
            locationId: Number(selectedLocation),
            locationName: selectedLocationName,
          },
        ],
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={cartQty} activeCat={productCategoryName(product)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center font-bold text-slate-500">
            Loading product...
          </div>
        ) : !product || !product.is_published || product.status !== "approved" ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
            <h1 className="text-xl font-black text-slate-900">Product not available</h1>
            <button
              onClick={() => navigate("/allproducts")}
              className="mt-5 px-6 py-3 rounded-lg bg-violet-600 text-white font-bold"
            >
              Back to Products
            </button>
          </div>
        ) : (
          <>
            <div className="text-xs text-slate-500 mb-4">
              <button onClick={() => navigate("/allproducts")} className="font-bold hover:text-violet-700">
                Products
              </button>
              <span className="mx-2">/</span>
              <span>{productCategoryName(product)}</span>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 bg-white border border-slate-200 rounded-lg overflow-hidden">
             
              <div className="bg-slate-100 flex flex-col">
              
                <div className="min-h-[360px] flex items-center justify-center flex-1">
                  {product.product_images && product.product_images.length > 0 ? (
                    <img
                      src={imageUrl(product.product_images[selectedImageIndex]?.image)}
                      alt={`${product.name} - View ${selectedImageIndex + 1}`}
                      className="w-full h-full max-h-[560px] object-cover"
                    />
                  ) : product.image ? (
                    <img
                      src={imageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full max-h-[560px] object-cover"
                    />
                  ) : (
                    <span className="text-slate-400 font-bold">No Image</span>
                  )}
                </div>

             
                {product.product_images && product.product_images.length > 0 && (
                  <div className="bg-white border-t border-slate-200 p-3">
                    <p className="text-xs font-bold text-slate-700 mb-3 px-1">
                      Views: {product.product_images.length}
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.product_images.map((img, index) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                            selectedImageIndex === index
                              ? "border-violet-600 ring-2 ring-violet-300"
                              : "border-slate-300 hover:border-slate-400"
                          }`}
                          title={`View ${index + 1} - ${img.image_type}`}
                        >
                          <img
                            src={imageUrl(img.image)}
                            alt={`View ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 px-1 mt-2">
                      Showing: View {selectedImageIndex + 1}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-violet-600 uppercase">
                      {productCategoryName(product)}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                      {product.name}
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={toggleWishlist}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-2xl transition ${
                      wishlistIds.has(String(product.id))
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-slate-200 bg-white text-slate-400 hover:border-rose-200 hover:text-rose-500"
                    }`}
                    aria-label={wishlistIds.has(String(product.id)) ? "Remove from wishlist" : "Save to wishlist"}
                  >
                    {wishlistIds.has(String(product.id)) ? "♥" : "♡"}
                  </button>
                </div>
                {product.code && (
                  <p className="text-sm text-slate-500 mt-2">Code: {product.code}</p>
                )}
                <div className="mt-5">
                  {activePromotion && (
                    <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">
                      {activePromotion.name}
                    </span>
                  )}
                  <p className="text-3xl font-black text-rose-600 mt-2">
                    {currency(finalPrice)}
                  </p>
                  {activePromotion && (
                    <p className="text-sm font-bold text-slate-400 line-through">
                      {currency(product.price)}
                    </p>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {availableQuantity > 0
                    ? `${availableQuantity} items available`
                    : "Out of Stock"}
                </p>

              
                {product.colors && product.colors.length > 0 && (
                  <label className="block mt-5">
                    <span className="text-sm font-black text-slate-900">Available Colors</span>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color)}
                          disabled={!color.is_available}
                          className={`relative p-1 rounded-lg transition-all ${
                            selectedColor?.id === color.id
                              ? "ring-2 ring-violet-600 ring-offset-1"
                              : ""
                          } ${!color.is_available ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={`${color.color_name}${!color.is_available ? " (Out of stock)" : ""}`}
                        >
                          <div
                            className="w-12 h-12 rounded border-2 border-slate-300 shadow-sm"
                            style={{ backgroundColor: color.color_code }}
                            title={color.color_name}
                          />
                          <span className="block text-xs font-bold text-center mt-1 text-slate-700">
                            {color.color_name}
                          </span>
                        </button>
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="text-xs text-slate-600 mt-2">
                        Selected: <span className="font-bold">{selectedColor.color_name}</span>
                        {selectedColor.quantity > 0 && (
                          <span className="ml-2">({selectedColor.quantity} in stock)</span>
                        )}
                      </p>
                    )}
                  </label>
                )}

                {productSizes(product.size).length > 0 && (
                  <div className="mt-5">
                    <span className="text-sm font-black text-slate-900">Select Size</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {productSizes(product.size).map((sizeOption) => (
                        <button
                          type="button"
                          key={sizeOption}
                          onClick={() => setSelectedSize(sizeOption)}
                          className={`rounded-lg border px-3 py-2 text-sm font-black transition ${
                            selectedSize === sizeOption
                              ? "border-violet-600 bg-violet-600 text-white shadow"
                              : "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400"
                          }`}
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                    {!selectedSize && (
                      <p className="mt-2 text-xs font-bold text-rose-600">
                        Please choose a size before ordering.
                      </p>
                    )}
                  </div>
                )}

                <label className="block mt-5">
                  <span className="text-sm font-black text-slate-900">Delivery Location</span>
                  <select
                    value={selectedLocation}
                    onChange={(event) => {
                      setSelectedLocation(event.target.value);
                      if (event.target.value) localStorage.setItem("buyer_delivery_location", event.target.value);
                      else localStorage.removeItem("buyer_delivery_location");
                    }}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 outline-none focus:border-violet-500"
                  >
                    <option value="">Select delivery location</option>
                    {activeLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} - {loc.city}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-6">
                  <h2 className="text-sm font-black text-slate-900">Key Specifications:</h2>
                  {keySpecifications(product.description).length > 0 ? (
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {keySpecifications(product.description).map((spec) => (
                        <li key={spec} className="flex gap-2 leading-6">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-600 mt-2 leading-6">
                      No product specifications provided.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900">Quantity</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty((value) => Math.max(1, value - 1))}
                      className="w-10 h-10 bg-white text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold">{qty}</span>
                    <button
                      onClick={() => setQty((value) => Math.min(availableQuantity || 1, value + 1))}
                      className="w-10 h-10 bg-white text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
                    <button
                      onClick={buyNow}
                    disabled={availableQuantity === 0}
                      className="py-3 rounded-lg bg-green-600 text-white font-black hover:bg-green-700 disabled:bg-slate-300"
                    >
                    Buy Now
                  </button>
                    <button
                      onClick={addToCart}
                    disabled={availableQuantity === 0}
                      className={`py-3 rounded-lg text-white font-black disabled:bg-slate-300 ${
                      added ? "bg-green-600" : "bg-violet-600 hover:bg-violet-700"
                    }`}
                  >
                    {added ? "Added to Cart" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => product && navigate(`/compare?product1=${product.id}`)}
                    className="py-3 rounded-lg border border-slate-300 text-slate-900 font-black hover:bg-slate-100"
                  >
                    Compare
                  </button>
                </div>
              </div>
            </section>

            <ReviewComments
              productId={product.id}
              productName={product.name}
              className="mt-6"
            />
          </>
        )}
      </main>

      <BuyerFooter />
    </div>
  );
}
