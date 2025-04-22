
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useRetry } from "@/hooks/use-retry";
import { validateFiles } from "./utils/fileValidation";
import { useStorageUpload } from "./useStorageUpload";
import { useResumeApiProcessing } from "./useResumeApiProcessing";
import { deleteResume } from "@/services/deleteResume";
import { getResumes } from "@/services/getResumes";

export const useResumeUpload = (jobId: string, setHasResumes: (value: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [resumes, setResumes] = useState<File[]>([]);
  const [hasUploadedResumes, setHasUploadedResumes] = useState(false);

  const { isUploading, uploadFilesToStorage } = useStorageUpload(jobId);
  const { sendWebhookNotification, processResumes } = useResumeApiProcessing(jobId);

  const { execute: executeWithRetry } = useRetry(
    async (fn: () => Promise<any>) => fn(),
    { maxRetries: 2, initialDelay: 1000 }
  );

  // Check if resumes exist on mount
  useEffect(() => {
    const checkForResumes = async () => {
      try {
        const resumeData = await getResumes(jobId);
        setHasUploadedResumes(resumeData.length > 0);
        setHasResumes(resumeData.length > 0);
      } catch (error) {
        console.error("Error checking for resumes:", error);
      }
    };
    
    checkForResumes();
  }, [jobId, setHasResumes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const { isValid, validFiles } = validateFiles(files);
    if (isValid) {
      setResumes(validFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...resumes];
    updatedFiles.splice(index, 1);
    setResumes(updatedFiles);
  };

  const handleUploadResumes = async () => {
    if (resumes.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one resume to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Upload files to storage
      const storageResult = await uploadFilesToStorage(resumes);

      if (!storageResult.success || storageResult.paths.length === 0) {
        toast({
          title: "Upload Failed",
          description: "Could not upload any resumes to storage.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Step 2: Send webhook notification
      const webhookSuccess = await sendWebhookNotification(storageResult.names, storageResult.paths);
      
      // Step 3: Process resumes with API
      const apiProcessing = await processResumes(resumes, storageResult.paths);

      // Determine the appropriate success message based on results
      if (apiProcessing.apiSuccessCount === resumes.length && webhookSuccess) {
        toast({
          title: "Success",
          description: `All ${resumes.length} resume(s) uploaded and processed successfully.`,
        });
      } else if (apiProcessing.apiSuccessCount > 0 || webhookSuccess) {
        toast({
          title: "Partial Success",
          description: `Uploaded ${storageResult.paths.length} file(s). Successfully processed ${apiProcessing.apiSuccessCount} resume(s).`,
        });
      } else {
        toast({
          title: "Limited Success",
          description: "Files uploaded to storage, but processing may need to be retried.",
          variant: "default"
        });
      }

      // Update state to reflect that we now have resumes
      setHasResumes(true);
      setHasUploadedResumes(true);
      setShowUploadDialog(false);
      setResumes([]);
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Unknown error during upload.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      setIsLoading(true);
      const success = await deleteResume(resumeId);
      
      if (success) {
        toast({
          title: "Resume Deleted",
          description: "The resume has been successfully removed.",
        });

        // Check if we still have any resumes
        const remainingResumes = await getResumes(jobId);
        setHasUploadedResumes(remainingResumes.length > 0);
        setHasResumes(remainingResumes.length > 0);
      } else {
        throw new Error("Failed to delete resume");
      }
    } catch (error: any) {
      console.error("Resume deletion error:", error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete resume. Please try again.",
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
    hasUploadedResumes,
    handleFileChange,
    handleRemoveFile,
    handleUploadResumes,
    handleDeleteResume,
    handleUploadDialogOpen: () => setShowUploadDialog(true),
    handleUploadDialogClose: () => {
      setShowUploadDialog(false);
      setResumes([]);
    },
  };
};
