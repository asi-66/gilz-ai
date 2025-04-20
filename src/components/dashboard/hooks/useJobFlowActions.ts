
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
  const [hasResumes, setHasResumes] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [resumes, setResumes] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: jobData.title,
    description: jobData.description,
    location: jobData.location,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check number of files
    if (files.length > 5) {
      toast({
        title: "Error",
        description: "You can only upload up to 5 resumes",
        variant: "destructive",
      });
      return;
    }
    
    // Validate each file
    const invalidFiles = files.filter(file => {
      // Check file type
      const validTypes = ['.pdf', '.txt', '.docx', '.doc'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const isValidType = validTypes.some(type => fileExt.endsWith(type));
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type. Please use PDF, TXT, DOC, or DOCX.`,
          variant: "destructive",
        });
        return true;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 5MB size limit.`,
          variant: "destructive",
        });
        return true;
      }
      
      return false;
    });
    
    if (invalidFiles.length > 0) {
      return;
    }
    
    setResumes(files);
  };

  const handleUploadResumes = async () => {
    if (resumes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one resume to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload each resume
      const resumePromises = resumes.map(async (file, index) => {
        return new Promise<string>((resolve, reject) => {
          console.log(`Processing resume ${index + 1}/${resumes.length}: ${file.name}`);
          
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            try {
              const resumeText = e.target?.result as string;
              console.log(`Uploading resume ${index + 1} content (${resumeText.length} chars)`);
              
              const resumeResponse = await api.uploadResume({
                resumeText,
                jobId,
              });
              
              console.log(`Resume ${index + 1} uploaded successfully with ID: ${resumeResponse.resumeId}`);
              resolve(resumeResponse.resumeId);
            } catch (error) {
              console.error(`Error uploading resume ${index + 1}:`, error);
              reject(error);
            }
          };
          
          reader.onerror = (error) => {
            console.error(`Error reading resume ${index + 1}:`, error);
            reject(error);
          };
          
          reader.readAsText(file, 'UTF-8');
        });
      });

      // Wait for all resumes to be uploaded
      const resumeIds = await Promise.all(resumePromises);
      console.log('All resumes processed successfully. Resume IDs:', resumeIds);
      
      toast({
        title: "Success",
        description: `${resumes.length} resume(s) uploaded successfully`,
      });
      
      setHasResumes(true);
      setShowUploadDialog(false);
      setResumes([]);
      
    } catch (error: any) {
      console.error("Error uploading resumes:", error);
      
      const errorMessage = error.message || "Unknown error";
      const statusCode = error.status || "";
      
      toast({
        title: `Error${statusCode ? ` (${statusCode})` : ""}`,
        description: `Failed to upload resumes: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDialogOpen = () => {
    setShowUploadDialog(true);
  };

  const handleUploadDialogClose = () => {
    setShowUploadDialog(false);
    setResumes([]);
  };

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
      
      // Call the resume scoring API
      const scoreResult = await api.scoreResume({
        resumeId: resumeId || 'all', // If no specific resumeId, use 'all' to process all resumes
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
      
      // Improved error handling with more details
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
    } catch (error: any) {
      console.error("Error starting chat session:", error);
      
      // Improved error handling with more details
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

  // Return all the state variables and handler functions
  return {
    isLoading,
    isEditing,
    formData,
    hasResumes,
    showUploadDialog,
    resumes,
    handleChange,
    handleSelectChange,
    handleEdit,
    handleCancel,
    handleSave,
    handleFileChange,
    handleUploadResumes,
    handleUploadDialogOpen,
    handleUploadDialogClose,
    startEvaluation,
    startChat
  };
};
