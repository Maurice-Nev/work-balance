import React from "react";
import { StressChart } from "../components/stressChart";
import { SectionCards } from "../components/sectionCards";

export const AdminDashboard = React.memo(() => {
  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col gap-8">
        <SectionCards />
        <StressChart />
        <SectionCards />
        <StressChart />
        <SectionCards />
        <StressChart />
        <SectionCards />
        <StressChart />
      </div>
    </div>
  );
});
