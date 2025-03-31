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
import { PlusIcon } from "lucide-react";
import { Stress } from "@/supabase/types/database.models";
import CommentForm from "./stressForm";

interface StressModalProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValues?: Stress;
}

export function StressModal({ children, initialValues }: StressModalProps) {
  const [open, onOpenChange] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">Track your stress</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full p-0 overflow-hidden">
        <DialogHeader className="bg-muted p-4">
          <DialogTitle>
            {initialValues ? "Edit" : "Create"} Stress Lvl
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <CommentForm initialValues={initialValues as Stress} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
