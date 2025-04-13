
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
      return <FileText className="h-4 w-4" />;
    case "evaluation":
      return <Star className="h-4 w-4" />;
    case "chat":
      return <MessageSquare className="h-4 w-4" />;
    case "creation":
      return <CircleUser className="h-4 w-4" />;
    default:
      return <CircleUser className="h-4 w-4" />;
  }
};

const ActivityItem: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
  return (
    <div className="flex items-start space-x-4 py-3">
      <div className="bg-primary/10 rounded-full p-2">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.description}</p>
        <div className="flex items-center pt-1">
          <span className="text-xs text-muted-foreground">{activity.time}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-xs font-medium">{activity.user.name}</span>
        </div>
      </div>
    </div>
  );
};

const RecentActivity: React.FC = () => {
  return (
    <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest activities across your job flows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
