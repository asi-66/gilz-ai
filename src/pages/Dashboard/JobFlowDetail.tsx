
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Search, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import JobFlowDetail from "@/components/dashboard/JobFlowDetail";

const JobFlowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState<File[]>([]);
  const [hasUploadedResumes, setHasUploadedResumes] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Mock job data - in production this would be fetched from API
  const jobData = {
    title: id ? `Job Flow ${id}` : "Job Not Found",
    description: "This is the job description.",
    location: "Remote",
    status: "active" as const,
    candidateCount: 0,
    createdAt: new Date().toLocaleDateString(),
  };

  // Handle resume file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check number of files
    if (files.length > 5) {
      toast({
        title: "Error",
        description: "You can only upload up to 5 resumes",
        variant: "destructive",
      });
      return;
    }
    
    // Validate each file
    const invalidFiles = files.filter(file => {
      // Check file type
      const validTypes = ['.pdf', '.txt', '.docx', '.doc'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const isValidType = validTypes.some(type => fileExt.endsWith(type));
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type. Please use PDF, TXT, DOC, or DOCX.`,
          variant: "destructive",
        });
        return true;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 5MB size limit.`,
          variant: "destructive",
        });
        return true;
      }
      
      return false;
    });
    
    if (invalidFiles.length > 0) {
      return;
    }
    
    setResumes(files);
  };

  // Handle resume upload
  const handleUploadResumes = async () => {
    if (resumes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one resume to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload each resume
      const resumePromises = resumes.map(async (file, index) => {
        return new Promise<string>((resolve, reject) => {
          console.log(`Processing resume ${index + 1}/${resumes.length}: ${file.name}`);
          
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            try {
              const resumeText = e.target?.result as string;
              console.log(`Uploading resume ${index + 1} content (${resumeText.length} chars)`);
              
              const resumeResponse = await api.uploadResume({
                resumeText,
                jobId: id || '',
              });
              
              console.log(`Resume ${index + 1} uploaded successfully with ID: ${resumeResponse.resumeId}`);
              resolve(resumeResponse.resumeId);
            } catch (error) {
              console.error(`Error uploading resume ${index + 1}:`, error);
              reject(error);
            }
          };
          
          reader.onerror = (error) => {
            console.error(`Error reading resume ${index + 1}:`, error);
            reject(error);
          };
          
          reader.readAsText(file, 'UTF-8');
        });
      });

      // Wait for all resumes to be uploaded
      const resumeIds = await Promise.all(resumePromises);
      console.log('All resumes processed successfully. Resume IDs:', resumeIds);
      
      toast({
        title: "Success",
        description: `${resumes.length} resume(s) uploaded successfully`,
      });
      
      setHasUploadedResumes(true);
      setShowUploadDialog(false);
      setResumes([]);
      
    } catch (error: any) {
      console.error("Error uploading resumes:", error);
      
      const errorMessage = error.message || "Unknown error";
      const statusCode = error.status || "";
      
      toast({
        title: `Error${statusCode ? ` (${statusCode})` : ""}`,
        description: `Failed to upload resumes: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start screening function
  const startScreening = async () => {
    if (!hasUploadedResumes) {
      toast({
        title: "Error",
        description: "Please upload resumes before starting screening",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would pass the resume IDs to the evaluation component
    if (id) {
      toast({
        title: "Success",
        description: "Starting screening process",
      });
      
      // Here you would redirect to screening view or update state
    }
  };

  // Start chat function
  const startChat = async () => {
    if (!hasUploadedResumes) {
      toast({
        title: "Error",
        description: "Please upload resumes before starting chat",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would initialize the chat session
    if (id) {
      toast({
        title: "Success",
        description: "Starting AI chat assistant",
      });
      
      // Here you would redirect to chat view or update state
    }
  };

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
          <>
            <Card className="border border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{jobData.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <p className="text-muted-foreground">{jobData.description}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Work Mode</h3>
                  <p className="text-muted-foreground">{jobData.location}</p>
                </div>
                
                <div className="pt-4 border-t border-border/30">
                  <div className="flex flex-wrap gap-3 justify-between items-center">
                    <Button 
                      onClick={() => setShowUploadDialog(true)}
                      className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resumes
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={startScreening}
                        disabled={!hasUploadedResumes || isLoading}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Start Screening
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={startChat}
                        disabled={!hasUploadedResumes || isLoading}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Start AI Chat
                      </Button>
                    </div>
                  </div>
                </div>
                
                {showUploadDialog && (
                  <Card className="mt-4 border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Upload Resumes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resumes">Select Resume Files (PDF, TXT, DOC, DOCX)</Label>
                        <Input
                          id="resumes"
                          type="file"
                          accept=".pdf,.txt,.doc,.docx"
                          multiple
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                        <p className="text-sm text-muted-foreground">
                          You can upload up to 5 resumes. Maximum file size: 5MB per file.
                        </p>
                        
                        {resumes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Selected files:</p>
                            <ul className="text-sm text-muted-foreground">
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
                          onClick={() => {
                            setShowUploadDialog(false);
                            setResumes([]);
                          }}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleUploadResumes}
                          disabled={resumes.length === 0 || isLoading}
                        >
                          {isLoading ? "Uploading..." : "Upload"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Job Flow Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please go back to Job Flow Management and create a new job flow.
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
