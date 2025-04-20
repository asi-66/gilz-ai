
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface WebhookPayload {
  type: "resume-upload";
  data: {
    fileNames: string[];
  }
}

export const useWebhook = () => {
  const [webhookUrl, setWebhookUrl] = useState(() => 
    localStorage.getItem('resumeWebhookUrl') || ''
  );

  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setWebhookUrl(url);
    localStorage.setItem('resumeWebhookUrl', url);
  };

  const sendWebhookNotification = async (fileNames: string[]) => {
    if (!webhookUrl) return;

    try {
      const webhookPayload: WebhookPayload = {
        type: "resume-upload",
        data: { fileNames }
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error('Webhook notification failed');
      }

      toast({
        title: "Webhook Sent",
        description: "Webhook notification sent successfully",
      });
    } catch (error) {
      toast({
        title: "Webhook Error",
        description: "Failed to send webhook notification",
        variant: "destructive",
      });
    }
  };

  return {
    webhookUrl,
    handleWebhookUrlChange,
    sendWebhookNotification
  };
};
