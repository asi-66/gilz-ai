
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MetricsCards from "@/components/dashboard/MetricsCards";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const Dashboard = () => {
  const { isLoading, dashboardData } = useDashboardData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome to Gilz AI Resume Screening Tool.</p>
        </div>

        {/* Key metrics */}
        <MetricsCards 
          data={{
            totalActiveJobs: dashboardData.totalActiveJobs,
            totalCandidates: dashboardData.totalCandidates,
            resumesProcessed: dashboardData.resumesProcessed,
            interviewsScheduled: dashboardData.interviewsScheduled,
            isLoading
          }} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
