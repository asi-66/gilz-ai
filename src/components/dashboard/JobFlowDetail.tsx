
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ChatInterface from "./ChatInterface";
import EvaluationInterface from "./EvaluationInterface";
import JobFlowSettingsTab from "./JobFlowSettingsTab";
import JobFlowHeader from "./JobFlowHeader";
import { useJobFlowActions } from "./hooks/useJobFlowActions";

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
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch correct job data from Supabase
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
          // Count associated resumes
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
          
          // Check if there are any resumes to enable evaluation and chat
          if (resumeCount && resumeCount > 0) {
            setHasResumesState(true);
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
        setIsLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [jobId]);
  
  // This is to update the hasResumes state based on resumeCount
  const setHasResumesState = (hasResumes: boolean) => {
    setHasResumesInternal(hasResumes);
  };
  
  const { 
    isEditing, 
    formData,
    hasResumes: hasResumesInternal,
    setHasResumes: setHasResumesInternal,
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
    startChat
  } = useJobFlowActions(jobId, fetchedJobData, setShowEvaluation, setShowChat, setActiveTab);

  return (
    <div className="space-y-6">
      <JobFlowHeader 
        jobData={fetchedJobData}
        showEvaluation={showEvaluation}
        showChat={showChat}
        isLoading={isLoading}
        activeTab={activeTab}
        hasResumes={hasResumesInternal}
        onUploadResumes={handleUploadDialogOpen}
        onStartEvaluation={startEvaluation}
        onStartChat={startChat}
      />

      {showUploadDialog && (
        <Card className="border border-black/10 dark:border-white/10 bg-white/90 dark:bg-gray-900/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-900 dark:text-white">Upload Resumes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resumes" className="text-gray-900 dark:text-white">Select Resume Files (PDF, TXT, DOC, DOCX)</Label>
              <Input
                id="resumes"
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You can upload up to 5 resumes. Maximum file size: 5MB per file.
              </p>
              
              {resumes.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Selected files:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400">
                    {resumes.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleUploadDialogClose}
                disabled={isLoading}
                className="bg-white/20 dark:bg-black/20 text-gray-900 dark:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUploadResumes}
                disabled={resumes.length === 0 || isLoading}
                className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
              >
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showEvaluation || showChat ? (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/20 dark:bg-black/20">
            <TabsTrigger value="settings" className="text-gray-900 dark:text-white">Settings</TabsTrigger>
            {showEvaluation && <TabsTrigger value="evaluation" className="text-gray-900 dark:text-white">Evaluation</TabsTrigger>}
            {showChat && <TabsTrigger value="chat" className="text-gray-900 dark:text-white">Chat</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="settings" className="mt-4">
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
          </TabsContent>
          
          {showEvaluation && (
            <TabsContent value="evaluation" className="mt-4">
              <EvaluationInterface jobId={jobId} />
            </TabsContent>
          )}
          
          {showChat && (
            <TabsContent value="chat" className="mt-4">
              <ChatInterface jobId={jobId} sessionId={`job-${jobId}`} />
            </TabsContent>
          )}
        </Tabs>
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
  );
};

export default JobFlowDetail;
