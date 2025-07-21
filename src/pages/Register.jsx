import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_BASE}/api/auth/register`, form);
      toast.success(res.data.message || "Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Register
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-sm text-gray-500 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Role */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 font-medium mb-1">
            Role
          </label>
          <select
            id="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
