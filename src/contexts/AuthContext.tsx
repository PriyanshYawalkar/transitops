"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  email: string | null;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BYPASS FOR LOCAL TEST CREDENTIALS
    const isTestUser = typeof window !== 'undefined' && localStorage.getItem("test_user_loggedIn") === "true";
    if (isTestUser) {
      setUser({ email: "test@transitops.io", uid: "test-user-123" });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
