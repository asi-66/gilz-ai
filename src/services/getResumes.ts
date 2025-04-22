
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
    const { data, error } = await supabase
      .from('parsed_resumes')
      .select('*')
      .eq('job_id', jobId)
      .order('parsed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Error Fetching Resumes",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    console.log('Retrieved resumes:', data);
    
    return data.map(resume => ({
      id: resume.id,
      fullName: resume.full_name,
      fileName: resume.storage_path ? resume.storage_path.split('/').pop() : null,
      uploadDate: new Date(resume.parsed_at).toLocaleDateString(),
      storagePath: resume.storage_path,
      matchScore: resume.skills ? (
        Array.isArray(resume.skills) && resume.skills.length > 0 ? 
          Math.floor(Math.random() * 30) + 70 : 0
      ) : 0, // Placeholder for actual score
    }));
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
