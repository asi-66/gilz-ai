
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobFlowSettingsTab from "./JobFlowSettingsTab";
import EvaluationInterface from "./EvaluationInterface";
import ChatInterface from "./ChatInterface";

interface JobFlowTabsProps {
  jobId: string;
  activeTab: string;
  showEvaluation: boolean;
  showChat: boolean;
  formData: {
    title: string;
    description: string;
    location: string;
  };
  isEditing: boolean;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  handleDeleteResume?: (resumeId: string) => void;
}

const JobFlowTabs: React.FC<JobFlowTabsProps> = ({
  jobId,
  activeTab,
  showEvaluation,
  showChat,
  formData,
  isEditing,
  isLoading,
  handleChange,
  handleSelectChange,
  handleEdit,
  handleCancel,
  handleSave,
  handleDeleteResume
}) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab}>
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
          <EvaluationInterface 
            jobId={jobId} 
            onDeleteResume={handleDeleteResume} 
          />
        </TabsContent>
      )}
      
      {showChat && (
        <TabsContent value="chat" className="mt-4">
          <ChatInterface jobId={jobId} sessionId={`job-${jobId}`} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default JobFlowTabs;
