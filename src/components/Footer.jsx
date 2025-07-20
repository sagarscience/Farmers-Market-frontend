import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">FarmersMarket</h2>
          <p className="text-sm">
            Empowering farmers and buyers through a secure and easy-to-use online trading platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/register" className="hover:underline">Register</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Support</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm">📧 support@farmersmarket.com</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <div className="flex mt-3 gap-4 text-white text-lg">
            <a href="#" className="hover:opacity-80"><FaFacebookF /></a>
            <a href="#" className="hover:opacity-80"><FaTwitter /></a>
            <a href="#" className="hover:opacity-80"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="bg-green-700 text-center text-sm py-4">
        © {new Date().getFullYear()} FarmersMarket. All rights reserved.
      </div>
    </footer>
  );
}
