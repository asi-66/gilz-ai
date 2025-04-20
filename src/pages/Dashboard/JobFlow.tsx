import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    refreshJobFlows();
  }, []);

  const handleCreateJobSuccess = async (jobId: string) => {
    toast({
      title: "Success",
      description: "Job flow created successfully. Refreshing data...",
    });
    
    await refreshJobFlows();
    navigate(`/dashboard/job-flow/${jobId}`);
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing",
      description: "Fetching latest job flows...",
    });
    refreshJobFlows();
  };

  const handleDeleteJob = (jobId: string) => {
    refreshJobFlows();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center backdrop-blur-md bg-white/10 dark:bg-black/20 p-4 rounded-lg border border-gray-200/20 dark:border-gray-700/20 shadow-sm">
          <div>
            <h1 className="text-2xl font-medium text-gray-800 dark:text-white">Job Flow Management</h1>
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
              className="hover:bg-muted/50"
              title="Refresh job flows"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setCreateJobModalOpen(true)}
              className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90 font-medium shadow-sm"
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
          <>
            {jobFlows && jobFlows.length > 0 ? (
              <JobFlowList jobFlows={jobFlows} onDelete={handleDeleteJob} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">No job flows found in the database</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Create your first job flow to start screening resumes</p>
                <Button 
                  onClick={() => setCreateJobModalOpen(true)}
                  className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job Flow
                </Button>
              </div>
            )}
          </>
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
