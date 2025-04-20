
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobTable } from "./job-flow/JobTable";
import { EmptyState } from "./job-flow/EmptyState";
import { DeleteDialog } from "./job-flow/DeleteDialog";
import type { JobFlow } from "./job-flow/types";

interface JobFlowListProps {
  jobFlows: JobFlow[];
  onDelete?: (id: string) => void;
}

const JobFlowList: React.FC<JobFlowListProps> = ({ jobFlows, onDelete }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null);

  const handleViewJobFlow = (id: string) => {
    navigate(`/dashboard/job-flow/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedJobId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJobId) return;

    try {
      const { error } = await supabase
        .from('job_descriptions')
        .delete()
        .eq('id', selectedJobId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job flow deleted successfully",
      });

      if (onDelete) {
        onDelete(selectedJobId);
      }
    } catch (error) {
      console.error('Error deleting job flow:', error);
      toast({
        title: "Error",
        description: "Failed to delete job flow",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setSelectedJobId(null);
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="backdrop-blur-sm pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Job Flows
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Your active and recent job flows
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {jobFlows.length > 0 ? (
          <div className="overflow-auto max-w-full">
            <ScrollArea className="h-[600px]">
              <JobTable 
                jobFlows={jobFlows}
                onView={handleViewJobFlow}
                onDelete={handleDeleteClick}
              />
            </ScrollArea>
          </div>
        ) : (
          <EmptyState />
        )}
      </CardContent>

      <DeleteDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </Card>
  );
};

export default JobFlowList;
