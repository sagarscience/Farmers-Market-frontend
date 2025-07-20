import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/ChatGPT Image Jul 11, 2025, 05_21_43 PM.png";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleChatClick = () => {
    if (!auth?.token) {
      navigate("/login");
    } else {
      navigate("/chat");
    }
  };

  return (
    <nav className="sticky top-0 bg-green-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl">
        <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
        <span>FarmersMarket</span>
      </Link>

      <div className="flex items-center space-x-4">
        {auth.token && (
          <Link to="/dashboard" className="hover:underline">
            Dashboard ({auth.role})
          </Link>
        )}

        {auth.token && auth.role === "buyer" && (
          <>
            <Link to="/cart" className="relative hover:underline">
              🛒 Cart
              <span className="ml-1 bg-white text-green-600 px-2 py-0.5 rounded-full text-xs">
                {cart.length}
              </span>
            </Link>
            <Link to="/orders" className="hover:underline">
              My Orders
            </Link>
          </>
        )}

        {/* 💬 Chat Room Button */}
        <button
          onClick={handleChatClick}
          className="inline-flex items-center gap-2 bg-white text-green-600 px-4 py-1.5 rounded hover:bg-gray-100 transition"
        >
          💬 Chat Room
        </button>

        {auth.token ? (
          <button
            onClick={logout}
            className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="bg-white rounded px-3 py-2 text-green-400 hover:underline">Login</Link>
            <Link to="/register" className="bg-white rounded px-3 py-2 text-blue-600 hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
