
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface JobFlowUploadDialogProps {
  isLoading: boolean;
  resumes: File[];
  onClose: () => void;
  onUpload: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile?: (index: number) => void;
}

const JobFlowUploadDialog: React.FC<JobFlowUploadDialogProps> = ({
  isLoading,
  resumes,
  onClose,
  onUpload,
  onFileChange,
  onRemoveFile,
}) => {
  return (
    <Card className="border border-black/10 dark:border-white/10 bg-white/90 dark:bg-gray-900/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-900 dark:text-white">Upload Resumes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resumes" className="text-gray-900 dark:text-white">
            Select Resume Files (PDF, TXT, DOC, DOCX)
          </Label>
          <Input
            id="resumes"
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            multiple
            onChange={onFileChange}
            disabled={isLoading}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can upload up to 5 resumes. Maximum file size: 5MB per file.
          </p>
          
          {resumes.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Selected files:</p>
              <ul className="mt-2 space-y-1">
                {resumes.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                    <span className="truncate max-w-[85%] text-gray-900 dark:text-white">{file.name}</span>
                    {onRemoveFile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onRemoveFile(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100/30"
                        disabled={isLoading}
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
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="bg-white/20 dark:bg-black/20 text-gray-900 dark:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={onUpload}
            disabled={resumes.length === 0 || isLoading}
            className="bg-[#7efb98] text-[#1F2937] hover:bg-[#7efb98]/90"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFlowUploadDialog;
