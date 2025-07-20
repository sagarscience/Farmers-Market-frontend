import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { auth } = useAuth();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!auth.token) return alert("Login to post a review");

    try {
      await axios.post(
        `http://localhost:5000/api/products/${id}/review`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setMessage("Review submitted successfully");
      setRating(0);
      setComment("");
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting review");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="mb-4 text-gray-700">{product.description}</p>
      <p className="mb-4">Price: ₹{product.price}</p>

      {/* ✅ REVIEWS */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          product.reviews.map((r, i) => (
            <div key={i} className="border-t pt-2 mt-2">
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-yellow-600">Rating: {r.rating} ⭐</p>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* ✅ ADD REVIEW FORM */}
      {auth.role === "buyer" && (
        <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">Write a Review</h3>
          {message && <p className="text-sm text-red-500">{message}</p>}
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border px-2 py-1 rounded"
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
