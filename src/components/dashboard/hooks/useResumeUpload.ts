import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/services/api";
import { useRetry } from "@/hooks/use-retry";
import { v4 as uuidv4 } from 'uuid';
import { validateFiles } from "./utils/fileValidation";
import { useStorageUpload } from "./useStorageUpload";
import { useResumeApiProcessing } from "./useResumeApiProcessing";

const N8N_WEBHOOK_URL = "https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab";

export const useResumeUpload = (jobId: string, setHasResumes: (value: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [resumes, setResumes] = useState<File[]>([]);

  const { isUploading, uploadFilesToStorage } = useStorageUpload(jobId);
  const { sendWebhookNotification, processResumes } = useResumeApiProcessing(jobId);

  const { execute: executeWithRetry } = useRetry(
    async (fn: () => Promise<any>) => fn(),
    { maxRetries: 2, initialDelay: 1000 }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const { isValid, validFiles } = validateFiles(files);
    if (isValid) {
      setResumes(validFiles);
    }
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

      const webhookSuccess = await sendWebhookNotification(storageResult.names, storageResult.paths);

      const apiProcessing = await processResumes(resumes, storageResult.paths);

      if (apiProcessing.apiSuccessCount === resumes.length && webhookSuccess) {
        toast({
          title: "Success",
          description: `Uploaded and processed all resumes successfully.`,
        });
      } else if (apiProcessing.apiSuccessCount > 0 || webhookSuccess) {
        toast({
          title: "Partial Success",
          description: `${apiProcessing.apiSuccessCount} resume(s) processed. Webhook sent? ${webhookSuccess ? 'Yes' : 'No'}`,
        });
      } else {
        toast({
          title: "Warning",
          description: "File(s) uploaded to storage, but processing and/or webhook failed.",
          variant: "destructive"
        });
      }

      setHasResumes(true);
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
      const { data: resumeData, error: fetchError } = await supabase
        .from('parsed_resumes')
        .select('storage_path')
        .eq('id', resumeId)
        .single();

      if (fetchError) throw fetchError;

      if (resumeData?.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('resumes')
          .remove([resumeData.storage_path]);

        if (storageError) throw storageError;
      }

      const { error: deleteError } = await supabase
        .from('parsed_resumes')
        .delete()
        .eq('id', resumeId);

      if (deleteError) throw deleteError;

      toast({
        title: "Resume Deleted",
        description: "The resume has been successfully removed.",
      });

      const { count } = await supabase
        .from('parsed_resumes')
        .select('id', { count: 'exact', head: true })
        .eq('job_id', jobId);
        
      setHasResumes(!!count);

    } catch (error: any) {
      console.error("Resume deletion error:", error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    showUploadDialog,
    resumes,
    handleFileChange,
    handleUploadResumes,
    handleDeleteResume,
    handleUploadDialogOpen: () => setShowUploadDialog(true),
    handleUploadDialogClose: () => {
      setShowUploadDialog(false);
      setResumes([]);
    },
  };
};
