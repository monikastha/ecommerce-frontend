/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import ReviewComments from "./ReviewComments";
import {
  addBuyerCartItem,
  clearBuyerCart,
  getBuyerCart,
  getBuyerCartCount,
} from "../../../utils/buyerCart";
import type { BuyerCartItem } from "../../../utils/buyerCart";
import { reduceStockForItems } from "../../../services/stockService";

type CheckoutState = {
  items?: BuyerCartItem[];
  buyNow?: boolean;
};

type DeliveryType = "normal" | "emergency";

type ApiLocation = {
  id: number;
  name: string;
  province: string;
  city: string;
  status: string;
  normal_delivery_charge?: string | number;
  emergency_delivery_charge?: string | number;
};

type ApiCategory = {
  id: number;
  name: string;
};

type ApiProduct = {
  id: number;
  name: string;
  price: number | string;
  image?: string;
  category?: string | number | { id?: number; name?: string } | null;
  category_name?: string;
  description?: string;
  status?: string;
  is_published?: boolean;
};

const getItemSizes = (item?: BuyerCartItem): string[] => {
  const rawSizes = (item as BuyerCartItem & { sizes?: unknown; size_options?: unknown })?.sizes
    ?? (item as BuyerCartItem & { sizes?: unknown; size_options?: unknown })?.size_options
    ?? item?.size;

  if (Array.isArray(rawSizes)) {
    return rawSizes
      .map((size) => String(size).trim())
      .filter(Boolean);
  }

  if (typeof rawSizes === "string") {
    return rawSizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
  }

  return [];
};

const paymentMethods = [
  { value: "cash_on_delivery", label: "Cash on Delivery" },
  { value: "khalti", label: "Khalti Payment" },
];

const normalizeApiOrigin = (value: string) => {
  const raw = String(value || "").trim();
  if (!raw) return "http://127.0.0.1:8000";
  const normalized = raw.replace(/\/+$/, "");
  return normalized.startsWith("http://") || normalized.startsWith("https://")
    ? normalized
    : `http://${normalized}`;
};

const apiOrigin = normalizeApiOrigin(import.meta.env.VITE_API_URL || "http://127.0.0.1:8000");

const buildApiEndpoints = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return Array.from(
    new Set([
      `${apiOrigin}${normalizedPath}`,
      `${apiOrigin.replace("localhost", "127.0.0.1")}${normalizedPath}`,
      `${apiOrigin.replace("127.0.0.1", "localhost")}${normalizedPath}`,
      normalizedPath,
    ])
  );
};

