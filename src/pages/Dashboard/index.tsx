
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import RecentActivity from "@/components/dashboard/RecentActivity";
import JobFlowList from "@/components/dashboard/JobFlowList";
import { CreateJobModal } from "@/components/dashboard/modals";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
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
  ];

  const handleCreateJobSuccess = (jobId: string) => {
    navigate(`/dashboard/job-flow/${jobId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center backdrop-blur-md bg-white/5 dark:bg-black/5 p-4 rounded-lg border border-white/10 dark:border-white/5">
          <div>
            <h1 className="text-2xl font-medium text-gray-800 dark:text-white">Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to Gilz AI Resume Screening Dashboard
            </p>
          </div>
          <Button 
            onClick={() => setCreateJobModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 text-gray-800 dark:text-white border border-white/10 dark:border-white/5"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Job Flow
          </Button>
        </div>

        <DashboardMetrics />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <JobFlowList jobFlows={jobFlows} />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>

      <CreateJobModal 
        isOpen={createJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
        onSuccess={handleCreateJobSuccess}
      />
    </DashboardLayout>
  );
};

export default DashboardHome;
