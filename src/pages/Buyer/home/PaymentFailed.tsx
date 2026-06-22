/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, CreditCard, ShoppingBag } from "lucide-react";

import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import { getBuyerCartCount } from "../../../utils/buyerCart";

const orderIdFromTransaction = (transactionUuid?: string | null) =>
  transactionUuid?.match(/^(ORD-\d+)/)?.[1] || "";

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId =
    searchParams.get("orderId") ||
    searchParams.get("purchase_order_id")?.match(/^(ORD-\d+)/)?.[1] ||
    orderIdFromTransaction(searchParams.get("transaction_uuid")) ||
    searchParams.get("oid") ||
    "";

  useEffect(() => {
    if (!orderId) return;

    const orders = JSON.parse(localStorage.getItem("buyer_orders") || "[]");
    const nextOrders = orders.map((order: any) =>
      order.id === orderId
        ? {
            ...order,
            paymentStatus: "failed",
            paymentFailedAt: new Date().toISOString(),
          }
        : order
    );
    localStorage.setItem("buyer_orders", JSON.stringify(nextOrders));
  }, [orderId]);

  const retryPayment = () => {
    const pendingPayment = sessionStorage.getItem("pending_khalti_payment");
    if (pendingPayment) {
      navigate("/payment", { state: JSON.parse(pendingPayment) });
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={getBuyerCartCount()} />

      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12">
        <section className="w-full rounded-lg border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <AlertTriangle size={38} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900">Payment Failed</h1>
          <p className="mt-2 text-slate-600">
            Your Khalti payment was not completed. You can try payment again or keep shopping.
          </p>

          <div className="mx-auto mt-7 max-w-xl rounded-lg border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs font-bold uppercase text-slate-500">Order ID</p>
            <p className="mt-1 break-all font-mono text-sm font-black text-slate-900">
              {orderId || "Not provided"}
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={retryPayment}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-3 font-black text-white transition hover:bg-rose-700"
            >
              <CreditCard size={18} />
              Try Again
            </button>
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
