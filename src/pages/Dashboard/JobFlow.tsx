
import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import JobFlowList from "@/components/dashboard/JobFlowList";
import { CreateJobModal } from "@/components/dashboard/modals";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobFlows } from "@/components/dashboard/hooks/useJobFlows";
import { toast } from "@/hooks/use-toast";

const JobFlow = () => {
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const navigate = useNavigate();
  const { jobFlows, isLoading, refreshJobFlows } = useJobFlows();

  // Initial data fetch - using useCallback to prevent dependencies changing
  const initialFetch = useCallback(() => {
    console.log("Initial fetch for job flows");
    refreshJobFlows();
  }, [refreshJobFlows]);

  // Only fetch on initial mount
  useEffect(() => {
    initialFetch();
    // Empty dependency array to only run once on mount
  }, [initialFetch]);

  const handleRefresh = () => {
    toast({
      title: "Refreshing",
      description: "Fetching latest job flows...",
    });
    refreshJobFlows();
  };

  const handleCreateJobSuccess = (jobId: string) => {
    toast({
      title: "Success",
      description: "Job flow created successfully",
    });
    refreshJobFlows();
    navigate(`/dashboard/job-flow/${jobId}`);
  };

  const handleDeleteJob = () => {
    refreshJobFlows();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 min-h-screen w-full">
        <div className="flex justify-between items-center bg-background/50 backdrop-blur-sm p-4 rounded-lg border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Job Flow Management</h1>
            <p className="text-muted-foreground">
              Manage your resume screening job flows
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="hover:bg-accent"
              title="Refresh job flows"
            >
              <RefreshCw className="h-4 w-4 text-foreground" />
            </Button>
            <Button 
              onClick={() => setCreateJobModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Job Flow
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="relative rounded-lg border border-border bg-background/50 backdrop-blur-sm shadow">
            <div className="overflow-hidden">
              <JobFlowList jobFlows={jobFlows} onDelete={handleDeleteJob} />
            </div>
          </div>
        )}
      </div>

      <CreateJobModal 
        isOpen={createJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
        onSuccess={handleCreateJobSuccess}
      />
    </DashboardLayout>
  );
};

export default JobFlow;
