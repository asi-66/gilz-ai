
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export function useStorageUpload(jobId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [uploadedStoragePaths, setUploadedStoragePaths] = useState<string[]>([]);

  // Uploads each file to storage and tracks names/paths
  const uploadFilesToStorage = async (files: File[]): Promise<{names: string[], paths: string[], success: boolean}> => {
    setIsUploading(true);
    setUploadedFileNames([]);
    setUploadedStoragePaths([]);

    let fileNames: string[] = [];
    let storagePaths: string[] = [];
    let uploadsSucceeded = 0;

    for (const file of files) {
      try {
        const fileExt = file.name.substring(file.name.lastIndexOf('.'));
        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = `${jobId}/${fileName}`;
        const { error } = await supabase.storage.from('resumes').upload(filePath, file);

        if (error) {
          toast({
            title: "Upload Error",
            description: `Failed to upload "${file.name}" to storage.`,
            variant: "destructive",
          });
          continue;
        }
        fileNames.push(file.name);
        storagePaths.push(filePath);
        uploadsSucceeded++;
      } catch(error: any) {
        toast({
          title: "Upload Error",
          description: error.message || `Failed to upload "${file.name}"`,
          variant: "destructive",
        });
      }
    }

    setUploadedFileNames(fileNames);
    setUploadedStoragePaths(storagePaths);
    setIsUploading(false);

    return {
      names: fileNames,
      paths: storagePaths,
      success: uploadsSucceeded === files.length,
    };
  };

  return {
    isUploading,
    uploadedFileNames,
    uploadedStoragePaths,
    uploadFilesToStorage,
  };
}
