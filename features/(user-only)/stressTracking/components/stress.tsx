import React from "react";
import { StressModal } from "../forms/stressModal";
import {
  useGetStressForUser,
  useGetTodayStressForUser,
} from "@/hooks/useStress";
import { Stress } from "@/supabase/types/database.models";
import { StressLineChart } from "./StressLineChart";

export const StressComponent = () => {
  const { data: stress } = useGetTodayStressForUser();
  const { data: lifetimeStress } = useGetStressForUser();
  return (
    <div className="w-full relative mt-1 my-6">
      <StressLineChart
        stress={stress as Stress}
        companyData={[]}
        data={lifetimeStress as Stress[]}
      />
    </div>
  );
};
