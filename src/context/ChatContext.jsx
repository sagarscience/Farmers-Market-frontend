// context/ChatContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";


const ChatContext = createContext();
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    if (!auth?.user?.name || !auth?.role) return;

    const newSocket = io(SOCKET_URL, {
      query: { name: auth.user.name, role: auth.role, userId: auth.user._id },
      transports: ["websocket"], // Force WebSocket for more stable connection
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("typing", ({ from }) => {
      setTypingUser(from);
    });

    newSocket.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log("🔌 Disconnected from socket");
      }
      setSocket(null);
      setOnlineUsers([]);
      setTypingUser("");
    };
  }, [auth]);

  return (
    <ChatContext.Provider value={{ socket, onlineUsers, typingUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
