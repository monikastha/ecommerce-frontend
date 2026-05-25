import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import SellerNavbar from "./SellerNavbar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Category = { id: number; name: string };
type Seller = { id: number; name: string; status: string };

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    seller: "",
    code: "",
    price: "",
    quantity: "",
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    axios.get(`${API_ORIGIN}/api/productcategory/categories/`).then((res) => setCategories(res.data));
    axios.get(`${API_ORIGIN}/api/seller/`).then((res) => setSellers(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (image) data.append("image", image);
      await axios.post(`${API_ORIGIN}/api/products/`, data);
      alert("Product added and sent for approval.");
      navigate("/seller/manageproduct");
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-[13px]">
      <SellerSidebar />
      <div className="flex-1 flex flex-col">
        <SellerNavbar />
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-[620px] bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <h2 className="text-center text-gray-700 text-sm font-semibold mb-4">
              Add Product Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <label className="block text-gray-700">
                Product Title
                <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-green-500" />
              </label>
              <label className="block text-gray-700">
                Seller
                <select name="seller" value={form.seller} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-green-500">
                  <option value="">Select seller</option>
                  {sellers.filter((seller) => seller.status === "approved").map((seller) => (
                    <option key={seller.id} value={seller.id}>{seller.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block mb-3 text-gray-700">
              Description
              <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 outline-none resize-none focus:border-green-500" />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
              <label className="block text-gray-700">
                Category
                <select name="category" value={form.category} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500">
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="block text-gray-700">
                Code
                <input name="code" value={form.code} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500" />
              </label>
              <label className="block text-gray-700">
                Price
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className="mt-1 w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500" />
              </label>
              <label className="block text-gray-700">
                Quantity
                <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded px-2 py-2 outline-none focus:border-green-500" />
              </label>
            </div>

            <label className="block mb-4 text-gray-700">
              Product Image
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-50" />
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => navigate("/seller/manageproduct")} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
                Cancel
              </button>
              <button disabled={loading} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60">
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
