// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  setLogin: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // On mount, restore auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) return;

    const parts = token.split(".");
    const isJWT = parts.length === 3;

    try {
      if (isJWT) {
        const decoded = JSON.parse(atob(parts[1]));

        if (decoded) {
          setUser(decoded);
          localStorage.setItem("user", JSON.stringify(decoded));
          setIsLoggedIn(true);
          return;
        }
      }

      // Fallback to stored user
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
        return;
      }

      // If no user anywhere, log out
      logout();
    } catch (err) {
      console.error("Token decode failed:", err);
      // but do NOT remove token automatically
      // logout();  <-- REMOVE THIS
      setIsLoggedIn(false);
    }
  }, []);

  const setLogin = (token: string, userObj: User) => {
    // persist token + user
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
