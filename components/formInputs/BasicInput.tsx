"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface BasicInputProps {
  control: Control<any> | undefined;
  validationFieldName: string;
  label: string;
  placeholder: string;
  description?: string;
  className?: string;
}

export const BasicInput = ({
  control,
  validationFieldName,
  label,
  placeholder,
  description,
  className,
}: BasicInputProps) => {
  return (
    <FormField
      control={control}
      name={validationFieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input className={className} placeholder={placeholder} {...field} />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BasicInput;