const fetchApi = async (path: string, init?: RequestInit) => {
  let lastError: unknown;
  for (const endpoint of buildApiEndpoints(path)) {
    try {
      const res = await fetch(endpoint, init);
      if (res.ok || res.status >= 400) {
        return res;
      }
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error(`Failed to fetch ${path}`);
};

const fetchApiJson = async (path: string, init?: RequestInit) => {
  const res = await fetchApi(path, init);
  const data = await res.json().catch(() => ({}));
  return { res, data };
};

const currency = (value: number) => `Rs. ${value.toLocaleString()}`;

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as CheckoutState;
  const [items, setItems] = useState<BuyerCartItem[]>(() => state.items?.length ? state.items : getBuyerCart());
  const [locations, setLocations] = useState<ApiLocation[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    deliveryLocation: String(items[0]?.locationId || localStorage.getItem("buyer_delivery_location") || ""),
    deliveryType: "normal" as DeliveryType,
    paymentType: "cash_on_delivery",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryFeeError, setDeliveryFeeError] = useState("");
  const [, setAllowOrderWithoutDeliveryCharge] = useState(false);
  const [itemDetails, setItemDetails] = useState<Record<number, { quantity: number; size: string }>>(() => {
    const details: Record<number, { quantity: number; size: string }> = {};
    items.forEach((item, idx) => {
      const sizes = getItemSizes(item);
      details[idx] = { quantity: item.quantity, size: sizes.length === 1 ? sizes[0] : "" };
    });
    return details;
  });
  const [similarProducts, setSimilarProducts] = useState<ApiProduct[]>([]);

  const syncCartItems = (nextItems: BuyerCartItem[]) => {
    setItems(nextItems);
    setItemDetails((prev) => {
      const next = { ...prev };
      nextItems.forEach((item, idx) => {
        if (!next[idx]) {
          const sizes = getItemSizes(item);
          next[idx] = { quantity: item.quantity, size: sizes.length === 1 ? sizes[0] : "" };
        }
      });
      return next;
    });
  };

  const handleAddSimilarProduct = (product: ApiProduct) => {
    addBuyerCartItem(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        category:
          typeof product.category === "string"
            ? product.category
            : typeof product.category === "object"
            ? product.category?.name
            : undefined,
        description: product.description,
      },
      1
    );
  };

  useEffect(() => {
    const onCartChange = () => syncCartItems(getBuyerCart());
    window.addEventListener("buyer-cart-change", onCartChange);
    return () => window.removeEventListener("buyer-cart-change", onCartChange);
  }, []);

  const imageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:") || path.startsWith("/")) {
      return path;
    }
    return `${apiOrigin}${path}`;
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item, idx) => {
      const quantity = itemDetails[idx]?.quantity || item.quantity;
      return sum + item.price * quantity;
    }, 0),
    [items, itemDetails]
  );

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const { data } = await fetchApiJson(`/api/locations/`);
        setLocations(Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []);
      } catch (error) {
        console.error(error);
      }
    };
    loadLocations();
    
    const loadCategories = async () => {
      try {
        const { data } = await fetchApiJson(`/api/productcategory/categories/`);
        setCategories(Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const productCategoryText = (product: ApiProduct | { category?: string | number | { id?: number; name?: string } | null; category_name?: string | null } | null) => {
    if (!product) return "Product";
    if (typeof product.category_name === "string" && product.category_name.trim()) return product.category_name.trim();
    if (typeof product.category === "object") return product.category?.name?.trim() || "Product";
    if (typeof product.category === "string") return product.category.trim();
    if (typeof product.category === "number") return String(product.category);
    return "Product";
  };

  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (!items.length) {
        setSimilarProducts([]);
        return;
      }

      try {
        const { data } = await fetchApiJson(`/api/products/?status=approved&is_published=true`);
        if (!Array.isArray(data)) {
          setSimilarProducts([]);
          return;
        }

        const baseCategory = String(items[0]?.category || "").trim().toLowerCase();
        const similar = data.filter((product: ApiProduct) => {
          if (product.id === items[0].id) return false;
          const productCategory = String(productCategoryText(product)).trim().toLowerCase();
          return baseCategory && productCategory === baseCategory;
        });

        setSimilarProducts(similar.slice(0, 4));
      } catch (error) {
        console.error(error);
        setSimilarProducts([]);
      }
    };

    loadSimilarProducts();
  }, [items]);

  const activeLocations = useMemo(
    () =>
      locations.filter((loc) => {
        const status = String(loc.status || "").trim().toLowerCase();
        return !status || status === "active";
      }),
    [locations]
  );

  const selectedLocation = useMemo(
    () => locations.find((loc) => String(loc.id) === formData.deliveryLocation),
    [formData.deliveryLocation, locations]
  );

  const total = subtotal + deliveryFee;

  const categoryNames = useMemo(
    () => Array.from(new Set(categories.map((c) => c.name).filter(Boolean))),
    [categories]
  );

  useEffect(() => {
    const calculateDeliveryFee = async () => {
      if (!formData.deliveryLocation || !subtotal) {
        setDeliveryFee(0);
        setDeliveryFeeError("");
        setAllowOrderWithoutDeliveryCharge(false);
        return;
      }

      try {
        const { res, data } = await fetchApiJson(`/api/delivery-charge/calculate/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: Number(formData.deliveryLocation),
            delivery_type: formData.deliveryType,
            product_total: subtotal,
          }),
        });

        if (!res.ok) {
          const errorMsg = data.error || "Delivery charge is not available.";
          setDeliveryFee(0);
          setDeliveryFeeError(errorMsg);
          
          
          if (errorMsg.toLowerCase().includes("no delivery charge rule") || 
              errorMsg.toLowerCase().includes("not available")) {
            setAllowOrderWithoutDeliveryCharge(true);
          }
          return;
        }

        setDeliveryFee(Number(data.delivery_charge || 0));
        setDeliveryFeeError("");
        setAllowOrderWithoutDeliveryCharge(false);
      } catch (error) {
        setDeliveryFee(0);
        const errorMsg = error instanceof Error ? error.message : "Delivery charge is not available.";
        setDeliveryFeeError(errorMsg);
        
        if (errorMsg.toLowerCase().includes("no delivery charge rule") || 
            errorMsg.toLowerCase().includes("not available")) {
          setAllowOrderWithoutDeliveryCharge(true);
        }
      }
    };

    calculateDeliveryFee();
  }, [formData.deliveryLocation, formData.deliveryType, subtotal]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      alert("Your cart is empty.");
      navigate("/allproducts");
      return;
    }

    if (!formData.email || !formData.phone || !formData.address || !formData.city || 
        !formData.deliveryLocation || !formData.name || !formData.postal_code) {
      alert("Please complete your contact and delivery information.");
      return;
    }



    setIsProcessing(true);

    try {
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;

    
      try {
        await reduceStockForItems(items);
      } catch (stockError: any) {
        alert(stockError.message || "Some items are out of stock.");
        setIsProcessing(false);
        return;
      }

      const orderData = {
        id: orderId,
        items: items.map((item, idx) => {
          const size = itemDetails[idx]?.size || "";
          return {
            ...item,
            quantity: itemDetails[idx]?.quantity || item.quantity,
            ...(size ? { size } : {}),
          };
        }),
        total: subtotal + (deliveryFee || 0),
        deliveryFee: deliveryFee || 0,
        deliveryType: formData.deliveryType,
        deliveryLocation: selectedLocation
          ? `${selectedLocation.name}, ${selectedLocation.city}`
          : formData.deliveryLocation,
        paymentType: formData.paymentType,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        postal_code: formData.postal_code,
        status: "pending",
        createdAt: new Date().toISOString(),
        note: deliveryFeeError ? "Delivery charge rule not found - charged 0" : undefined,
      };

      const { res: orderRes, data: orderApiData } = await fetchApiJson(`/api/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderId,
          user_id: Number(localStorage.getItem("user_id") || 0) || undefined,
          username: localStorage.getItem("username") || "",
          customer_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          delivery_location: Number(formData.deliveryLocation) || null,
          delivery_location_name: orderData.deliveryLocation,
          delivery_type: formData.deliveryType,
          delivery_fee: deliveryFee || 0,
          payment_type: formData.paymentType,
          status: "pending",
          notes: orderData.note || "",
          reduce_stock: false,
          items: orderData.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            size: item.size || "",
          })),
        }),
      });
      if (!orderRes.ok) {
        throw new Error(orderApiData.error || orderApiData.detail || orderApiData.message || JSON.stringify(orderApiData));
      }

      if (formData.paymentType === "cash_on_delivery") {
        const { res: paymentRes, data: paymentData } = await fetchApiJson(`/api/record-cod-payment/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: orderData.total,
            items: orderData.items,
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: orderData.address,
            deliveryType: formData.deliveryType,
            deliveryLocation: orderData.deliveryLocation,
            deliveryFee: orderData.deliveryFee,
          }),
        });

        if (!paymentRes.ok) {
          const errorMessage = paymentData.message || paymentData.error || paymentData.detail || "Failed to record cash on delivery payment.";
          throw new Error(errorMessage);
        }
      }

      const orders = JSON.parse(localStorage.getItem("buyer_orders") || "[]");
      const orderToStore = {
        ...orderData,
        stockReduced: true,
        paymentStatus: formData.paymentType === "cash_on_delivery" ? "completed" : undefined,
        paymentReference: formData.paymentType === "cash_on_delivery" ? "COD-LOCAL" : undefined,
      };
      localStorage.setItem("buyer_orders", JSON.stringify([orderToStore, ...orders]));

      if (!state.buyNow) clearBuyerCart();

      setIsProcessing(false);

      if (formData.paymentType === "khalti") {
        navigate("/payment", {
          state: {
            orderId,
            amount: subtotal + (deliveryFee || 0),
            items,
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}`,
          }
        });
      } else {
        navigate(`/payment-success?orderId=${encodeURIComponent(orderId)}&refId=COD-LOCAL`);
      }

    } catch (error: any) {
      alert(error.message || "Order placement failed");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={getBuyerCartCount()} categories={categoryNames} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Checkout</h1>
          <p className="text-sm text-slate-500">Confirm delivery details and choose a payment method.</p>
        </div>

        {items.length === 0 ? (
          <section className="bg-white border border-slate-200 rounded-lg p-10 text-center">
            <h2 className="text-lg font-black text-slate-900">No items to checkout</h2>
            <button
              onClick={() => navigate("/allproducts")}
              className="mt-5 px-6 py-3 rounded-lg bg-violet-600 text-white font-bold"
            >
              Browse Products
            </button>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
            <div className="space-y-6">
              <section className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                  <div className="space-y-4">
                    <div className="w-full h-[320px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                      <img
                        src={imageUrl(items[0]?.image)}
                        alt={items[0]?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`grid ${getItemSizes(items[0]).length ? "grid-cols-2" : "grid-cols-1"} gap-3 text-sm`}>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                        <p className="text-xs text-slate-500">Quantity</p>
                        <p className="font-black text-slate-900">
                          {itemDetails[0]?.quantity || items[0]?.quantity}
                        </p>
                      </div>
                      {getItemSizes(items[0]).length > 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                          <p className="text-xs text-slate-500">Size</p>
                          <p className="font-black text-slate-900">
                            {itemDetails[0]?.size || "Not selected"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{items[0]?.name}</h2>
                      <p className="mt-2 text-sm uppercase tracking-[0.18em] text-violet-700 font-semibold">
                        {items[0]?.category || "Product"}
                      </p>
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {items[0]?.description || "No description available for this item."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-2">Quantity</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setItemDetails((prev) => ({
                                ...prev,
                                0: {
                                  ...prev[0],
                                  quantity: Math.max(1, prev[0]?.quantity - 1),
                                },
                              }));
                            }}
                            className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={itemDetails[0]?.quantity || items[0]?.quantity}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 1);
                              setItemDetails((prev) => ({
                                ...prev,
                                0: { ...prev[0], quantity: val },
                              }));
                            }}
                            className="w-20 text-center border border-slate-300 rounded-lg px-2 py-2 outline-none focus:border-violet-500"
                          />
                          <button
                            onClick={() => {
                              setItemDetails((prev) => ({
                                ...prev,
                                0: {
                                  ...prev[0],
                                  quantity: (prev[0]?.quantity || items[0]?.quantity) + 1,
                                },
                              }));
                            }}
                            className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {getItemSizes(items[0]).length > 0 && (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-2">Size</label>
                          <div className="flex flex-wrap gap-2">
                            {getItemSizes(items[0]).map((sizeOption) => (
                              <button
                                key={sizeOption}
                                onClick={() => {
                                  setItemDetails((prev) => ({
                                    ...prev,
                                    0: { ...prev[0], size: sizeOption },
                                  }));
                                }}
                                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                                  itemDetails[0]?.size === sizeOption
                                    ? "bg-violet-600 text-white shadow-md"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                {sizeOption}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {items[0] && (
                <ReviewComments
                  productId={items[0].id}
                  productName={items[0].name}
                  showForm={false}
                  compact
                />
              )}

              <section className="bg-white border border-slate-200 rounded-lg p-5">
                <h2 className="text-lg font-black text-slate-900 mb-5">Similar Products</h2>
                {similarProducts.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {similarProducts.map((product) => {
                      const alreadyInCart = items.some((item) => item.id === product.id);
                      return (
                        <div key={product.id} className="group border border-slate-200 rounded-3xl overflow-hidden transition-shadow hover:shadow-lg">
                          <div className="h-44 overflow-hidden bg-slate-100">
                            <img
                              src={imageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-black text-slate-900 truncate">{product.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{product.category_name || String(product.category || "Product")}</p>
                            <p className="mt-3 font-black text-slate-900">{currency(Number(product.price))}</p>
                            <button
                              onClick={() => handleAddSimilarProduct(product)}
                              className="mt-4 w-full rounded-full bg-violet-600 px-3 py-2 text-sm font-black text-white transition hover:bg-violet-700"
                            >
                              {alreadyInCart ? "Add another" : "Add to order"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No similar products are available for this item.</p>
                )}
              </section>

              {items.length > 1 && (
                <section className="bg-white border border-slate-200 rounded-lg p-5">
                  <h2 className="text-lg font-black text-slate-900 mb-4">Other Cart Items</h2>
                  <div className="space-y-4">
                    {items.slice(1).map((item, idx) => (
                      <div key={item.id} className="border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-100">
                          <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 truncate">{item.name}</p>
                          <p className="text-sm text-slate-500">{item.category || "Product"}</p>
                          <p className="mt-2 text-sm text-slate-700">Qty: {itemDetails[idx + 1]?.quantity || item.quantity}</p>
                          {getItemSizes(item).length > 0 && (
                            <p className="text-sm text-slate-700">Size: {itemDetails[idx + 1]?.size || "Not selected"}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="bg-white border border-slate-200 rounded-lg p-5 h-fit">
              <h2 className="text-lg font-black text-slate-900">Delivery Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold text-slate-700">👤 Full Name *</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500"
                    placeholder="Enter your full name"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500"
                    placeholder="buyer@example.com"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Phone</span>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500"
                    placeholder="98XXXXXXXX"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-bold text-slate-700">Address</span>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500"
                    placeholder="Street, ward, landmark"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">City</span>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500"
                    placeholder="Kathmandu"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">📮 Postal Code *</span>
                  <input
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500"
                    placeholder="e.g., 44600"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Delivery Location</span>
                  <select
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500 bg-white"
                  >
                    <option value="">Select Location</option>
                    {activeLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.province} - {loc.city} ({loc.name})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Delivery Type</span>
                  <select
                    name="deliveryType"
                    value={formData.deliveryType}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500 bg-white"
                  >
                    <option value="normal">Normal Delivery</option>
                    <option value="emergency">Emergency Fast Delivery</option>
                  </select>
                  {deliveryFeeError && (
                    <p className="mt-2 text-xs font-bold text-amber-600">
                      {deliveryFeeError} — Proceeding with ₹0 delivery charge.
                    </p>
                  )}
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Payment Method</span>
                  <select
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-violet-500 bg-white"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-7">
                <h2 className="text-lg font-black text-slate-900">Payment Summary</h2>
                {formData.name && formData.postal_code && (
                  <div className="mt-4 mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold">DELIVERY TO:</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">👤 {formData.name}</p>
                    <p className="text-xs text-slate-600 mt-1">📮 Postal Code: {formData.postal_code}</p>
                    <p className="text-xs text-slate-600">📍 {formData.city}</p>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold">{currency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Delivery ({formData.deliveryType === "emergency" ? "Emergency" : "Normal"})
                    </span>
                    <span className="font-bold">{currency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                    <span className="font-black">Total Payment</span>
                    <span className="font-black text-rose-600">{currency(total)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="mt-6 w-full rounded-lg bg-green-600 py-3 text-white font-black hover:bg-green-700 disabled:opacity-60"
                >
                  {isProcessing
                    ? "Processing..."
                    : formData.paymentType === "khalti"
                    ? "Proceed to Payment"
                    : "Place COD Order"}
                </button>
              </div>
            </aside>
          </div>
        )}

      </main>

      <BuyerFooter />
    </div>
  );
}
