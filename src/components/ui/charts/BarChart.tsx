
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { BarChartData } from "@/types/chart.types";

interface BarChartProps {
  data: BarChartData;
}

export const BarChart = ({ data }: BarChartProps) => {
  return (
    <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
      <RechartsPrimitive.BarChart data={data.labels.map((label, i) => ({
        name: label,
        value: data.datasets[0].data[i],
      }))}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey="name" />
        <RechartsPrimitive.YAxis />
        <RechartsPrimitive.Tooltip />
        <RechartsPrimitive.Legend />
        <RechartsPrimitive.Bar 
          dataKey="value" 
          name={data.datasets[0].label || 'Value'}  // Add fallback in case label is not provided
          fill={data.datasets[0].backgroundColor} 
        />
      </RechartsPrimitive.BarChart>
    </RechartsPrimitive.ResponsiveContainer>
  );
};
