
import React from 'react';
import { LineChart, BarChart, PieChart, Line, Bar, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
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
          <LineChart
            data={data.labels.map((label: string, index: number) => ({
              name: label,
              ...data.datasets.reduce((acc: any, dataset: any) => {
                acc[dataset.label] = dataset.data[index];
                return acc;
              }, {}),
            }))}
          >
            <Tooltip />
            {data.datasets.map((dataset: any, index: number) => (
              <Line 
                key={index}
                type="monotone" 
                dataKey={dataset.label} 
                stroke={dataset.borderColor || '#10B981'} 
                activeDot={{ r: 8 }} 
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart
            data={data.labels.map((label: string, index: number) => ({
              name: label,
              ...data.datasets.reduce((acc: any, dataset: any) => {
                acc[dataset.label] = dataset.data[index];
                return acc;
              }, {}),
            }))}
          >
            <Tooltip />
            {data.datasets.map((dataset: any, index: number) => (
              <Bar 
                key={index} 
                dataKey={dataset.label} 
                fill={dataset.backgroundColor || '#7efb98'} 
              />
            ))}
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data.labels.map((label: string, index: number) => ({
                name: label,
                value: data.datasets[0].data[index],
                fill: data.datasets[0].backgroundColor[index] || '#10B981',
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            />
            <Tooltip />
          </PieChart>
        );
      default:
        return null;
    }
  };

  // Define a config object that matches the expected ChartConfig type
  const chartConfig: ChartConfig = {
    line: { 
      label: 'Line Chart',
      color: '#10B981'
    },
    bar: { 
      label: 'Open Positions',
      color: '#7efb98'
    },
    pieQualified: { 
      label: 'Qualified',
      color: '#10B981'
    },
    piePending: { 
      label: 'Pending Review',
      color: '#F59E0B'
    },
    pieNotQualified: { 
      label: 'Not Qualified',
      color: '#EF4444'
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
