
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";
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
  
  const { 
    isLoading, 
    isEditing, 
    formData, 
    handleChange, 
    handleSelectChange, 
    handleEdit, 
    handleCancel, 
    handleSave,
    startEvaluation,
    startChat
  } = useJobFlowActions(jobId, jobData, setShowEvaluation, setShowChat, setActiveTab);

  return (
    <div className="space-y-6">
      <JobFlowHeader 
        jobData={jobData}
        showEvaluation={showEvaluation}
        showChat={showChat}
        isLoading={isLoading}
        activeTab={activeTab}
        onStartEvaluation={startEvaluation}
        onStartChat={startChat}
      />

      {showEvaluation || showChat ? (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {showEvaluation && <TabsTrigger value="evaluation">Evaluation</TabsTrigger>}
            {showChat && <TabsTrigger value="chat">Chat</TabsTrigger>}
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
