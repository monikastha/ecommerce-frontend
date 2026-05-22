import { useState } from "react";
import SellerSidebar from "./SellerSidebar";
import SellerNavbar from "./SellerNavbar";

export default function SellerAddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productCode, setProductCode] = useState("");
  const [price, setPrice] = useState("");
  const [fileName, setFileName] = useState("Choose File");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-[13px]">
      
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar */}
        <SellerNavbar />

        {/* Page Body */}
        <div className="flex-1 flex items-center justify-center p-4">

          {/* Smaller Form Card */}
          <div className="w-full max-w-[500px] bg-white border border-gray-200 rounded-lg shadow-sm p-5">

            {/* Heading */}
            <h2 className="text-center text-gray-700 text-sm font-semibold mb-4">
              Add Product Information
            </h2>

            {/* Title */}
            <div className="mb-3">
              <label className="block mb-1 text-gray-700">
                Product Title
              </label>

              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-green-500"
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block mb-1 text-gray-700">
                Description
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none resize-none focus:border-green-500"
              />
            </div>

            {/* Category + Code + Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">

              {/* Category */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="food">Food</option>
                </select>
              </div>

              {/* Code */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Code
                </label>

                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Code"
                  className="w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Price
                </label>

                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Rs."
                  className="w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500"
                />
              </div>

            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">
                Product Image
              </label>

              <label className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100">
                <span className="text-gray-600 text-[12px] truncate">
                  {fileName}
                </span>

                <span className="bg-gray-200 px-2 py-1 rounded text-[11px]">
                  Browse
                </span>

                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">

              {/* Cancel */}
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
                Cancel
              </button>

              {/* Save */}
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm">
                Save
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}