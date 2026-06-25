/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Save,
} from "lucide-react";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import { saveProfileToStorage, PROFILE_IMAGE_UPDATED_EVENT } from "../../../components/ProfileAvatar";
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
  profile_pic?: string;
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

const imageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const url = `${API_BASE}${path}`;
  return `${url}?v=1`;
};

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
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>(() => imageUrl(localStorage.getItem("profile_image") ?? undefined) || "");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<AccountForm>(() => emptyForm());
  const [categories, setCategories] = useState<string[]>([]);

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
        setProfilePicPreview(imageUrl(nextProfile.profile_pic));
        setForm(profileToForm(nextProfile));
        localStorage.setItem("name", nextProfile.name || "");
        localStorage.setItem("username", nextProfile.username || "");
        localStorage.setItem("email", nextProfile.email || "");
        localStorage.setItem("profile_image", nextProfile.profile_pic || "");
        localStorage.setItem("buyer_phone", nextProfile.phone_number || "");
        localStorage.setItem("buyer_address", nextProfile.address || "");
        saveProfileToStorage(nextProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setLoadingProfile(false);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/productcategory/categories/`);
        const data = await response.json();
        if (Array.isArray(data)) {
          const categoryNames = data.map((c: any) => c.name).filter(Boolean);
          setCategories(categoryNames);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadProfile();
    loadCategories();
  }, []);

  useEffect(() => {
    if (profile && profile.profile_pic) {
      setProfilePicPreview(imageUrl(profile.profile_pic));
    }
  }, [profile]);

  const handleProfilePicChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProfilePicFile(file);
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

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

    let body: BodyInit;
    let headers: HeadersInit = {};

    if (profilePicFile) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (typeof value === "string") {
          formData.append(key, value);
        }
      });
      formData.append("profile_pic", profilePicFile);
      body = formData;
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(`${API_BASE}/api/buyer/profile/${userId}/`, {
        method: "PATCH",
        headers,
        body,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Failed to save profile.");
      }

      const nextProfile = data as BuyerProfile;
      setProfile(nextProfile);
      setProfilePicPreview(imageUrl(nextProfile.profile_pic));
      setProfilePicFile(null);
      setForm(profileToForm(nextProfile));
      localStorage.setItem("name", nextProfile.name || "");
      localStorage.setItem("username", nextProfile.username || "");
      localStorage.setItem("email", nextProfile.email || "");
      localStorage.setItem("buyer_phone", nextProfile.phone_number || "");
      localStorage.setItem("buyer_address", nextProfile.address || "");
      saveProfileToStorage(nextProfile);
      
      window.dispatchEvent(new Event(PROFILE_IMAGE_UPDATED_EVENT));
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
      <BuyerNavbar cartQty={getBuyerCartCount()} categories={categories} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <section className="rounded-3xl bg-gradient-to-r from-teal-700 via-cyan-600 to-slate-900 p-8 text-white shadow-xl mb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200/90">Buyer account</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">
                {profile?.name ? `Welcome back, ${profile.name}` : "Welcome back"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-100/90">
                Manage your profile picture, personal details, and purchase history from one place.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/25 bg-white/10 shadow-lg">
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800 text-4xl font-black text-white/90">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : "B"}
                  </div>
                )}
              </div>
              <button
                onClick={() => document.getElementById("profilePicInput")?.click()}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/20"
              >
                Change Photo
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm uppercase text-cyan-100/70">Cart</p>
              <p className="mt-3 text-3xl font-black">{getBuyerCartCount()}</p>
              <p className="mt-2 text-sm text-cyan-100/80">Items waiting in cart</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm uppercase text-cyan-100/70">Orders</p>
              <p className="mt-3 text-3xl font-black">{orders.length}</p>
              <p className="mt-2 text-sm text-cyan-100/80">Recent purchases</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm uppercase text-cyan-100/70">Spent</p>
              <p className="mt-3 text-3xl font-black">{currency(orderTotal)}</p>
              <p className="mt-2 text-sm text-cyan-100/80">Purchase history value</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-3xl bg-slate-100 border border-slate-200">
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-3xl font-black text-slate-700">
                      {profile?.name ? profile.name.charAt(0).toUpperCase() : "B"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-700">Profile</p>
                  <h2 className="text-2xl font-black text-slate-900">{profile?.name || "Buyer Name"}</h2>
                  <p className="text-sm text-slate-500">{profile?.email || "Your registered email will appear here."}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById("profilePicInput")?.click()}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-black text-slate-900 hover:border-teal-500"
              >
                Change picture
              </button>
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
