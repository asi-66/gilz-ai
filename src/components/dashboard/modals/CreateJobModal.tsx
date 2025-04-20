
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import JobFlowForm from "../JobFormSteps/JobFlowForm";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background/80 backdrop-blur-lg border border-border/50 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Job Flow</DialogTitle>
          <DialogDescription>Create a new job flow by entering the job details</DialogDescription>
        </DialogHeader>

        <JobFlowForm onSuccess={onSuccess} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
