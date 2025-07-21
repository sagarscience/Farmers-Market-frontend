import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amt);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (cart.length === 0 || total <= 0) {
      alert("🛒 Your cart is empty or invalid.");
      return;
    }

    setLoading(true);
    try {
      const { data: order } = await axios.post(
        `${API_BASE}/api/payment/create-order`,
        { amount: total }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Farmers Online Trading",
        description: "Secure payment for your farm order",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${API_BASE}/api/orders`,
              {
                cart,
                total,
                paymentId: response.razorpay_payment_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            alert("✅ Payment & Order successful!");
            clearCart();
            navigate("/dashboard");
          } catch (err) {
            console.error("Order save failed:", err);
            alert("Payment succeeded, but order save failed.");
          }
        },
        prefill: {
          name: auth?.user?.name || "Test Buyer",
          email: auth?.user?.email || "buyer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 px-4 flex items-center justify-center">
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-green-700 text-lg font-bold hover:text-green-800"
          aria-label="Go back"
        >
          ←
        </button>

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Checkout
        </h2>

        {/* Cart Summary */}
        <ul className="divide-y mb-4">
          {cart.map((item) => (
            <li key={item._id} className="py-3 text-gray-700 text-sm">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-600">
                ₹{item.price} × {item.quantity} ={" "}
                <span className="font-bold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className="text-lg font-semibold text-gray-800 mb-6 text-right">
          Total:{" "}
          <span className="text-green-700">{formatPrice(total)}</span>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading || cart.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "💳 Pay Now"}
        </button>
      </div>
    </div>
  );
}
