/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState, useCallback } from "react";       
import { useNavigate } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import {
  getBuyerCart,
  getBuyerCartCount,
  removeBuyerCartItem,
  updateBuyerCartQuantity,
} from "../../../utils/buyerCart";
import type { BuyerCartItem } from "../../../utils/buyerCart";

const currency = (value: number) => `Rs. ${value.toLocaleString()}`;
const categoryLabel = (category?: string) => category?.trim() || "General";

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<BuyerCartItem[]>([]);

  const refresh = useCallback(() => {
    setItems([...getBuyerCart()]);
  }, []);

  useEffect(() => {
    refresh();

    const handleCartChange = () => refresh();
    window.addEventListener("buyer-cart-change", handleCartChange);

    return () => window.removeEventListener("buyer-cart-change", handleCartChange);
  }, [refresh]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const deliveryFee = subtotal > 0 ? 120 : 0;
  const total = subtotal + deliveryFee;

  const changeQty = useCallback((id: number, quantity: number) => {
    updateBuyerCartQuantity(id, quantity);
    refresh();
  }, [refresh]);

  const removeItem = useCallback((id: number) => {
    removeBuyerCartItem(id);
    refresh();
  }, [refresh]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cartQty = useMemo(() => getBuyerCartCount(), [items]);

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={cartQty} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Shopping Cart</h1>
            <p className="text-sm text-slate-500">Review items before checkout.</p>
          </div>
        <button
  type="button"
  onClick={() => navigate("/allproducts")}
  className="px-4 py-2 rounded-lg border border-b bg-white-400 text-sm font-bold text-slate-900 hover:bg-yellow-500 hover:border-yellow-600"
>
  Continue Shopping
</button>
        </div>

        {items.length === 0 ? (
          <section className="bg-white border border-slate-200 rounded-lg p-10 text-center">
            <p className="text-4xl mb-3">🛒</p>
            <h2 className="text-lg font-black text-slate-900">Your cart is empty</h2>
            <p className="text-sm text-slate-500 mt-1">Browse products and add what you like.</p>
            <button
              type="button"
              onClick={() => navigate("/allproducts")}
              className="mt-5 px-6 py-3 rounded-lg bg-violet-600 text-white font-bold hover:bg-violet-700"
            >
              Browse Products
            </button>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[92px_1fr] sm:grid-cols-[112px_1fr_auto] gap-4 p-4 border-b border-slate-100 last:border-b-0"
                >
                  {/* Image & Details (unchanged) */}
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-[92px] h-[92px] sm:w-28 sm:h-28 rounded-lg object-cover bg-slate-100" />
                  ) : (
                    <div className="w-[92px] h-[92px] sm:w-28 sm:h-28 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                      No Image
                    </div>
                  )}

                  <div>
                    <p className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-black text-teal-700 uppercase">
                      {categoryLabel(item.category)}
                    </p>
                    <h3 className="font-black text-slate-900 mt-1">{item.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                      {item.description || "Ready for checkout"}
                    </p>
                    {item.locationName && <p className="text-xs font-bold text-violet-700 mt-1">Delivery area: {item.locationName}</p>}
                    <p className="font-black text-rose-600 mt-2">{currency(item.price)}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 col-span-2 sm:col-span-1">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                      <button onClick={() => changeQty(item.id, item.quantity - 1)} className="w-9 h-9 bg-white text-lg font-bold">-</button>
                      <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => changeQty(item.id, item.quantity + 1)} disabled={!!item.stock && item.quantity >= item.stock} className="w-9 h-9 bg-white text-lg font-bold disabled:text-slate-300">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-sm font-bold text-red-600 hover:text-red-700">Remove</button>
                  </div>
                </div>
              ))}
            </section>

            <aside className="bg-white border border-slate-200 rounded-lg p-5 h-fit">
              <h2 className="text-lg font-black text-slate-900">Order Summary</h2>
              <div className="space-y-3 mt-5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">{currency(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span className="font-bold">{currency(deliveryFee)}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                  <span className="font-black">Total</span>
                  <span className="font-black text-rose-600">{currency(total)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full py-3 rounded-lg bg-green-600 text-white font-black hover:bg-green-700"
              >
                Checkout
              </button>
            </aside>
          </div>
        )}
      </main>

      <BuyerFooter />
    </div>
  );
}