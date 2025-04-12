
import { toast } from "@/hooks/use-toast";

// Base API URL
const API_BASE_URL = 'https://primary-production-005c.up.railway.app/workflow/fkOR9Lq3foJ1vWxy/webhook';

// Interface for API error
interface ApiError {
  status: number;
  message: string;
}

// Utility function to handle API errors
const handleApiError = (error: any): ApiError => {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data.message || 'An error occurred with the API response'
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 0,
      message: 'No response received from the server'
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred'
    };
  }
};

// Generic fetch function with error handling
const fetchApi = async <T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> => {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    const apiError = handleApiError(error);
    toast({
      title: "API Error",
      description: apiError.message,
      variant: "destructive"
    });
    throw apiError;
  }
};

// API functions for different endpoints
export const api = {
  // Job Management
  createJob: (jobData: any) => {
    return fetchApi('job-create', 'POST', jobData);
  },
  
  // Resume Upload
  uploadResume: (data: { resumeText: string, jobId: string }) => {
    return fetchApi('resume-upload', 'POST', data);
  },
  
  // Resume Scoring
  scoreResume: (data: { resumeId: string, jobId: string }) => {
    return fetchApi('resume-score', 'POST', data);
  },
  
  // HR Chat
  sendChatMessage: (data: { message: string, sessionId: string }) => {
    return fetchApi('hr-chat', 'POST', data);
  }
};

export default api;
