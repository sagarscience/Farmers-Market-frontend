// components/ChatLink.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChatLink() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!auth?.token) {
      e.preventDefault(); // prevent default <Link> navigation
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      💬 Chat Room
    </button>
  );
}
