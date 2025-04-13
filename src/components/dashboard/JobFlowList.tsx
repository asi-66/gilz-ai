
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface JobFlow {
  id: string;
  title: string;
  status: "active" | "completed" | "pending";
  location: string;
  createdAt: string;
  candidateCount: number;
}

interface JobFlowListProps {
  jobFlows: JobFlow[];
}

const JobFlowList: React.FC<JobFlowListProps> = ({ jobFlows }) => {
  const navigate = useNavigate();

  const handleViewJobFlow = (id: string) => {
    navigate(`/dashboard/job-flow/${id}`);
  };

  return (
    <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
      <CardHeader>
        <CardTitle>Job Flows</CardTitle>
        <CardDescription>
          Your active and recent job flows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Job Title</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Location</th>
                <th className="text-left py-3 px-4 font-medium">Created</th>
                <th className="text-left py-3 px-4 font-medium">Candidates</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobFlows.map((flow) => (
                <tr key={flow.id} className="border-b border-border/50 hover:bg-background/50">
                  <td className="py-3 px-4">{flow.title}</td>
                  <td className="py-3 px-4">
                    <Badge variant={
                      flow.status === "active" ? "default" : 
                      flow.status === "completed" ? "success" : "secondary"
                    }>
                      {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{flow.location}</td>
                  <td className="py-3 px-4">{flow.createdAt}</td>
                  <td className="py-3 px-4">{flow.candidateCount}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewJobFlow(flow.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFlowList;
