import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name.trim() ||
      !product.description.trim() ||
      !product.price ||
      !product.quantity
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (product.price <= 0 || product.quantity <= 0) {
      alert("Price and quantity must be greater than zero.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        product,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      alert("✅ Product added successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "❌ Add product error:",
        error.response?.data || error.message
      );
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Add New Product
        </h2>

        {/* Product Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-1"
          >
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="e.g. Fresh Tomatoes"
            required
            className="w-full p-2 border text-gray-600 border-gray-300 rounded"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-1"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={product.description}
            onChange={handleChange}
            placeholder="Brief description about the product"
            required
            className="w-full p-2 border text-gray-600 border-gray-300 rounded"
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 font-medium mb-1"
          >
            Price (₹ per kg) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            name="price"
            min="1"
            step="0.1"
            value={product.price}
            onChange={handleChange}
            placeholder="e.g. 25"
            required
            className="w-full p-2 border text-gray-600 border-gray-300 rounded"
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-gray-700 font-medium mb-1"
          >
            Stock Quantity (kg) <span className="text-red-500">*</span>
          </label>
          <input
            id="stock"
            type="number"
            name="stock"
            min="1"
            value={product.stock}
            onChange={handleChange}
            placeholder="e.g. 100"
            required
            className="w-full p-2 border text-gray-600 border-gray-300 rounded"
          />
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label
            htmlFor="imageUrl"
            className="block text-gray-700 font-medium mb-1"
          >
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border text-gray-600 border-gray-300 rounded"
          />
        </div>

        {/* Image Preview */}
        {product.imageUrl && (
          <div className="mb-4">
            <img
              src={product.imageUrl}
              alt="Product Preview"
              className="w-full h-40 object-cover rounded"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded transition duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "➕ Add Product"}
        </button>
      </form>
    </div>
  );
}
