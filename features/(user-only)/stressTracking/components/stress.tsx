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
      {/* tracking stuff / Charts */}
      {/* <pre>{JSON.stringify(stress, null, 2)}</pre> */}
      {/* <div className="w-fit overflow-auto bg-black">
        <pre>
          {lifetimeStress?.map((item, index) => {
            return <div key={index}>{JSON.stringify(item, null, 2)}</div>;
          })}
        </pre>
      </div> */}
      <StressLineChart companyData={[]} data={lifetimeStress as Stress[]} />
      <StressModal
        className="absolute top-6 right-6"
        initialValues={stress as Stress}
      />
    </div>
  );
};
