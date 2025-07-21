import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const url=import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/auth/login`, form);
      const token = res.data.token;

      login(token);
      const decoded = jwtDecode(token);
      const role = decoded.role;

      toast.success("✅ Login successful!");

      if (role === "admin") navigate("/admin");
      else if (role === "farmer" || role === "buyer") navigate("/dashboard");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error("❌ Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Login</h2>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="text-black w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="text-black w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <span
              onClick={togglePassword}
              className="absolute top-9 right-3 text-gray-500 cursor-pointer"
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Register Redirect */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-700 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
