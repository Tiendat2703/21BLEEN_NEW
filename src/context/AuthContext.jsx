import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  // Temporary login without storing in localStorage
  const login = (userIdParam, accessToken) => {
    setUserId(userIdParam);
    setToken(accessToken);
    setIsAuthenticated(true);
    // Note: No localStorage storage - session is temporary
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
    setIsAuthenticated(false);
    // No need to remove from localStorage since we don't store there
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
