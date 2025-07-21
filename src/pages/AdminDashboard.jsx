import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${auth.token}` };
        const [u, p, o] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin/users`, { headers }),
          axios.get(`${BASE_URL}/api/admin/products`, { headers }),
          axios.get(`${BASE_URL}/api/admin/orders`, { headers }),
        ]);
        setUsers(u.data);
        setProducts(p.data);
        setOrders(o.data);
      } catch (err) {
        console.error("Admin fetch failed:", err);
      }
    };

    fetchData();
  }, [auth.token]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete user failed:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete product failed:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/api/orders/${orderId}/track`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...data.order, _newStatus: "" } : o))
      );
    } catch (err) {
      console.error("Order update failed:", err);
      alert("Failed to update order status");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) &&
      (roleFilter ? u.role === roleFilter : true)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: users.length },
          { label: "Total Products", value: products.length },
          { label: "Total Orders", value: orders.length },
          {
            label: "Total Revenue",
            value: `₹${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)}`,
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded shadow text-center">
            <h4 className="text-gray-500 text-sm">{stat.label}</h4>
            <p className="text-xl font-bold text-green-700">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Users */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">👥 Users</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="px-3 py-1 border rounded"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="">All Roles</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow rounded p-4 space-y-3">
          {filteredUsers.map((user) => (
            <div key={user._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-green-100 px-2 py-1 rounded text-green-800">{user.role}</span>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">📦 Products</h2>
        <div className="bg-white p-4 rounded shadow space-y-4">
          {products.map((prod) => (
            <div key={prod._id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-4">
                {prod.imageUrl && (
                  <img src={prod.imageUrl} alt={prod.name} className="w-14 h-14 object-cover rounded" />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{prod.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{prod.price} • {prod.stock}kg • by {prod.createdBy?.name || "Unknown"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteProduct(prod._id)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Orders */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">🧾 Orders</h2>
        <div className="bg-white p-4 rounded shadow space-y-5">
          {orders.map((order) => (
            <div key={order._id} className="border-b pb-4">
              <p className="font-semibold text-gray-800 mb-1">
                Buyer: {order.buyer?.name || "N/A"} • ₹{order.totalAmount}
              </p>
              <p className="text-sm text-gray-500 mb-1">Payment ID: {order.paymentId}</p>
              <p className="text-sm text-gray-500 mb-2">
                Ordered on: {new Date(order.createdAt).toLocaleString()}
              </p>

              <ul className="list-disc pl-6 text-sm mb-2">
                {order.products.map((p, idx) => (
                  <li key={idx}>
                    {p.name} — ₹{p.price} × {p.quantity} = ₹{p.price * p.quantity}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 mt-1">
                <select
                  value={order._newStatus || ""}
                  onChange={(e) =>
                    setOrders((prev) =>
                      prev.map((o) =>
                        o._id === order._id ? { ...o, _newStatus: e.target.value } : o
                      )
                    )
                  }
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="">-- Update Status --</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => handleStatusChange(order._id, order._newStatus)}
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
