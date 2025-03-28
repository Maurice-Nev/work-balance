"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RegisterForm from "../forms/registerForm";
import { PlusIcon } from "lucide-react";
import { NewDepartment } from "@/supabase/types/database.models";

interface RegisterModalProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValues?: NewDepartment;
}

export function RegisterModal({ children, initialValues }: RegisterModalProps) {
  const [open, onOpenChange] = React.useState(false);

  return (
    <div>
      <div className="">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            {children ? (
              children
            ) : (
              <Button variant="outline" size="sm">
                <PlusIcon />
                <span className="hidden lg:inline">Add User</span>
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] w-full p-0 overflow-hidden">
            <DialogHeader className="bg-muted p-4">
              <DialogTitle>
                {initialValues ? "Edit" : "Create"} User
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <RegisterForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
