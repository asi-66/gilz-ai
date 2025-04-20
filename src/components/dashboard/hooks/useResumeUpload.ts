import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/services/api";
import { useRetry } from "@/hooks/use-retry";
import { v4 as uuidv4 } from 'uuid';

interface WebhookPayload {
  jobId: string;
  resumeId: string;
  fileName: string;
  uploadTime: string;
  fileSize: number;
}

export const useResumeUpload = (jobId: string, setHasResumes: (value: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [resumes, setResumes] = useState<File[]>([]);
  const [webhookUrl, setWebhookUrl] = useState<string>(localStorage.getItem('resumeWebhookUrl') || '');

  const { execute: executeWithRetry } = useRetry(
    async (fn: () => Promise<any>) => fn(),
    { maxRetries: 2, initialDelay: 1000 }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Maximum 5 resumes can be uploaded at once",
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
          description: `${file.name} is not supported. Please use PDF, TXT, DOC, or DOCX files.`,
          variant: "destructive",
        });
        return true;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 5MB limit.`,
          variant: "destructive",
        });
        return true;
      }
      
      return false;
    });
    
    if (invalidFiles.length > 0) return;
    setResumes(files);
  };

  const handleWebhookUrlChange = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('resumeWebhookUrl', url);
  };

  const triggerWebhook = async (payload: WebhookPayload) => {
    if (!webhookUrl) return;

    try {
      console.log("Triggering webhook with payload:", payload);
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });
      console.log("Webhook triggered successfully");
    } catch (error) {
      console.error("Error triggering webhook:", error);
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
      const resumePromises = resumes.map(async (file) => {
        const fileExt = file.name.substring(file.name.lastIndexOf('.'));
        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = `${jobId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(uploadError.message || 'Upload failed');
        }

        const resumeText = await file.text();
        const resumeResponse = await api.uploadResume({
          resumeText,
          jobId,
          storagePath: filePath
        });

        if (webhookUrl) {
          await triggerWebhook({
            jobId,
            resumeId: resumeResponse.resumeId,
            fileName: file.name,
            uploadTime: new Date().toISOString(),
            fileSize: file.size,
          });
        }

        return resumeResponse.resumeId;
      });

      const resumeIds = await Promise.all(resumePromises);
      console.log('All resumes processed successfully. Resume IDs:', resumeIds);
      
      toast({
        title: "Upload Successful",
        description: `${resumes.length} resume(s) uploaded successfully`,
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
        .select('*')
        .eq('id', resumeId)
        .single();

      if (fetchError) throw fetchError;

      if (resumeData && 'storage_path' in resumeData && resumeData.storage_path) {
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

      const { count, error: countError } = await supabase
        .from('parsed_resumes')
        .select('id', { count: 'exact', head: true })
        .eq('job_id', jobId);
        
      if (!countError && count === 0) {
        setHasResumes(false);
      }

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
    webhookUrl,
    handleFileChange,
    handleUploadResumes,
    handleDeleteResume,
    handleWebhookUrlChange,
    handleUploadDialogOpen: () => setShowUploadDialog(true),
    handleUploadDialogClose: () => {
      setShowUploadDialog(false);
      setResumes([]);
    },
  };
};
