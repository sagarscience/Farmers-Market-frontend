import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const { auth } = useAuth();

  // Format currency in INR
  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amt);

  // Fetch user's order history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to load orders:", err);
      }
    };

    fetchOrders();
  }, [auth.token]);

  // Download Invoice as PDF
  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          responseType: "blob", // Needed for PDF blob
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Invoice download failed:", err);
      alert("Failed to download invoice");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-green-50">
      <h2 className="text-3xl font-bold text-green-700 mb-6">🧾 Your Orders</h2>

      {orders.length === 0 ? (
        <div className="text-gray-600 bg-white p-6 rounded shadow text-center">
          <p className="text-lg">You haven’t placed any orders yet.</p>
          <p className="text-sm mt-2">Start shopping from the dashboard!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition"
            >
              {/* Order Header Info */}
              <div className="mb-2 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>📅 Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>🧾 Payment ID:</strong>{" "}
                  <span className="font-mono">{order.paymentId || "N/A"}</span>
                </p>
                <p>
                  <strong>🚚 Status:</strong>{" "}
                  <span className="text-green-700 font-semibold">
                    {order.status}
                  </span>
                </p>
              </div>

              {/* Items List */}
              <div className="mt-3">
                <h4 className="text-md font-semibold mb-1 text-gray-700">
                  Items Ordered:
                </h4>
                <ul className="text-gray-800 text-sm list-disc list-inside space-y-1">
                  {order.products.map((item) => (
                    <li key={item.productId}>
                      {item.name || "Unnamed Product"} — ₹{item.price} ×{" "}
                      {item.quantity} ={" "}
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total + Actions */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-green-700 font-bold text-lg">
                  Total: {formatPrice(order.totalAmount)}
                </p>

                <div className="flex gap-3">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-sm text-green-600 underline hover:text-green-800"
                  >
                    📦 Track Order
                  </Link>

                  <button
                    onClick={() => handleDownloadInvoice(order._id)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                  >
                    🧾 Download Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
