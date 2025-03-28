import { DepartmentWithRatings } from "@/supabase/types/database.models";
import { DepartmentItem } from "./departmentItem";

interface DepartmentGridProps {
  departments: DepartmentWithRatings[];
}

export const DepartmentGrid = ({ departments }: DepartmentGridProps) => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xlgrid-cols-4 2xl:grid-cols-4 gap-6 mt-2">
      {departments?.map((department, index) => {
        return (
          <DepartmentItem department={department} index={index} key={index} />
        );
      })}
    </div>
  );
};
