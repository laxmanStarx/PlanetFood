import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userId: string | null;
  login: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem("userId"); // Load userId from localStorage on first load
  });

  // Save userId to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

  const login = (id: string) => {
    setUserId(id);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId"); // Clear userId when logging out
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
