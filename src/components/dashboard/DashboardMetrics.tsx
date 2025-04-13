
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, FileText, CheckCircle } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

const DashboardMetrics: React.FC = () => {
  // In a real app, these would come from an API or context
  const metrics = [
    {
      title: "Active Jobs",
      value: 12,
      description: "Total active job flows",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      title: "Total Candidates",
      value: 248,
      description: "Candidates across all jobs",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Resumes Processed",
      value: 187,
      description: "Resumes analyzed this month",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Completed Evaluations",
      value: 42,
      description: "Evaluations finalized",
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
        />
      ))}
    </div>
  );
};

export default DashboardMetrics;
