"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { DepartmentFormSchema } from "./validation/departmentVal";
import { useCreateDepartment, useUpdateDepartment } from "@/hooks/department";
import BasicInput from "@/components/formInputs/BasicInput";
import { NewDepartment } from "@/supabase/types/database.models";

interface DepartmentFormProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValues?: NewDepartment;
}

export const DepartmentForm = ({
  className,
  initialValues,
  ...props
}: DepartmentFormProps) => {
  const form = useForm<z.infer<typeof DepartmentFormSchema>>({
    resolver: zodResolver(DepartmentFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
    },
  });

  const { mutate: createDepartment, isPending } = useCreateDepartment();
  const { mutate: updateDepartment, isPending: updateIsPending } =
    useUpdateDepartment();

  const queryClient = new QueryClient();

  async function onSubmit(data: z.infer<typeof DepartmentFormSchema>) {
    initialValues?.id
      ? updateDepartment(
          { department_id: initialValues.id, updates: { name: data.name } },
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
      : createDepartment(
          { name: data.name },
          {
            onSuccess: (res) => {
              if (res) {
                toast.success("Create successfull!", {
                  description: <pre>{JSON.stringify(res, null, 2)}</pre>,
                });
                // queryClient.invalidateQueries();
              }
            },
            onError: (err) => {
              toast.error("Create error", {
                description: <pre>{JSON.stringify(err, null, 2)}</pre>,
              });
            },
          }
        );
  }

  return (
    <div>
      {" "}
      <div className={cn(" h-full gap-6 w-full", className)} {...props}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6 h-full"
          >
            <BasicInput
              control={form.control}
              label="Name"
              placeholder="IT"
              validationFieldName="name"
            />

            <Button
              type="submit"
              disabled={isPending || updateIsPending}
              className="w-full"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DepartmentForm;
