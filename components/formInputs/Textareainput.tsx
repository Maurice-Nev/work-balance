"use client";

import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface TextareaInputProps {
  control: Control<any> | undefined;
  validationFieldName: string;
  label: string;
  placeholder: string;
  description?: string;
  className?: string;
}

export const TextareaInput = ({
  control,
  validationFieldName,
  label,
  placeholder,
  description,
  className,
}: TextareaInputProps) => {
  return (
    <FormField
      control={control}
      name={validationFieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              className={className}
              placeholder={placeholder}
              {...field}
              rows={10}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaInput;
