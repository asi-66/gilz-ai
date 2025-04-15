
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: jobData.title,
    description: jobData.description,
    location: jobData.location,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // API call to update job flow would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Success",
        description: "Job flow updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job flow",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEvaluation = async () => {
    setIsLoading(true);
    try {
      console.log(`Starting evaluation for job ID: ${jobId}`);
      
      // For demo purposes, we'll use a placeholder resumeId
      // In a real app, you'd select an actual resume to evaluate
      const resumeId = "sample-resume-id"; 
      
      // Call the resume scoring API
      const scoreResult = await api.scoreResume({
        resumeId,
        jobId,
      });
      
      console.log('Resume scoring result:', scoreResult);
      
      setShowEvaluation(true);
      setActiveTab("evaluation");
      
      toast({
        title: "Success",
        description: "Evaluation started successfully",
      });
    } catch (error) {
      console.error("Error starting evaluation:", error);
      toast({
        title: "Error",
        description: "Failed to start evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async () => {
    setIsLoading(true);
    try {
      console.log(`Starting chat session for job ID: ${jobId}`);
      
      // Create session ID based on job ID
      const sessionId = `job-${jobId}`;
      
      // Initial message to start the chat
      const initialMessage = "Hello, I'd like to discuss the job requirements";
      
      // Call the HR chat API
      const chatResponse = await api.sendChatMessage({
        message: initialMessage,
        sessionId,
        jobId, // Including job context
      });
      
      console.log('Chat initialized with response:', chatResponse);
      
      setShowChat(true);
      setActiveTab("chat");
      
      toast({
        title: "Success",
        description: "Chat session started successfully",
      });
    } catch (error) {
      console.error("Error starting chat session:", error);
      toast({
        title: "Error",
        description: "Failed to start chat session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Return all the state variables and handler functions
  return {
    isLoading,
    isEditing,
    formData,
    handleChange,
    handleSelectChange,
    handleEdit,
    handleCancel,
    handleSave,
    startEvaluation,
    startChat
  };
};
