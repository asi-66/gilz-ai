
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobFlowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Empty job data placeholder - in a real app, would fetch from API
  const jobData = {
    title: "Job Not Found",
    description: "This job could not be found or hasn't been created yet.",
    location: "N/A",
    status: "pending" as const,
    candidateCount: 0,
    createdAt: "",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/job-flow')}
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Flows
          </Button>
        </div>
        
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Create Your First Job Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please use the "Create Job Flow" button to create your first job flow and start screening resumes.
            </p>
            <Button 
              onClick={() => navigate('/dashboard/job-flow')}
              className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
            >
              Go to Job Flow Management
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobFlowDetailPage;
