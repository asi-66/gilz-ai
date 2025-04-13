
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step2Props {
  jobDescription: string;
  workMode: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const Step2JobDetails: React.FC<Step2Props> = ({
  jobDescription,
  workMode,
  onInputChange,
  onSelectChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          name="jobDescription"
          placeholder="Enter the job description here..."
          value={jobDescription}
          onChange={onInputChange}
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="workMode">Work Mode</Label>
        <Select
          value={workMode}
          onValueChange={(value) => onSelectChange("workMode", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select work mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="In-office">In-office</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Step2JobDetails;
