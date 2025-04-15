
import { toast } from "@/hooks/use-toast";

// Base API URL - Updated to match the correct endpoint format
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
      message: error.response.data?.message || 'An error occurred with the API response'
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
    // Using a modified URL construction - don't append endpoint if it's empty
    const url = endpoint ? `${API_BASE_URL}/${endpoint}` : API_BASE_URL;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    };

    console.log(`Fetching ${method} ${url}`, body ? 'with payload' : 'without payload');
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(errorText || `HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json() as T;
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Call Failed:', error);
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
  // Job Management - Using empty string for main webhook endpoint
  createJob: (jobData: any) => {
    console.log('Creating job with data:', jobData);
    return fetchApi('', 'POST', {
      type: 'job-create',
      data: jobData
    });
  },
  
  // Resume Upload
  uploadResume: (data: { resumeText: string, jobId: string }) => {
    console.log('Uploading resume for job:', data.jobId);
    return fetchApi('', 'POST', {
      type: 'resume-upload',
      data
    });
  },
  
  // Resume Scoring
  scoreResume: (data: { resumeId: string, jobId: string }) => {
    return fetchApi('', 'POST', {
      type: 'resume-score',
      data
    });
  },
  
  // HR Chat
  sendChatMessage: (data: { message: string, sessionId: string }) => {
    return fetchApi('', 'POST', {
      type: 'hr-chat',
      data
    });
  }
};

export default api;
