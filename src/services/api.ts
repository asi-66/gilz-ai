
// Base API URL - Connection to n8n webhook
const API_BASE_URL = 'https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab';

// Interface for API error
interface ApiError {
  status: number;
  message: string;
}

// Interfaces for API requests
interface JobCreateRequest {
  flowName: string;
  jobDescription: string;
  workMode: string;
}

interface ResumeUploadRequest {
  resumeText: string;
  jobId: string;
}

interface ResumeScoreRequest {
  resumeId: string;
  jobId: string;
}

interface ChatMessageRequest {
  message: string;
  sessionId: string;
  jobId?: string;
  resumeId?: string;
}

// Interfaces for API responses
interface JobResponse {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface ResumeUploadResponse {
  id: string;
  jobId: string;
  status: string;
}

interface ResumeScoreResponse {
  id: string;
  scores: {
    overall: number;
    skills: number;
    experience: number;
    education: number;
  };
  recommendations: string[];
}

interface ChatMessageResponse {
  id: string;
  message: string;
  timestamp: string;
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
  endpoint: string = '', 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
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

    console.log(`Fetching ${method} ${url}`, body ? 'with payload:' : 'without payload');
    if (body) console.log(JSON.stringify(body, null, 2));
    
    const response = await fetch(url, options);
    
    // Log response status
    console.log(`Response status: ${response.status}`);
    
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
    throw apiError;
  }
};

// API endpoints implementation
export const api = {
  // Job creation endpoint
  createJob: (jobData: JobCreateRequest): Promise<JobResponse> => {
    console.log('Creating job with data:', jobData);
    return fetchApi<JobResponse>('', 'POST', {
      type: 'job-create',
      data: {
        title: jobData.flowName,
        description: jobData.jobDescription,
        location: jobData.workMode,
        department: "Engineering",
        requiredSkills: [],
        preferredSkills: [],
        minimumExperience: "Not Specified",
        educationRequirements: "Not Specified",
      }
    });
  },
  
  // Resume upload endpoint
  uploadResume: (data: ResumeUploadRequest): Promise<ResumeUploadResponse> => {
    console.log('Uploading resume for job:', data.jobId);
    return fetchApi<ResumeUploadResponse>('', 'POST', {
      type: 'resume-upload',
      data
    });
  },
  
  // Resume scoring endpoint
  scoreResume: (data: ResumeScoreRequest): Promise<ResumeScoreResponse> => {
    console.log('Scoring resume:', data.resumeId, 'for job:', data.jobId);
    return fetchApi<ResumeScoreResponse>('', 'POST', {
      type: 'resume-score',
      data
    });
  },
  
  // HR chat endpoint
  sendChatMessage: (data: ChatMessageRequest): Promise<ChatMessageResponse> => {
    console.log('Sending chat message in session:', data.sessionId);
    return fetchApi<ChatMessageResponse>('', 'POST', {
      type: 'hr-chat',
      data
    });
  }
};

export default api;
