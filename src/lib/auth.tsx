// lib/auth-context.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ACCESS_TOKEN_KEY = "access_token";
const IS_ADMIN_KEY = "is_admin";
const EXPIRES_AT_KEY = "expires_at";

type AuthContextType = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string, isAdmin: boolean, expiresAt?: number | string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    const exp = json.expires_at ?? json.exp;
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  if (!token) return false;
  const exp = getTokenExpiry(token);
  if (exp === null) return false;
  return exp * 1000 > Date.now();
}

function clearStoredAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(IS_ADMIN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && isTokenValid(token)) {
      setIsLoggedIn(true);
      setIsAdmin(localStorage.getItem(IS_ADMIN_KEY) === "true");
    } else {
      clearStoredAuth();
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const login = (
    token: string,
    isAdmin: boolean,
    expiresAt?: number | string
  ) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(IS_ADMIN_KEY, isAdmin.toString());
    if (expiresAt != null) {
      localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
    }
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    clearStoredAuth();
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
