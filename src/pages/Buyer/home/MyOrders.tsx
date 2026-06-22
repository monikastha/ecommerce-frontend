/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import { getBuyerCartCount } from "../../../utils/buyerCart";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type MyOrderItem = {
  id: number;
  product_name: string;
  product_category?: string;
  product_image?: string;
  quantity: number;
  price: string | number;
  subtotal: string | number;
};

type MyOrder = {
  id: number;
  order_number: string;
  delivery_location_name?: string;
  delivery_type: string;
  delivery_fee: string | number;
  payment_type: string;
  total: string | number;
  status: string;
  created_at: string;
  items: MyOrderItem[];
};

const currency = (value?: string | number) =>
  `Rs. ${Number(value || 0).toLocaleString()}`;

const statusLabel = (status?: string) =>
  (status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const paymentLabel = (paymentType?: string) => {
  if (paymentType === "cash_on_delivery") return "Cash on Delivery";
  if (paymentType === "khalti") return "Khalti";
  return paymentType || "-";
};

const statusClass = (status?: string) => {
  if (status === "cancelled") return "bg-red-50 text-red-700";
  if (status === "delivered" || status === "completed") return "bg-green-50 text-green-700";
  if (status === "processing" || status === "pending") return "bg-amber-50 text-amber-700";
  return "bg-blue-50 text-blue-700";
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const query = userId
      ? `user_id=${encodeURIComponent(userId)}`
      : `username=${encodeURIComponent(username || "")}`;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/?${query}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load your orders.");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={getBuyerCartCount()} activeCat="My Orders" categories={[]} showAllCategory={false} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
            <p className="mt-1 text-sm text-slate-500">
              View every order you placed and its current status.
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-500">Total Orders</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{orders.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-500">Total Spent</p>
            <p className="mt-2 text-3xl font-black text-rose-600">{currency(totalSpent)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-500">Active Orders</p>
            <p className="mt-2 text-3xl font-black text-teal-700">
              {orders.filter((order) => !["delivered", "completed", "cancelled"].includes(order.status)).length}
            </p>
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <section className="rounded-lg border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-black text-slate-900">No orders yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              After you place an order from checkout, it will appear here.
            </p>
            <button
              onClick={() => navigate("/allproducts")}
              className="mt-5 rounded-lg bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-700"
            >
              Browse Products
            </button>
          </section>
        ) : (
          <section className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Order ID</p>
                    <h2 className="mt-1 text-lg font-black text-slate-900">{order.order_number}</h2>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {order.created_at ? new Date(order.created_at).toLocaleString() : "Recent"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                    <p className="mt-3 text-xl font-black text-rose-600">{currency(order.total)}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3 rounded-lg bg-slate-50 p-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-slate-900">{item.product_name}</p>
                          <p className="text-xs font-bold text-slate-500">
                            {item.product_category || "Product"} · Qty {item.quantity}
                          </p>
                          <p className="mt-1 text-sm font-black text-slate-700">{currency(item.subtotal)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Payment</span>
                      <span className="font-black text-slate-900">{paymentLabel(order.payment_type)}</span>
                    </div>
                    <div className="mt-3 flex justify-between gap-3">
                      <span className="text-slate-500">Delivery</span>
                      <span className="font-black capitalize text-slate-900">{order.delivery_type}</span>
                    </div>
                    <div className="mt-3 flex justify-between gap-3">
                      <span className="text-slate-500">Delivery Fee</span>
                      <span className="font-black text-slate-900">{currency(order.delivery_fee)}</span>
                    </div>
                    <p className="mt-4 text-xs font-bold leading-5 text-slate-500">
                      {order.delivery_location_name || "Delivery location not available"}
                    </p>
                    <button
                      onClick={() => navigate(`/ordertracking?orderId=${encodeURIComponent(order.order_number)}`)}
                      className="mt-4 w-full rounded-lg border border-teal-200 px-3 py-2 text-sm font-black text-teal-700 hover:bg-teal-50"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <BuyerFooter />
    </div>
  );
}
