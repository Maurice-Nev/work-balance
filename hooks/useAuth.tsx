// amk

import {
  login,
  logout,
  register,
  validateUserSession,
} from "@/actions/authAction";
import { NewUser } from "@/supabase/types/database.models";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await login({ email: email, password: password });
      router.push("/");
      return res;
    },
  });
  return mutation;
};

export const useRegister = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({ newUser }: { newUser: NewUser }) => {
      const res = await register({ newUser: newUser });
      router.push("/");
      return res;
    },
  });
  return mutation;
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = new QueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await logout();
      router.push("/login");
      queryClient.invalidateQueries({ queryKey: ["getSelf"] });
      return res;
    },
  });
  return mutation;
};

export const getSelf = () => {
  const query = useQuery({
    queryKey: ["getSelf"],
    queryFn: async () => {
      const res = await validateUserSession();
      return res;
    },
    // staleTime: 0,
    // cacheTime: 1000 * 60 * 5, // 5 Minuten
    staleTime: 1000 * 30, // 30 Sekunden
  });
  return query;
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = parseCookies();
      const sessionToken = cookies.sessionToken;
      setIsAuthenticated(!!sessionToken);
    };

    checkAuth();

    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  return { isAuthenticated };
}
