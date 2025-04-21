
import { toast } from "@/hooks/use-toast";

export const createJob = async (data: any) => {
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
};
