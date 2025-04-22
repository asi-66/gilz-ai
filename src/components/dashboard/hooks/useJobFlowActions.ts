
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useResumeUpload } from "./useResumeUpload";
import { supabase } from "@/integrations/supabase/client";

export const useJobFlowActions = (
  jobId: string, 
  jobData: any, 
  setShowEvaluation: (show: boolean) => void,
  setShowChat: (show: boolean) => void,
  setActiveTab: (tab: string) => void
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasResumes, setHasResumes] = useState(false);
  const [formData, setFormData] = useState({
    title: jobData.title,
    description: jobData.description,
    location: jobData.location,
    status: jobData.status,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      status: jobData.status,
    });
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('job_descriptions')
        .update({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          is_active: formData.status === "active",
        })
        .eq('id', jobId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Job details updated successfully",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating job details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update job details",
        variant: "destructive",
      });
    }
  };

  const startEvaluation = () => {
    setShowEvaluation(true);
    setActiveTab("evaluation");
  };

  const startChat = () => {
    setShowChat(true);
    setActiveTab("chat");
  };

  const { 
    isLoading,
    showUploadDialog,
    resumes,
    handleFileChange,
    handleRemoveFile,
    handleUploadResumes,
    handleDeleteResume,
    handleUploadDialogOpen,
    handleUploadDialogClose,
  } = useResumeUpload(jobId, setHasResumes);

  return {
    isEditing,
    formData,
    hasResumes,
    setHasResumes,
    showUploadDialog,
    resumes,
    handleChange,
    handleSelectChange,
    handleEdit,
    handleCancel,
    handleSave,
    handleFileChange,
    handleRemoveFile,
    handleUploadResumes,
    handleUploadDialogOpen,
    handleUploadDialogClose,
    startEvaluation,
    startChat,
    handleDeleteResume,
    isLoading
  };
};
