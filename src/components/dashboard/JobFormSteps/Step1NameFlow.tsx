
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Step1Props {
  flowName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Step1NameFlow: React.FC<Step1Props> = ({ flowName, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="flowName">Flow Name</Label>
        <Input
          id="flowName"
          name="flowName"
          placeholder="e.g., UI/UX Designer Screening"
          value={flowName}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Step1NameFlow;
