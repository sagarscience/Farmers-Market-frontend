import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function FarmerDashboard() {
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  const headers = {
    Authorization: `Bearer ${auth.token}`,
  };

  // ✅ Fetch farmer's products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/my", {
        headers,
      });
      setProducts(res.data);
      console.log(headers);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ Fetch orders for farmer's products
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/farmer", {
        headers,
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  // ✅ Update order tracking status
  const handleUpdateStatus = async (orderId) => {
    const newStatus = statusUpdate[orderId];
    if (!newStatus) return;

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/track`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
      setStatusUpdate((prev) => ({ ...prev, [orderId]: "" }));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [auth.token]);

  return (
    <div className="p-6 space-y-10">
      {/* ✅ FARMER'S PRODUCTS */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-green-700">
            🌱 Your Products
          </h2>
          <Link
            to="/add-product"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            ➕ Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-600 mt-10">
            <p className="text-lg">You haven't added any products yet.</p>
            <Link
              to="/add-product"
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow bg-white hover:shadow-md transition"
              >
                <img
                  src={product.imageUrl || "/default-produce.jpg"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-xl font-semibold text-green-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description?.slice(0, 60)}...
                </p>
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Price:</span> ₹{product.price}{" "}
                  / kg
                </p>
                <p
                  className={`text-sm font-medium ${
                    product.quantity > 0 ? "text-gray-700" : "text-red-600"
                  }`}
                >
                  <span className="font-semibold">Stock:</span>{" "}
                  {product.quantity > 0
                    ? `${product.quantity} kg`
                    : "Out of Stock"}
                </p>
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/edit-product/${product._id}`}
                    className="bg-yellow-500 text-center text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ ORDER HISTORY FOR FARMER'S PRODUCTS */}
      <section>
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          🧾 Orders for Your Products
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet for your products.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border p-4 rounded shadow bg-white"
              >
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Buyer:</strong> {order.buyer?.name}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <ul className="list-disc list-inside text-gray-800 text-sm mb-2">
                  {order.products.map((item) => (
                    <li key={item.productId}>
                      {item.name} — ₹{item.price} × {item.quantity}
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-700 mb-2">
                  <strong>Current Status:</strong>{" "}
                  <span className="text-green-700 font-semibold">
                    {order.status}
                  </span>
                </p>

                {/* ✅ Status update select + button */}
                <div className="flex text-gray-700 gap-2 items-center mt-2">
                  <select
                    value={statusUpdate[order._id] || ""}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        [order._id]: e.target.value,
                      }))
                    }
                    className="border px-3 py-1 rounded text-sm"
                  >
                    <option value="">-- Update Status --</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(order._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
