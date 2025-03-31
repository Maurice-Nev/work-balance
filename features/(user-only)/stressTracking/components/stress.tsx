import React from "react";
import { StressModal } from "../forms/stressModal";
import { useGetTodayStressForUser } from "@/hooks/useStress";
import { Stress } from "@/supabase/types/database.models";

export const StressComponent = () => {
  const { data: stress } = useGetTodayStressForUser();

  return (
    <div className="w-full h-44 rounded-lg px-4 py-3 mt-1 border my-6">
      tracking stuff / Charts
      {/* <pre>{JSON.stringify(stress, null, 2)}</pre> */}
      <StressModal initialValues={stress as Stress} />
    </div>
  );
};
