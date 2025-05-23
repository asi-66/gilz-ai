
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateJobForm } from '../hooks/useCreateJobForm';

interface JobFlowFormProps {
  onSuccess: (jobId: string) => void;
  onClose: () => void;
}

export const JobFlowForm: React.FC<JobFlowFormProps> = ({ onSuccess, onClose }) => {
  const { 
    formData, 
    isLoading, 
    handleChange, 
    handleSelectChange, 
    handleSubmit 
  } = useCreateJobForm(onSuccess, onClose);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Job Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flowName">Job Title</Label>
            <Input
              id="flowName"
              name="flowName"
              value={formData.flowName}
              onChange={handleChange}
              placeholder="Enter job title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Enter detailed job description"
              rows={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workMode">Work Mode</Label>
            <Select
              value={formData.workMode}
              onValueChange={(value) => handleSelectChange("workMode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Job Flow"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobFlowForm;
