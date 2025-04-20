
import { toast } from "@/hooks/use-toast";

export interface FileValidationOptions {
  maxFiles?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export const validateFiles = (
  files: File[],
  options: FileValidationOptions = {}
): { isValid: boolean; validFiles: File[] } => {
  const {
    maxFiles = 5,
    maxSizeInMB = 5,
    allowedTypes = ['.pdf', '.txt', '.docx', '.doc']
  } = options;

  if (files.length > maxFiles) {
    toast({
      title: "Too Many Files",
      description: `Maximum ${maxFiles} resumes can be uploaded at once`,
      variant: "destructive",
    });
    return { isValid: false, validFiles: [] };
  }

  const validFiles = files.filter(file => {
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const isValidType = allowedTypes.some(type => fileExt.endsWith(type));
    
    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: `${file.name} is not supported. Please use PDF, TXT, DOC, or DOCX files.`,
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `${file.name} exceeds the ${maxSizeInMB}MB limit.`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  });

  return {
    isValid: validFiles.length === files.length,
    validFiles
  };
};
