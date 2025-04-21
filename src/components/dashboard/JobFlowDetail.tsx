
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import JobFlowHeader from "./JobFlowHeader";
import JobFlowUploadDialog from "./JobFlowUploadDialog";
import JobFlowTabs from "./JobFlowTabs";
import JobFlowSettingsTab from "./JobFlowSettingsTab";
import { useJobFlowActions } from "./hooks/useJobFlowActions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JobFlowDetailProps {
  jobId: string;
  jobData: {
    title: string;
    description: string;
    location: string;
    status: "active" | "completed" | "pending";
    candidateCount: number;
    createdAt: string;
  };
}

const JobFlowDetail: React.FC<JobFlowDetailProps> = ({ jobId, jobData }) => {
  const [activeTab, setActiveTab] = useState("settings");
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [fetchedJobData, setFetchedJobData] = useState(jobData);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const {
    isEditing,
    formData,
    hasResumes,
    setHasResumes,
    showUploadDialog,
    resumes,
    handleChange,
    handleSelectChange,
    handleEdit,
    handleCancel,
    handleSave,
    handleFileChange,
    handleUploadResumes,
    handleUploadDialogOpen,
    handleUploadDialogClose,
    startEvaluation,
    startChat,
    handleDeleteResume,
    isLoading
  } = useJobFlowActions(jobId, fetchedJobData, setShowEvaluation, setShowChat, setActiveTab);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('job_descriptions')
          .select('*')
          .eq('id', jobId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          const { count: resumeCount, error: countError } = await supabase
            .from('parsed_resumes')
            .select('id', { count: 'exact', head: true })
            .eq('job_id', jobId);
          
          if (countError) console.error('Error counting resumes:', countError);
          
          setFetchedJobData({
            title: data.title || 'Untitled Job',
            description: data.description || 'No description provided',
            location: data.location || 'Remote',
            status: data.is_active ? "active" : "completed",
            candidateCount: resumeCount || 0,
            createdAt: new Date(data.created_at).toLocaleDateString(),
          });
          
          if (resumeCount && resumeCount > 0) {
            setHasResumes(true);
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch job details",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [jobId, setHasResumes]);

  // Determine the effective loading state (either data loading or action loading)
  const isPageLoading = isDataLoading || isLoading;

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-6 pb-8">
        <JobFlowHeader 
          jobData={fetchedJobData}
          showEvaluation={showEvaluation}
          showChat={showChat}
          isLoading={isPageLoading}
          activeTab={activeTab}
          hasResumes={hasResumes}
          onUploadResumes={handleUploadDialogOpen}
          onStartEvaluation={startEvaluation}
          onStartChat={startChat}
        />

        {showUploadDialog && (
          <JobFlowUploadDialog
            isLoading={isLoading}
            resumes={resumes}
            onClose={handleUploadDialogClose}
            onUpload={handleUploadResumes}
            onFileChange={handleFileChange}
          />
        )}

        {showEvaluation || showChat ? (
          <JobFlowTabs
            jobId={jobId}
            activeTab={activeTab}
            showEvaluation={showEvaluation}
            showChat={showChat}
            formData={formData}
            isEditing={isEditing}
            isLoading={isLoading}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleSave={handleSave}
            handleDeleteResume={handleDeleteResume}
          />
        ) : (
          <JobFlowSettingsTab 
            formData={formData}
            isEditing={isEditing}
            isLoading={isLoading}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleSave={handleSave}
          />
        )}
      </div>
    </ScrollArea>
  );
};

export default JobFlowDetail;
