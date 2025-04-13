
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleUser, FileText, MessageSquare, Star } from "lucide-react";

// Activity types for different rendering
type ActivityType = "upload" | "evaluation" | "chat" | "creation";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  user: {
    name: string;
    avatar?: string;
  };
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "creation",
    title: "New Job Flow Created",
    description: "Senior Frontend Developer",
    time: "10 min ago",
    user: {
      name: "John Doe",
    },
  },
  {
    id: "2",
    type: "upload",
    title: "Resumes Uploaded",
    description: "5 resumes for UI/UX Designer",
    time: "1 hour ago",
    user: {
      name: "Sarah Johnson",
    },
  },
  {
    id: "3",
    type: "evaluation",
    title: "Evaluation Completed",
    description: "Product Manager candidates ranked",
    time: "3 hours ago",
    user: {
      name: "Michael Brown",
    },
  },
  {
    id: "4",
    type: "chat",
    title: "AI Chat Session",
    description: "Discussed candidate requirements",
    time: "Yesterday",
    user: {
      name: "Emily Davis",
    },
  },
];

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "upload":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "evaluation":
      return <Star className="h-4 w-4 text-yellow-500" />;
    case "chat":
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case "creation":
      return <CircleUser className="h-4 w-4 text-purple-500" />;
    default:
      return <CircleUser className="h-4 w-4 text-gray-500" />;
  }
};

const ActivityItem: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
  return (
    <div className="flex items-start space-x-4 py-3 hover:bg-muted/30 px-2 rounded-md transition-colors">
      <div className="bg-[#7efb98]/20 rounded-full p-2 flex-shrink-0">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none text-gray-800 dark:text-gray-200">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.description}</p>
        <div className="flex items-center pt-1">
          <span className="text-xs text-muted-foreground">{activity.time}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{activity.user.name}</span>
        </div>
      </div>
    </div>
  );
};

const RecentActivity: React.FC = () => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Activity</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          Latest activities across your job flows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
