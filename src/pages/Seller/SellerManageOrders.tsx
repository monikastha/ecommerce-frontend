import { useState } from "react";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

interface Order {
  id: string;
  customerName: string;
  deliveryStatus: "Pending" | "Delivered";
}

const allOrders: Order[] = [
  { id: "001", customerName: "Kamala Stha", deliveryStatus: "Pending" },
  { id: "002", customerName: "Princy Bhusal", deliveryStatus: "Delivered" },
];

type FilterTab = "All Orders" | "Pending" | "Completed";

export default function SellerOrders() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = allOrders.filter((o) => {
    const matchesTab =
      activeTab === "All Orders" ||
      (activeTab === "Pending" && o.deliveryStatus === "Pending") ||
      (activeTab === "Completed" && o.deliveryStatus === "Delivered");

    const matchesSearch =
      searchQuery === "" ||
      o.id.includes(searchQuery) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

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
              </button>
            ))}

            <div className="flex-1 flex justify-end">
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
          <div className="bg-white border rounded-md overflow-hidden">

            <table className="w-full text-xs">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-center">Customer</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3 text-center">{order.customerName}</td>
                    <td className="p-3 text-center">{order.deliveryStatus}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs">
                          Accept
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <button className="bg-blue-900 text-white px-4 py-2 rounded text-xs">
              Previous
            </button>
            <button className="bg-blue-900 text-white px-4 py-2 rounded text-xs">
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}