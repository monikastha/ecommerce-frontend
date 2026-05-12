import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    label: "Orders Tracking",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a3 3 0 110 6 3 3 0 010-6zm6 14H6v-.6c0-2 4-3.1 6-3.1s6 1.1 6 3.1V20z" />
      </svg>
    ),
  },
  {
    label: "Earnings",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    ),
  },
  {
    label: "Logout",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
      </svg>
    ),
  },
];

const activeDeliveries = [
  {
    id: "#1234",
    customer: "Ram Kumar",
    pickup: "Warehouse A, LaganKhel",
    drop: "Newoad, Kathmandu",
    eta: "12:15 PM",
    status: "In Transit",
    statusColor: "bg-orange-200 text-orange-700",
  },
  {
    id: "#1235",
    customer: "Sita Magar",
    pickup: "Store B, Patan",
    drop: "Thamel, Kathmandu",
    eta: "01:05 PM",
    status: "Picked Up",
    statusColor: "bg-green-200 text-green-700",
  },
];

const completedOrders = [
  {
    id: "#124",
    customer: "Kamala Stha",
    address: "Boudha, Kathmandu",
    amount: "Rs. 250",
    completedAt: "11:20 AM",
  },
  {
    id: "#1231",
    customer: "Princy Bhusal",
    address: "Pulchowk, Lalitpur",
    amount: "Rs. 180",
    completedAt: "10:05 AM",
  },
  {
    id: "#1228",
    customer: "Hari Thapa",
    address: "Baneshwor, Kathmandu",
    amount: "Rs. 320",
    completedAt: "09:30 AM",
  },
];

const OrdersTracking = () => {
  const [activeNav, setActiveNav] = useState("Orders Tracking");

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">

      {/* SIDEBAR - always visible */}
      <aside className="w-56 bg-slate-400 flex flex-col flex-shrink-0 h-full">

        {/* Logo */}
        <div className="flex flex-col items-center py-5 px-4 border-b border-slate-500">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-2">
            🛒
          </div>
          <p className="text-blue-900 font-bold text-sm tracking-wide">SAJILO MART</p>
          <p className="text-slate-600 text-xs tracking-widest">SHOP ANYTIME ANYWHERE</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`flex items-center gap-3 w-full px-5 py-3 text-sm text-left transition-colors ${
                activeNav === item.label
                  ? "bg-red-600 text-white font-semibold"
                  : "text-slate-700 hover:bg-slate-500 hover:text-white font-medium"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile */}
        <div className="flex items-center gap-3 px-4 py-4 border-t border-slate-500">
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-lg flex-shrink-0">
            👤
          </div>
          <div className="overflow-hidden">
            <p className="text-blue-900 font-semibold text-xs truncate">Profile Name</p>
            <p className="text-slate-600 text-xs truncate">example@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm flex-shrink-0">
          <p className="text-lg font-semibold text-slate-700">Good Morning, Sani ☀️</p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1.5 rounded-full border border-slate-300 text-xs w-48 outline-none focus:border-blue-400"
            />
            <div className="relative cursor-pointer">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">4</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">S</div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="px-6 py-1.5 text-xs text-slate-400">
          Home &gt; Orders
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <h2 className="text-base font-semibold text-slate-600 mb-3 mt-1">Orders</h2>

          {/* Top Section */}
          <div className="flex gap-4 mb-6">

            {/* Active Deliveries */}
            <div className="flex-1 bg-pink-50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-lg">🔒</span>
                  <h3 className="text-sm font-bold text-slate-700">
                    Active Deliveries({activeDeliveries.length})
                  </h3>
                </div>
                <button className="text-xs text-blue-500 font-medium hover:underline">
                  View All →
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {activeDeliveries.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                      {order.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-sm font-semibold text-slate-700">{order.customer}</p>
                        <span className="text-blue-500 text-xs">📞</span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="text-blue-400">🏠</span> Pickup: {order.pickup}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="text-red-400">📍</span> Drop: {order.drop}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${order.statusColor}`}>
                        {order.status}
                      </span>
                      <p className="text-xs text-slate-400">ETA: {order.eta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Stats */}
            <div className="flex flex-col gap-3 w-44">
              <div className="bg-blue-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600 text-xl">📋</span>
                  <p className="text-sm font-bold text-blue-800">Today's Orders</p>
                </div>
                <p className="text-4xl font-bold text-blue-900">8</p>
              </div>
              <div className="bg-blue-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600 text-xl">📋</span>
                  <p className="text-sm font-bold text-blue-800">Pending Delivery</p>
                </div>
                <p className="text-4xl font-bold text-blue-900">2</p>
                <p className="text-xs text-orange-500 font-medium mt-1">⚠️ 1 urgent</p>
              </div>
            </div>
          </div>

          {/* Completed Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
              <span className="text-blue-600">📋</span>
              <h3 className="text-sm font-bold text-slate-700">Recent Completed Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-600">Order id</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-600">Customer Name</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-600">Address</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-600">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-600">Completed At</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((order, index) => (
                    <tr key={order.id} className={`border-b border-slate-50 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                      <td className="px-5 py-4 text-sm text-slate-600 font-medium">{order.id}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{order.customer}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{order.address}</td>
                      <td className="px-5 py-4 text-sm text-slate-700 font-medium">{order.amount}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{order.completedAt}</td>
                      <td className="px-5 py-4">
                        <span className="bg-green-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Delivered
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default OrdersTracking;