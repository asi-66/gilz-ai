
import React from "react";
import { Resume } from "@/services/getResumes";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CandidateDialogProps {
  candidate: Resume | null;
  onClose: () => void;
  onDownload: (e: React.MouseEvent, storagePath: string | null) => void;
  onDelete: (resumeId: string) => void;
}

const CandidateDialog: React.FC<CandidateDialogProps> = ({
  candidate,
  onClose,
  onDownload,
  onDelete,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getCandidateName = (resume: Resume) => {
    return resume.fullName || resume.fileName || 'Unnamed Candidate';
  };

  if (!candidate) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-background/80 backdrop-blur-lg border border-border/50 shadow-lg">
        <DialogHeader>
          <DialogTitle>Candidate Profile</DialogTitle>
          <DialogDescription>
            Resume details for {getCandidateName(candidate)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{getCandidateName(candidate)}</h3>
            <Badge variant="outline" className={getScoreColor(candidate.matchScore || 0)}>
              {candidate.matchScore || 0}% Match
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Upload Information</h4>
            <p className="text-sm">Uploaded on: {candidate.uploadDate}</p>
            <p className="text-sm">File: {candidate.fileName || 'Unknown file'}</p>
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={(e) => candidate.storagePath && onDownload(e, candidate.storagePath)}>
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                onDelete(candidate.id);
                onClose();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDialog;
