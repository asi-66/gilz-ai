
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal, Plus, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="bg-white dark:bg-gray-800 pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Job Flows</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          Your active and recent job flows
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {jobFlows.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/50">
                  <TableHead className="font-medium text-gray-800 dark:text-gray-200">Job Title</TableHead>
                  <TableHead className="font-medium text-gray-800 dark:text-gray-200">Status</TableHead>
                  <TableHead className="font-medium text-gray-800 dark:text-gray-200">Location</TableHead>
                  <TableHead className="font-medium text-gray-800 dark:text-gray-200">Created</TableHead>
                  <TableHead className="font-medium text-gray-800 dark:text-gray-200">Candidates</TableHead>
                  <TableHead className="text-right font-medium text-gray-800 dark:text-gray-200">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobFlows.map((flow) => (
                  <TableRow key={flow.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">{flow.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(flow.status)}>
                        {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{flow.location}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{flow.createdAt}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {flow.candidateCount > 0 ? (
                        <span className="font-medium">{flow.candidateCount}</span>
                      ) : (
                        <span className="text-muted-foreground dark:text-gray-400">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewJobFlow(flow.id)}
                          className="hover:bg-[#7efb98]/10 text-gray-700 dark:text-gray-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-800 border">
                            <DropdownMenuItem className="text-gray-700 dark:text-gray-200">Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-700 dark:text-gray-200">Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">No job flows created yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Create your first job flow to start screening resumes</p>
            <Button 
              onClick={() => navigate('/dashboard/job-flow/create')}
              className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Job Flow
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobFlowList;
