"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { StressFormSchema } from "./validation/StressVal";
import { NewStress, Stress } from "@/supabase/types/database.models";
import NumberInput from "@/components/formInputs/NumberInput";
import { useCreateStress, useUpdateStress } from "@/hooks/useStress";
import SelectInput from "@/components/formInputs/SelectInput";
import { useGetAllDepartmentsWithoutRatings } from "@/hooks/useDepartment";

interface CommentFormProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValues?: Stress;
}

export const CommentForm = ({
  initialValues,
  className,
  ...props
}: CommentFormProps) => {
  const form = useForm<z.infer<typeof StressFormSchema>>({
    resolver: zodResolver(StressFormSchema),
    defaultValues: {
      stress: initialValues?.stress || 0,
      department_id: initialValues?.department_id || "",
    },
  });
  const { data: options, isLoading: optionsLoading } =
    useGetAllDepartmentsWithoutRatings();

  const { mutate: createStress, isPending } = useCreateStress();
  const { mutate: updateStress, isPending: isUpdating } = useUpdateStress();

  function onSubmit(data: z.infer<typeof StressFormSchema>) {
    const newStress = {
      ...data,
    } as NewStress;

    initialValues
      ? updateStress({ stress_id: initialValues.id, updates: newStress })
      : createStress({ newStress: newStress });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <SelectInput
            control={form.control}
            validationFieldName="department_id"
            label="Department"
            placeholder="Choose your department"
            options={
              options?.map((item) => ({
                label: item.name || "Unknown",
                value: item.id,
              })) || []
            }
            // description="Please choose your department"
            className="w-full"
          />
          <NumberInput
            control={form.control}
            label="How is your stress Lvl today?"
            placeholder="2"
            validationFieldName="stress"
          />
          <Button
            type="submit"
            disabled={isPending || isUpdating || optionsLoading}
            className="w-full"
          >
            {initialValues ? "Update" : "Send"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
