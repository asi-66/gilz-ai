
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobFlowSettingsTabProps {
  formData: {
    title: string;
    description: string;
    location: string;
  };
  isEditing: boolean;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
}

const JobFlowSettingsTab: React.FC<JobFlowSettingsTabProps> = ({
  formData,
  isEditing,
  isLoading,
  handleChange,
  handleSelectChange,
  handleEdit,
  handleCancel,
  handleSave,
}) => {
  return (
    <Card className="bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Job Details</CardTitle>
        <CardDescription>
          View and update job information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={!isEditing}
              className="text-lg font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Enter job title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={8}
              value={formData.description}
              onChange={handleChange}
              disabled={!isEditing}
              className="resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Enter job description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base font-medium">Work Mode</Label>
            <Select
              disabled={!isEditing}
              value={formData.location}
              onValueChange={(value) => handleSelectChange("location", value)}
            >
              <SelectTrigger id="location" className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="In-office">In-office</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-border/20">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFlowSettingsTab;
