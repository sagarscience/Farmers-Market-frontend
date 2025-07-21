import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ChatLink() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!auth?.token) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <Link to="/chat" onClick={handleClick}>
      <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        💬 Chat Room
      </div>
    </Link>
  );
}
