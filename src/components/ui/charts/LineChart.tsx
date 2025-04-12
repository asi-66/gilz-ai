
import * as React from "react";
import * as RechartsPrimitive from "recharts";

interface LineChartProps {
  data: any;
}

export const LineChart = ({ data }: LineChartProps) => {
  return (
    <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
      <RechartsPrimitive.LineChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey="name" />
        <RechartsPrimitive.YAxis />
        <RechartsPrimitive.Tooltip />
        <RechartsPrimitive.Legend />
        {data.datasets.map((dataset: any, index: number) => (
          <RechartsPrimitive.Line 
            key={index}
            type="monotone" 
            dataKey="pv" 
            data={data.labels.map((label: string, i: number) => ({
              name: label,
              pv: dataset.data[i],
            }))}
            name={dataset.label}
            stroke={dataset.borderColor || "#10B981"}
            fill={dataset.backgroundColor}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsPrimitive.LineChart>
    </RechartsPrimitive.ResponsiveContainer>
  );
};
