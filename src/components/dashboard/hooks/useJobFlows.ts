
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

export interface JobFlow {
  id: string;
  title: string;
  status: "active" | "completed" | "pending";
  location: string;
  createdAt: string;
  candidateCount: number;
}

export const useJobFlows = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobFlows, setJobFlows] = useState<JobFlow[]>([]);

  const fetchJobFlows = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching job flows...");
      const response = await api.getJobFlows();
      console.log("Job flows response:", response);
      
      if (response.success && response.jobs) {
        setJobFlows(response.jobs.map((job: any) => ({
          id: job.jobId,
          title: job.title,
          status: job.status || "active",
          location: job.workMode || "Remote",
          createdAt: new Date(job.timestamp || Date.now()).toLocaleDateString(),
          candidateCount: job.candidateCount || 0
        })));
      } else {
        setJobFlows([]);
      }
    } catch (error: any) {
      console.error("Error fetching job flows:", error);
      toast({
        title: "Error",
        description: "Failed to fetch job flows. Please try again.",
        variant: "destructive",
      });
      setJobFlows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobFlows();
  }, []);

  return {
    jobFlows,
    isLoading,
    refreshJobFlows: fetchJobFlows
  };
};
