"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import React, { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const chartConfig = {
  avg_stress: {
    label: "Average Stress",
    color: "hsl(var(--chart-1))",
  },
  negative_reviews: {
    label: "Negative Reviews",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export type HighStressDataProps = {
  department_name: string;
  avg_stress: number;
  negative_reviews: number;
};

const HighStressBarChart = React.memo(
  ({ highStressData }: { highStressData: HighStressDataProps[] }) => {
    const isMobile = useIsMobile();

    // Memoized Chart Data
    const memoizedData = useMemo(() => highStressData, [highStressData]);

    return (
      <Card className="m-0">
        <CardHeader>
          <CardTitle>High Stress Departments</CardTitle>
          <CardDescription>
            Average Stress and Negative Reviews per Department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="w-full h-[70vh] md:h-[50vh]"
            config={chartConfig}
          >
            <ResponsiveContainer>
              <BarChart
                data={memoizedData}
                layout={isMobile ? "vertical" : "horizontal"}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid horizontal={false} />
                {isMobile ? (
                  <YAxis
                    type="category"
                    dataKey="department_name"
                    tickLine={false}
                    axisLine={false}
                    width={100}
                    tick={({ x, y, payload }) => (
                      <text
                        x={x}
                        y={y}
                        textAnchor="end"
                        fill="#555"
                        className="hidden"
                      >
                        {payload.value}
                      </text>
                    )}
                  />
                ) : (
                  <XAxis
                    type="category"
                    dataKey="department_name"
                    tickLine={false}
                    axisLine={false}
                  />
                )}
                {isMobile ? <XAxis type="number" /> : <YAxis type="number" />}
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="avg_stress"
                  stackId="a"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 4, 4]}
                >
                  <LabelList
                    dataKey="avg_stress"
                    position="insideRight"
                    offset={8}
                    className="fill-background"
                    fontSize={12}
                    formatter={(value: any) =>
                      isMobile ? value.toFixed(0) : value
                    }
                  />
                </Bar>
                <Bar
                  dataKey="negative_reviews"
                  stackId="a"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 4, 4]}
                >
                  <LabelList
                    dataKey="negative_reviews"
                    position="insideRight"
                    offset={8}
                    className="fill-background"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Stress and Negative Reviews Overview{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing average stress and number of negative reviews per department
          </div>
        </CardFooter>
      </Card>
    );
  }
);

export default HighStressBarChart;
