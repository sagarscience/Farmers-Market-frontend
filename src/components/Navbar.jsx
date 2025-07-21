import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/ChatGPT Image Jul 11, 2025, 05_21_43 PM.png";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleChatClick = () => {
    closeMenu();
    if (!auth?.token) navigate("/login");
    else navigate("/chat");
  };

  return (
    <nav className="bg-green-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-bold">
          <img src={logo} alt="FarmersMarket" className="h-8 w-8 object-contain" />
          FarmersMarket
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
          {auth.token && (
            <Link to="/dashboard" className="hover:underline">
              Dashboard ({auth.role})
            </Link>
          )}

          {auth.token && auth.role === "buyer" && (
            <>
              <Link to="/cart" className="relative hover:underline">
                🛒 Cart
                {cart.length > 0 && (
                  <span className="ml-1 bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:underline">My Orders</Link>
            </>
          )}

          {auth.token && auth.role === "farmer" && (
            <>
              <Link to="/dashboard/products" className="hover:underline">My Products</Link>
              <Link to="/dashboard/orders" className="hover:underline">My Orders</Link>
            </>
          )}

          {auth.token && auth.role === "admin" && (
            <>
              <Link to="/dashboard/users" className="hover:underline">Users</Link>
              <Link to="/dashboard/products" className="hover:underline">All Products</Link>
              <Link to="/dashboard/orders" className="hover:underline">All Orders</Link>
            </>
          )}

          <button
            onClick={handleChatClick}
            className="bg-white text-green-600 px-3 py-1.5 rounded hover:bg-gray-100"
          >
            💬 Chat Room
          </button>

          {auth.token ? (
            <button
              onClick={logout}
              className="bg-white text-red-600 px-3 py-1.5 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-white text-green-600 px-3 py-1.5 rounded hover:bg-gray-100">
                Login
              </Link>
              <Link to="/register" className="bg-white text-blue-600 px-3 py-1.5 rounded hover:bg-gray-100">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-green-700 px-6 py-4 space-y-4 text-sm font-medium">
          {auth.token && (
            <Link to="/dashboard" onClick={closeMenu} className="block hover:underline">
              Dashboard ({auth.role})
            </Link>
          )}

          {auth.token && auth.role === "buyer" && (
            <>
              <Link to="/cart" onClick={closeMenu} className="block hover:underline">
                🛒 Cart ({cart.length})
              </Link>
              <Link to="/orders" onClick={closeMenu} className="block hover:underline">
                My Orders
              </Link>
            </>
          )}

          {auth.token && auth.role === "farmer" && (
            <>
              <Link to="/dashboard/products" onClick={closeMenu} className="block hover:underline">My Products</Link>
              <Link to="/dashboard/orders" onClick={closeMenu} className="block hover:underline">My Orders</Link>
            </>
          )}

          {auth.token && auth.role === "admin" && (
            <>
              <Link to="/dashboard/users" onClick={closeMenu} className="block hover:underline">Users</Link>
              <Link to="/dashboard/products" onClick={closeMenu} className="block hover:underline">All Products</Link>
              <Link to="/dashboard/orders" onClick={closeMenu} className="block hover:underline">All Orders</Link>
            </>
          )}

          <button
            onClick={handleChatClick}
            className="block w-full text-left bg-white text-green-600 px-3 py-1.5 rounded hover:bg-gray-100"
          >
            💬 Chat Room
          </button>

          {auth.token ? (
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="block w-full text-left bg-white text-red-600 px-3 py-1.5 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="block bg-white text-green-600 px-3 py-1.5 rounded hover:bg-gray-100">
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="block bg-white text-blue-600 px-3 py-1.5 rounded hover:bg-gray-100">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
