import { useState, useEffect } from "react";
import { User } from "@/types";
import { authStorage } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = () => setUser(authStorage.getUser());
    load();
    setIsLoading(false);
    const onStorage = (e: StorageEvent) => {
      if (["access_token","refresh_token","user"].includes(e.key || "")) load();
    };
    const onAuthChanged = () => load();
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth:changed', onAuthChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth:changed', onAuthChanged);
    };
  }, []);

  const login = (user: User, accessToken: string, refreshToken: string) => {
    authStorage.setUser(user);
    authStorage.setAccessToken(accessToken);
    authStorage.setRefreshToken(refreshToken);
    setUser(user);
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    authStorage.setUser(updatedUser);
    setUser(updatedUser);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };
}
