import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function EditProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/my", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        const product = res.data.find((p) => p._id === id);
        if (!product) return alert("Product not found");

        // ✅ Only pick relevant fields
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          quantity: product.quantity || "",
          imageUrl: product.imageUrl || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      }
    };

    fetchProduct();
  }, [id, auth.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, form, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      alert("✅ Product updated successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-green-100">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Edit Product
        </h2>

        {/* Product Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-1"
          >
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border  text-gray-700 border-gray-300 rounded"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border  text-gray-700 border-gray-300 rounded"
            rows={3}
            required
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 font-medium mb-1"
          >
            Price (₹)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border  text-gray-700 border-gray-300 rounded"
            required
          />
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-gray-700 font-medium mb-1"
          >
            Quantity (kg)
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="w-full p-2 border  text-gray-700 border-gray-300 rounded"
            required
          />
        </div>

        {/* Image URL */}
        <div className="mb-6">
          <label
            htmlFor="imageUrl"
            className="block text-gray-700 font-medium mb-1"
          >
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border text-gray-700 border-gray-300 rounded"
          />

          {/* 🔍 Live Image Preview */}
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-3 w-full h-40 object-cover rounded border"
              onError={(e) => {
                e.target.src = "/default-produce.jpg"; // fallback if image URL fails
              }}
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
