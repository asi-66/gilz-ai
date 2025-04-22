
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Step3Props {
  resumes: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile?: (index: number) => void;
}

const Step3ResumeUpload: React.FC<Step3Props> = ({ resumes, onFileChange, onRemoveFile }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resumes">Upload Resumes (Max 5)</Label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="resumes"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/30 hover:bg-background/50 border-border/50"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-foreground/70">
                <span className="font-semibold">Click to upload</span> or
                drag and drop
              </p>
              <p className="text-xs text-foreground/50">
                PDF, DOCX, or TXT (MAX. 5 files)
              </p>
            </div>
            <Input
              id="resumes"
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              onChange={onFileChange}
            />
          </label>
        </div>
        {resumes.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">
              {resumes.length} file(s) selected:
            </p>
            <ul className="text-xs text-foreground/70 mt-2 space-y-1">
              {resumes.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-background/40 p-2 rounded">
                  <span className="truncate max-w-[80%]">{file.name}</span>
                  {onRemoveFile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveFile(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3ResumeUpload;
