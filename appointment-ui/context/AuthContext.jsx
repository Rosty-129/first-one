import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("authtoken") || null);
  const [user, setUser] = useState(null);

  // Helper function to decode JWT payload safely
  const parseJwt = (tokenStr) => {
    try {
      const base64Url = tokenStr.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken, role) => {
    localStorage.setItem("authtoken", newToken);
    setToken(newToken);
    const decoded = parseJwt(newToken);
    setUser(decoded || { role });
  };

  const logout = () => {
    localStorage.removeItem("authtoken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}