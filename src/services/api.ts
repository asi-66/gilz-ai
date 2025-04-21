
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

export const api = {
  createJob: async (data: any) => {
    console.log('Creating job with data:', data);
    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/job-create', {
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

  getJobFlows: async () => {
    console.log('Fetching all job flows');

    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/job-list', {
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

  uploadResume: async (payload: { resumeText: string; jobId: string; storagePath?: string }) => {
    console.log('Uploading resume with payload:', payload);
    try {
      // Implement a timeout for fetch to prevent hanging indefinitely
      const timeoutDuration = 60000; // 60 seconds
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
      
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/resume-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'resume-upload',
          data: {
            resumeText: payload.resumeText,
            jobId: payload.jobId,
            storagePath: payload.storagePath
          },
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      console.log('Upload resume response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload resume failed response:', errorText);
        throw new Error(errorText || `Failed to upload resume: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Resume uploaded successfully:', responseData);
      return responseData;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Resume upload request timed out');
        // Even if the upload request times out, we'll consider it a partial success
        // since the file is already in Supabase storage
        toast({
          title: "Partial Success",
          description: "File uploaded to storage but webhook processing timed out. You may need to restart screening.",
          variant: "warning",
        });
        // Return a synthetic success response
        return { 
          success: true, 
          message: "File uploaded to storage successfully, but webhook processing timed out",
          resumeId: "temporary-id" // This is temporary
        };
      }
      
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: `Failed to upload resume: ${error.message || error}`,
        variant: "destructive",
      });
      throw error;
    }
  },

  scoreResume: async (payload: { resumeId: string; jobId: string }) => {
    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/resume-score', {
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

      const responseData = await response.json();
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

  sendChatMessage: async (payload: { message: string; sessionId: string; jobId: string }) => {
    try {
      const response = await fetch('https://primary-production-005c.up.railway.app/webhook/hr-chat', {
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

      const responseData = await response.json();
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
