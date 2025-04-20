import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/services/api";
import { useRetry } from "@/hooks/use-retry";
import { v4 as uuidv4 } from 'uuid';

interface WebhookPayload {
  type: "resume-upload";
  data: {
    fileNames: string[];
  }
}

export const useResumeUpload = (jobId: string, setHasResumes: (value: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [resumes, setResumes] = useState<File[]>([]);
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('resumeWebhookUrl') || '');

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

  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setWebhookUrl(url);
    localStorage.setItem('resumeWebhookUrl', url);
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
        
        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(uploadError.message || 'Upload failed');
        }

        uploadedFileNames.push(file.name);
        
        // Parse resume and store metadata
        const resumeText = await file.text();
        const resumeResponse = await api.uploadResume({
          resumeText,
          jobId,
          storagePath: filePath
        });

        return resumeResponse.resumeId;
      });

      const resumeIds = await Promise.all(resumePromises);
      
      // After all files are uploaded, trigger webhook if URL is provided
      if (webhookUrl) {
        const webhookPayload: WebhookPayload = {
          type: "resume-upload",
          data: {
            fileNames: uploadedFileNames
          }
        };

        try {
          const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
          });

          if (!webhookResponse.ok) {
            throw new Error('Webhook notification failed');
          }

          console.log('Webhook notification sent successfully');
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          toast({
            title: "Webhook Notification Failed",
            description: "Files were uploaded but webhook notification failed",
            variant: "destructive",
          });
        }
      }

      console.log('All resumes processed successfully. Resume IDs:', resumeIds);
      
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
      // We need to check if the storage_path column exists
      // Get the resume data first
      const { data: resumeData, error: fetchError } = await supabase
        .from('parsed_resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

      if (fetchError) throw fetchError;

      // Only attempt to delete from storage if storage_path exists
      if (resumeData && 'storage_path' in resumeData && resumeData.storage_path) {
        // Delete from Supabase storage
        const { error: storageError } = await supabase.storage
          .from('resumes')
          .remove([resumeData.storage_path]);

        if (storageError) throw storageError;
      }

      // Delete from parsed_resumes table
      const { error: deleteError } = await supabase
        .from('parsed_resumes')
        .delete()
        .eq('id', resumeId);

      if (deleteError) throw deleteError;

      toast({
        title: "Resume Deleted",
        description: "The resume has been successfully removed.",
      });

      // Implement a check to see if there are still resumes for this job
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
