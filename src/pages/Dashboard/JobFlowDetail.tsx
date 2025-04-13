
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import JobFlowDetail from "@/components/dashboard/JobFlowDetail";

const JobFlowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch job data from an API
  const jobData = {
    title: "UI/UX Designer",
    description: "We are looking for a talented UI/UX Designer to join our team. The ideal candidate will have experience with Figma, user research, and creating responsive designs.",
    location: "Remote",
    status: "active" as const,
    candidateCount: 5,
    createdAt: "April 10, 2025",
  };

  return (
    <DashboardLayout>
      <JobFlowDetail jobId={id || ""} jobData={jobData} />
    </DashboardLayout>
  );
};

export default JobFlowDetailPage;
