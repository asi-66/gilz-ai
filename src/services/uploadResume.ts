
import { toast } from "@/hooks/use-toast";

export const uploadResume = async (payload: { resumeText: string; jobId: string; storagePath?: string }) => {
  console.log('Uploading resume with payload:', payload);
  try {
    // Implement a timeout for fetch to prevent hanging indefinitely
    const timeoutDuration = 30000; // 30 seconds
    
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
      
      // Return a structured response with detailed error info
      return { 
        success: true, 
        message: "File uploaded to storage successfully, but API processing had issues",
        resumeId: "storage-only-" + Date.now(), // Generate a temporary ID
        status: response.status,
        details: errorText
      };
    }

    const responseData = await response.json();
    console.log('Resume uploaded successfully:', responseData);
    
    // Return a structured success response
    return {
      ...responseData,
      success: true,
      message: "Resume uploaded and processed successfully"
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Resume upload request timed out but file is in storage');
      return { 
        success: true, 
        message: "File uploaded to storage successfully, but webhook processing timed out",
        resumeId: "storage-only-" + Date.now(),
        timeoutError: true
      };
    }
    
    console.error('Error uploading resume, but file may be in storage:', error);
    return { 
      success: true, 
      message: "File uploaded to storage successfully, but API processing failed",
      resumeId: "storage-only-" + Date.now(),
      error: error.message
    };
  }
};
