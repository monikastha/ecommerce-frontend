import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

export default function SellerProductManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([
    {
      id: "PRD001",
      name: "Partywear Blue Saree",
      price: "Rs. 2299",
      quantity: 12,
      status: "Published",
    },
    {
      id: "PRD002",
      name: "Diamond Set",
      price: "Rs. 1999",
      quantity: 5,
      status: "Unpublished",
    },
    {
      id: "PRD003",
      name: "Casual Slipper",
      price: "Rs. 999",
      quantity: 20,
      status: "Published",
    },
    {
      id: "PRD004",
      name: "Shoulder Bag",
      price: "Rs. 799",
      quantity: 8,
      status: "Published",
    },
    {
      id: "PRD005",
      name: "Floral Kurti",
      price: "Rs. 1599",
      quantity: 15,
      status: "Published",
    },
  ]);

  // DELETE FUNCTION
  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmDelete) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full h-screen bg-gray-100 font-sans text-[13px]">

      {/* SIDEBAR */}
      <SellerSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <SellerNavbar />

        {/* PAGE CONTENT */}
        <div className="p-6 overflow-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Product Management
            </h2>

            <div className="flex items-center gap-4">

              {/* SEARCH */}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or ID..."
                className="px-4 py-2.5 border border-gray-300 rounded-lg w-80 focus:outline-none focus:border-red-500"
              />

              {/* ADD PRODUCT BUTTON */}
              <button
                onClick={() => navigate("/seller/addproduct")}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                + Add Product
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow overflow-hidden">

            {/* TABLE HEADER */}
            <div className="grid grid-cols-14 bg-gray-100 p-4 font-semibold text-gray-700 border-b">
              <div className="col-span-2">Product ID</div>
              <div className="col-span-4">Product Name</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-center">Action</div>
            </div>

            {/* TABLE ROWS */}
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-14 p-4 border-b hover:bg-gray-50 items-center"
              >
                {/* PRODUCT ID */}
                <div className="col-span-2 font-medium text-gray-700">
                  {product.id}
                </div>

                {/* PRODUCT NAME */}
                <div className="col-span-4 font-medium text-gray-800">
                  {product.name}
                </div>

                {/* PRICE */}
                <div className="col-span-2 text-gray-700 font-medium">
                  {product.price}
                </div>

                {/* QUANTITY */}
                <div className="col-span-2 text-gray-700 font-medium">
                  {product.quantity}
                </div>

                {/* STATUS */}
                <div className="col-span-2">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${
                      product.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="col-span-2 flex justify-center gap-2">

                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => alert(`Edit ${product.name}`)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
                  >
                    Edit
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* EMPTY MESSAGE */}
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No products found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}