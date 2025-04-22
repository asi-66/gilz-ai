
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowUpDown, Star, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { getResumes, Resume } from "@/services/getResumes";
import { supabase } from "@/integrations/supabase/client";

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
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
    } else if (sortField === "uploadDate") {
      const dateA = new Date(a.uploadDate).getTime();
      const dateB = new Date(b.uploadDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const handleCandidateClick = (candidate: Resume) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseDialog = () => {
    setSelectedCandidate(null);
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
      fetchResumes(); // Refresh the list after deletion
    }
  };

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
      
      // Create a download link and trigger download
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

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getCandidateName = (resume: Resume) => {
    return resume.fullName || resume.fileName || 'Unnamed Candidate';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
        <CardHeader>
          <CardTitle>
            Resume Evaluation Results
          </CardTitle>
          <CardDescription>
            Review candidate evaluations and scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading resumes...</span>
            </div>
          ) : resumes.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => toggleSort("matchScore")}>
                        Match Score
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResumes.map((resume) => (
                    <TableRow key={resume.id} className="cursor-pointer hover:bg-background/50" onClick={() => handleCandidateClick(resume)}>
                      <TableCell>
                        <div className="font-medium">{getCandidateName(resume)}</div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${getScoreColor(resume.matchScore || 0)}`}>
                          {resume.matchScore || 0}%
                        </div>
                      </TableCell>
                      <TableCell>{resume.uploadDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => handleDownload(e, resume.storagePath)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {onDeleteResume && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleDeleteClick(e, resume.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No resumes uploaded yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Upload resumes to start evaluating candidates</p>
              <Button 
                className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
              >
                Upload Resumes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Detail Dialog */}
      <Dialog open={selectedCandidate !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] bg-background/80 backdrop-blur-lg border border-border/50 shadow-lg">
          <DialogHeader>
            <DialogTitle>Candidate Profile</DialogTitle>
            <DialogDescription>
              Resume details for {selectedCandidate ? getCandidateName(selectedCandidate) : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{getCandidateName(selectedCandidate)}</h3>
                <Badge variant="outline" className={`${getScoreColor(selectedCandidate.matchScore || 0)}`}>
                  {selectedCandidate.matchScore || 0}% Match
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Upload Information</h4>
                <p className="text-sm">Uploaded on: {selectedCandidate.uploadDate}</p>
                <p className="text-sm">File: {selectedCandidate.fileName || 'Unknown file'}</p>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={(e) => selectedCandidate.storagePath && handleDownload(e, selectedCandidate.storagePath)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
                {onDeleteResume && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setResumeToDelete(selectedCandidate.id);
                      setShowDeleteDialog(true);
                      handleCloseDialog();
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Resume
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResumeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EvaluationInterface;
