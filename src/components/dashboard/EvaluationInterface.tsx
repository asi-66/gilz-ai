
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getResumes, Resume } from "@/services/getResumes";
import { supabase } from "@/integrations/supabase/client";
import ResumeTable from "./resume/ResumeTable";
import CandidateDialog from "./resume/CandidateDialog";
import DeleteConfirmationDialog from "./resume/DeleteConfirmationDialog";

interface EvaluationInterfaceProps {
  jobId: string;
  onDeleteResume?: (resumeId: string) => void;
}

const EvaluationInterface: React.FC<EvaluationInterfaceProps> = ({ jobId, onDeleteResume }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Resume | null>(null);
  const [sortField, setSortField] = useState<"matchScore" | "fullName" | "uploadDate">("matchScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const resumeData = await getResumes(jobId);
      setResumes(resumeData);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast({
        title: "Error Loading Resumes",
        description: "Could not load resumes. Please try refreshing.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchResumes();
    }
  }, [jobId]);

  const toggleSort = (field: "matchScore" | "fullName" | "uploadDate") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedResumes = [...resumes].sort((a, b) => {
    if (sortField === "matchScore") {
      const scoreA = a.matchScore || 0;
      const scoreB = b.matchScore || 0;
      return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA;
    } else if (sortField === "fullName") {
      const nameA = a.fullName || '';
      const nameB = b.fullName || '';
      return sortDirection === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else {
      const dateA = new Date(a.uploadDate).getTime();
      const dateB = new Date(b.uploadDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
  });

  const handleDownload = async (e: React.MouseEvent, storagePath: string | null) => {
    e.stopPropagation();
    if (!storagePath) {
      toast({
        title: "Error",
        description: "File path not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(storagePath);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = storagePath.split('/').pop() || 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: error.message || "Could not download the file",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, resumeId: string) => {
    e.stopPropagation();
    setResumeToDelete(resumeId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (resumeToDelete && onDeleteResume) {
      await onDeleteResume(resumeToDelete);
      setShowDeleteDialog(false);
      setResumeToDelete(null);
      fetchResumes();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Resume Evaluation Results</CardTitle>
            <CardDescription>Review candidate evaluations and scores</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchResumes}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <span>Loading resumes...</span>
            </div>
          ) : resumes.length > 0 ? (
            <ResumeTable
              resumes={sortedResumes}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
              onCandidateClick={setSelectedCandidate}
              onDownload={handleDownload}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No resumes uploaded yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Upload resumes to start evaluating candidates
              </p>
              <Button className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90">
                Upload Resumes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CandidateDialog
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onDownload={handleDownload}
        onDelete={(resumeId) => {
          setResumeToDelete(resumeId);
          setShowDeleteDialog(true);
        }}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default EvaluationInterface;
