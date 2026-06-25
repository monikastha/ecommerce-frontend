import React, { useEffect, useMemo, useState } from "react";
import {
  FaBan,
  FaBoxOpen,
  FaCheck,
  FaCogs,
  FaClock,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaListUl,
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingBag,
  FaSyncAlt,
  FaTimes,
  FaTruck,
  FaUserCheck,
} from "react-icons/fa";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type OrderItem = {
  id: number;
  product_name: string;
  product_category?: string;
  product_image?: string;
  selected_size?: string;
  quantity: number;
  price: string | number;
  subtotal: string | number;
};

type Deliveryman = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  profile_image?: string | null;
};

export type OrderRecord = {
  id: number;
  order_number: string;
  buyer_username?: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  delivery_location_name?: string;
  delivery_type: string;
  delivery_fee: string | number;
  payment_type: string;
  subtotal: string | number;
  total: string | number;
  status: string;
  notes?: string;
  assigned_deliveryman?: number | null;
  assigned_deliveryman_detail?: Deliveryman | null;
  created_at: string;
  items: OrderItem[];
};

type Props = {
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
  title?: string;
  subtitle?: string;
  emergencyOnly?: boolean;
};

const currency = (value?: string | number) =>
  `Rs. ${Number(value || 0).toLocaleString()}`;

const paymentLabel = (paymentType?: string) => {
  if (paymentType === "cash_on_delivery") return "Cash on Delivery";
  if (paymentType === "khalti") return "Khalti";
  return paymentType || "-";
};

const statusLabel = (status?: string) => (status || "pending").replace(/_/g, " ");

const canAssignDelivery = (status?: string) => ["ready_for_delivery", "delivery_rejected", "processing"].includes(status || "");
const canCancelOrder = (status?: string) =>
  ["pending", "seller_accepted", "preparing", "warehouse_processing", "ready_for_delivery", "delivery_assigned"].includes(status || "");

const orderProducts = (order: OrderRecord) =>
  order.items?.length
    ? order.items
        .map((item) => {
          const size = item.selected_size ? ` (${item.selected_size})` : "";
          return `${item.product_name || "Product"}${size} x${item.quantity || 1}`;
        })
        .join(", ")
    : "No products";

const imageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

const matchesLocation = (deliveryman: Deliveryman, order: OrderRecord) => {
  const haystack = deliveryman.address.toLowerCase();
  return [order.city, order.delivery_location_name, order.address]
    .filter(Boolean)
    .some((value) => haystack.includes(String(value).toLowerCase()));
};

