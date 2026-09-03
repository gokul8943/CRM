import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import type { AuthUser } from "../../types/auth.types";

import {
  getCurrentUser,
  logout as logoutApi,
} from "./api/auth.api";

import {
  useAuthStore,
} from "../../store/auth.store";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(
    null
  );

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const user = useAuthStore(
    (state) => state.user
  );

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const clearAuth = useAuthStore(
    (state) => state.clearAuth
  );

  const [isLoading, setIsLoading] =
    useState(true);

  /**
   * Initialize authentication
   */
  useEffect(() => {
    let mounted = true;

    const initializeAuth =
      async () => {
        try {
          const response =
            await getCurrentUser();

          if (mounted) {
            setUser(
              response.user
            );
          }
        } catch (error) {
          if (mounted) {
            clearAuth();
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [setUser, clearAuth]);

  /**
   * Refresh current user
   */
  const refreshUser =
    useCallback(async () => {
      try {
        const response =
          await getCurrentUser();

        setUser(
          response.user
        );
      } catch (error) {
        clearAuth();
      }
    }, [
      setUser,
      clearAuth,
    ]);

  /**
   * Logout
   */
  const logout =
    useCallback(async () => {
      try {
        await logoutApi();
      } finally {
        clearAuth();
      }
    }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx =
    useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
};