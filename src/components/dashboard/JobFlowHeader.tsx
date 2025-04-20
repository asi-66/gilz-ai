
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Search, Upload } from "lucide-react";

interface JobFlowHeaderProps {
  jobData: {
    title: string;
    status: "active" | "completed" | "pending";
    candidateCount: number;
    createdAt: string;
  };
  showEvaluation: boolean;
  showChat: boolean;
  isLoading: boolean;
  activeTab: string;
  hasResumes: boolean;
  onUploadResumes: () => void;
  onStartEvaluation: (resumeId?: string) => void;
  onStartChat: () => void;
}

const JobFlowHeader: React.FC<JobFlowHeaderProps> = ({
  jobData,
  showEvaluation,
  showChat,
  isLoading,
  activeTab,
  hasResumes,
  onUploadResumes,
  onStartEvaluation,
  onStartChat
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div>
        <h1 className="text-2xl font-medium">{jobData.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={
            jobData.status === "active" ? "default" : 
            jobData.status === "completed" ? "success" : "secondary"
          }>
            {jobData.status.charAt(0).toUpperCase() + jobData.status.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {jobData.candidateCount} candidates • Created on {jobData.createdAt}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
          onClick={onUploadResumes}
          disabled={isLoading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Resumes
        </Button>
        
        <Button 
          variant="default" 
          onClick={() => onStartEvaluation()} 
          disabled={isLoading || !hasResumes}
        >
          {isLoading && activeTab === "evaluation" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Start Screening
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onStartChat} 
          disabled={isLoading || !hasResumes}
        >
          {isLoading && activeTab === "chat" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="mr-2 h-4 w-4" />
          )}
          Start Chat
        </Button>
      </div>
    </div>
  );
};

export default JobFlowHeader;