const OrderManagementView: React.FC<Props> = ({
  sidebar,
  navbar,
  title = "Order Management",
  subtitle = "View buyer payment details, product costs, and assign delivery staff",
  emergencyOnly = false,
}) => {
  const [search, setSearch] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState<"all" | "normal" | "emergency">(
    emergencyOnly ? "emergency" : "all"
  );
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [deliverymen, setDeliverymen] = useState<Deliveryman[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewOrder, setViewOrder] = useState<OrderRecord | null>(null);
  const [assignOrder, setAssignOrder] = useState<OrderRecord | null>(null);
  const [assigningId, setAssigningId] = useState<number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDeliverymen = async () => {
    setDeliveryLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/api/deliveryman/delivery/`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load deliverymen");
      setDeliverymen(Array.isArray(data) ? data : []);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load deliverymen");
      setDeliverymen([]);
    } finally {
      setDeliveryLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
    void loadDeliverymen();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    const base = emergencyOnly
      ? orders.filter((order) => order.delivery_type === "emergency")
      : deliveryFilter === "all"
      ? orders
      : orders.filter((order) => order.delivery_type === deliveryFilter);

    const sorted = [...base].sort((a, b) => {
      if (a.delivery_type !== b.delivery_type) return a.delivery_type === "emergency" ? -1 : 1;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    if (!query) return sorted;

    return sorted.filter((order) =>
      [
        order.order_number,
        order.buyer_username,
        order.customer_name,
        order.email,
        order.phone,
        order.address,
        order.city,
        order.delivery_type,
        order.payment_type,
        order.status,
        order.assigned_deliveryman_detail?.name,
        orderProducts(order),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [deliveryFilter, emergencyOnly, orders, search]);

  const orderStats = useMemo(() => {
    const activeStatuses = [
      "seller_accepted",
      "preparing",
      "warehouse_processing",
      "ready_for_delivery",
      "delivery_assigned",
      "delivery_accepted",
      "picked_up",
      "out_for_delivery",
      "processing",
      "shipped",
    ];
    const emergency = orders.filter((order) => order.delivery_type === "emergency");
    return {
      total: orders.length,
      pending: orders.filter((order) => ["pending", "seller_accepted", "preparing"].includes(order.status)).length,
      active: orders.filter((order) => activeStatuses.includes(order.status)).length,
      delivered: orders.filter((order) => order.status === "delivered").length,
      normal: orders.filter((order) => order.delivery_type === "normal").length,
      emergency: emergency.length,
      emergencyOpen: emergency.filter((order) => order.status !== "delivered" && order.status !== "cancelled").length,
      emergencyDelivered: emergency.filter((order) => order.status === "delivered").length,
    };
  }, [orders]);

  const latestEmergency = useMemo(
    () => filteredOrders.find((order) => order.delivery_type === "emergency" && order.status !== "delivered" && order.status !== "cancelled"),
    [filteredOrders]
  );

  const updateStatus = async (orderId: number, nextStatus: string) => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/${orderId}/set-status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");
      setOrders((prev) => prev.map((order) => (order.id === orderId ? data : order)));
      setViewOrder((prev) => (prev?.id === orderId ? data : prev));
      setAssignOrder((prev) => (prev?.id === orderId ? data : prev));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update order");
    }
  };

  const assignDeliveryman = async (deliverymanId: number) => {
    if (!assignOrder) return;
    setAssigningId(deliverymanId);
    try {
      const res = await fetch(`${API_ORIGIN}/api/orders/${assignOrder.id}/assign-deliveryman/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryman_id: deliverymanId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign deliveryman");
      setOrders((prev) => prev.map((order) => (order.id === assignOrder.id ? data : order)));
      setAssignOrder(null);
      setViewOrder((prev) => (prev?.id === assignOrder.id ? data : prev));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign deliveryman");
    } finally {
      setAssigningId(null);
    }
  };

  const rankedDeliverymen = useMemo(() => {
    if (!assignOrder) return deliverymen;
    return [...deliverymen].sort((a, b) => Number(matchesLocation(b, assignOrder)) - Number(matchesLocation(a, assignOrder)));
  }, [assignOrder, deliverymen]);

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif;}
        body{background:#f8fafc;}
        .omWrapper{min-height:100vh;background:#f8fafc;}
        .omMain{margin-left:250px;width:calc(100% - 250px);min-height:100vh;display:flex;flex-direction:column;background:#f8fafc;}
        .omContainer{padding:28px;}
        .omHeader{display:flex;justify-content:space-between;align-items:center;background:#fff;padding:22px;border-radius:10px;box-shadow:0 8px 20px rgba(15,23,42,0.06);margin-bottom:22px;flex-wrap:wrap;gap:15px;}
        .omTitleSection{display:flex;align-items:center;gap:14px;}
        .omHeaderIcon{width:52px;height:52px;background:${emergencyOnly ? "#dc2626" : "#2563eb"};color:#fff;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:20px;}
        .omTitle{font-size:23px;font-weight:700;color:#0f172a;}
        .omSubtitle{font-size:13px;color:#64748b;margin-top:3px;}
        .omActions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end;}
        .filterTabs{display:flex;align-items:center;gap:6px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:4px;}
        .filterBtn{border:none;border-radius:6px;background:transparent;color:#475569;padding:8px 11px;font-size:12px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}
        .filterBtn.active{background:#fff;color:#2563eb;box-shadow:0 1px 4px rgba(15,23,42,0.12);}
        .filterBtn.normalFilter.active{color:#16a34a;}
        .filterBtn.emergencyFilter.active{color:#dc2626;}
        .search{width:280px;padding:10px 14px;border-radius:8px;border:1px solid #d1d5db;outline:none;font-size:13px;}
        .search:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.15);}
        .reload{width:38px;height:38px;border:none;border-radius:8px;background:#2563eb;color:white;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;}
        .statsGrid{display:grid;grid-template-columns:repeat(${emergencyOnly ? 4 : 6},minmax(140px,1fr));gap:14px;margin-bottom:18px;}
        .statCard{
          position:relative;
          border:1px solid #e2e8f0;
          background:#fff;
          border-radius:8px;
          padding:16px;
          min-height:118px;
          overflow:hidden;
          text-align:left;
          box-shadow:0 10px 26px rgba(15,23,42,0.07);
          transition:transform 0.2s ease,box-shadow 0.2s ease,border-color 0.2s ease;
        }
        .statCard.clickable{cursor:pointer;}
        .statCard:hover{transform:translateY(-3px);box-shadow:0 16px 34px rgba(15,23,42,0.11);border-color:currentColor;}
        .statCard::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:currentColor;}
        .statCard::after{content:"";position:absolute;right:-30px;top:-30px;width:92px;height:92px;border-radius:999px;opacity:0.1;background:currentColor;}
        .statTop{display:flex;align-items:center;justify-content:space-between;gap:10px;position:relative;z-index:1;}
        .statIcon{width:42px;height:42px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;background:currentColor;box-shadow:0 10px 20px rgba(15,23,42,0.12);}
        .statLabel{font-size:12px;color:#64748b;font-weight:800;text-transform:uppercase;letter-spacing:0;}
        .statValue{font-size:29px;line-height:1;font-weight:900;color:#0f172a;margin-top:16px;position:relative;z-index:1;}
        .statHint{font-size:12px;color:#64748b;margin-top:8px;font-weight:700;position:relative;z-index:1;}
        .statTotal{color:#2563eb;}
        .statPending{color:#d97706;}
        .statActive{color:#7c3aed;}
        .statDelivered{color:#16a34a;}
        .statNormal{color:#0f766e;}
        .statEmergency{color:#dc2626;}
        .urgentBox{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px;padding:18px;border-radius:10px;border:1px solid #fecaca;background:#fff1f2;color:#991b1b;}
        .urgentBox strong{display:block;color:#7f1d1d;font-size:16px;margin-bottom:5px;}
        .urgentBox p{font-size:13px;color:#991b1b;line-height:1.5;}
        .tableBox{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 8px 20px rgba(15,23,42,0.06);}
        table{width:100%;border-collapse:collapse;}
        th{background:#f8fafc;padding:14px;text-align:left;font-size:12px;color:#475569;font-weight:700;white-space:nowrap;}
        td{padding:14px;border-top:1px solid #f1f5f9;font-size:13px;color:#334155;vertical-align:top;}
        tr:hover{background:#f9fafb;}
        .muted{color:#64748b;font-size:12px;margin-top:4px;line-height:1.5;}
        .delivery,.status{display:inline-flex;padding:6px 10px;border-radius:999px;font-size:11px;font-weight:800;text-transform:capitalize;}
        .emergency{background:#fee2e2;color:#dc2626;}
        .normal{background:#dcfce7;color:#16a34a;}
        .pending{background:#fef3c7;color:#d97706;}
        .confirmed{background:#dbeafe;color:#1d4ed8;}
        .processing,.out_for_delivery,.shipped{background:#fef3c7;color:#b45309;}
        .cancelled{background:#fee2e2;color:#dc2626;}
        .delivered,.completed{background:#dcfce7;color:#16a34a;}
        .assigned{display:flex;align-items:center;gap:7px;color:#166534;font-weight:700;margin-top:7px;}
        .actionBtns{display:grid;grid-template-columns:repeat(5,34px);gap:7px;min-width:198px;}
        .btn{width:34px;height:34px;border:none;padding:0;border-radius:8px;font-size:13px;cursor:pointer;font-weight:700;display:inline-flex;align-items:center;justify-content:center;}
        .btn:hover,.reload:hover,.filterBtn:hover{filter:brightness(0.96);}
        .view{background:#0f172a;color:#fff;}
        .assign{background:#7c3aed;color:#fff;}
        .process{background:#16a34a;color:#fff;}
        .complete{background:#2563eb;color:#fff;}
        .cancel{background:#dc2626;color:#fff;}
        .empty{text-align:center;padding:40px;color:#94a3b8;font-size:13px;}
        .error{margin-bottom:16px;border:1px solid #fecaca;background:#fef2f2;color:#b91c1c;padding:12px;border-radius:8px;font-size:13px;font-weight:700;}
        .modalOverlay{position:fixed;inset:0;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:22px;z-index:1100;}
        .modal{width:min(960px,100%);max-height:88vh;overflow:auto;background:#fff;border-radius:10px;box-shadow:0 24px 70px rgba(15,23,42,0.24);}
        .modalHead{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:20px 22px;border-bottom:1px solid #e2e8f0;}
        .modalTitle{font-size:20px;font-weight:800;color:#0f172a;}
        .closeBtn{width:36px;height:36px;border:none;border-radius:8px;background:#f1f5f9;color:#0f172a;display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .modalBody{padding:22px;}
        .detailGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:18px;}
        .infoBlock{border:1px solid #e2e8f0;border-radius:8px;padding:13px;background:#fff;}
        .infoLabel{font-size:11px;text-transform:uppercase;color:#64748b;font-weight:800;margin-bottom:6px;}
        .infoValue{font-size:13px;color:#0f172a;font-weight:700;line-height:1.45;word-break:break-word;}
        .sectionTitle{font-size:15px;font-weight:800;color:#0f172a;margin:18px 0 10px;}
        .itemsList{display:grid;gap:10px;}
        .itemRow{display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;border:1px solid #e2e8f0;border-radius:8px;padding:10px;background:#fff;}
        .itemImg{width:56px;height:56px;border-radius:8px;object-fit:cover;background:#f1f5f9;}
        .totals{display:grid;gap:8px;margin-top:14px;margin-left:auto;max-width:340px;}
        .totalRow{display:flex;justify-content:space-between;font-size:13px;color:#334155;}
        .totalRow strong{font-size:16px;color:#0f172a;}
        .deliveryGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;}
        .deliveryCard{border:1px solid #e2e8f0;background:#fff;border-radius:8px;padding:14px;text-align:left;cursor:pointer;transition:0.2s;display:flex;gap:12px;align-items:flex-start;}
        .deliveryCard:hover{border-color:#7c3aed;box-shadow:0 12px 24px rgba(124,58,237,0.12);transform:translateY(-1px);}
        .deliveryCard.active{border-color:#16a34a;background:#f0fdf4;}
        .deliveryCard.nearby{border-color:#dc2626;background:#fff7ed;}
        .nearbyBadge{display:inline-flex;margin-top:7px;padding:4px 7px;border-radius:999px;background:#fee2e2;color:#b91c1c;font-size:10px;font-weight:900;}
        .avatar{width:48px;height:48px;border-radius:8px;background:#e0e7ff;color:#3730a3;display:flex;align-items:center;justify-content:center;font-weight:900;overflow:hidden;flex:none;}
        .avatar img{width:100%;height:100%;object-fit:cover;}
        .cardName{font-size:14px;font-weight:800;color:#0f172a;}
        .cardLine{font-size:12px;color:#64748b;margin-top:4px;display:flex;gap:6px;align-items:center;}
        .assigning{opacity:0.65;pointer-events:none;}
        @media(max-width:1100px){
          .tableBox{overflow-x:auto;}
          table{min-width:1250px;}
          .search{width:100%;}
          .omActions{width:100%;}
          .filterTabs{width:100%;justify-content:space-between;}
          .statsGrid{grid-template-columns:repeat(2,minmax(0,1fr));}
          .detailGrid{grid-template-columns:1fr 1fr;}
        }
        @media(max-width:760px){
          .omMain{margin-left:0;width:100%;}
          .omContainer{padding:16px;}
          .statsGrid{grid-template-columns:1fr;}
          .detailGrid{grid-template-columns:1fr;}
          .itemRow{grid-template-columns:48px 1fr;}
          .itemRow>strong{grid-column:1 / -1;}
        }
      `}</style>

      <div className="omWrapper">
        {sidebar}
        <div className="omMain">
          {navbar}
          <div className="omContainer">
            <div className="omHeader">
              <div className="omTitleSection">
                <div className="omHeaderIcon">
                  {emergencyOnly ? <FaExclamationTriangle /> : <FaShoppingBag />}
                </div>
                <div>
                  <h2 className="omTitle">{title}</h2>
                  <p className="omSubtitle">{subtitle}</p>
                </div>
              </div>

              <div className="omActions">
                {!emergencyOnly && (
                  <div className="filterTabs" aria-label="Filter orders by delivery type">
                    <button type="button" className={`filterBtn ${deliveryFilter === "all" ? "active" : ""}`} onClick={() => setDeliveryFilter("all")}>
                      <FaListUl /> All Orders
                    </button>
                    <button type="button" className={`filterBtn normalFilter ${deliveryFilter === "normal" ? "active" : ""}`} onClick={() => setDeliveryFilter("normal")}>
                      <FaTruck /> Normal
                    </button>
                    <button type="button" className={`filterBtn emergencyFilter ${deliveryFilter === "emergency" ? "active" : ""}`} onClick={() => setDeliveryFilter("emergency")}>
                      <FaTruck /> Emergency
                    </button>
                  </div>
                )}
                <input type="text" placeholder="Search orders, buyer, product..." className="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button className="reload" onClick={loadOrders} title="Refresh orders" aria-label="Refresh orders">
                  <FaSyncAlt />
                </button>
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            {emergencyOnly && latestEmergency && (
              <div className="urgentBox">
                <div>
                  <strong>Immediate emergency notification: {latestEmergency.order_number}</strong>
                  <p>{latestEmergency.customer_name || "Buyer"} needs urgent delivery for {orderProducts(latestEmergency)}. Assign a nearby deliveryman and process this order first.</p>
                </div>
                {canAssignDelivery(latestEmergency.status) ? (
                  <button className="btn assign" onClick={() => setAssignOrder(latestEmergency)} title="Assign deliveryman" aria-label="Assign deliveryman">
                    <FaTruck />
                  </button>
                ) : (
                  <strong>Waiting for seller or warehouse</strong>
                )}
              </div>
            )}

            <div className="statsGrid">
              {!emergencyOnly ? (
                <>
                  <button type="button" className="statCard statTotal clickable" onClick={() => setDeliveryFilter("all")}>
                    <div className="statTop"><span className="statLabel">Total Orders</span><span className="statIcon"><FaShoppingBag /></span></div>
                    <div className="statValue">{orderStats.total}</div>
                    <div className="statHint">All buyer orders</div>
                  </button>
                  <div className="statCard statPending">
                    <div className="statTop"><span className="statLabel">Pending</span><span className="statIcon"><FaClock /></span></div>
                    <div className="statValue">{orderStats.pending}</div>
                    <div className="statHint">Seller queue</div>
                  </div>
                  <div className="statCard statActive">
                    <div className="statTop"><span className="statLabel">Processing</span><span className="statIcon"><FaCogs /></span></div>
                    <div className="statValue">{orderStats.active}</div>
                    <div className="statHint">In progress</div>
                  </div>
                  <div className="statCard statDelivered">
                    <div className="statTop"><span className="statLabel">Delivered</span><span className="statIcon"><FaCheck /></span></div>
                    <div className="statValue">{orderStats.delivered}</div>
                    <div className="statHint">Completed orders</div>
                  </div>
                  <button type="button" className="statCard statNormal clickable" onClick={() => setDeliveryFilter("normal")}>
                    <div className="statTop"><span className="statLabel">Normal</span><span className="statIcon"><FaBoxOpen /></span></div>
                    <div className="statValue">{orderStats.normal}</div>
                    <div className="statHint">Normal delivery</div>
                  </button>
                  <button type="button" className="statCard statEmergency clickable" onClick={() => setDeliveryFilter("emergency")}>
                    <div className="statTop"><span className="statLabel">Emergency</span><span className="statIcon"><FaTruck /></span></div>
                    <div className="statValue">{orderStats.emergency}</div>
                    <div className="statHint">Fast delivery</div>
                  </button>
                </>
              ) : (
                <>
                  <div className="statCard statEmergency">
                    <div className="statTop"><span className="statLabel">Emergency Orders</span><span className="statIcon"><FaTruck /></span></div>
                    <div className="statValue">{orderStats.emergency}</div>
                    <div className="statHint">Buyer urgent orders</div>
                  </div>
                  <div className="statCard statPending">
                    <div className="statTop"><span className="statLabel">Need Action</span><span className="statIcon"><FaClock /></span></div>
                    <div className="statValue">{orderStats.emergencyOpen}</div>
                    <div className="statHint">Prioritize now</div>
                  </div>
                  <div className="statCard statDelivered">
                    <div className="statTop"><span className="statLabel">Delivered</span><span className="statIcon"><FaCheck /></span></div>
                    <div className="statValue">{orderStats.emergencyDelivered}</div>
                    <div className="statHint">Delivered emergency orders</div>
                  </div>
                  <div className="statCard statActive">
                    <div className="statTop"><span className="statLabel">Delivery Staff</span><span className="statIcon"><FaUserCheck /></span></div>
                    <div className="statValue">{deliverymen.length}</div>
                    <div className="statHint">Available for assignment</div>
                  </div>
                </>
              )}
            </div>

            <div className="tableBox">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Buyer</th>
                    <th>Products</th>
                    <th>Delivery</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} className="empty">Loading orders...</td></tr>
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                      const deliveryClass = order.delivery_type === "emergency" ? "emergency" : "normal";
                      const assigned = order.assigned_deliveryman_detail;
                      return (
                        <tr key={order.id}>
                          <td>
                            <strong>{order.order_number}</strong>
                            {order.postal_code && <div className="muted">Postal: {order.postal_code}</div>}
                          </td>
                          <td>
                            <strong>{order.customer_name || "Buyer"}</strong>
                            <div className="muted">{order.phone || "-"}</div>
                            <div className="muted">{order.email || "-"}</div>
                          </td>
                          <td>
                            <strong>{orderProducts(order)}</strong>
                            <div className="muted">{order.address || "-"}{order.city ? `, ${order.city}` : ""}</div>
                          </td>
                          <td>
                            <span className={`delivery ${deliveryClass}`}>{order.delivery_type || "normal"}</span>
                            <div className="muted">{order.delivery_location_name || "-"}</div>
                            <div className="muted">Fee: {currency(order.delivery_fee)}</div>
                            {assigned && <div className="assigned"><FaUserCheck size={12} /> {assigned.name}</div>}
                          </td>
                          <td>{paymentLabel(order.payment_type)}</td>
                          <td>
                            <strong>{currency(order.total)}</strong>
                            <div className="muted">Items: {currency(order.subtotal)}</div>
                          </td>
                          <td><span className={`status ${order.status}`}>{statusLabel(order.status)}</span></td>
                          <td>{order.created_at ? new Date(order.created_at).toLocaleString() : "-"}</td>
                          <td>
                            <div className="actionBtns">
                              <button className="btn view" onClick={() => setViewOrder(order)} title="View order details" aria-label="View order details"><FaEye /></button>
                              {canAssignDelivery(order.status) && (
                                <button className="btn assign" onClick={() => setAssignOrder(order)} title="Assign deliveryman" aria-label="Assign deliveryman"><FaTruck /></button>
                              )}
                              {canCancelOrder(order.status) && (
                                <button className="btn cancel" onClick={() => updateStatus(order.id, "cancelled")} title="Cancel order" aria-label="Cancel order"><FaBan /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={9} className="empty">{emergencyOnly ? "No emergency fast delivery orders found." : "No buyer orders found yet."}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {viewOrder && (
        <div className="modalOverlay" onClick={() => setViewOrder(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modalHead">
              <div>
                <div className="modalTitle">Order {viewOrder.order_number}</div>
                <p className="omSubtitle">All buyer, payment, delivery, and product cost details</p>
              </div>
              <button className="closeBtn" onClick={() => setViewOrder(null)}><FaTimes /></button>
            </div>
            <div className="modalBody">
              <div className="detailGrid">
                <div className="infoBlock"><div className="infoLabel">Customer</div><div className="infoValue">{viewOrder.customer_name}</div><div className="muted">{viewOrder.buyer_username || "Buyer account"}</div></div>
                <div className="infoBlock"><div className="infoLabel">Contact</div><div className="infoValue"><FaPhone size={11} /> {viewOrder.phone || "-"}</div><div className="muted"><FaEnvelope size={11} /> {viewOrder.email || "-"}</div></div>
                <div className="infoBlock"><div className="infoLabel">Buyer Address</div><div className="infoValue"><FaMapMarkerAlt size={11} /> {viewOrder.address}</div><div className="muted">{viewOrder.city || "-"} | Postal: {viewOrder.postal_code || "-"}</div></div>
                <div className="infoBlock"><div className="infoLabel">Delivery</div><div className="infoValue">{viewOrder.delivery_type || "normal"}</div><div className="muted">{viewOrder.delivery_location_name || "-"}</div></div>
                <div className="infoBlock"><div className="infoLabel">Payment</div><div className="infoValue">{paymentLabel(viewOrder.payment_type)}</div><div className="muted">Status: {statusLabel(viewOrder.status)}</div></div>
                <div className="infoBlock"><div className="infoLabel">Assigned Deliveryman</div><div className="infoValue">{viewOrder.assigned_deliveryman_detail?.name || "Not assigned"}</div><div className="muted">{viewOrder.assigned_deliveryman_detail?.phone || ""}</div></div>
              </div>

              {viewOrder.notes && <div className="infoBlock"><div className="infoLabel">Order Note</div><div className="infoValue">{viewOrder.notes}</div></div>}

              <div className="sectionTitle">Products And Cost</div>
              <div className="itemsList">
                {viewOrder.items?.map((item) => (
                  <div className="itemRow" key={item.id}>
                    {item.product_image ? <img className="itemImg" src={imageUrl(item.product_image)} alt={item.product_name} /> : <div className="itemImg" />}
                    <div>
                      <strong>{item.product_name}</strong>
                      <div className="muted">{item.product_category || "Product"} | Qty: {item.quantity}</div>
                      {item.selected_size && <div className="muted">Size: {item.selected_size}</div>}
                      <div className="muted">Unit price: {currency(item.price)}</div>
                    </div>
                    <strong>{currency(item.subtotal)}</strong>
                  </div>
                ))}
              </div>

              <div className="totals">
                <div className="totalRow"><span>Product subtotal</span><strong>{currency(viewOrder.subtotal)}</strong></div>
                <div className="totalRow"><span>Delivery fee</span><strong>{currency(viewOrder.delivery_fee)}</strong></div>
                <div className="totalRow"><span>Grand total</span><strong>{currency(viewOrder.total)}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {assignOrder && (
        <div className="modalOverlay" onClick={() => setAssignOrder(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modalHead">
              <div>
                <div className="modalTitle">Assign Deliveryman</div>
                <p className="omSubtitle">{assignOrder.order_number} | {assignOrder.customer_name} | {currency(assignOrder.total)}</p>
              </div>
              <button className="closeBtn" onClick={() => setAssignOrder(null)}><FaTimes /></button>
            </div>
            <div className="modalBody">
              {deliveryLoading ? (
                <div className="empty">Loading delivery staff...</div>
              ) : rankedDeliverymen.length ? (
                <div className="deliveryGrid">
                  {rankedDeliverymen.map((deliveryman) => {
                    const isAssigned = assignOrder.assigned_deliveryman === deliveryman.id;
                    const isNearby = matchesLocation(deliveryman, assignOrder);
                    const initials = (deliveryman.name || deliveryman.username || "D").slice(0, 2).toUpperCase();
                    return (
                      <button
                        type="button"
                        key={deliveryman.id}
                        className={`deliveryCard ${isAssigned ? "active" : ""} ${isNearby ? "nearby" : ""} ${assigningId === deliveryman.id ? "assigning" : ""}`}
                        onClick={() => assignDeliveryman(deliveryman.id)}
                      >
                        <span className="avatar">{deliveryman.profile_image ? <img src={imageUrl(deliveryman.profile_image)} alt={deliveryman.name} /> : initials}</span>
                        <span>
                          <span className="cardName">{deliveryman.name}</span>
                          <span className="cardLine">@{deliveryman.username}</span>
                          <span className="cardLine"><FaPhone size={10} /> {deliveryman.phone || "No phone"}</span>
                          <span className="cardLine"><FaEnvelope size={10} /> {deliveryman.email || "No email"}</span>
                          <span className="cardLine"><FaMapMarkerAlt size={10} /> {deliveryman.address || "No address"}</span>
                          {isNearby && <span className="nearbyBadge">Nearest match</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="empty">No delivery staff found. Add delivery staff first.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderManagementView;
