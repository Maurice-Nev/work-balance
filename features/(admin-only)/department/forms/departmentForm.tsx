"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { DepartmentFormSchema } from "./validation/departmentVal";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/hooks/useDepartment";
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

  async function onSubmit(data: z.infer<typeof DepartmentFormSchema>) {
    initialValues?.id
      ? updateDepartment({
          department_id: initialValues.id,
          updates: data,
        })
      : createDepartment({ name: data.name });
  }

  return (
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
  );
};

export default DepartmentForm;
