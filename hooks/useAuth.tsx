// amk

import {
  login,
  logout,
  register,
  validateUserSession,
} from "@/actions/authAction";
import { NewUser } from "@/supabase/types/database.models";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  newUser: NewUser;
}

/**
 * Hook for handling user login
 * @returns Mutation object for login operation
 */
export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const res = await login({ email, password });
      router.push("/");
      return res;
    },
  });
};

/**
 * Hook for handling user registration
 * @returns Mutation object for registration operation
 */
export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ newUser }: RegisterData) => {
      const res = await register({ newUser });
      router.push("/");
      return res;
    },
  });
};

/**
 * Hook for handling user logout
 * @returns Mutation object for logout operation
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await logout();
      router.push("/login");
      queryClient.invalidateQueries({ queryKey: ["getSelf"] });
      return res;
    },
  });
};

/**
 * Hook for fetching current user data
 * @returns Query object containing user data
 */
export const getSelf = () => {
  return useQuery({
    queryKey: ["getSelf"],
    queryFn: validateUserSession,
    staleTime: 1000 * 30, // 30 seconds
  });
};

/**
 * Hook for checking authentication status
 * @returns Object containing authentication status
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const { sessionToken } = parseCookies();
      setIsAuthenticated(!!sessionToken);
    };

    // Initial check
    checkAuth();

    // Check every 5 seconds instead of every second
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, []);

  return { isAuthenticated };
}
