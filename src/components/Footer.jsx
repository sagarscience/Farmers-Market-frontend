import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">FarmersMarket</h2>
          <p className="text-sm leading-relaxed">
            Empowering farmers and buyers through a secure and easy-to-use online trading platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white">Home</Link></li>
            <li><Link to="/login" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white">Login</Link></li>
            <li><Link to="/register" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white">Register</Link></li>
            <li><Link to="/dashboard" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white">Dashboard</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white">Support</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm">📧 support@farmersmarket.com</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <div className="flex mt-4 gap-4 text-white text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-gray-200 transition-all">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-200 transition-all">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-200 transition-all">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-green-700 text-center text-sm py-4">
        © {new Date().getFullYear()} <span className="font-semibold">FarmersMarket</span>. All rights reserved.
      </div>
    </footer>
  );
}
