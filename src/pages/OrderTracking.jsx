import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function OrderTracking() {
  const { orderId } = useParams();
  const { auth } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");

  // ✅ Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setOrder(data);
      } catch (err) {
        console.error("❌ Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      fetchOrder();
    }
  }, [orderId, auth?.token]);

  // ✅ Update tracking status
  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/track`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setOrder(data.order);
      setNewStatus("");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update tracking status.");
    }
  };

  // ✅ Loading / error states
  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-600">
        Order not found or access denied.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow mt-10 rounded">
      <h2 className="text-xl font-bold mb-4 text-green-700">🧾 Order Tracking</h2>

      {/* ✅ Order Info */}
      <p className="mb-2 text-gray-600">
        <strong>Order ID:</strong> {order._id}
      </p>
      <p className="mb-4 text-gray-600">
        <strong>Status:</strong>{" "}
        <span className="font-semibold text-green-600">{order.status}</span>
      </p>

      {/* ✅ Tracking History */}
      <h3 className="font-semibold text-gray-600 mb-2">📍 Tracking History</h3>
      <ul className="space-y-2 text-gray-600 text-sm">
        {order.trackingHistory?.length > 0 ? (
          order.trackingHistory.map((t, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{t.status}</span>
              <span className="text-gray-500 text-xs">
                {new Date(t.date).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic">
            No tracking updates available yet.
          </li>
        )}
      </ul>

      {/* ✅ Status Update Section (admin/farmer only) */}
      {(auth.role === "admin" || auth.role === "farmer") && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2 text-gray-700">✏️ Update Tracking Status</h3>
          <div className="flex gap-2 items-center">
            <select
              className="border rounded px-3 py-1 text-sm"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">-- Select Status --</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
