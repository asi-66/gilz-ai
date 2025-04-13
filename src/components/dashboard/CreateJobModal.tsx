
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

interface Step1FormData {
  flowName: string;
}

interface Step2FormData {
  jobDescription: string;
  workMode: string;
}

interface Step3FormData {
  resumes: File[];
}

type FormData = Step1FormData & Step2FormData & Step3FormData;

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
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
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNextStep = () => {
    if (step === 1 && !formData.flowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a flow name",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !formData.jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
      // Step 1: Create the job
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

      const jobResponse = await api.createJob(jobData);
      const jobId = jobResponse.id;

      // Step 2: Upload resumes
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background/80 backdrop-blur-lg border border-border/50 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 1 && "Create New Job Flow - Step 1"}
            {step === 2 && "Create New Job Flow - Step 2"}
            {step === 3 && "Create New Job Flow - Step 3"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Name your job flow"}
            {step === 2 && "Enter job details"}
            {step === 3 && "Upload resumes (max 5)"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flowName">Flow Name</Label>
                <Input
                  id="flowName"
                  name="flowName"
                  placeholder="e.g., UI/UX Designer Screening"
                  value={formData.flowName}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Enter the job description here..."
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workMode">Work Mode</Label>
                <Select
                  value={formData.workMode}
                  onValueChange={(value) =>
                    handleSelectChange("workMode", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="In-office">In-office</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resumes">Upload Resumes (Max 5)</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="resumes"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/30 hover:bg-background/50 border-border/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-foreground/70">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-foreground/50">
                        PDF, DOCX, or TXT (MAX. 5 files)
                      </p>
                    </div>
                    <Input
                      id="resumes"
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {formData.resumes.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">
                      {formData.resumes.length} file(s) selected:
                    </p>
                    <ul className="text-xs text-foreground/70 mt-1">
                      {formData.resumes.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={handleNextStep} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="relative"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Create Job Flow"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
