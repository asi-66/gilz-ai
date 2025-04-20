
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, Users, CalendarCheck } from "lucide-react";
import { DashboardMetrics } from "@/types/chart.types";

interface MetricsData extends DashboardMetrics {
  isLoading: boolean;
}

const MetricsCards = ({ data }: { data: MetricsData }) => {
  const { totalActiveJobs, totalCandidates, resumesProcessed, interviewsScheduled, isLoading } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {isLoading ? "..." : totalActiveJobs}
              </h3>
            </div>
            <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
              <Briefcase className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Candidates</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {isLoading ? "..." : totalCandidates}
              </h3>
            </div>
            <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
              <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resumes Processed</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {isLoading ? "..." : resumesProcessed}
              </h3>
            </div>
            <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
              <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviews Scheduled</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {isLoading ? "..." : interviewsScheduled}
              </h3>
            </div>
            <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
              <CalendarCheck className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
