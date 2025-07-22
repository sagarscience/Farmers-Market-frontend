import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null, user: null });
  const [loading, setLoading] = useState(true); // ✅ loading added

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("🧩 Decoded token inside useEffect:", decoded);
        setAuth({
          token,
          role: decoded.role,
          user: { name: decoded.name, email: decoded.email, _id: decoded.id },
        });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }

    setLoading(false); // ✅ 🔥 MOVE THIS OUTSIDE the if-block
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("🔓 Decoded JWT:", decoded);

      localStorage.setItem("token", token);

      setAuth({
        token,
        role: decoded.role,
        user: {
          name: decoded.name,
          email: decoded.email,
          _id: decoded.id,
        },
      });
    } catch (err) {
      console.error("Login token decode failed:", err);
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
