
import { useState, useEffect, useCallback } from "react";
import { Resume } from "@/services/getResumes";
import { getResumes } from "@/services/getResumes";
import { toast } from "@/hooks/use-toast";

export const useEvaluationInterface = (jobId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Resume | null>(null);
  const [sortField, setSortField] = useState<"matchScore" | "fullName" | "uploadDate">("matchScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [fetchAttempts, setFetchAttempts] = useState(0);

  const fetchResumes = useCallback(async () => {
    if (!jobId) {
      console.error("Cannot fetch resumes: No job ID provided");
      setIsLoading(false);
      return;
    }

    console.log(`Attempting to fetch resumes (attempt ${fetchAttempts + 1})...`);
    setIsLoading(true);
    
    try {
      const resumeData = await getResumes(jobId);
      console.log(`Resume data fetched, count: ${resumeData.length}`);
      setResumes(resumeData);
      
      if (resumeData.length === 0 && fetchAttempts < 2) {
        // If no resumes found and we haven't tried many times, schedule another attempt
        setFetchAttempts(prev => prev + 1);
      }
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
  }, [jobId, fetchAttempts]);

  useEffect(() => {
    if (jobId) {
      fetchResumes();
    }
  }, [jobId, fetchResumes]);

  // If no resumes found on first attempt, try again after a delay
  useEffect(() => {
    if (fetchAttempts > 0 && fetchAttempts < 3 && resumes.length === 0) {
      const timer = setTimeout(() => {
        fetchResumes();
      }, 2000); // Wait 2 seconds before retrying
      
      return () => clearTimeout(timer);
    }
  }, [fetchAttempts, resumes.length, fetchResumes]);

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

  return {
    isLoading,
    selectedCandidate,
    sortField,
    sortDirection,
    showDeleteDialog,
    resumeToDelete,
    sortedResumes,
    setSelectedCandidate,
    setShowDeleteDialog,
    setResumeToDelete,
    toggleSort,
    fetchResumes
  };
};
