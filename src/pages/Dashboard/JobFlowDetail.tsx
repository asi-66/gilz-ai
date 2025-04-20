
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import JobFlowDetail from "@/components/dashboard/JobFlowDetail";
import { toast } from "@/hooks/use-toast";

const JobFlowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "Remote",
    status: "active" as const,
    candidateCount: 0,
    createdAt: new Date().toLocaleDateString(),
  });

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('job_descriptions')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Count associated resumes
          const { count: resumeCount, error: countError } = await supabase
            .from('parsed_resumes')
            .select('id', { count: 'exact', head: true })
            .eq('job_id', id);
          
          if (countError) console.error('Error counting resumes:', countError);
          
          setJobData({
            title: data.title || 'Untitled Job',
            description: data.description || 'No description provided',
            location: data.location || 'Remote',
            status: data.is_active ? "active" : "completed",
            candidateCount: resumeCount || 0,
            createdAt: new Date(data.created_at).toLocaleDateString(),
          });
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch job data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobData();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/job-flow')}
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Flows
          </Button>
        </div>
        
        {id ? (
          isLoading ? (
            <Card className="border border-border/50 p-6">
              <CardContent className="flex justify-center items-center h-[200px]">
                <div className="text-center">
                  <div className="h-8 w-8 border-2 border-primary/30 border-t-primary animate-spin rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading job details...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <JobFlowDetail jobId={id} jobData={jobData} />
          )
        ) : (
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Job Flow Not Found. Please go back to Job Flow Management.
              </p>
              <Button 
                onClick={() => navigate('/dashboard/job-flow')}
                className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
              >
                Go to Job Flow Management
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobFlowDetailPage;
