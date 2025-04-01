"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Stress } from "@/supabase/types/database.models";

const chartConfig = {
  stress: {
    label: "Stress Level",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StressLineChart({
  data,
  companyData,
}: {
  data: Stress[];
  companyData: Stress[];
}) {
  const [visibleData, setVisibleData] = useState<Stress[]>(data);

  // Berechnung der Durchschnittswerte und Stressspitzen
  // Persönlicher Durchschnitt
  const personalAverage =
    data.reduce((sum, item) => sum + (item.stress ?? 0), 0) / data.length || 0;

  // Unternehmensdurchschnitt
  const companyAverage =
    companyData.reduce((sum, item) => sum + (item.stress ?? 0), 0) /
      companyData.length || 0;

  // Stressspitzenberechnung
  const stressSpikes = data.filter((item) => (item.stress ?? 0) >= 8);
  const spikeCount = stressSpikes.length;
  const spikeAverage =
    spikeCount > 0
      ? stressSpikes.reduce((sum, item) => sum + (item.stress ?? 0), 0) /
        spikeCount
      : 0;

  useEffect(() => {
    const updateChartData = () => {
      const screenWidth = window.innerWidth;
      let dataLength = 56; // Standard: 8 Wochen

      if (screenWidth < 600) {
        dataLength = 14; // Mobile: 2 Wochen
      } else if (screenWidth < 900) {
        dataLength = 28; // Tablet: 4 Wochen
      }

      const latestData = data.slice(-dataLength); // Neueste Einträge von hinten
      setVisibleData(latestData);
    };

    updateChartData();
    window.addEventListener("resize", updateChartData);
    return () => window.removeEventListener("resize", updateChartData);
  }, [data]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stresslevel - Verlauf</CardTitle>
        <CardDescription>
          Dynamisch angepasst für verschiedene Bildschirmgrößen
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                dataKey="created_at"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(5, 10)}
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
                formatter={(value) => `Stresslevel: ${value}`}
              />
              <Line
                dataKey="stress"
                type="monotone"
                stroke="var(--color-stress)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-stress)" }}
                activeDot={{ r: 6 }}
              >
                <LabelList
                  dataKey="stress"
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex justify-between flex-col gap-4 lg:gap-0 lg:flex-row w-full my-4 py-4 border-y">
          <div className="flex gap-2 font-medium leading-none">
            Persönlicher Durchschnitt: {personalAverage.toFixed(2)}
          </div>
          <div className="flex gap-2 font-medium leading-none">
            Unternehmensdurchschnitt: {companyAverage.toFixed(2)}
          </div>
          <div className="flex gap-2 font-medium leading-none">
            Stressspitzen (≥ 8): {spikeCount}
          </div>
          <div className="flex gap-2 font-medium leading-none">
            Durchschnitt: {spikeAverage.toFixed(2)}
          </div>
        </div>
        <div className="leading-none text-muted-foreground">
          Berechnung basierend auf den letzten 8 Wochen
        </div>
      </CardFooter>
    </Card>
  );
}
