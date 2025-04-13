
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
    if (formData.resumes.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one resume",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

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

      const jobResponse = await api.createJob(jobData) as JobResponse;
      const jobId = jobResponse.id;

      const resumePromises = formData.resumes.map(async (file) => {
        return new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const resumeText = e.target?.result as string;
              await api.uploadResume({
                resumeText,
                jobId,
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });
      });

      await Promise.all(resumePromises);

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
