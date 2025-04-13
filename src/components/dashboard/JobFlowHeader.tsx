
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Users } from "lucide-react";

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
  onStartEvaluation: () => void;
  onStartChat: () => void;
}

const JobFlowHeader: React.FC<JobFlowHeaderProps> = ({
  jobData,
  showEvaluation,
  showChat,
  isLoading,
  activeTab,
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
        {!showEvaluation && (
          <Button 
            variant="default" 
            onClick={onStartEvaluation} 
            disabled={isLoading}
          >
            {isLoading && activeTab === "evaluation" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Users className="mr-2 h-4 w-4" />
            )}
            Start Evaluation
          </Button>
        )}
        
        {!showChat && (
          <Button 
            variant="outline" 
            onClick={onStartChat} 
            disabled={isLoading}
          >
            {isLoading && activeTab === "chat" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            Start Chat
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobFlowHeader;
