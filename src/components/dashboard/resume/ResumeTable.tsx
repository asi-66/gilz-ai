
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowUpDown, Trash2 } from "lucide-react";
import { Resume } from "@/services/getResumes";

interface ResumeTableProps {
  resumes: Resume[];
  sortField: "matchScore" | "fullName" | "uploadDate";
  sortDirection: "asc" | "desc";
  onSort: (field: "matchScore" | "fullName" | "uploadDate") => void;
  onCandidateClick: (resume: Resume) => void;
  onDownload: (e: React.MouseEvent, storagePath: string | null) => void;
  onDelete: (e: React.MouseEvent, resumeId: string) => void;
}

const ResumeTable: React.FC<ResumeTableProps> = ({
  resumes,
  sortField,
  sortDirection,
  onSort,
  onCandidateClick,
  onDownload,
  onDelete,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getCandidateName = (resume: Resume) => {
    return resume.fullName || resume.fileName || 'Unnamed Candidate';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort("matchScore")}>
                Match Score
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume) => (
            <TableRow key={resume.id} className="cursor-pointer hover:bg-background/50" onClick={() => onCandidateClick(resume)}>
              <TableCell>
                <div className="font-medium">{getCandidateName(resume)}</div>
              </TableCell>
              <TableCell>
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${getScoreColor(resume.matchScore || 0)}`}>
                  {resume.matchScore || 0}%
                </div>
              </TableCell>
              <TableCell>{resume.uploadDate}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => resume.storagePath && onDownload(e, resume.storagePath)}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => onDelete(e, resume.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResumeTable;
