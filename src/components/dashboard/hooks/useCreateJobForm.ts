
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

interface FormData {
  flowName: string;
  jobDescription: string;
  workMode: string;
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
  });

  const resetForm = () => {
    setFormData({
      flowName: "",
      jobDescription: "",
      workMode: "Remote",
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

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.flowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job title",
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

    setIsLoading(true);
    console.log('Starting job creation process...');

    try {
      // Create the job
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
      
      toast({
        title: "Success",
        description: "New Job Flow Created",
      });
      
      resetForm();
      onSuccess(jobId);
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
    resetForm,
    handleSubmit
  };
};
