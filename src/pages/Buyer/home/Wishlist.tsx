import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import {
  addBuyerCartItem,
  getBuyerCartCount,
} from "../../../utils/buyerCart";
import type { BuyerWishlistItem } from "../../../utils/buyerWishlist";
import {
  getBuyerWishlistItems,
  removeBuyerWishlistItem,
} from "../../../utils/buyerWishlist";

const currency = (value: string | number) =>
  `Rs. ${(Number(String(value).replace(/[^0-9.]/g, "")) || 0).toLocaleString()}`;

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState<BuyerWishlistItem[]>(() => getBuyerWishlistItems());
  const [cartQty, setCartQty] = useState(getBuyerCartCount());

  useEffect(() => {
    const refreshWishlist = () => setItems(getBuyerWishlistItems());
    const refreshCart = () => setCartQty(getBuyerCartCount());

    window.addEventListener("buyer-wishlist-change", refreshWishlist);
    window.addEventListener("buyer-cart-change", refreshCart);
    window.addEventListener("storage", refreshWishlist);
    return () => {
      window.removeEventListener("buyer-wishlist-change", refreshWishlist);
      window.removeEventListener("buyer-cart-change", refreshCart);
      window.removeEventListener("storage", refreshWishlist);
    };
  }, []);

  const removeItem = (id: number | string) => {
    setItems(removeBuyerWishlistItem(id));
  };

  const addToCart = (item: BuyerWishlistItem) => {
    addBuyerCartItem({
      id: Number(item.id),
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description,
      size: item.size,
      sizes: item.sizes,
      stock: item.stock,
    });
    setCartQty(getBuyerCartCount());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={cartQty} activeCat="Wishlist" categories={[]} showAllCategory={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Wishlist</h1>
            <p className="mt-1 text-sm text-slate-500">
              {items.length ? `${items.length} saved product${items.length > 1 ? "s" : ""}` : "No saved products yet."}
            </p>
          </div>
          <button
            onClick={() => navigate("/allproducts")}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
          >
            Continue Shopping
          </button>
        </div>

        {items.length === 0 ? (
          <section className="rounded-lg border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-3xl text-rose-500">
              ♥
            </div>
            <h2 className="mt-5 text-xl font-black text-slate-900">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-slate-500">
              Tap the heart on products you like, then come back here to compare or buy them later.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <article
                key={String(item.id)}
                className="rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  onClick={() => navigate(`/product/${item.id}`, { state: item })}
                  className="block h-52 w-full overflow-hidden rounded-t-lg bg-slate-100"
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                      No Image
                    </div>
                  )}
                </button>

                <div className="p-4">
                  <p className="text-xs font-black uppercase text-violet-600">{item.category || "Product"}</p>
                  <h2 className="mt-2 min-h-[44px] text-base font-black text-slate-900 line-clamp-2">
                    {item.name}
                  </h2>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-black text-rose-600">{currency(item.price)}</span>
                    {item.originalPrice && (
                      <span className="text-xs font-bold text-slate-400 line-through">
                        {currency(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => addToCart(item)}
                      className="rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-black text-white hover:bg-violet-700"
                    >
                      Add Cart
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg border border-rose-200 px-3 py-2.5 text-sm font-black text-rose-600 hover:bg-rose-50"
                    >
                      Remove
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
