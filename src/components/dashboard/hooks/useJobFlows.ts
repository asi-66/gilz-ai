
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [isLoading, setIsLoading] = useState(false);
  const [jobFlows, setJobFlows] = useState<JobFlow[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchJobFlows = useCallback(async () => {
    const now = Date.now();
    
    // Prevent repeated fetching in short time intervals (debounce-like behavior)
    if (now - lastFetchTime < 2000 && jobFlows.length > 0) {
      console.log("Skipping fetch, already fetched recently");
      return;
    }
    
    // Only set loading to true if we're actually fetching
    setIsLoading(true);
    
    try {
      console.log("Fetching job flows from Supabase...");
      
      // Fetch job data from Supabase job_descriptions table
      const { data, error } = await supabase
        .from('job_descriptions')
        .select('id, title, description, location, created_at, is_active');
      
      if (error) {
        throw error;
      }
      
      console.log("Supabase job flows retrieved:", data);
      setLastFetchTime(now);
      
      if (data && data.length > 0) {
        // Map the Supabase data to our JobFlow interface
        const mappedJobs = data.map(job => ({
          id: job.id,
          title: job.title,
          // Map is_active to our status options
          status: job.is_active ? "active" as const : "completed" as const,
          location: job.location || "Remote",
          createdAt: new Date(job.created_at || Date.now()).toLocaleDateString(),
          // For candidate count, we would ideally count related records
          // For now, set to 0 as we'll need to implement this later
          candidateCount: 0
        }));
        
        setJobFlows(mappedJobs);
      } else {
        console.log("No job flows found in Supabase");
        setJobFlows([]);
      }
    } catch (error: any) {
      console.error("Error fetching job flows from Supabase:", error);
      toast({
        title: "Error",
        description: "Failed to fetch job flows. Please try again.",
        variant: "destructive",
      });
      // Don't clear existing data on error to prevent UI flashing
    } finally {
      setIsLoading(false);
    }
  }, [jobFlows.length, lastFetchTime]);

  return {
    jobFlows,
    isLoading,
    refreshJobFlows: fetchJobFlows
  };
};
