"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { CommentFormSchema } from "./validation/commentVal";
import { useCreateRating, useUpdateRating } from "@/hooks/useRating";
import { NewRating } from "@/supabase/types/database.models";
import NumberInput from "@/components/formInputs/NumberInput";
import TextareaInput from "@/components/formInputs/Textareainput";

interface CommentFormProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValues?: any;
  department_id: string;
}

export const CommentForm = ({
  initialValues,
  className,
  department_id,
  ...props
}: CommentFormProps) => {
  const form = useForm<z.infer<typeof CommentFormSchema>>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      comment: initialValues?.comment || "",
      rating: initialValues?.rating || "0",
    },
  });

  const { mutate: createRating, isPending } = useCreateRating();
  const { mutate: updateRating, isPending: isUpdating } = useUpdateRating();

  function onSubmit(data: z.infer<typeof CommentFormSchema>) {
    const newRating = {
      ...data,
      department_id: department_id,
    } as NewRating;

    initialValues
      ? updateRating({ rating_id: initialValues.id, updates: newRating })
      : createRating({ newRating: newRating });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <NumberInput
            control={form.control}
            label="Rating"
            placeholder="4"
            validationFieldName="rating"
          />
          <TextareaInput
            control={form.control}
            label="Comment"
            placeholder="Need better organisation"
            validationFieldName="comment"
          />
          <Button
            type="submit"
            disabled={isPending || isUpdating}
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
