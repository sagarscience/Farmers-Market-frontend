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
    <div className="p-4 border rounded shadow bg-white max-w-md mx-auto mt-6">
      <h2 className="text-lg font-bold text-green-700 mb-3">🟢 Online Users</h2>
      {onlineUsers.length === 0 ? (
        <p className="text-sm text-gray-500">No users online</p>
      ) : (
        <ul className="space-y-2">
          {onlineUsers
            .filter((u) => u.name !== auth.user?.name)
            .map((user, i) => (
              <li
                key={i}
                className="cursor-pointer hover:text-green-700 text-gray-800"
                onClick={() => handleSelectUser(user)}
              >
                {user.name} <span className="text-sm text-gray-500">({user.role})</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
