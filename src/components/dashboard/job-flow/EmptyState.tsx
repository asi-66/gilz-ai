
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="text-foreground mb-4">No job flows created yet</p>
      <p className="text-sm text-muted-foreground mb-6">
        Create your first job flow to start screening resumes
      </p>
      <Button 
        onClick={() => navigate('/dashboard/job-flow/create')}
        className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Job Flow
      </Button>
    </div>
  );
};
