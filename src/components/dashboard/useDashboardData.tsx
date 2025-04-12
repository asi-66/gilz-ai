
import { useState, useEffect } from "react";

interface DashboardData {
  totalActiveJobs: number;
  totalCandidates: number;
  resumesProcessed: number;
  interviewsScheduled: number;
  recentActivity: {
    id: number;
    type: string;
    message: string;
    time: string;
  }[];
}

export const useDashboardData = () => {
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
        totalActiveJobs: 12,
        totalCandidates: 87,
        resumesProcessed: 145,
        interviewsScheduled: 28,
        recentActivity: [
          { id: 1, type: "resume", message: "New resume uploaded for Software Engineer position", time: "10 minutes ago" },
          { id: 2, type: "job", message: "New job listing created: Product Manager", time: "1 hour ago" },
          { id: 3, type: "evaluation", message: "Candidate James Brown scored 85% match for UX Designer", time: "3 hours ago" },
          { id: 4, type: "interview", message: "Interview scheduled with Sarah Johnson for Data Analyst", time: "Yesterday" },
          { id: 5, type: "resume", message: "New resume uploaded for Marketing Specialist position", time: "Yesterday" }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Sample data for the charts
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Resumes Received",
        data: [30, 42, 33, 54, 65, 43],
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
        data: [45, 30, 25],
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
        data: [5, 3, 2, 1, 1],
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
