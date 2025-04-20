import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useJobFlowForm } from "./useJobFlowForm";
import { useResumeUpload } from "./useResumeUpload";
import { useRetry } from "@/hooks/use-retry";

interface JobData {
  title: string;
  description: string;
  location: string;
  status: "active" | "completed" | "pending";
  candidateCount: number;
  createdAt: string;
}

export const useJobFlowActions = (
  jobId: string,
  jobData: JobData,
  setShowEvaluation: (value: boolean) => void,
  setShowChat: (value: boolean) => void,
  setActiveTab: (value: string) => void
) => {
  const [hasResumes, setHasResumes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formActions = useJobFlowForm({
    title: jobData.title,
    description: jobData.description,
    location: jobData.location,
  });

  const uploadActions = useResumeUpload(jobId, setHasResumes);

  const { execute: executeWithRetry } = useRetry(
    async (fn: () => Promise<any>) => fn(),
    { maxRetries: 3, initialDelay: 1000 }
  );

  const startEvaluation = async (resumeId?: string) => {
    if (!hasResumes) {
      toast({
        title: "Cannot Start Evaluation",
        description: "Please upload resumes before starting the evaluation process",
        variant: "destructive",
      });
      return;
    }

    try {
      await executeWithRetry(async () => {
        console.log(`Starting evaluation for job ID: ${jobId}, resume ID: ${resumeId || 'all'}`);
        
        const scoreResult = await api.scoreResume({
          resumeId: resumeId || 'all',
          jobId,
        });
        
        console.log('Resume scoring result:', scoreResult);
        setShowEvaluation(true);
        setActiveTab("evaluation");
        
        toast({
          title: "Evaluation Started",
          description: "The evaluation process has begun successfully",
        });
      });
    } catch (error: any) {
      console.error("Evaluation error:", error);
      
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Evaluation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const startChat = async () => {
    if (!hasResumes) {
      toast({
        title: "Cannot Start Chat",
        description: "Please upload resumes before starting a chat session",
        variant: "destructive",
      });
      return;
    }

    try {
      await executeWithRetry(async () => {
        console.log(`Starting chat session for job ID: ${jobId}`);
        
        const sessionId = `job-${jobId}`;
        const initialMessage = "Hello, I'd like to discuss the job requirements";
        
        const chatResponse = await api.sendChatMessage({
          message: initialMessage,
          sessionId,
          jobId,
        });
        
        console.log('Chat initialized with response:', chatResponse);
        setShowChat(true);
        setActiveTab("chat");
        
        toast({
          title: "Chat Session Started",
          description: "You can now start discussing job requirements",
        });
      });
    } catch (error: any) {
      console.error("Chat initialization error:", error);
      
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Chat Session Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Helper function to extract meaningful error messages
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    
    if (error.message) {
      return error.message;
    }

    if (error.error_description) {
      return error.error_description;
    }

    if (error.status) {
      return `Server error (${error.status}): Please try again later`;
    }

    return "An unexpected error occurred. Please try again.";
  };

  return {
    ...formActions,
    ...uploadActions,
    hasResumes,
    setHasResumes,
    startEvaluation,
    startChat
  };
};
