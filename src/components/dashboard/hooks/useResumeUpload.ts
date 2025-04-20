
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/services/api";
import { useRetry } from "@/hooks/use-retry";
import { v4 as uuidv4 } from 'uuid';
import { validateFiles } from "./utils/fileValidation";

const N8N_WEBHOOK_URL = "https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab";

export const useResumeUpload = (jobId: string, setHasResumes: (value: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [resumes, setResumes] = useState<File[]>([]);

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

  const sendWebhookNotification = async (fileNames: string[]) => {
    try {
      const webhookPayload = {
        type: "resume-upload",
        data: { fileNames }
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error('Webhook notification failed');
      }
    } catch (error) {
      console.error('Error sending webhook notification:', error);
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
    const uploadedFileNames: string[] = [];

    try {
      const resumePromises = resumes.map(async (file) => {
        const fileExt = file.name.substring(file.name.lastIndexOf('.'));
        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = `${jobId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        uploadedFileNames.push(file.name);
        
        const resumeText = await file.text();
        return api.uploadResume({
          resumeText,
          jobId,
          storagePath: filePath
        });
      });

      await Promise.all(resumePromises);
      
      // Send notification to N8N webhook
      await sendWebhookNotification(uploadedFileNames);

      toast({
        title: "Success",
        description: "Resumes uploaded successfully. Processing...",
      });
      
      setHasResumes(true);
      setShowUploadDialog(false);
      setResumes([]);
      
    } catch (error: any) {
      console.error("Resume upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload resumes. Please try again.",
        variant: "destructive",
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
