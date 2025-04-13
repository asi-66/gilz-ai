
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MetricsCards from "@/components/dashboard/MetricsCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const Dashboard = () => {
  const { isLoading, dashboardData, chartData } = useDashboardData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Dashboard</h1>
          <p className="text-[#4B5563]">Welcome to Gilz AI Resume Screening Tool.</p>
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

        {/* Charts and Activity section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts */}
          <DashboardCharts data={chartData} />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
