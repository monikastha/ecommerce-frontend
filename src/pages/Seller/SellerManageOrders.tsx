import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type FilterTab = "All Orders" | "Pending" | "Completed";

type OrderItem = {
  id: number;
  product?: number | null;
  product_name?: string;
  selected_size?: string;
  quantity?: number;
  price?: string | number;
  subtotal?: string | number;
};

type Order = {
  id: number;
  order_number: string;
  buyer_username?: string;
  customer_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  payment_type?: string;
  subtotal?: string | number;
  total?: string | number;
  status?: string;
  created_at?: string;
  assigned_deliveryman_detail?: {
    name?: string;
    phone?: string;
  } | null;
  items?: OrderItem[];
};

type Product = {
  id: number;
};

const POLL_INTERVAL_MS = 5000;

export default function SellerManageOrders() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [productIds, setProductIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const sellerId = localStorage.getItem("seller_id");
  const mountedRef = useRef(true);

  const loadOrders = useCallback(async (silent = false) => {
    if (!mountedRef.current) return;
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const productUrl = sellerId
        ? `${API_ORIGIN}/api/products/?seller=${sellerId}`
        : `${API_ORIGIN}/api/products/`;

      const [productRes, orderRes] = await Promise.all([
        fetch(productUrl),
        fetch(`${API_ORIGIN}/api/orders/`),
      ]);

      if (!productRes.ok || !orderRes.ok) {
        throw new Error("Unable to load seller orders or products.");
      }

      const productData = await productRes.json();
      const orderData = await orderRes.json();

      const sellerProducts: Product[] = Array.isArray(productData) ? productData : [];
      const sellerProductIds = new Set(sellerProducts.map((product) => product.id));

      const allOrders: Order[] = Array.isArray(orderData) ? orderData : [];
      const sellerOrders = allOrders.filter((order) =>
        (order.items || []).some((item) => item.product && sellerProductIds.has(item.product))
      );

      setProductIds(sellerProductIds);
      setOrders(sellerOrders);
      setSelectedOrder((current) =>
        current ? sellerOrders.find((order) => order.id === current.id) || null : null
      );
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load seller orders.");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [sellerId]);

  useEffect(() => {
    mountedRef.current = true;

    const initialize = async () => {
      await loadOrders();
    };

    void initialize();

    const refreshTimer = window.setInterval(() => {
      void loadOrders(true);
    }, POLL_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadOrders(true);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mountedRef.current = false;
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loadOrders]);

  const isCompleted = (status?: string) => status === "delivered" || status === "cancelled";
  const isPending = (status?: string) => status !== "delivered" && status !== "cancelled";

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesTab =
        activeTab === "All Orders" ||
        (activeTab === "Pending" && isPending(order.status)) ||
        (activeTab === "Completed" && isCompleted(order.status));

      const matchesSearch =
        !query ||
        String(order.order_number || "").toLowerCase().includes(query) ||
        String(order.customer_name || "").toLowerCase().includes(query) ||
        (order.buyer_username || "").toLowerCase().includes(query) ||
        (order.email || "").toLowerCase().includes(query) ||
        (order.phone || "").toLowerCase().includes(query) ||
        (order.items || [])
          .map((item) => item.product_name || "")
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesTab && matchesSearch;
    }).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }, [activeTab, orders, searchQuery]);

  const updateOrderStatus = async (orderId: number, nextStatus: "confirmed" | "cancelled") => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/${orderId}/set-status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.detail || "Failed to update order status.");
      }
      setOrders((prev) => prev.map((order) => (order.id === orderId ? data : order)));
      setSelectedOrder((prev) => (prev?.id === orderId ? data : prev));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to update order status.");
    }
  };

  const sellerStatusLabel = (status?: string) => {
    if (isCompleted(status)) return "Completed";
    return "Pending";
  };

  const orderStatusLabel = (status?: string) => {
    return (status || "pending").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const currency = (value?: string | number) => `Rs. ${Number(value || 0).toLocaleString()}`;

  const orderProducts = (order: Order) =>
    order.items?.length
      ? order.items
          .map((item) => {
            const size = item.selected_size ? ` (${item.selected_size})` : "";
            return `${item.product_name || "Product"}${size} x${item.quantity || 1}`;
          })
          .join(", ")
      : "No products";

  const pendingCount = orders.filter((order) => isPending(order.status)).length;
  const completedCount = orders.filter((order) => isCompleted(order.status)).length;

  return (
    <div className="flex w-full h-screen bg-gray-100 font-sans text-[13px]">

      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <SellerNavbar />

        {/* Page Content */}
        <div className="p-5">

          {/* Tabs + Search */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">

            {(["All Orders", "Pending", "Completed"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full border text-xs ${
                  activeTab === tab
                    ? "bg-blue-900 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {tab}
                {tab === "Pending" ? ` (${pendingCount})` : tab === "Completed" ? ` (${completedCount})` : ""}
              </button>
            ))}

            <div className="flex-1 flex justify-end items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <span>{refreshing ? "Refreshing..." : "Live refresh"}</span>
                <span className="font-semibold">•</span>
                <span>{lastUpdated ? `Updated at ${lastUpdated}` : "Waiting for first load..."}</span>
              </div>
              <button
                type="button"
                onClick={() => void loadOrders(true)}
                className="bg-blue-900 text-white px-3 py-2 rounded-md text-xs"
              >
                Refresh
              </button>
              <input
                type="text"
                placeholder="Search order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-3 py-2 rounded-md w-64 text-xs"
              />
            </div>

          </div>

          {/* Table */}
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white border rounded-md overflow-hidden">

            <table className="w-full text-xs">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-center">Customer</th>
                  <th className="p-3 text-center">Products</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="p-6 text-center text-gray-500" colSpan={6}>
                      Loading seller orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td className="p-6 text-center text-gray-500" colSpan={6}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const canAccept = order.status === "pending";
                    const canReject = ["pending", "confirmed", "processing"].includes(order.status || "");
                    return (
                      <tr key={order.id} className="border-t">
                        <td className="p-3">
                          <strong>{order.order_number || `#${order.id}`}</strong>
                          <div className="text-[11px] text-gray-500">#{order.id}</div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="font-semibold">{order.customer_name || "Customer"}</div>
                          <div className="text-[11px] text-gray-500">{order.phone || order.email || "-"}</div>
                        </td>
                        <td className="p-3 text-center max-w-[260px] truncate">{orderProducts(order)}</td>
                        <td className="p-3 text-center font-semibold">{currency(order.total)}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                              isCompleted(order.status)
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                            title={`Order status: ${orderStatusLabel(order.status)}`}
                          >
                            {sellerStatusLabel(order.status)}
                          </span>
                          <div className="mt-1 text-[11px] text-gray-500">{orderStatusLabel(order.status)}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2 flex-wrap">
                            <button
                              className="bg-blue-900 text-white px-3 py-1 rounded text-xs"
                              onClick={() => setSelectedOrder(order)}
                            >
                              Details
                            </button>
                            <button
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs disabled:cursor-not-allowed disabled:bg-gray-300"
                              disabled={!canAccept}
                              onClick={() => void updateOrderStatus(order.id, "confirmed")}
                            >
                              Accept
                            </button>
                            <button
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs disabled:cursor-not-allowed disabled:bg-gray-300"
                              disabled={!canReject}
                              onClick={() => void updateOrderStatus(order.id, "cancelled")}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <button className="bg-blue-900 text-white px-4 py-2 rounded text-xs" disabled>
              Previous
            </button>
            <button className="bg-blue-900 text-white px-4 py-2 rounded text-xs" disabled>
              Next
            </button>
          </div>

        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-md bg-white shadow-xl">
            <div className="flex items-start justify-between border-b p-4">
              <div>
                <h2 className="text-base font-bold">Order {selectedOrder.order_number}</h2>
                <p className="text-xs text-gray-500">
                  {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : ""}
                </p>
              </div>
              <button
                className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-700"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-bold">Customer</h3>
                <div className="space-y-1 text-xs text-gray-700">
                  <p><strong>Name:</strong> {selectedOrder.customer_name || "-"}</p>
                  <p><strong>Email:</strong> {selectedOrder.email || "-"}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone || "-"}</p>
                  <p><strong>Address:</strong> {selectedOrder.address || "-"}{selectedOrder.city ? `, ${selectedOrder.city}` : ""}</p>
                  <p><strong>Postal Code:</strong> {selectedOrder.postal_code || "-"}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-bold">Tracking</h3>
                <div className="space-y-1 text-xs text-gray-700">
                  <p><strong>Seller Status:</strong> {sellerStatusLabel(selectedOrder.status)}</p>
                  <p><strong>Order Status:</strong> {orderStatusLabel(selectedOrder.status)}</p>
                  <p><strong>Payment:</strong> {orderStatusLabel(selectedOrder.payment_type)}</p>
                  <p><strong>Deliveryman:</strong> {selectedOrder.assigned_deliveryman_detail?.name || "Not assigned"}</p>
                  <p><strong>Delivery Phone:</strong> {selectedOrder.assigned_deliveryman_detail?.phone || "-"}</p>
                </div>
              </div>
            </div>

            <div className="border-t p-4">
              <h3 className="mb-2 text-sm font-bold">Items</h3>
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-center">Price</th>
                      <th className="p-2 text-center">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).filter((item) => item.product && productIds.has(item.product)).map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2">{item.product_name || "Product"}</td>
                        <td className="p-2 text-center">{item.quantity || 1}</td>
                        <td className="p-2 text-center">{currency(item.price)}</td>
                        <td className="p-2 text-center">{currency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-right text-sm font-bold">Total: {currency(selectedOrder.total)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
