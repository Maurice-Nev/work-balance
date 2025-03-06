"use client";

import { toast } from "sonner";
import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function onLoginSubmit(data: z.infer<typeof LoginFormSchema>) {
  toast("You submitted the following values:", {
    description: (
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
  });
}
