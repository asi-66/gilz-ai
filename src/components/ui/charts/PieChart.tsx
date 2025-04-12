
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { PieChartData } from "@/types/chart.types";

interface PieChartProps {
  data: PieChartData;
}

export const PieChart = ({ data }: PieChartProps) => {
  return (
    <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
      <RechartsPrimitive.PieChart>
        <RechartsPrimitive.Pie
          data={data.labels.map((label, i) => ({
            name: label,
            value: data.datasets[0].data[i],
            fill: data.datasets[0].backgroundColor[i]
          }))}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
        />
        <RechartsPrimitive.Tooltip />
        <RechartsPrimitive.Legend />
      </RechartsPrimitive.PieChart>
    </RechartsPrimitive.ResponsiveContainer>
  );
};
