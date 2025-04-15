
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
  id: string;
}

interface ResumeUploadResponse {
  id: string;
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setFormData((prev) => ({ ...prev, resumes: files }));
  };

  const handleSubmit = async () => {
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
      
      if (!jobResponse || !jobResponse.id) {
        throw new Error('Invalid job response - missing job ID');
      }
      
      const jobId = jobResponse.id;
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
              
              console.log(`Resume ${index + 1} uploaded successfully with ID: ${resumeResponse.id}`);
              resolve(resumeResponse.id);
            } catch (error) {
              console.error(`Error uploading resume ${index + 1}:`, error);
              reject(error);
            }
          };
          
          reader.onerror = (error) => {
            console.error(`Error reading resume ${index + 1}:`, error);
            reject(error);
          };
          
          reader.readAsText(file);
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
      toast({
        title: "Error",
        description: error.message || "Failed to create job flow. Please try again.",
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
