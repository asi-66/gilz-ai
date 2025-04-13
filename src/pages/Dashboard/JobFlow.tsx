
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

  // Sample job flows data - in a real app, this would come from an API
  const jobFlows = [
    {
      id: "1",
      title: "Frontend Developer",
      status: "active" as const,
      location: "Remote",
      createdAt: "April 10, 2025",
      candidateCount: 12,
    },
    {
      id: "2",
      title: "UI/UX Designer",
      status: "active" as const,
      location: "Remote",
      createdAt: "April 8, 2025",
      candidateCount: 8,
    },
    {
      id: "3",
      title: "Product Manager",
      status: "completed" as const,
      location: "In-office",
      createdAt: "April 5, 2025",
      candidateCount: 6,
    },
    {
      id: "4",
      title: "Backend Developer",
      status: "pending" as const,
      location: "Remote",
      createdAt: "April 3, 2025",
      candidateCount: 0,
    },
    {
      id: "5",
      title: "DevOps Engineer",
      status: "active" as const,
      location: "Hybrid",
      createdAt: "April 1, 2025",
      candidateCount: 5,
    },
    {
      id: "6",
      title: "Data Scientist",
      status: "completed" as const,
      location: "Remote",
      createdAt: "March 28, 2025",
      candidateCount: 10,
    },
  ];

  const handleCreateJobSuccess = (jobId: string) => {
    navigate(`/dashboard/job-flow/${jobId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium">Job Flow Management</h1>
            <p className="text-muted-foreground">
              Manage your resume screening job flows
            </p>
          </div>
          <Button 
            onClick={() => setCreateJobModalOpen(true)}
            className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
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
