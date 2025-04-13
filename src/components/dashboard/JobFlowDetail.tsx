
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, MessageSquare, Save, Users } from "lucide-react";
import { api } from "@/services/api";
import ChatInterface from "./ChatInterface";
import EvaluationInterface from "./EvaluationInterface";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: jobData.title,
    description: jobData.description,
    location: jobData.location,
  });

  const [evaluationReady, setEvaluationReady] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // API call to update job flow would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Success",
        description: "Job flow updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job flow",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEvaluation = async () => {
    setIsLoading(true);
    try {
      // Call the resume scoring API
      await api.scoreResume({
        resumeId: "sample-resume-id", // In a real app, you'd use the actual resume ID
        jobId: jobId,
      });
      
      setShowEvaluation(true);
      setActiveTab("evaluation");
      
      toast({
        title: "Success",
        description: "Evaluation started successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start evaluation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async () => {
    setIsLoading(true);
    try {
      // Call the HR chat API
      await api.sendChatMessage({
        message: "Hello, I'd like to discuss the job requirements",
        sessionId: `job-${jobId}`,
      });
      
      setShowChat(true);
      setActiveTab("chat");
      
      toast({
        title: "Success",
        description: "Chat session started successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chat session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // In a real app, you would fetch these states from the backend
  React.useEffect(() => {
    // Simulate backend processing completion after 2 seconds
    const timer = setTimeout(() => {
      setEvaluationReady(true);
      setChatReady(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium">{jobData.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={
              jobData.status === "active" ? "default" : 
              jobData.status === "completed" ? "success" : "secondary"
            }>
              {jobData.status.charAt(0).toUpperCase() + jobData.status.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {jobData.candidateCount} candidates • Created on {jobData.createdAt}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {!showEvaluation && (
            <Button 
              variant="default" 
              onClick={startEvaluation} 
              disabled={!evaluationReady || isLoading}
            >
              {isLoading && activeTab === "evaluation" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Users className="mr-2 h-4 w-4" />
              )}
              Start Evaluation
            </Button>
          )}
          
          {!showChat && (
            <Button 
              variant="outline" 
              onClick={startChat} 
              disabled={!chatReady || isLoading}
            >
              {isLoading && activeTab === "chat" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="mr-2 h-4 w-4" />
              )}
              Start Chat
            </Button>
          )}
        </div>
      </div>

      {showEvaluation || showChat ? (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {showEvaluation && <TabsTrigger value="evaluation">Evaluation</TabsTrigger>}
            {showChat && <TabsTrigger value="chat">Chat</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="settings" className="mt-4">
            <SettingsTabContent 
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
        <SettingsTabContent 
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

// Settings Tab Content Component
interface SettingsTabContentProps {
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
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({
  formData,
  isEditing,
  isLoading,
  handleChange,
  handleSelectChange,
  handleEdit,
  handleCancel,
  handleSave,
}) => {
  return (
    <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
      <CardHeader>
        <CardTitle>Flow Settings</CardTitle>
        <CardDescription>
          Update your job flow information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Flow Name</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Work Mode</Label>
            <Select
              disabled={!isEditing}
              value={formData.location}
              onValueChange={(value) => handleSelectChange("location", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="In-office">In-office</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFlowDetail;
