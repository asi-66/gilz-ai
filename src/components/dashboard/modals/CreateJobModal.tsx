
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
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";
import Step1NameFlow from "../JobFormSteps/Step1NameFlow";
import Step2JobDetails from "../JobFormSteps/Step2JobDetails";
import Step3ResumeUpload from "../JobFormSteps/Step3ResumeUpload";
import { useCreateJobForm } from "../hooks/useCreateJobForm";

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
  
  const { 
    formData, 
    isLoading, 
    handleChange, 
    handleSelectChange, 
    handleFileChange, 
    resetForm,
    handleSubmit 
  } = useCreateJobForm(onSuccess, onClose);

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
            <Step1NameFlow 
              flowName={formData.flowName}
              onChange={handleChange}
            />
          )}

          {step === 2 && (
            <Step2JobDetails 
              jobDescription={formData.jobDescription}
              workMode={formData.workMode}
              onInputChange={handleChange}
              onSelectChange={handleSelectChange}
            />
          )}

          {step === 3 && (
            <Step3ResumeUpload 
              resumes={formData.resumes}
              onFileChange={handleFileChange}
            />
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
