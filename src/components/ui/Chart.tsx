
import React from 'react';
import { Line, Bar, Pie } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ChartProps {
  data: any;
  type: 'line' | 'bar' | 'pie';
  options?: any;
}

export const Chart: React.FC<ChartProps> = ({ data, type, options }) => {
  // Map the chart type to the appropriate Recharts component
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <Line
            data={data.labels.map((label: string, index: number) => ({
              name: label,
              ...data.datasets.reduce((acc: any, dataset: any) => {
                acc[dataset.label] = dataset.data[index];
                return acc;
              }, {}),
            }))}
            dataKey="name"
          >
            {/* Additional line chart configurations can be added here */}
          </Line>
        );
      case 'bar':
        return (
          <Bar
            data={data.labels.map((label: string, index: number) => ({
              name: label,
              ...data.datasets.reduce((acc: any, dataset: any) => {
                acc[dataset.label] = dataset.data[index];
                return acc;
              }, {}),
            }))}
            dataKey="name"
          >
            {/* Additional bar chart configurations can be added here */}
          </Bar>
        );
      case 'pie':
        return (
          <Pie
            data={data.labels.map((label: string, index: number) => ({
              name: label,
              value: data.datasets[0].data[index],
              fill: data.datasets[0].backgroundColor[index],
            }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
          >
            {/* Additional pie chart configurations can be added here */}
          </Pie>
        );
      default:
        return null;
    }
  };

  // Define a minimal config based on common chart types
  const chartConfig = {
    line: { tension: 'tension' },
    bar: { open: 'Open Positions' },
    pie: { qualified: 'Qualified', pending: 'Pending Review', notQualified: 'Not Qualified' }
  };

  return (
    <ChartContainer config={chartConfig}>
      <ChartTooltip content={<ChartTooltipContent />} />
      {renderChart()}
    </ChartContainer>
  );
};
