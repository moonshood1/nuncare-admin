import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!token;

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token");
      const isAuthRoute =
        location.pathname === "/login" ||
        location.pathname === "/reset-password";

      // Redirige vers la page du login si l'url actuelle n'est pas login ou reset
      if (!storedToken && !isAuthRoute) {
        navigate("/login");
        return;
      }

      // Si l'utilisateur est connecté et essaie d'acceder au login , redirection vers la homepage
      if (storedToken && isAuthRoute) {
        navigate("/");
        return;
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
