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
import { RegisterFormSchema } from "./vaidation/registerVal";
import { toast } from "sonner";
import { useRegister } from "@/hooks/useAuth";
import { QueryClient } from "@tanstack/react-query";
import { useCreateUser, useUpdateUser } from "@/hooks/useUser";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValues?: any;
}

export const RegisterForm = ({
  initialValues,
  className,
  ...props
}: RegisterFormProps) => {
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      surname: initialValues?.surname || "",
      email: initialValues?.email || "",
      password: "",
    },
  });

  // const { mutate: registerMutation, isPending } = useRegister();
  const { mutate: createUser, isPending } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  function onSubmit(data: z.infer<typeof RegisterFormSchema>) {
    initialValues
      ? updateUser(
          { user_id: initialValues.id, updates: data },
          {
            onSuccess: (res) => {
              if (res) {
                toast.success("Update successfull!", {
                  description: <pre>{JSON.stringify(res, null, 2)}</pre>,
                });
                // queryClient.invalidateQueries();
              }
            },
            onError: (err) => {
              toast.error("Update error", {
                description: <pre>{JSON.stringify(err, null, 2)}</pre>,
              });
            },
          }
        )
      : createUser(
          { newUser: data },
          {
            onSuccess: (res) => {
              if (res) {
                toast.success("Register successfull!", {
                  description: <pre>{JSON.stringify(res, null, 2)}</pre>,
                });
                // queryClient.invalidateQueries();
              }
            },
            onError: (err) => {
              toast.error("Register error", {
                description: <pre>{JSON.stringify(err, null, 2)}</pre>,
              });
            },
          }
        );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
          <EmailInput validationFieldName={"email"} control={form.control} />
          <PasswordInput
            control={form.control}
            validationFieldName="password"
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {initialValues ? "Submit" : "Register"}
          </Button>
        </form>
      </Form>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking Register, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default RegisterForm;
