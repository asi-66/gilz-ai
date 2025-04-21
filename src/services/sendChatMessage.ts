
import { toast } from "@/hooks/use-toast";

export const sendChatMessage = async (payload: { message: string; sessionId: string; jobId: string }) => {
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
};
