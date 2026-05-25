import { useState } from "react";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

type OrderStatus = "Ready For Shipping" | "Shipped" | "New Order";

interface Order {
  id: string;
  status: OrderStatus;
  customer: string;
  productName: string;
  quantity: number;
  price: number;
}

const initialOrders: Order[] = [
  {
    id: "01",
    status: "Ready For Shipping",
    customer: "Binita",
    productName: "Diamond Set",
    quantity: 1,
    price: 1999,
  },
  {
    id: "02",
    status: "Shipped",
    customer: "Kabita",
    productName: "Floral Kurthi",
    quantity: 1,
    price: 999,
  },
  {
    id: "03",
    status: "Shipped",
    customer: "Karuna",
    productName: "Hand Bag",
    quantity: 2,
    price: 1999,
  },
  {
    id: "04",
    status: "Shipped",
    customer: "Monika",
    productName: "Simple Watch",
    quantity: 2,
    price: 1499,
  },
  {
    id: "05",
    status: "New Order",
    customer: "Sani",
    productName: "Casual Slipper",
    quantity: 1,
    price: 999,
  },
];

export default function SellerOrders() {
  const [orders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] =
    useState<"all" | "pending" | "completed">("all");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.includes(searchQuery) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && o.status === "New Order") ||
      (activeTab === "completed" && o.status === "Shipped");

    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex w-full h-screen bg-gray-100 font-sans text-[13px]">

      <SellerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <SellerNavbar />

        {/* ✅ PUSH CONTENT DOWN */}
        <div className="flex-1 overflow-y-auto p-5 pt-10">

          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-8">

            {/* TABS */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 rounded-md border ${
                  activeTab === "all"
                    ? "bg-gray-800 text-white"
                    : "bg-white"
                }`}
              >
                All Orders
              </button>

              <button
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-2 rounded-md border ${
                  activeTab === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-white"
                }`}
              >
                Pending
              </button>

              <button
                onClick={() => setActiveTab("completed")}
                className={`px-3 py-2 rounded-md border ${
                  activeTab === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-white"
                }`}
              >
                Completed
              </button>
            </div>

            {/* SEARCH (RIGHT) */}
            <div className="w-[380px]">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
              />
            </div>

          </div>

          {/* TABLE (NOW LOWER + CENTER FEEL) */}
          <div className="bg-white rounded-lg overflow-hidden border mt-6">

            <table className="w-full border-collapse">

              <thead className="bg-gray-300">
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Product",
                    "Qty",
                    "Price",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-center font-semibold text-gray-800"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                  >
                    <td className="px-4 py-3 text-center">{order.id}</td>
                    <td className="px-4 py-3 text-center">{order.customer}</td>
                    <td className="px-4 py-3 text-center">{order.productName}</td>
                    <td className="px-4 py-3 text-center">{order.quantity}</td>
                    <td className="px-4 py-3 text-center">
                      Rs. {order.price}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="text-gray-800 font-medium">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md">
                          Accept
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      </div>
    </div>
  );
}