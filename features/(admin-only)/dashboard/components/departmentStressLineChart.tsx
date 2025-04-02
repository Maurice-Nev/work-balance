"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  stress: {
    label: "Stress Level",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export type StressData = {
  period: string;
  avg_stress: number;
};

export function DepartmentStressLineChart({
  departmentName,
  data,
}: {
  departmentName: string;
  data: StressData[];
}) {
  const [visibleData, setVisibleData] = useState<StressData[]>(data);
  useEffect(() => {
    const updateChartData = () => {
      const screenWidth = window.innerWidth;
      let dataLength = 56; // Standard: 8 weeks

      if (screenWidth < 600) {
        dataLength = 14; // Mobile: 2 weeks
      } else if (screenWidth < 900) {
        dataLength = 28; // Tablet: 4 weeks
      }
      if (data && data.length > 0) {
        const latestData = data.slice(-dataLength); // Latest entries from the end
        setVisibleData(latestData);
      }
    };

    updateChartData();
    window.addEventListener("resize", updateChartData);
    return () => window.removeEventListener("resize", updateChartData);
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
      <ResponsiveContainer>
        <LineChart
          data={visibleData}
          margin={{
            top: 20,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(5, 10)} // Format: MM-DD
          />
          <YAxis
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={{ value: "Stress", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            content={<ChartTooltipContent indicator="line" />}
            formatter={(value) => `Stress Level: ${value}`}
          />
          <Line
            dataKey="avg_stress"
            type="monotone"
            stroke="var(--color-stress)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--color-stress)" }}
            activeDot={{ r: 6 }}
          >
            <LabelList
              dataKey="avg_stress"
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
