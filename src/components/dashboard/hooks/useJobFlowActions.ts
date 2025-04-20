
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useJobFlowForm } from "./useJobFlowForm";
import { useResumeUpload } from "./useResumeUpload";

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

  const startEvaluation = async (resumeId?: string) => {
    if (!hasResumes) {
      toast({
        title: "Error",
        description: "Please upload resumes before starting evaluation",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Starting evaluation for job ID: ${jobId}, resume ID: ${resumeId || 'all'}`);
      
      const scoreResult = await api.scoreResume({
        resumeId: resumeId || 'all',
        jobId,
      });
      
      console.log('Resume scoring result:', scoreResult);
      setShowEvaluation(true);
      setActiveTab("evaluation");
      
      toast({
        title: "Success",
        description: "Evaluation started successfully",
      });
    } catch (error: any) {
      console.error("Error starting evaluation:", error);
      
      const errorMessage = error.message || "Unknown error";
      const statusCode = error.status || "";
      
      toast({
        title: `Error${statusCode ? ` (${statusCode})` : ""}`,
        description: `Failed to start evaluation: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async () => {
    if (!hasResumes) {
      toast({
        title: "Error",
        description: "Please upload resumes before starting chat",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
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
        title: "Success",
        description: "Chat session started successfully",
      });
    } catch (error: any) {
      console.error("Error starting chat session:", error);
      
      const errorMessage = error.message || "Unknown error";
      const statusCode = error.status || "";
      
      toast({
        title: `Error${statusCode ? ` (${statusCode})` : ""}`,
        description: `Failed to start chat session: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
