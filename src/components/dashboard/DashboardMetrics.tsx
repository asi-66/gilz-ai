
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, FileText, CheckCircle, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 backdrop-blur-md bg-white/10 dark:bg-black/20">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-100">{title}</CardTitle>
        <div className="w-8 h-8 bg-[#7efb98]/30 rounded-full flex items-center justify-center text-[#1F2937] dark:text-white">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#1F2937] dark:text-white">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

const DashboardMetrics: React.FC = () => {
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<Record<string, string>>({});

  // Test API endpoints
  const testApiEndpoints = async () => {
    setIsTestingApi(true);
    setApiStatus({});
    
    const results: Record<string, string> = {};
    
    try {
      // Test job creation endpoint
      try {
        await api.createJob({ title: "Test Job", description: "Test description" });
        results.createJob = "Success";
      } catch (error) {
        console.error("Job creation test failed:", error);
        results.createJob = "Failed";
      }
      
      // Test resume upload endpoint
      try {
        await api.uploadResume({ resumeText: "Sample resume text", jobId: "test-job-id" });
        results.uploadResume = "Success";
      } catch (error) {
        console.error("Resume upload test failed:", error);
        results.uploadResume = "Failed";
      }
      
      // Test resume scoring endpoint
      try {
        await api.scoreResume({ resumeId: "test-resume-id", jobId: "test-job-id" });
        results.scoreResume = "Success";
      } catch (error) {
        console.error("Resume scoring test failed:", error);
        results.scoreResume = "Failed";
      }
      
      // Test chat message endpoint
      try {
        await api.sendChatMessage({ message: "Test message", sessionId: "test-session-id" });
        results.sendChatMessage = "Success";
      } catch (error) {
        console.error("Chat message test failed:", error);
        results.sendChatMessage = "Failed";
      }
      
      setApiStatus(results);
      
      const allSuccessful = Object.values(results).every(result => result === "Success");
      if (allSuccessful) {
        toast({
          title: "API Test Successful",
          description: "All API endpoints are functioning correctly",
          variant: "default",
        });
      } else {
        toast({
          title: "API Test Results",
          description: "Some API endpoints failed. Check the status panel for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API testing failed:", error);
      toast({
        title: "API Test Failed",
        description: "Error occurred while testing API endpoints",
        variant: "destructive",
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  // In a real app, these would come from an API or context
  const metrics = [
    {
      title: "Active Jobs",
      value: 12,
      description: "Total active job flows",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      title: "Total Candidates",
      value: 248,
      description: "Candidates across all jobs",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Resumes Processed",
      value: 187,
      description: "Resumes analyzed this month",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Completed Evaluations",
      value: 42,
      description: "Evaluations finalized",
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
          />
        ))}
      </div>
      
      {/* API Testing Section */}
      <Card className="border-none shadow-sm backdrop-blur-md bg-white/10 dark:bg-black/20 mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Network className="h-4 w-4" />
            Webhook Connection Test
          </CardTitle>
          <CardDescription>Test connectivity to API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testApiEndpoints} 
            disabled={isTestingApi}
            className="mb-4 bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
          >
            {isTestingApi ? "Testing..." : "Test Webhook Connections"}
          </Button>
          
          {Object.keys(apiStatus).length > 0 && (
            <div className="mt-4 space-y-2 p-3 rounded-md bg-background/20 text-sm">
              <h4 className="font-medium mb-2">Test Results:</h4>
              {Object.entries(apiStatus).map(([endpoint, status]) => (
                <div key={endpoint} className="flex justify-between items-center">
                  <span>{endpoint}:</span>
                  <span className={`font-medium ${status === "Success" ? "text-green-500" : "text-red-500"}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
