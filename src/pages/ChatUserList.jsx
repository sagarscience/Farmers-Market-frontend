import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChatUserList() {
  const { onlineUsers } = useChat();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleSelectUser = (user) => {
    const myName = auth.user?.name;
    const otherName = user.name;
    const roomId = [myName, otherName].sort().join("_");
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">🟢 Online Users</h2>

      {onlineUsers.length <= 1 ? (
        <p className="text-gray-500 text-sm">No other users online.</p>
      ) : (
        <ul className="space-y-3">
          {onlineUsers
            .filter((u) => u.name !== auth.user?.name)
            .map((user, i) => (
              <li
                key={i}
                onClick={() => handleSelectUser(user)}
                className="cursor-pointer p-2 hover:bg-green-50 border rounded flex justify-between items-center transition"
              >
                <div>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <span className="text-xs text-gray-500">{user.role}</span>
                </div>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
