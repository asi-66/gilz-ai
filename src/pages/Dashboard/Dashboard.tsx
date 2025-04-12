
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Users, CalendarCheck, ArrowUp, ArrowDown } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Chart } from "@/components/ui/Chart";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
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

  // Activity icon mapping
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "resume":
        return <FileText className="h-5 w-5 text-[#10B981]" />;
      case "job":
        return <Briefcase className="h-5 w-5 text-[#F59E0B]" />;
      case "evaluation":
        return <FileBarChart className="h-5 w-5 text-[#6B7280]" />;
      case "interview":
        return <CalendarCheck className="h-5 w-5 text-[#3B82F6]" />;
      default:
        return <FileText className="h-5 w-5 text-[#6B7280]" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Dashboard</h1>
          <p className="text-[#4B5563]">Welcome to Gilz AI Resume Screening Tool.</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">Active Jobs</p>
                  <h3 className="text-2xl font-bold text-[#1F2937] mt-1">
                    {isLoading ? "..." : dashboardData.totalActiveJobs}
                  </h3>
                  <div className="flex items-center mt-1 text-[#10B981]">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-xs">2 new this week</span>
                  </div>
                </div>
                <div className="rounded-full p-3 bg-[#7efb98]/20">
                  <Briefcase className="h-6 w-6 text-[#1F2937]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">Total Candidates</p>
                  <h3 className="text-2xl font-bold text-[#1F2937] mt-1">
                    {isLoading ? "..." : dashboardData.totalCandidates}
                  </h3>
                  <div className="flex items-center mt-1 text-[#10B981]">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-xs">12 new this week</span>
                  </div>
                </div>
                <div className="rounded-full p-3 bg-[#7efb98]/20">
                  <Users className="h-6 w-6 text-[#1F2937]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">Resumes Processed</p>
                  <h3 className="text-2xl font-bold text-[#1F2937] mt-1">
                    {isLoading ? "..." : dashboardData.resumesProcessed}
                  </h3>
                  <div className="flex items-center mt-1 text-[#10B981]">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-xs">23 this week</span>
                  </div>
                </div>
                <div className="rounded-full p-3 bg-[#7efb98]/20">
                  <FileText className="h-6 w-6 text-[#1F2937]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">Interviews Scheduled</p>
                  <h3 className="text-2xl font-bold text-[#1F2937] mt-1">
                    {isLoading ? "..." : dashboardData.interviewsScheduled}
                  </h3>
                  <div className="flex items-center mt-1 text-[#EF4444]">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    <span className="text-xs">3 less than last week</span>
                  </div>
                </div>
                <div className="rounded-full p-3 bg-[#7efb98]/20">
                  <CalendarCheck className="h-6 w-6 text-[#1F2937]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activity section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts */}
          <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resume Applications Trend</CardTitle>
                <CardDescription>Monthly resume submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart data={lineChartData} type="line" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Candidate Evaluation</CardTitle>
                  <CardDescription>Distribution by qualification</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart data={pieChartData} type="pie" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Open Positions</CardTitle>
                  <CardDescription>By department</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart data={barChartData} type="bar" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse mr-3" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  dashboardData.recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="shrink-0 mr-3 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-sm text-[#1F2937]">{activity.message}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
