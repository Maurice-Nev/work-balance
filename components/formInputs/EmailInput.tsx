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

interface EmailInputProps {
  control: Control<any> | undefined;
  validationFieldName: string;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
}

export const EmailInput = ({
  control,
  validationFieldName,
  label = "Email",
  placeholder = "m.musterman@hot-mail.com",
  description,
  className,
}: EmailInputProps) => {
  return (
    <FormField
      control={control}
      name={validationFieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="email"
              className={className}
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

export default EmailInput;
