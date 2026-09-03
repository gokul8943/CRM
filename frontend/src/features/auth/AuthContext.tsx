import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import type { AuthUser } from '../../types/auth.types';

import {
  getCurrentUser,
  logout as logoutApi,
} from './api/auth.api';

import { useAuthStore } from '../../store/auth.store';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const user = useAuthStore(
    (state) => state.user
  );

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  const clearAuth = useAuthStore(
    (state) => state.clearAuth
  );

  const [isLoading, setIsLoading] =
    useState(true);

  /**
   * Initialize authentication
   *
   * 1. Try to get current user.
   * 2. If access token is expired/missing,
   *    Axios interceptor will refresh it.
   * 3. Get current user again.
   */
  useEffect(() => {

    let mounted = true;

    const initializeAuth = async () => {

      try {

        let currentUser;

        try {

          // First try /me
          const response =
            await getCurrentUser();

          currentUser = response.user;

        } catch (error: any) {

          // Axios interceptor will attempt
          // refresh automatically on 401.

          const accessToken =
            useAuthStore.getState()
              .accessToken;

          if (!accessToken) {
            throw error;
          }

          const response =
            await getCurrentUser();

          currentUser = response.user;
        }

        if (mounted) {

          const accessToken =
            useAuthStore.getState()
              .accessToken;

          if (accessToken) {
            setAuth(
              currentUser,
              accessToken
            );
          }
        }

      } catch {

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

  }, [setAuth, clearAuth]);


  /**
   * Manually refresh current user
   */
  const refreshUser = useCallback(
    async () => {

      try {

        const response =
          await getCurrentUser();

        const accessToken =
          useAuthStore.getState()
            .accessToken;

        if (accessToken) {

          setAuth(
            response.user,
            accessToken
          );

        }

      } catch {

        clearAuth();

      }

    },
    [setAuth, clearAuth]
  );


  /**
   * Logout
   */
  const logout = useCallback(
    async () => {

      try {

        await logoutApi();

      } finally {

        clearAuth();

      }
    },
    [clearAuth]
  );


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
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
};