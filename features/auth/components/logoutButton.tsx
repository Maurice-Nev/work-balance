"use client";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { destroyCookie } from "nookies";
import { toast } from "sonner";
import { VariantProps } from "class-variance-authority";
import { useRouter } from "next/navigation";

export const LogoutButton = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { mutate: logoutMutation, isPending } = useLogout();
  const router = useRouter();

  function logout() {
    logoutMutation(undefined, {
      onSuccess: (res) => {
        if (res) {
          toast.success("Logout erfolgreich!", {
            description: <pre>{JSON.stringify(res, null, 2)}</pre>,
          });

          destroyCookie(null, "sessionToken");
          queryClient.invalidateQueries({ queryKey: ["getSelf"] });
          router.push("/login");
          // window.location.reload();
        }
      },
      onError: (err) => {
        toast.error("Logout fehlgeschlagen", {
          description: <pre>{JSON.stringify(err, null, 2)}</pre>,
        });
      },
    });
  }

  const Comp = asChild ? Slot : "button";

  if (!isAuthenticated) return null;
  return (
    <Comp
      data-slot="button"
      onClick={logout}
      disabled={isPending}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    ></Comp>
  );
};
