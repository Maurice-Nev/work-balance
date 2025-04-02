import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Eye } from "lucide-react";
import {
  DepartmentStressLineChart,
  StressData,
} from "./departmentStressLineChart";
import { CommentsList } from "./commentsList";
import { DialogClose } from "@radix-ui/react-dialog";
import { Period } from "@/hooks/useDepartmentAnalytics";

type StressChangesData =
  | {
      department_id: string;
      department_name: string;
      stress_values: {
        period: string;
        avg_stress: number;
      }[];
    }
  | undefined;

interface CompanyStatisticModalProps {
  department_name: string;
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  stressChangesData: StressChangesData;
}

export const DepartmentStatisticModal = ({
  department_name,
  period,
  setPeriod,

  stressChangesData,
}: CompanyStatisticModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen md:w-[66vw] max-w-screen overflow-hidden sm:max-w-screen p-6">
        <div className="w-full overflow-hidden h-full relative">
          <DialogHeader>
            <DialogTitle>Stress Level - {department_name}</DialogTitle>
            <div className="flex justify-between flex-col lg:flex-row">
              Dynamically adjusted for different screen sizes
              <div className="flex gap-4">
                <Button onClick={() => setPeriod("week")} variant={"outline"}>
                  <Calendar /> 1 week
                </Button>{" "}
                <Button onClick={() => setPeriod("month")} variant={"outline"}>
                  <Calendar /> 1 month
                </Button>{" "}
                <Button
                  onClick={() => setPeriod("8_weeks")}
                  variant={"outline"}
                >
                  <Calendar /> 8 weeks
                </Button>
              </div>
            </div>
          </DialogHeader>
          <DepartmentStressLineChart
            data={stressChangesData?.stress_values as StressData[]}
            departmentName={department_name as string}
          />
          <div className="text-xl my-4">Comments</div>
          <div className="max-w-full relative h-52 overflow-hidden">
            <CommentsList
              period={period}
              departmentId={stressChangesData?.department_id as string}
            />
          </div>
          <DialogFooter className="sm:justify-start mt-6 max-w-full items-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
