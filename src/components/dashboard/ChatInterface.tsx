import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { sendChatMessage } from "@/services/sendChatMessage";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  jobId: string;
  sessionId: string;
}

// Utility to simulate backend processing complete state
function useChatReady(jobId: string) {
  // Replace this simulation with real state in future when API is ready!
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    // Simulate async processing; replace with state check if available
    const timer = setTimeout(() => setIsReady(true), 2000);
    return () => clearTimeout(timer);
  }, [jobId]);
  return isReady;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ jobId, sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant for this job flow. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isReady = useChatReady(jobId);

  useEffect(() => {
    // Show loading animation at beginning, then "unlock" when ready
    if (isReady) {
      setInitialLoading(false);
    }
  }, [isReady]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Real implementation: POST to the /webhook/hr-chat endpoint
      const response = await sendChatMessage({
        message: inputMessage,
        sessionId,
        jobId,
      });

      // Use real AI response
      const aiMessage: Message = {
        id: generateId(),
        content: response.response || "I'm here to help you with your hiring process.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading && !initialLoading) {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm h-[600px] flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/lovable-uploads/2947f7fd-d3b9-4741-b729-e9afd63877aa.png" alt="AI" />
                  <AvatarFallback className="bg-[#7efb98]/30 text-[#1F2937]">AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="break-words">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {message.sender === "user" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>HR</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
          {initialLoading && (
            <div className="flex flex-col items-center justify-center pt-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#7efb98]" />
              <p className="text-muted-foreground mt-2">Preparing AI chat session...</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isLoading || initialLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || initialLoading || !inputMessage.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
