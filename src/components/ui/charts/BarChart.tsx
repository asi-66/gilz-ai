
import * as React from "react";
import * as RechartsPrimitive from "recharts";

interface BarChartProps {
  data: any;
}

export const BarChart = ({ data }: BarChartProps) => {
  return (
    <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
      <RechartsPrimitive.BarChart data={data.labels.map((label: string, i: number) => ({
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
          name={data.datasets[0].label}
          fill={data.datasets[0].backgroundColor || "#7efb98"} 
        />
      </RechartsPrimitive.BarChart>
    </RechartsPrimitive.ResponsiveContainer>
  );
};
