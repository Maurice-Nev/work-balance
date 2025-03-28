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
import { NewRating } from "@/supabase/types/database.models";
import CommentForm from "./commentForm";

interface CommentModalProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValues?: NewRating;
  department_id: string;
}

export function CommentModal({
  children,
  initialValues,
  department_id,
}: CommentModalProps) {
  const [open, onOpenChange] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">Write Comment</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full p-0 overflow-hidden">
        <DialogHeader className="bg-muted p-4">
          <DialogTitle>{initialValues ? "Edit" : "Create"} Comment</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <CommentForm
            department_id={department_id}
            initialValues={initialValues}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
