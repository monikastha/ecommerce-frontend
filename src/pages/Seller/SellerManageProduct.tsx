import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api`;

type Product = {
  id: number;
  name: string;
  code?: string;
  category_name?: string;
  price: string;
  quantity: number;
  status: "pending" | "approved" | "rejected";
  is_published: boolean;
};

export default function SellerProductManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/products/`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/products/${id}/`);
      fetchProducts();
    } catch (error) {
      alert("Failed to delete product");
      console.error(error);
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const query = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          String(p.id).includes(query) ||
          (p.code || "").toLowerCase().includes(query)
        );
      }),
    [products, search]
  );

  return (
    <div className="flex w-full h-screen bg-gray-100 font-sans text-[13px]">
      <SellerSidebar />
      <div className="flex-1 flex flex-col">
        <SellerNavbar />
        <div className="p-6 overflow-auto">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, code, or ID..."
                className="px-4 py-2.5 border border-gray-300 rounded-lg w-80 max-w-full focus:outline-none focus:border-red-500"
              />
              <button
                onClick={() => navigate("/seller/product/add")}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
              >
                + Add Product
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-4">ID</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Approval</th>
                  <th className="p-4">Published</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="p-8 text-center text-gray-500">Loading products...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-gray-500">No products found.</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">#{product.id}</td>
                      <td className="p-4 font-medium text-gray-800">{product.name}</td>
                      <td className="p-4">{product.category_name || "-"}</td>
                      <td className="p-4">Rs. {product.price}</td>
                      <td className="p-4">{product.quantity}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === "approved" ? "bg-green-100 text-green-700" :
                          product.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4">{product.is_published ? "Yes" : "No"}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/seller/product/edit/${product.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-md grid place-items-center"
                            title="Edit product"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-md grid place-items-center"
                            title="Delete product"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
