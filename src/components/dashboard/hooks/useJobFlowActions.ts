
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
      // Call the resume scoring API
      await api.scoreResume({
        resumeId: "sample-resume-id", // In a real app, you'd use the actual resume ID
        jobId: jobId,
      });
      
      setShowEvaluation(true);
      setActiveTab("evaluation");
      
      toast({
        title: "Success",
        description: "Evaluation started successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start evaluation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async () => {
    setIsLoading(true);
    try {
      // Call the HR chat API
      await api.sendChatMessage({
        message: "Hello, I'd like to discuss the job requirements",
        sessionId: `job-${jobId}`,
      });
      
      setShowChat(true);
      setActiveTab("chat");
      
      toast({
        title: "Success",
        description: "Chat session started successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chat session",
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
