
import { useState, useEffect } from "react";
import { DashboardData, ChartData } from "@/types/chart.types";

// Hook return type
interface DashboardHookReturn {
  isLoading: boolean;
  dashboardData: DashboardData;
  chartData: ChartData;
}

export const useDashboardData = (): DashboardHookReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalActiveJobs: 0,
    totalCandidates: 0,
    resumesProcessed: 0,
    interviewsScheduled: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setDashboardData({
        totalActiveJobs: 0,
        totalCandidates: 0,
        resumesProcessed: 0,
        interviewsScheduled: 0,
        recentActivity: []
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Chart data with empty placeholders
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Resumes Received",
        data: [0, 0, 0, 0, 0, 0],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const pieChartData = {
    labels: ["Qualified", "Pending Review", "Not Qualified"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 1,
        borderColor: "#fff"
      }
    ],
  };

  const barChartData = {
    labels: ["Engineering", "Marketing", "Design", "Finance", "HR"],
    datasets: [
      {
        label: "Open Positions",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "#7efb98",
      }
    ],
  };

  return {
    isLoading,
    dashboardData,
    chartData: {
      lineChartData,
      pieChartData,
      barChartData
    }
  };
};
