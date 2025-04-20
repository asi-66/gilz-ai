
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { JobFlow } from "./types";

interface JobTableProps {
  jobFlows: JobFlow[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const JobTable: React.FC<JobTableProps> = ({ jobFlows, onView, onDelete }) => {
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
    <div className="w-full min-w-[800px] overflow-auto">
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
                    onClick={() => onView(flow.id)}
                    className="hover:bg-[#7efb98]/10 text-gray-700 dark:text-gray-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(flow.id)}
                    className="hover:bg-red-500/10 text-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
