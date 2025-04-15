
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
      const jobData = {
        title: formData.flowName,
        description: formData.jobDescription,
        location: formData.workMode,
        department: "Not Specified",
        requiredSkills: [],
        preferredSkills: [],
        minimumExperience: "Not Specified",
        educationRequirements: "Not Specified",
      };

      console.log('Submitting job data:', jobData);
      const jobResponse = await api.createJob(jobData) as JobResponse;
      console.log('Job created successfully:', jobResponse);
      
      if (!jobResponse || !jobResponse.id) {
        throw new Error('Invalid job response - missing job ID');
      }
      
      const jobId = jobResponse.id;
      console.log('Processing resumes for job ID:', jobId);

      const resumePromises = formData.resumes.map(async (file, index) => {
        return new Promise<void>((resolve, reject) => {
          console.log(`Processing resume ${index + 1}/${formData.resumes.length}: ${file.name}`);
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            try {
              const resumeText = e.target?.result as string;
              console.log(`Uploading resume ${index + 1} content (${resumeText.length} chars)`);
              
              await api.uploadResume({
                resumeText,
                jobId,
              });
              
              console.log(`Resume ${index + 1} uploaded successfully`);
              resolve();
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

      await Promise.all(resumePromises);
      console.log('All resumes processed successfully');

      toast({
        title: "Success",
        description: "Job flow created successfully",
      });

      resetForm();
      onSuccess(jobId);
      onClose();
    } catch (error) {
      console.error("Error creating job flow:", error);
      toast({
        title: "Error",
        description: "Failed to create job flow. Please try again.",
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
