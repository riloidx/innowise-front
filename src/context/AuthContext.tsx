import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: string | null;
  loginUser: (accessToken: string, refreshToken: string, login: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [login, setLogin] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUserId = localStorage.getItem('userId');
    const storedLogin = localStorage.getItem('login');
    
    if (token && storedUserId && storedLogin) {
      setIsAuthenticated(true);
      setUserId(parseInt(storedUserId));
      setLogin(storedLogin);
    }
  }, []);

  const loginUser = (accessToken: string, refreshToken: string, userLogin: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('login', userLogin);
    
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const userIdFromToken = payload.userId;
    
    localStorage.setItem('userId', userIdFromToken.toString());
    setUserId(userIdFromToken);
    setLogin(userLogin);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('userId');
    localStorage.removeItem('login');
    setIsAuthenticated(false);
    setUserId(null);
    setLogin(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
