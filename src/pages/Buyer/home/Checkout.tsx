import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import {
  clearBuyerCart,
  getBuyerCart,
  getBuyerCartCount,
} from "../../../utils/buyerCart";
import type { BuyerCartItem } from "../../../utils/buyerCart";

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

const paymentMethods = [
  { value: "cash_on_delivery", label: "Cash on Delivery" },
  { value: "esewa", label: "eSewa" },
  { value: "khalti", label: "Khalti" },
  { value: "card", label: "Debit/Credit Card" },
];
const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const currency = (value: number) => `Rs. ${value.toLocaleString()}`;

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as CheckoutState;
  const [items] = useState<BuyerCartItem[]>(() => state.items?.length ? state.items : getBuyerCart());
  const [locations, setLocations] = useState<ApiLocation[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    deliveryLocation: String(items[0]?.locationId || localStorage.getItem("buyer_delivery_location") || ""),
    deliveryType: "normal" as DeliveryType,
    paymentType: "cash_on_delivery",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryFeeError, setDeliveryFeeError] = useState("");

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/api/locations/`);
        const data = await res.json();
        setLocations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };
    loadLocations();
  }, []);

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

  useEffect(() => {
    const calculateDeliveryFee = async () => {
      if (!formData.deliveryLocation || !subtotal) {
        setDeliveryFee(0);
        setDeliveryFeeError("");
        return;
      }

      try {
        const res = await fetch(`${API_ORIGIN}/api/delivery-charge/calculate/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: Number(formData.deliveryLocation),
            delivery_type: formData.deliveryType,
            product_total: subtotal,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Delivery charge is not available for this location.");
        }

        setDeliveryFee(Number(data.delivery_charge || 0));
        setDeliveryFeeError("");
      } catch (error) {
        setDeliveryFee(0);
        setDeliveryFeeError(error instanceof Error ? error.message : "Delivery charge is not available.");
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

    if (!formData.email || !formData.phone || !formData.address || !formData.city || !formData.deliveryLocation) {
      alert("Please complete your contact and delivery information.");
      return;
    }

    if (deliveryFeeError) {
      alert(deliveryFeeError);
      return;
    }

    setIsProcessing(true);
    try {
      await Promise.all(
        items.map((item) =>
          fetch(`${API_ORIGIN}/api/warehouse/stock/reduce-by-location/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product: item.id,
              location: Number(formData.deliveryLocation),
              quantity: item.quantity,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error || "Out of Stock in Your Area");
            }
          })
        )
      );

      const orderId = `ORD-${Date.now().toString().slice(-8)}`;
      const orders = JSON.parse(localStorage.getItem("buyer_orders") || "[]");
      localStorage.setItem(
        "buyer_orders",
        JSON.stringify([
          {
            id: orderId,
            items,
            total,
            deliveryFee,
            deliveryType: formData.deliveryType,
            deliveryLocation: selectedLocation
              ? `${selectedLocation.name}, ${selectedLocation.city}`
              : formData.deliveryLocation,
            paymentType: formData.paymentType,
            address: `${formData.address}, ${formData.city}`,
            status: formData.paymentType === "cash_on_delivery" ? "confirmed" : "payment_pending",
            createdAt: new Date().toISOString(),
          },
          ...orders,
        ])
      );
      if (!state.buyNow) clearBuyerCart();
      setIsProcessing(false);
      setSuccessOrder(orderId);
    } catch (error: any) {
      alert(error.message || "Out of Stock in Your Area");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={getBuyerCartCount()} />

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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <section className="bg-white border border-slate-200 rounded-lg p-5">
              <h2 className="text-lg font-black text-slate-900 mb-5">Delivery Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <span className="text-sm font-bold text-slate-700">Delivery Address</span>
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
                    <p className="mt-2 text-xs font-bold text-red-600">{deliveryFeeError}</p>
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
                <h2 className="text-lg font-black text-slate-900 mb-3">Items</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 truncate">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.category || "Product"}</p>
                        {item.locationName && (
                          <p className="text-xs font-bold text-violet-700">
                            Delivery area: {item.locationName}
                          </p>
                        )}
                        <p className="text-sm font-bold text-slate-700">
                          {item.quantity} x {currency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="bg-white border border-slate-200 rounded-lg p-5 h-fit">
              <h2 className="text-lg font-black text-slate-900">Payment Summary</h2>
              <div className="space-y-3 mt-5 text-sm">
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
                className="mt-6 w-full py-3 rounded-lg bg-green-600 text-white font-black hover:bg-green-700 disabled:bg-green-300"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </aside>
          </div>
        )}
      </main>

      {successOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] px-4">
          <div className="bg-white rounded-lg p-8 text-center max-w-md w-full shadow-2xl">
            <div className="text-5xl mb-4">OK</div>
            <h2 className="text-2xl font-black text-green-700">Order Placed Successfully</h2>
            <p className="text-slate-600 mt-2">
              Order ID: <strong>{successOrder}</strong>
            </p>
            <p className="text-sm text-slate-500 mt-2">
              {formData.paymentType === "cash_on_delivery"
                ? "Pay when your order arrives."
                : "Your digital payment is marked as pending for confirmation."}
            </p>
            <button
              onClick={() => navigate("/ordertracking")}
              className="mt-6 px-6 py-3 rounded-lg bg-green-600 text-white font-black"
            >
              Track Order
            </button>
          </div>
        </div>
      )}

      <BuyerFooter />
    </div>
  );
}
