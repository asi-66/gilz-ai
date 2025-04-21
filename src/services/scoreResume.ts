
import { toast } from "@/hooks/use-toast";

export const scoreResume = async (payload: { resumeId: string; jobId: string }) => {
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
};
