import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

interface FormData {
  flowName: string;
  jobDescription: string;
  workMode: string;
  resumes: File[];
}

interface JobResponse {
  jobId: string;
}

interface ResumeUploadResponse {
  resumeId: string;
}

export const useCreateJobForm = (
  onSuccess: (jobId: string) => void,
  onClose: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    flowName: "",
    jobDescription: "",
    workMode: "Remote",
    resumes: [],
  });

  const resetForm = () => {
    setFormData({
      flowName: "",
      jobDescription: "",
      workMode: "Remote",
      resumes: [],
    });
  };

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
    
    setFormData((prev) => ({ ...prev, resumes: files }));
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.flowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job flow name",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.resumes.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one resume",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting job creation process...');

    try {
      // Step 1: Create the job
      const jobData = {
        flowName: formData.flowName,
        jobDescription: formData.jobDescription,
        workMode: formData.workMode,
      };
      
      console.log('Submitting job data:', jobData);
      const jobResponse = await api.createJob(jobData);
      
      if (!jobResponse || !jobResponse.jobId) {
        throw new Error('Invalid job response - missing job ID');
      }
      
      const jobId = jobResponse.jobId;
      console.log('Job created successfully with ID:', jobId);

      // Step 2: Upload each resume
      const resumePromises = formData.resumes.map(async (file, index) => {
        return new Promise<string>((resolve, reject) => {
          console.log(`Processing resume ${index + 1}/${formData.resumes.length}: ${file.name}`);
          
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
          
          // Specify encoding to handle different file types better
          reader.readAsText(file, 'UTF-8');
        });
      });

      // Wait for all resumes to be uploaded
      const resumeIds = await Promise.all(resumePromises);
      console.log('All resumes processed successfully. Resume IDs:', resumeIds);
      
      toast({
        title: "Success",
        description: "Job flow created successfully",
      });
      
      resetForm();
      onSuccess(jobId);
      onClose();
    } catch (error: any) {
      console.error("Error creating job flow:", error);
      
      // Provide more detailed error message
      const errorMessage = error.message || "Unknown error";
      const statusCode = error.status || "";
      const errorDetails = error.details ? `: ${error.details}` : "";
      
      toast({
        title: `Error${statusCode ? ` (${statusCode})` : ""}`,
        description: `Failed to create job flow: ${errorMessage}${errorDetails}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSelectChange,
    handleFileChange,
    resetForm,
    handleSubmit
  };
};
