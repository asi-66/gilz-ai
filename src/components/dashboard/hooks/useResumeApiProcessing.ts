
import { toast } from "@/hooks/use-toast";
import { useRetry } from "@/hooks/use-retry";
import { uploadResume } from "@/services/uploadResume";
const N8N_WEBHOOK_URL = "https://primary-production-005c.up.railway.app/webhook/9a45b076-3a38-4fb7-9a9c-488bbca220ab";

export function useResumeApiProcessing(jobId: string) {
  const { execute: executeWithRetry } = useRetry(
    async (fn: () => Promise<any>) => fn(),
    { maxRetries: 2, initialDelay: 1000 }
  );

  // Notifies n8n webhook after successful storage upload
  const sendWebhookNotification = async (fileNames: string[], storagePaths: string[]) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const webhookPayload = {
        type: "resume-upload",
        data: { 
          fileNames,
          jobId,
          storagePaths,
          timestamp: new Date().toISOString()
        }
      };
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        toast({
          title: "Webhook Error",
          description: "Failed to notify webhook after upload.",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (err) {
      toast({
        title: "Webhook Network Error",
        description: "Failed to send notification to webhook.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Calls the API to process resumes after uploading to storage
  const processResumes = async (files: File[], storagePaths: string[]) => {
    const results: any[] = [];
    let apiSuccessCount = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const resumeText = await file.text();
        const filePath = storagePaths[i];
        const result = await executeWithRetry(() =>
          uploadResume({ resumeText, jobId, storagePath: filePath })
        );
        if (result) apiSuccessCount++;
        results.push(result);
      } catch (error) {
        results.push(null);
      }
    }
    return { results, apiSuccessCount };
  };

  return {
    sendWebhookNotification,
    processResumes,
  }
}
