
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

export const useResumeUpload = (jobId: string, setHasResumes: (value: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [resumes, setResumes] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 5) {
      toast({
        title: "Error",
        description: "You can only upload up to 5 resumes",
        variant: "destructive",
      });
      return;
    }
    
    const invalidFiles = files.filter(file => {
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
    
    if (invalidFiles.length > 0) return;
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
      const resumePromises = resumes.map(async (file, index) => {
        return new Promise<string>((resolve, reject) => {
          console.log(`Processing resume ${index + 1}/${resumes.length}: ${file.name}`);
          
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            try {
              const resumeText = e.target?.result as string;
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

  return {
    isLoading,
    showUploadDialog,
    resumes,
    handleFileChange,
    handleUploadResumes,
    handleUploadDialogOpen: () => setShowUploadDialog(true),
    handleUploadDialogClose: () => {
      setShowUploadDialog(false);
      setResumes([]);
    },
  };
};
