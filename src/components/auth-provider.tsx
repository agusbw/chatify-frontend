import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { AuthContextType, UserAuthData } from "@/lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    Cookies.get("token") || null
  );
  const [user, setUser] = useState<UserAuthData | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log({ errorData });
        throw new Error(errorData.error);
      }

      const data: {
        token: string;
        user: { id: number; username: string };
      } = await res.json();

      setToken(() => data.token);
      setUser({ id: data.user.id, username: data.user.username });

      Cookies.set("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: data.user.id, username: data.user.username })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("token");
    localStorage.removeItem("user");
  };

  const checkAuthenticated = () => {
    const token = Cookies.get("token");
    return token !== null;
  };

  useEffect(() => {
    const isAuthenticated = checkAuthenticated();
    if (isAuthenticated) {
      setToken(Cookies.get("token") || null);
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    }
  }, [token]);

  const contextValue: AuthContextType = {
    token,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
