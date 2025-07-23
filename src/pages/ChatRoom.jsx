import { useEffect, useState, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

export default function ChatRoom() {
  const { socket, onlineUsers, typingUser } = useChat();
  const { auth, loading } = useAuth();
  const { roomId = "global" } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !auth.token) {
      navigate("/login");
    }
  }, [auth.token, loading, navigate]);

  // Join room on load
  useEffect(() => {
    if (socket && roomId && auth?.user?.name) {
      socket.emit("joinRoom", roomId);
    }
  }, [socket, roomId, auth?.user?.name]);

  // Load and receive messages
  useEffect(() => {
    if (!socket) return;

    socket.on("loadMessages", setMessages);
    socket.on("receiveMessage", (data) =>
      setMessages((prev) => [...prev, data])
    );

    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, [socket]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (socket && auth?.user?.name) {
      socket.emit("typing", { from: auth.user.name, roomId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId });
    }, 1000);
  };

  const handleSend = () => {
    if (!message.trim() || !socket || !auth?.user?.name) return;

    const [user1, user2] = roomId.split("_");
    const recieverId =
      user1 === auth.user._id ? user2 : user1;

    socket.emit("sendMessage", {
      roomId,
      senderName: auth.user.name,
      senderId: auth.user._id,
      recieverId: roomId === "global" ? "global" : recieverId,
      role: auth.role,
      message,
    });

    setMessage("");
    socket.emit("stopTyping", { roomId });
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded flex flex-col sm:flex-row gap-4">
      {/* Sidebar: Online Users */}
      <div className="w-full sm:w-1/4 border-r pr-4">
        <h3 className="text-lg font-semibold text-green-700 mb-3">🟢 Online Users</h3>
        {onlineUsers.length === 0 ? (
          <p className="text-sm text-gray-400">No one online</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {onlineUsers.map((u, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {u.name} <span className="text-xs text-gray-500">({u.role})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-green-700">
          💬 Chat Room: {roomId === "global" ? "🌍 Global" : `Private (${roomId})`}
        </h2>

        <input
          type="text"
          placeholder="Search user or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full border px-3 py-2 rounded text-sm text-gray-700"
        />

        <div className="h-[30rem] overflow-y-auto mb-4 border rounded p-3 bg-gray-50">
          {filteredMessages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages found.</p>
          ) : (
            filteredMessages.map((msg, i) => {
              const isOwn = msg.sender === auth.user?.name;
              return (
                <div
                  key={i}
                  className={`flex flex-col max-w-[75%] mb-2 ${
                    isOwn ? "ml-auto items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded px-3 py-2 text-sm ${
                      isOwn
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="font-semibold">
                      {msg.sender}{" "}
                      <span className="text-xs text-gray-600 font-normal">
                        ({msg.role || "user"})
                      </span>
                    </div>
                    <div>{msg.message}</div>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}

          {typingUser && typingUser !== auth.user.name && (
            <div className="text-sm text-gray-500 italic">{typingUser} is typing...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 text-gray-700 border rounded px-3 py-2"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!socket?.connected}
          />
          <button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
