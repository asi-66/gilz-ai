
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
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      default:
        return "bg-muted/10 text-muted-foreground hover:bg-muted/20";
    }
  };

  return (
    <div className="w-full overflow-auto scrollbar-thin">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/50">
              <TableHead className="font-medium text-foreground">Job Title</TableHead>
              <TableHead className="font-medium text-foreground">Status</TableHead>
              <TableHead className="font-medium text-foreground">Location</TableHead>
              <TableHead className="font-medium text-foreground">Created</TableHead>
              <TableHead className="font-medium text-foreground">Candidates</TableHead>
              <TableHead className="text-right font-medium text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobFlows.map((flow) => (
              <TableRow key={flow.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-foreground">{flow.title}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeVariant(flow.status)}>
                    {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground">{flow.location}</TableCell>
                <TableCell className="text-foreground">{flow.createdAt}</TableCell>
                <TableCell>
                  {flow.candidateCount > 0 ? (
                    <span className="font-medium text-foreground">{flow.candidateCount}</span>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onView(flow.id)}
                      className="hover:bg-primary/10 text-foreground hover:text-primary"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(flow.id)}
                      className="hover:bg-destructive/10 text-destructive"
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
    </div>
  );
};
