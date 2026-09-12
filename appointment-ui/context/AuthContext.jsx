import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Corrected: useState uses array destructuring [value, setter]
  const [token, setToken] = useState(() => localStorage.getItem("authtoken"));

  const login = (newToken) => {
    localStorage.setItem("authtoken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    // Corrected: pass string key "authtoken", not variable newtoken
    localStorage.removeItem("authtoken");
    setToken(null);
  };

  // Corrected: return statement must be inside the AuthProvider function
  return (
    <AuthContext.Provider value={{ login, logout, token, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};