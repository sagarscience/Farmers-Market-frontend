// pages/BuyerDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_BASE_URL + "/api/products"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchName = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchMin = minPrice === "" || product.price >= Number(minPrice);
    const matchMax = maxPrice === "" || product.price <= Number(maxPrice);
    return matchName && matchMin && matchMax;
  });

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-3xl font-bold text-green-700 mb-6">
        🛒 Available Products
      </h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded text-sm text-gray-800 w-full sm:w-60"
        />
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded text-sm text-gray-800 w-24"
        />
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded text-sm text-gray-800 w-24"
        />
        <button
          onClick={() => {
            setSearchTerm("");
            setMinPrice("");
            setMaxPrice("");
          }}
          className="ml-auto text-sm text-white bg-green-400 hover:bg-green-500 px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-600">No matching products found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow bg-white hover:shadow-lg transition"
            >
              <img
                src={product.imageUrl || "/default-produce.jpg"}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-xl font-semibold text-green-800 mb-1">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                {product.description?.slice(0, 60)}...
              </p>
              <p className="text-gray-700 text-sm">₹{product.price} / kg</p>
              <p className="text-gray-500 text-sm">
                👨‍🌾 Farmer: {product.createdBy?.name || "N/A"}
              </p>
              <p
                className={`mt-2 text-sm font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `In Stock: ${product.quantity} kg`
                  : "Out of Stock"}
              </p>

              <button
                disabled={product.stock <= 0}
                onClick={() => addToCart(product)}
                className={`mt-4 w-full py-2 rounded text-white font-semibold transition ${
                  product.stock > 0
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
