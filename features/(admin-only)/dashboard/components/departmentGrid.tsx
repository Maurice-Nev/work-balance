"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Eye, Star } from "lucide-react";
import React, { JSX } from "react";
import { DepartmentStressLineChart } from "./departmentStressLineChart";
import { CommentsList } from "./commentsList";
import { DialogClose } from "@radix-ui/react-dialog";
import { DepartmentStatisticModal } from "./departmentStatisticModal";

type AverageStressData =
  | {
      department_name: string | null;
      average_stress: number;
    }[]
  | undefined;

type StressChangesData =
  | {
      department_id: string;
      department_name: string;
      stress_values: {
        period: string;
        avg_stress: number;
      }[];
    }[]
  | undefined;

type Period = "week" | "month" | "8_weeks";

interface CompanyGridProps {
  averageStressData: AverageStressData;
  stressChangesData: StressChangesData;
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
}

export const DepartmentGrid = ({
  averageStressData,
  stressChangesData,
  period,
  setPeriod,
}: CompanyGridProps) => {
  function generateStars(avgRating: number): JSX.Element[] {
    return Array.from({ length: Math.round(avgRating) }, (_, index) => (
      <Star className="fill-foreground" key={index} />
    ));
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 mt-6 relative">
      {averageStressData?.map((item, index) => {
        return (
          <div
            className="border rounded-xl overflow-hidden px-0 text-lg"
            key={index}
          >
            <div className="grid justify-items-stretch grid-cols-1 grid-rows-3 w-full h-full">
              <div className="border-b h-10 flex items-center bg-sidebar">
                <span className="py-2 px-3">{item.department_name}</span>
              </div>
              <div className="px-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="">
                    {/* {generateStars(item.average_stress)} */}
                    Avg Stress Lvl: {item.average_stress}
                  </div>
                  <DepartmentStatisticModal
                    period={period}
                    setPeriod={setPeriod}
                    department_name={item.department_name as string}
                    key={index}
                    stressChangesData={stressChangesData?.find(
                      (data) => data.department_name === item.department_name
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
