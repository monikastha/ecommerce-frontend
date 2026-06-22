import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, PackageSearch, ShoppingBag } from "lucide-react";

import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import { getBuyerCartCount } from "../../../utils/buyerCart";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const CATEGORIES_CACHE_KEY = "buyer_navbar_categories_cache";
const CATEGORIES_CACHE_TTL = 3600000;

type CachedCategories = {
  categories: string[];
  timestamp: number;
};

type PaymentSuccessData = {
  transaction_uuid?: string;
  total_amount?: string;
  status?: string;
  ref_id?: string;
  product_code?: string;
};

type LocalBuyerOrder = {
  id?: string;
  [key: string]: unknown;
};

const decodePaymentData = (data: string | null): PaymentSuccessData => {
  if (!data) return {};

  try {
    return JSON.parse(window.atob(data)) as PaymentSuccessData;
  } catch {
    return {};
  }
};

const orderIdFromTransaction = (transactionUuid?: string | null) =>
  transactionUuid?.match(/^(ORD-\d+)/)?.[1] || "";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentData = useMemo(
    () => decodePaymentData(searchParams.get("data")),
    [searchParams]
  );

  const [cartQty, setCartQty] = useState(() => getBuyerCartCount());
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setCartQty(getBuyerCartCount());
    window.addEventListener("buyer-cart-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("buyer-cart-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
        if (cached) {
          const parsed: CachedCategories = JSON.parse(cached);
          const isExpired = Date.now() - parsed.timestamp > CATEGORIES_CACHE_TTL;
          if (!isExpired && Array.isArray(parsed.categories)) {
            setCategories(parsed.categories);
            return;
          }
        }

        const endpoints = [
          `${API_ORIGIN}/api/productcategory/categories/`,
          `${API_ORIGIN.replace("localhost", "127.0.0.1")}/api/productcategory/categories/`,
          `${API_ORIGIN.replace("127.0.0.1", "localhost")}/api/productcategory/categories/`,
        ];

        for (const url of endpoints) {
          try {
            const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
            if (!res.ok) continue;
            const data = await res.json();
            const categoryList = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
            const names = categoryList
              .map((item: string | Record<string, unknown> | null) => {
                if (typeof item === "string") return item;
                if (typeof item === "object" && item !== null) {
                  return (item.name || item.title || item.category || null) as string | null;
                }
                return null;
              })
              .filter(Boolean);

            if (names.length > 0) {
              setCategories(names);
              localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify({ categories: names, timestamp: Date.now() }));
              return;
            }
          } catch {
            // try next endpoint
          }
        }
      } catch {
        // silently fail
      }
    };

    loadCategories();
  }, []);

  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("purchase_order_id")?.match(/^(ORD-\d+)/)?.[1] ||
    orderIdFromTransaction(searchParams.get("transaction_uuid")) ||
    searchParams.get("oid") ||
    orderIdFromTransaction(paymentData.transaction_uuid) ||
    "";

  useEffect(() => {
    sessionStorage.removeItem("pending_khalti_payment");

    if (!orderId) return;

    try {
      const existingRaw = localStorage.getItem("buyer_orders") || "[]";
      const orders = JSON.parse(existingRaw);
      const nextOrders = (Array.isArray(orders) ? orders : []).map((order: LocalBuyerOrder) =>
        order.id === orderId
          ? {
              ...order,
              paymentStatus: "completed",
              paymentReference: searchParams.get("pidx") || paymentData.ref_id || searchParams.get("refId") || "",
              paymentCompletedAt: new Date().toISOString(),
            }
          : order
      );
      const nextRaw = JSON.stringify(nextOrders);
      if (nextRaw !== existingRaw) {
        localStorage.setItem("buyer_orders", nextRaw);
        
        window.dispatchEvent(new Event("buyer-orders-changed"));
      }
    } catch {
      // ignore JSON errors
    }
  }, [paymentData.ref_id, orderId, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={cartQty} categories={categories} showAllCategory={true} />

      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12">
        <section className="w-full rounded-lg border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle size={38} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900">Payment Successful</h1>
          <p className="mt-2 text-slate-600">
            Your Khalti payment has been received and your order is being processed.
          </p>

          <div className="mx-auto mt-7 grid max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Order ID</p>
              <p className="mt-1 break-all font-mono text-sm font-black text-slate-900">
                {orderId || "Not provided"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Reference</p>
              <p className="mt-1 break-all font-mono text-sm font-black text-slate-900">
                {searchParams.get("pidx") || paymentData.ref_id || searchParams.get("refId") || "Pending"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={`/ordertracking${orderId ? `?orderId=${encodeURIComponent(orderId)}` : ""}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-700"
            >
              <PackageSearch size={18} />
              Track Order
            </Link>
            <Link
              to="/allproducts"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-black text-slate-800 transition hover:bg-slate-100"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>

      <BuyerFooter />
    </div>
  );
}
