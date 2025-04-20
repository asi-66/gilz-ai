import { toast } from "@/hooks/use-toast";

interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message?: string;
}

interface ResumeUploadResponse {
  resumeId: string;
  message: string;
}

interface ResumeScoreResponse {
  message: string;
  scores: { [resumeId: string]: number };
}

interface ChatResponse {
  response: string;
}

// Define the API service with method signatures
export const api = {
  // Job creation
  createJob: async (data: any) => {
    console.log('Creating job with data:', data);
    
    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'job-create',
          data: {
            title: data.title,
            jobDescription: data.jobDescription,
            workMode: data.workMode
          }
        }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error in createJob:', error);
      throw error;
    }
  },
  
  // Get all job flows
  getJobFlows: async () => {
    console.log('Fetching all job flows');
    
    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'job-list',
          data: {}
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Job flows retrieved:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error in getJobFlows:', error);
      throw error;
    }
  },

  // Upload resume
  uploadResume: async (payload: { resumeText: string; jobId: string }): Promise<ResumeUploadResponse> => {
    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'resume-upload',
          data: {
            resumeText: payload.resumeText,
            jobId: payload.jobId,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload resume failed:', errorData);
        throw new Error(errorData.message || `Failed to upload resume: ${response.status}`);
      }

      const responseData: ResumeUploadResponse = await response.json();
      console.log('Resume uploaded:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: `Failed to upload resume: ${error.message || error}`,
        variant: "destructive",
      });
      throw error;
    }
  },

  // Score resume
  scoreResume: async (payload: { resumeId: string; jobId: string }): Promise<ResumeScoreResponse> => {
    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'resume-score',
          data: {
            resumeId: payload.resumeId,
            jobId: payload.jobId,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Score resume failed:', errorData);
        throw new Error(errorData.message || `Failed to score resume: ${response.status}`);
      }

      const responseData: ResumeScoreResponse = await response.json();
      console.log('Resume scored:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error scoring resume:', error);
      toast({
        title: "Error",
        description: `Failed to score resume: ${error.message || error}`,
        variant: "destructive",
      });
      throw error;
    }
  },

  // Send chat message
  sendChatMessage: async (payload: { message: string; sessionId: string; jobId: string }): Promise<ChatResponse> => {
    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'hr-chat',
          data: {
            message: payload.message,
            sessionId: payload.sessionId,
            jobId: payload.jobId,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Send chat message failed:', errorData);
        throw new Error(errorData.message || `Failed to send chat message: ${response.status}`);
      }

      const responseData: ChatResponse = await response.json();
      console.log('Chat message sent:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error sending chat message:', error);
      toast({
        title: "Error",
        description: `Failed to send chat message: ${error.message || error}`,
        variant: "destructive",
      });
      throw error;
    }
  },
};
