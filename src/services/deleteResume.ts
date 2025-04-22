
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const deleteResume = async (resumeId: string): Promise<boolean> => {
  console.log('Deleting resume with ID:', resumeId);
  try {
    // First, get the resume data to find the storage path
    const { data: resumeData, error: fetchError } = await supabase
      .from('parsed_resumes')
      .select('storage_path')
      .eq('id', resumeId)
      .single();

    if (fetchError) {
      console.error('Error fetching resume data for deletion:', fetchError);
      throw fetchError;
    }

    // If we have a storage path, delete the file from storage
    if (resumeData?.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([resumeData.storage_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue with DB deletion even if storage deletion fails
      }
    }

    // Delete the resume record from the database
    const { error: deleteError } = await supabase
      .from('parsed_resumes')
      .delete()
      .eq('id', resumeId);

    if (deleteError) {
      console.error('Error deleting resume record:', deleteError);
      throw deleteError;
    }

    return true;
  } catch (error: any) {
    console.error('Exception deleting resume:', error);
    toast({
      title: "Error Deleting Resume",
      description: error.message || "Failed to delete resume",
      variant: "destructive",
    });
    return false;
  }
};
