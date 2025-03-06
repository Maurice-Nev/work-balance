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
import BasicInput from "@/components/formInputs/BasicInput";
import {
  onRegisterSubmit,
  RegisterFormSchema,
} from "./formLogics/registerLogic";

export const RegisterForm = ({ className, ...props }: any) => {
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Register with your Credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onRegisterSubmit)}
              className="w-full space-y-6"
            >
              <div className="flex gap-4">
                <BasicInput
                  control={form.control}
                  label="Name"
                  placeholder="Max"
                  validationFieldName="name"
                />
                <BasicInput
                  control={form.control}
                  label="Surname"
                  placeholder="Musterman"
                  validationFieldName="surname"
                />
              </div>
              <EmailInput
                validationFieldName={"email"}
                control={form.control}
              />
              <PasswordInput
                control={form.control}
                validationFieldName="password"
              />
              <Button type="submit" className="w-full">
                Register
              </Button>
              <div className="text-center text-sm">
                You have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking Register, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default RegisterForm;
