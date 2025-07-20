import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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
          axios.get("http://localhost:5000/api/admin/users", { headers }),
          axios.get("http://localhost:5000/api/admin/products", { headers }),
          axios.get("http://localhost:5000/api/admin/orders", { headers }),
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
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("User delete failed:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Product delete failed:", err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) &&
      (roleFilter ? u.role === roleFilter : true)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6">
        Admin Dashboard
      </h2>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-4 shadow rounded text-center">
          <h4 className="text-sm text-gray-500 mb-1">Total Users</h4>
          <p className="text-2xl font-bold text-green-700">{users.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded text-center">
          <h4 className="text-sm text-gray-500 mb-1">Total Products</h4>
          <p className="text-2xl font-bold text-green-700">{products.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded text-center">
          <h4 className="text-sm text-gray-500 mb-1">Total Orders</h4>
          <p className="text-2xl font-bold text-green-700">{orders.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded text-center">
          <h4 className="text-sm text-gray-500 mb-1">Total Revenue</h4>
          <p className="text-2xl font-bold text-green-700">
            ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)}
          </p>
        </div>
      </div>

      {/* USERS */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">👥 Users</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search name..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="border  text-gray-800 px-3 py-1 rounded text-sm"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border  text-gray-800 px-2 py-1 rounded text-sm"
            >
              <option value="">All Roles</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium  text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-green-100 px-2 py-1 rounded text-green-800">
                  {user.role}
                </span>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          📦 Products
        </h3>
        <div className="bg-white rounded shadow p-4 space-y-4">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-4">
                {prod.imageUrl && (
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium  text-gray-800">{prod.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{prod.price} • {prod.quantity}kg • by{" "}
                    {prod.createdBy?.name || "Unknown"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteProduct(prod._id)}
                className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ORDERS */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">🧾 Orders</h3>
        <div className="bg-white rounded shadow p-4 space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border-b pb-4">
              <p className="text-gray-800 font-semibold mb-1">
                Buyer: {order.buyer?.name || "N/A"} • Total: ₹
                {order.totalAmount}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Payment ID: <span className="font-mono">{order.paymentId}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Ordered on: {new Date(order.createdAt).toLocaleString()}
              </p>

              <ul className="list-disc ml-6 text-sm text-gray-700 mb-2">
                {order.products.map((p, idx) => (
                  <li key={idx}>
                    {p.name} — ₹{p.price} × {p.quantity} = ₹
                    {p.price * p.quantity}
                  </li>
                ))}
              </ul>

              <div className="mb-2">
                <strong className="text-sm text-gray-600">Status:</strong>{" "}
                <span className="text-green-700 font-semibold">
                  {order.status}
                </span>
              </div>

              <div className="flex items-center text-gray-500 gap-2 mt-2">
                <select
                  className="border px-2 py-1 rounded text-sm"
                  value={order._newStatus || ""}
                  onChange={(e) => 
                    setOrders((prev) =>
                      prev.map((o) =>
                        o._id === order._id
                          ? { ...o, _newStatus: e.target.value }
                          : o
                      )
                    )
                  }
                >
                  <option value="">-- Update Status --</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                  onClick={async () => {
                    const newStatus = order._newStatus;
                    if (!newStatus) return;

                    try {
                      const { data } = await axios.patch(
                        `http://localhost:5000/api/orders/${order._id}/track`,
                        { status: newStatus },
                        {
                          headers: {
                            Authorization: `Bearer ${auth.token}`,
                          },
                        }
                      );

                      // Update order status in state
                      setOrders((prev) =>
                        prev.map((o) =>
                          o._id === order._id
                            ? { ...data.order, _newStatus: "" }
                            : o
                        )
                      );
                    } catch (err) {
                      console.error("Failed to update order:", err);
                      alert("Failed to update order status");
                    }
                  }}
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
