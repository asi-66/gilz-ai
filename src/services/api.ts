
import { toast } from "@/hooks/use-toast";

// Base API URL - This will be updated by the user
const API_BASE_URL = '';

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

// API endpoints (placeholder implementations to fix TypeScript errors)
export const api = {
  // Job creation endpoint
  createJob: (jobData: any) => {
    console.log('Creating job with data:', jobData);
    return fetchApi<any>('', 'POST', {
      type: 'job-create',
      data: jobData
    });
  },
  
  // Resume upload endpoint
  uploadResume: (data: { resumeText: string, jobId: string }) => {
    console.log('Uploading resume for job:', data.jobId);
    return fetchApi<any>('', 'POST', {
      type: 'resume-upload',
      data
    });
  },
  
  // Resume scoring endpoint
  scoreResume: (data: { resumeId: string, jobId: string }) => {
    return fetchApi<any>('', 'POST', {
      type: 'resume-score',
      data
    });
  },
  
  // HR chat endpoint
  sendChatMessage: (data: { message: string, sessionId: string }) => {
    return fetchApi<any>('', 'POST', {
      type: 'hr-chat',
      data
    });
  }
};

export default api;
