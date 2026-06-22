/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BuyerNavbar from "../../../components/BuyerNavbar2";   // Updated to match Checkout
import BuyerFooter from "../../../components/BuyerFooter";
import { getBuyerCartCount } from "../../../utils/buyerCart";

type OrderItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type PaymentState = {
  orderId: string;
  amount: number;
  items: OrderItem[];
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
};

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state as PaymentState;

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!orderData?.orderId || !orderData?.items?.length) {
      navigate("/checkout");
    }
  }, [orderData, navigate]);

  const handleKhaltiPayment = async () => {
    if (!orderData) return;

    setIsProcessing(true);
    sessionStorage.setItem("pending_khalti_payment", JSON.stringify(orderData));

    try {
      const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${API_ORIGIN}/api/initiate-khalti/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          amount: orderData.amount,
          productName: orderData.items.length === 1
            ? orderData.items[0].name
            : `${orderData.items.length} items`,
          customerName: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate Khalti payment");
      }

      if (!data.paymentUrl) {
        throw new Error("Khalti did not return a payment URL.");
      }

      window.location.href = data.paymentUrl;

    } catch (error: any) {
      alert(error.message || "Payment initiation failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleTestPaymentSuccess = () => {
    if (!orderData) return;

    sessionStorage.setItem("pending_khalti_payment", JSON.stringify(orderData));
    navigate(`/payment-success?orderId=${encodeURIComponent(orderData.orderId)}&refId=LOCAL-TEST`);
  };

  if (!orderData) {
    return <div>Loading payment details...</div>;
  }

  const totalAmount = orderData.amount;

  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={getBuyerCartCount()} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Complete Your Payment</h1>
          <p className="text-slate-600 mt-1">Order ID: <span className="font-mono font-bold">{orderData.orderId}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-6">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 leading-tight">{item.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-lg font-bold text-slate-900 mt-2">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="font-bold mb-3">Delivery Details</h3>
              <p><strong>Name:</strong> {orderData.customerName}</p>
              <p><strong>Email:</strong> {orderData.email}</p>
              {orderData.phone && <p><strong>Phone:</strong> {orderData.phone}</p>}
              {orderData.address && <p><strong>Address:</strong> {orderData.address}</p>}
            </div>
          </div>

          
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Payment Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-slate-600">Total Amount</span>
                  <span className="font-bold text-2xl">Rs. {totalAmount.toLocaleString()}</span>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={handleKhaltiPayment}
                    disabled={isProcessing}
                    className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        Pay with <span className="font-black">Khalti</span>
                      </>
                    )}
                  </button>

                  {import.meta.env.VITE_ENABLE_KHALTI_SIMULATOR === "true" && (
                    <button
                      type="button"
                      onClick={handleTestPaymentSuccess}
                      disabled={isProcessing}
                      className="mt-3 w-full border border-slate-300 bg-white hover:bg-slate-50 disabled:bg-gray-100 text-slate-800 font-bold py-3 rounded-xl text-sm transition-all duration-200"
                    >
                      Simulate Successful Payment
                    </button>
                  )}
                </div>

                <p className="text-center text-xs text-slate-500 mt-4">
                  Secure payment powered by Khalti
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BuyerFooter />
    </div>
  );
}
