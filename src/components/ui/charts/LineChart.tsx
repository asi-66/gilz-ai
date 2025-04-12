
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { LineChartData } from "@/types/chart.types";

interface LineChartProps {
  data: LineChartData;
}

export const LineChart = ({ data }: LineChartProps) => {
  return (
    <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
      <RechartsPrimitive.LineChart>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey="name" />
        <RechartsPrimitive.YAxis />
        <RechartsPrimitive.Tooltip />
        <RechartsPrimitive.Legend />
        {data.datasets.map((dataset, index) => (
          <RechartsPrimitive.Line 
            key={index}
            type="monotone" 
            dataKey="pv" 
            data={data.labels.map((label, i) => ({
              name: label,
              pv: dataset.data[i],
            }))}
            name={dataset.label || `Dataset ${index + 1}`}  // Add fallback in case label is not provided
            stroke={dataset.borderColor}
            fill={dataset.backgroundColor}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsPrimitive.LineChart>
    </RechartsPrimitive.ResponsiveContainer>
  );
};
