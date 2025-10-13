import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // No persistent authentication - always start as unauthenticated
    // This ensures users always need to enter passcode
    setIsAuthenticated(false);
    setUserId(null);
    setToken(null);
  }, []);

  const login = (userIdParam, accessToken) => {
    setUserId(userIdParam);
    setToken(accessToken);
    setIsAuthenticated(true);
    // No localStorage storage - session only exists in memory
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
    setIsAuthenticated(false);
    // No localStorage cleanup needed since we don't store there
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
