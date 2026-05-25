import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Category = { id: number; name: string };

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    code: "",
    description: "",
    is_published: false,
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    axios.get(`${API_ORIGIN}/api/productcategory/categories/`).then((res) => setCategories(res.data));
    axios.get(`${API_ORIGIN}/api/products/${id}/`).then((res) => {
      const data = res.data;
      setForm({
        name: data.name || "",
        price: data.price || "",
        quantity: String(data.quantity ?? 0),
        category: data.category ? String(data.category) : "",
        code: data.code || "",
        description: data.description || "",
        is_published: Boolean(data.is_published),
      });
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, String(value)));
      if (image) data.append("image", image);
      await axios.patch(`${API_ORIGIN}/api/products/${id}/`, data);
      alert("Product updated successfully.");
      navigate("/seller/manageproduct");
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100 font-sans">
      <SellerSidebar />
      <div className="flex-1 flex flex-col">
        <SellerNavbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
              <p className="text-sm text-gray-500">Update product details and publication state</p>
            </div>
            <button onClick={() => navigate("/seller/manageproduct")} className="px-4 py-2 rounded-lg border border-gray-300 bg-white">
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Product Name" className="p-3 rounded border border-gray-300" />
                <input name="code" value={form.code} onChange={handleChange} placeholder="Code" className="p-3 rounded border border-gray-300" />
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required placeholder="Price" className="p-3 rounded border border-gray-300" />
                <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="p-3 rounded border border-gray-300" />
              </div>
              <select name="category" value={form.category} onChange={handleChange} className="mt-3 w-full p-3 rounded border border-gray-300">
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="mt-3 w-full p-3 rounded border border-gray-300" placeholder="Description" />
              <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} />
                Publish after approval
              </label>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 h-fit">
              <h3 className="font-bold mb-3">Product Image</h3>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full border rounded p-2" />
              <button disabled={loading} className="w-full mt-4 py-2 rounded bg-green-600 text-white font-semibold disabled:opacity-60">
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
