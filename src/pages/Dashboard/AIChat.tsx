
import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const [jobContext, setJobContext] = useState("");
  const [candidateContext, setCandidateContext] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample data for dropdowns
  const jobs = [
    { id: "1", title: "Software Engineer" },
    { id: "2", title: "UX Designer" },
    { id: "3", title: "Product Manager" },
    { id: "4", title: "Marketing Specialist" },
    { id: "5", title: "Data Analyst" }
  ];

  const candidates = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "David Lee" },
    { id: "4", name: "Maria Garcia" },
    { id: "5", name: "James Brown" }
  ];

  // Suggested questions
  const suggestedQuestions = [
    "What skills should I look for in a Software Engineer?",
    "How do I identify a candidate with leadership potential?",
    "What are good interview questions for a Product Manager?",
    "Compare the top two candidates for Data Analyst"
  ];

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || message;
    
    if (!messageContent.trim()) {
      return;
    }

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: messageContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Mock API call to HR Chat endpoint
      console.log("Sending to HR Chat API:", {
        message: messageContent,
        sessionId: "session-123",
        jobId: jobContext,
        candidateId: candidateContext
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response
      const responses = [
        "Based on industry standards, a Software Engineer should have strong problem-solving skills and proficiency in programming languages relevant to your tech stack. For a web development role, look for experience with JavaScript, React, and Node.js.",
        "When evaluating candidates for leadership potential, look for examples of past initiative-taking, team coordination, and decision-making. Ask them to describe situations where they influenced others or led a project without formal authority.",
        "For a Product Manager, I'd recommend asking questions about their approach to prioritization, stakeholder management, and how they balance customer needs with business objectives.",
        "The key difference between the candidates is their experience level and technical skill specialization. James has stronger analytical skills while Maria has more experience with visualization tools and stakeholder communication."
      ];

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-10rem)]">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">AI Assistant</h1>
          <p className="text-[#4B5563]">Get insights and recommendations for hiring decisions</p>
        </div>

        <div className="flex flex-col h-full">
          {/* Context selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Select value={jobContext} onValueChange={setJobContext}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job context (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={candidateContext} onValueChange={setCandidateContext}>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate context (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map(candidate => (
                    <SelectItem key={candidate.id} value={candidate.id}>{candidate.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Suggested questions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedQuestions.map((question, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="text-sm"
                onClick={() => handleSendMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>

          {/* Chat messages */}
          <Card className="flex-1 mb-4 overflow-hidden flex flex-col">
            <CardContent className="p-4 flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-[#7efb98]/20 flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-[#333333]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#1F2937] mb-2">
                    HR AI Assistant
                  </h3>
                  <p className="text-[#6B7280] max-w-md">
                    Ask me questions about candidates, job requirements, or get help with your hiring process.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`flex gap-3 max-w-[80%] ${
                          msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <Avatar className={msg.sender === 'user' ? 'bg-[#333333]' : 'bg-[#7efb98]/30'}>
                          <AvatarFallback>
                            {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                          </AvatarFallback>
                        </Avatar>
                        <div 
                          className={`rounded-lg p-3 ${
                            msg.sender === 'user' 
                              ? 'bg-[#333333] text-white' 
                              : 'bg-gray-100 text-[#1F2937]'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="bg-[#7efb98]/30">
                          <AvatarFallback>
                            <Bot size={18} />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-gray-100 text-[#1F2937] flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <p className="text-sm">Thinking...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message input */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage()} 
              disabled={isLoading || !message.trim()}
              className="bg-[#333333] hover:bg-[#1F2937]"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIChat;
