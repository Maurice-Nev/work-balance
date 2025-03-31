"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import EmailInput from "@/components/formInputs/EmailInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import PasswordInput from "@/components/formInputs/PasswordInput";

import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { useLogin } from "@/hooks/useAuth";
import { LoginFormSchema } from "./validation/loginVal";
import { QueryClient } from "@tanstack/react-query";
import Logo from "@/components/general/logo";

export const LoginForm = ({ className, ...props }: any) => {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isPending } = useLogin();

  // 🟢 Funktion zum Verschlüsseln eines Passworts
  async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10); // `10` entspricht der Sicherheit von `gen_salt('bf')`
    return await bcrypt.hash(password, salt);
  }
  const queryClient = new QueryClient();

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    loginMutation(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          if (res) {
            toast.success("Login successfull!", {
              description: <pre>{res.message}</pre>,
            });
            // queryClient.invalidateQueries();
          }
        },
        onError: (err) => {
          toast.error("Login error", {
            description: <pre>{JSON.stringify(err, null, 2)}</pre>,
          });
        },
      }
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Email and Password</CardDescription>
          <div className=" flex size-6 items-center justify-center w-full rounded-md bg-foreground py-6 mt-6">
            <Logo className="text-background" />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <EmailInput
                validationFieldName={"email"}
                control={form.control}
              />
              <PasswordInput
                control={form.control}
                validationFieldName="password"
              />
              <Button type="submit" disabled={isPending} className="w-full">
                Login
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking Login, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default LoginForm;
