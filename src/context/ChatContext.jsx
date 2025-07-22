// context/ChatContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const { auth } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    // Ensure user is authenticated with valid ID
    if (!auth?.user?.name || !auth?.role || !auth?.user?._id) return;

    // Prevent multiple socket connections
    if (!socketRef.current) {
      const newSocket = io(SOCKET_URL, {
        query: {
          name: auth.user.name,
          role: auth.role,
          userId: auth.user._id,
        },
        transports: ["websocket"],
      });

      socketRef.current = newSocket;
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
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Disconnected from socket");
        socketRef.current = null;
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
