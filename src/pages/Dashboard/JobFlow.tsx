
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import JobFlowList from "@/components/dashboard/JobFlowList";
import { CreateJobModal } from "@/components/dashboard/modals";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobFlow = () => {
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const navigate = useNavigate();

  // Empty job flows array for production version
  const jobFlows = [];

  const handleCreateJobSuccess = (jobId: string) => {
    navigate(`/dashboard/job-flow/${jobId}`);
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
          <Button 
            onClick={() => setCreateJobModalOpen(true)}
            className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90 font-medium shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Job Flow
          </Button>
        </div>

        <JobFlowList jobFlows={jobFlows} />
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
