
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Resume {
  id: string;
  fullName: string | null;
  fileName: string | null;
  uploadDate: string;
  storagePath: string | null;
  matchScore?: number;
}

export const getResumes = async (jobId: string): Promise<Resume[]> => {
  console.log('Fetching resumes for job ID:', jobId);
  try {
    // Make sure we're querying with the exact job ID format that's stored in the database
    const { data, error, count } = await supabase
      .from('parsed_resumes')
      .select('*', { count: 'exact' })
      .eq('job_id', jobId);
    
    if (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Error Fetching Resumes",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    console.log('Retrieved resumes raw data:', data);
    console.log('Total count from database:', count);
    
    if (!data || data.length === 0) {
      // Log all rows from the parsed_resumes table to debug
      const { data: allResumes, error: allError } = await supabase
        .from('parsed_resumes')
        .select('id, job_id, full_name, storage_path')
        .limit(10);
      
      if (!allError && allResumes) {
        console.log('Sample of available resumes in database:', allResumes);
      }
      
      console.log('No resumes found for this job ID');
      return [];
    }
    
    const formatted = data.map(resume => {
      const formattedResume = {
        id: resume.id,
        fullName: resume.full_name,
        fileName: resume.storage_path ? resume.storage_path.split('/').pop() : null,
        uploadDate: new Date(resume.parsed_at).toLocaleDateString(),
        storagePath: resume.storage_path,
        matchScore: resume.skills ? (
          Array.isArray(resume.skills) && resume.skills.length > 0 ? 
            Math.floor(Math.random() * 30) + 70 : 0
        ) : 0, // Placeholder for actual score
      };
      console.log('Formatted resume:', formattedResume);
      return formattedResume;
    });
    
    console.log('Total resumes found:', formatted.length);
    return formatted;
  } catch (error: any) {
    console.error('Exception fetching resumes:', error);
    toast({
      title: "Error Fetching Resumes",
      description: error.message || "Unknown error occurred",
      variant: "destructive",
    });
    return [];
  }
};
