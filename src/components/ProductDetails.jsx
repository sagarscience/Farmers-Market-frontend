import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { auth } = useAuth();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error("❌ Failed to load product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!auth.token) return alert("Login to post a review");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/review`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setMessage("✅ Review submitted successfully");
      setRating("");
      setComment("");
      fetchProduct(); // refresh reviews
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) return <div className="text-center mt-10">⏳ Loading product details...</div>;
  if (!product) return <div className="text-center mt-10 text-red-600">❌ Product not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="mb-2 text-gray-700">{product.description}</p>
      <p className="mb-4 text-lg font-semibold">Price: ₹{product.price}</p>

      {/* ✅ REVIEWS */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((r, i) => (
              <div key={i} className="border-t pt-3">
                <p className="font-semibold text-sm text-green-700">{r.name}</p>
                <p className="text-yellow-600 text-sm">⭐ {r.rating} / 5</p>
                <p className="text-gray-800">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ ADD REVIEW */}
      {auth.role === "buyer" && (
        <form
          onSubmit={handleReviewSubmit}
          className="mt-8 border-t pt-6 space-y-3"
        >
          <h3 className="text-lg font-semibold">Write a Review</h3>
          {message && (
            <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            required
          >
            <option value="">Select rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Average</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Excellent</option>
          </select>
          <textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            rows={4}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}
