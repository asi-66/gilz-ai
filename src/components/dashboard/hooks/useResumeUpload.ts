
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

  const sendWebhookNotification = async (fileNames: string[], storagePaths: string[]) => {
    try {
      console.log('Sending webhook notification for files:', fileNames);
      const webhookPayload = {
        type: "resume-upload",
        data: { 
          fileNames,
          jobId,
          storagePaths,
          timestamp: new Date().toISOString()
        }
      };

      // Use a shorter timeout for webhook notification
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Webhook notification response status:', response.status);
      
      if (!response.ok) {
        console.error('Webhook notification failed with status:', response.status);
        return false;
      }
      
      console.log('Webhook notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending webhook notification:', error);
      return false;
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
    const uploadedStoragePaths: string[] = [];
    let uploadSuccessCount = 0;
    let apiSuccessCount = 0;
    let webhookSuccess = false;

    try {
      for (const file of resumes) {
        try {
          const fileExt = file.name.substring(file.name.lastIndexOf('.'));
          const fileName = `${uuidv4()}${fileExt}`;
          const filePath = `${jobId}/${fileName}`;
          
          console.log(`Uploading file ${file.name} to Supabase storage at path ${filePath}`);
          
          const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, file);

          if (uploadError) {
            console.error(`Error uploading ${file.name} to storage:`, uploadError);
            throw uploadError;
          }

          console.log(`File ${file.name} uploaded successfully to storage`);
          uploadedFileNames.push(file.name);
          uploadedStoragePaths.push(filePath);
          uploadSuccessCount++;
          
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
        }
      }
      
      console.log(`${uploadSuccessCount} files uploaded to storage successfully`);
      
      if (uploadSuccessCount === 0) {
        throw new Error("All file uploads to storage failed");
      }
      
      // Always send webhook notification as soon as files are uploaded to storage
      webhookSuccess = await sendWebhookNotification(uploadedFileNames, uploadedStoragePaths);
      console.log('Webhook notification result:', webhookSuccess ? 'Success' : 'Failed');
      
      // Then try to process with API
      const apiPromises = uploadedStoragePaths.map(async (filePath, index) => {
        try {
          const file = resumes.find(f => uploadedFileNames.includes(f.name));
          if (!file) return null;
          
          const resumeText = await file.text();
          console.log(`Processing file ${uploadedFileNames[index]} with API`);
          
          return await executeWithRetry(async () => {
            const result = await api.uploadResume({
              resumeText,
              jobId,
              storagePath: filePath
            });
            return result;
          });
        } catch (apiError) {
          console.error(`API processing failed for ${uploadedFileNames[index]}:`, apiError);
          return null;
        }
      });
      
      const apiResults = await Promise.all(apiPromises);
      apiSuccessCount = apiResults.filter(Boolean).length;
      
      console.log(`${apiSuccessCount} files processed by API successfully`);
      
      // Show appropriate toast based on results
      if (apiSuccessCount === uploadSuccessCount) {
        toast({
          title: webhookSuccess ? "Success" : "Partial Success",
          description: webhookSuccess 
            ? `${apiSuccessCount} resumes uploaded and processed successfully.`
            : `${apiSuccessCount} resumes processed, but webhook notification failed.`,
        });
      } else if (apiSuccessCount > 0) {
        toast({
          title: "Partial Success",
          description: `${apiSuccessCount} of ${uploadSuccessCount} resumes were fully processed. All files are uploaded to storage. ${webhookSuccess ? 'Webhook notification sent.' : 'Webhook notification failed.'}`,
        });
      } else if (uploadSuccessCount > 0) {
        toast({
          title: "Partial Success",
          description: `Files uploaded to storage. ${webhookSuccess ? 'Webhook notification sent.' : 'Webhook notification failed.'} API processing failed.`,
        });
      }
      
      if (uploadSuccessCount > 0) {
        setHasResumes(true);
      }
      
      setShowUploadDialog(false);
      setResumes([]);
      
    } catch (error: any) {
      console.error("Resume upload error:", error);
      
      if (uploadSuccessCount > 0) {
        // If we uploaded at least one file, consider it a partial success
        toast({
          title: "Partial Success",
          description: `${uploadSuccessCount} files uploaded, but encountered an error: ${error.message || "Unknown error"}`,
        });
        
        // Still try to send webhook notification even if there was an error
        if (!webhookSuccess) {
          sendWebhookNotification(uploadedFileNames, uploadedStoragePaths)
            .then(success => {
              console.log('Fallback webhook notification result:', success ? 'Success' : 'Failed');
            });
        }
        
        setHasResumes(true);
        setShowUploadDialog(false);
        setResumes([]);
      } else {
        toast({
          title: "Upload Failed",
          description: error.message || "Failed to upload resumes. Please try again.",
          variant: "destructive",
        });
      }
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
