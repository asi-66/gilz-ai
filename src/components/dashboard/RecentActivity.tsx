
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, CalendarCheck, BarChart } from "lucide-react";
import { ActivityItem } from "@/types/chart.types";

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

const RecentActivity = ({ activities, isLoading }: RecentActivityProps) => {
  // Activity icon mapping
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "resume":
        return <FileText className="h-5 w-5 text-[#10B981]" />;
      case "job":
        return <Briefcase className="h-5 w-5 text-[#F59E0B]" />;
      case "evaluation":
        return <BarChart className="h-5 w-5 text-[#6B7280]" />;
      case "interview":
        return <CalendarCheck className="h-5 w-5 text-[#3B82F6]" />;
      default:
        return <FileText className="h-5 w-5 text-[#6B7280]" />;
    }
  };

  return (
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
            activities.map((activity) => (
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
  );
};

export default RecentActivity;
