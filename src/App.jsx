import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import AdminDashboard from "./pages/AdminDashboard";
import OrderTracking from "./pages/OrderTracking";
import ChatRoom from "./pages/ChatRoom";
import ProtectedRoute from "./pages/ProtectedRoute";
import ChatUserList from "./pages/ChatUserList";

export default function App() {
  const { auth, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-Based Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {["admin", "farmer", "buyer"].includes(auth.role) ? (
                <Dashboard />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              {auth.role === "farmer" ? (
                <AddProduct />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-product/:id"
          element={
            <ProtectedRoute>
              {auth.role === "farmer" ? (
                <EditProduct />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              {auth.role === "buyer" ? <Cart /> : <Navigate to="/" replace />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              {auth.role === "buyer" ? (
                <Checkout />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              {auth.role === "buyer" ? (
                <OrderHistory />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              {["admin", "farmer", "buyer"].includes(auth.role) ? (
                <OrderTracking />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              {auth.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Public Chat Page */}
        <Route path="/chat" element={<ChatRoom />} />
        {/* Protected Chat Room */}
        <Route path="/chat/:roomId" element={<ChatRoom />} />
        {/* Protected Chat User List */}
        <Route path="/chat/users" element={<ChatUserList />} />
      </Routes>

      <Footer />
    </>
  );
}
