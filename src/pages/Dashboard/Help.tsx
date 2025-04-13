
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";

const Help = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium">Help & Support</h1>
          <p className="text-muted-foreground">
            Get help and support for using Gilz AI Resume Screening platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about using our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      What is Gilz AI Resume Screening?
                    </AccordionTrigger>
                    <AccordionContent>
                      Gilz AI Resume Screening is an advanced AI-powered platform that helps recruiters and hiring managers streamline the resume screening process. It uses artificial intelligence to analyze resumes, match candidates to job requirements, and provide insights to make better hiring decisions.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      How do I create a new job flow?
                    </AccordionTrigger>
                    <AccordionContent>
                      To create a new job flow, click the "Create Job Flow" button on the dashboard or in the sidebar. Follow the step-by-step wizard to name your job flow, enter job details, and upload candidate resumes. The system will automatically process the resumes and provide evaluations.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      What file formats are supported for resume uploads?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our platform supports resume uploads in PDF, DOCX, DOC, and TXT formats. We recommend using PDF for best results, as it maintains formatting consistently. You can upload up to 5 resumes at a time for each job flow.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      How does the AI evaluate resumes?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our AI evaluates resumes by analyzing the content against the job description and requirements. It considers factors such as skills, experience, education, and role relevance. The system generates a match score and detailed insights for each candidate, helping you identify the best matches quickly.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      Can I chat with the AI about candidates?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, each job flow includes an AI chat assistant that can answer questions about candidates, provide deeper insights, and help you understand the evaluation results. You can ask questions about specific skills, experience levels, or request comparisons between candidates.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger>
                      How secure is my data on the platform?
                    </AccordionTrigger>
                    <AccordionContent>
                      We take data security seriously. All data, including resumes and job descriptions, is encrypted during transit and at rest. We comply with data protection regulations and do not share your data with third parties. You have full control over your data and can delete it at any time.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Get in touch with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>support@gilzai.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>+1 (800) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Live chat (Business hours)</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Input placeholder="Your email address" />
                    <Input placeholder="Subject" />
                    <textarea
                      className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="How can we help you?"
                    />
                    <Button className="w-full">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>
                    Helpful resources and guides
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      User Guide
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Video Tutorials
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      API Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
