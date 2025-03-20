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
import DepartmentForm from "../forms/departmentForm";
import { PlusIcon } from "lucide-react";
import { NewDepartment } from "@/supabase/types/database.models";

interface DepartmentModalProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValues?: NewDepartment;
}

export function DepartmentModal({
  children,
  initialValues,
}: DepartmentModalProps) {
  const [openDialog, setOpenDdialog] = React.useState(false);

  return (
    <div>
      <div className="">
        <Dialog open={openDialog} onOpenChange={setOpenDdialog}>
          <DialogTrigger asChild>
            {children ? (
              children
            ) : (
              <Button variant="outline" size="sm">
                <PlusIcon />
                <span className="hidden lg:inline">Add Department</span>
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] w-full p-0 overflow-hidden">
            <DialogHeader className="bg-muted p-4">
              <DialogTitle>
                {initialValues ? "Edit" : "Create"} Department
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <DepartmentForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
