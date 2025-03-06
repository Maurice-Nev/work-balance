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

interface PasswordInputProps {
  control: Control<any> | undefined;
  validationFieldName: string;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
}

export const PasswordInput = ({
  control,
  validationFieldName,
  label = "Password",
  placeholder = "*******",
  description,
  className,
}: PasswordInputProps) => {
  return (
    <FormField
      control={control}
      name={validationFieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className={className}
              type="password"
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordInput;
