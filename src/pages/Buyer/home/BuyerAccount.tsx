import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  MapPin,
  Package,
  Save,
  ShoppingCart,
  User,
} from "lucide-react";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import { getBuyerCart, getBuyerCartCount } from "../../../utils/buyerCart";
import type { BuyerCartItem } from "../../../utils/buyerCart";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type BuyerOrder = {
  id: string;
  items?: BuyerCartItem[];
  total?: number;
  deliveryFee?: number;
  deliveryType?: string;
  deliveryLocation?: string;
  paymentType?: string;
  address?: string;
  status?: string;
  createdAt?: string;
};

type AccountForm = {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  address: string;
  age: string;
  gender: string;
};

type BuyerProfile = AccountForm & {
  id?: number;
  user_id?: number;
  total_orders?: boolean | number;
  total_spent?: number | string;
  created_at?: string;
  updated_at?: string;
};

const emptyForm = (): AccountForm => ({
  name: localStorage.getItem("name") || "",
  username: localStorage.getItem("username") || "",
  email: localStorage.getItem("email") || "",
  phone_number: localStorage.getItem("buyer_phone") || "",
  address: localStorage.getItem("buyer_address") || "",
  age: "",
  gender: "",
});

const profileToForm = (profile: Partial<BuyerProfile>): AccountForm => ({
  name: profile.name || "",
  username: profile.username || "",
  email: profile.email || "",
  phone_number: profile.phone_number || "",
  address: profile.address || "",
  age: profile.age ? String(profile.age) : "",
  gender: profile.gender || "",
});

const currency = (value: number) => `Rs. ${value.toLocaleString()}`;

const readOrders = (): BuyerOrder[] => {
  try {
    const raw = localStorage.getItem("buyer_orders");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const statusLabel = (status?: string) =>
  (status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function BuyerAccount() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<BuyerCartItem[]>([]);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<AccountForm>(() => emptyForm());

  useEffect(() => {
    const refreshCart = () => setCartItems(getBuyerCart());
    refreshCart();
    setOrders(readOrders());
    window.addEventListener("buyer-cart-change", refreshCart);
    return () => window.removeEventListener("buyer-cart-change", refreshCart);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setLoadingProfile(false);
        setError("Please log in again to view your account details.");
        return;
      }

      setLoadingProfile(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/api/buyer/profile/${userId}/`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.detail || "Failed to load profile.");
        }

        const nextProfile = data as BuyerProfile;
        setProfile(nextProfile);
        setForm(profileToForm(nextProfile));
        localStorage.setItem("name", nextProfile.name || "");
        localStorage.setItem("username", nextProfile.username || "");
        localStorage.setItem("email", nextProfile.email || "");
        localStorage.setItem("buyer_phone", nextProfile.phone_number || "");
        localStorage.setItem("buyer_address", nextProfile.address || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const orderTotal = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  const updateField = (field: keyof AccountForm, value: string) => {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("Please log in again to save your account details.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    const payload = {
      ...form,
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
      address: form.address.trim(),
      age: form.age.trim(),
      gender: form.gender.trim(),
    };

    try {
      const response = await fetch(`${API_BASE}/api/buyer/profile/${userId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Failed to save profile.");
      }

      const nextProfile = data as BuyerProfile;
      setProfile(nextProfile);
      setForm(profileToForm(nextProfile));
      localStorage.setItem("name", nextProfile.name || "");
      localStorage.setItem("username", nextProfile.username || "");
      localStorage.setItem("email", nextProfile.email || "");
      localStorage.setItem("buyer_phone", nextProfile.phone_number || "");
      localStorage.setItem("buyer_address", nextProfile.address || "");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={getBuyerCartCount()} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-black text-teal-700 uppercase">Buyer Account</p>
            <h1 className="text-2xl font-black text-slate-900">My Account</h1>
          </div>
          <button
            onClick={() => navigate("/allproducts")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-teal-500"
          >
            <ShoppingCart size={17} />
            Continue Shopping
          </button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700">
                <ShoppingCart size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cart Items</p>
                <p className="text-xl font-black text-slate-900">{getBuyerCartCount()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <Package size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Orders</p>
                <p className="text-xl font-black text-slate-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-rose-700">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Spent</p>
                <p className="text-xl font-black text-slate-900">{currency(orderTotal)}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-white">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Profile Details</h2>
                <p className="text-sm text-slate-500">
                  {profile?.id ? `Buyer ID #${profile.id}` : "Keep your buyer details ready for checkout."}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {loadingProfile && (
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                Loading registered buyer details...
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Full Name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-teal-500"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Username</span>
                <input
                  value={form.username}
                  onChange={(event) => updateField("username", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-teal-500"
                  placeholder="username"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-teal-500"
                  placeholder="buyer@example.com"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Phone Number</span>
                <input
                  value={form.phone_number}
                  onChange={(event) => updateField("phone_number", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-teal-500"
                  placeholder="98XXXXXXXX"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Age</span>
                <input
                  type="number"
                  min="1"
                  value={form.age}
                  onChange={(event) => updateField("age", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-teal-500"
                  placeholder="Age"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Gender</span>
                <select
                  value={form.gender}
                  onChange={(event) => updateField("gender", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-teal-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Address</span>
                <input
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-teal-500"
                  placeholder="Street, ward, landmark"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || loadingProfile}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700 disabled:bg-teal-300"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Account"}
              </button>
              {saved && <span className="text-sm font-bold text-emerald-700">Account saved.</span>}
            </div>
          </section>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 h-fit">
            <h2 className="text-lg font-black text-slate-900">Account Actions</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => navigate("/cart")}
                className="w-full inline-flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:border-teal-500"
              >
                <span>View Cart</span>
                <span>{currency(cartTotal)}</span>
              </button>
              <button
                onClick={() => navigate("/ordertracking")}
                className="w-full inline-flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:border-teal-500"
              >
                <span>Track Orders</span>
                <span>{orders.length}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-900">Recent Orders</h2>
            <p className="text-sm text-slate-500">Your latest checkout activity appears here.</p>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="font-black text-slate-900">No orders yet</h3>
              <p className="text-sm text-slate-500 mt-1">When you place an order, it will show in this account page.</p>
              <button
                onClick={() => navigate("/allproducts")}
                className="mt-4 rounded-lg bg-slate-900 px-5 py-3 text-sm font-black text-white"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-slate-900">{order.id}</p>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {statusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {(order.items || []).length} item(s)
                      {order.address ? ` • ${order.address}` : ""}
                    </p>
                    {order.deliveryLocation && (
                      <p className="text-xs font-bold text-teal-700 mt-1">
                        Delivery: {order.deliveryLocation}
                      </p>
                    )}
                  </div>
                  <div className="md:text-right">
                    <p className="font-black text-rose-600">{currency(Number(order.total || 0))}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BuyerFooter />
    </div>
  );
}
