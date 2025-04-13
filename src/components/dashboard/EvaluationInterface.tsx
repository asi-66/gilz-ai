
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowUpDown, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Candidate {
  id: string;
  name: string;
  score: number;
  matchPercentage: number;
  skills: string[];
  experience: string;
  resumeUrl: string;
}

interface EvaluationInterfaceProps {
  jobId: string;
}

const EvaluationInterface: React.FC<EvaluationInterfaceProps> = ({ jobId }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sortField, setSortField] = useState<"score" | "name" | "experience">("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sample candidates data - in a real app, this would come from the API
  const candidates: Candidate[] = [
    {
      id: "1",
      name: "John Smith",
      score: 85,
      matchPercentage: 85,
      skills: ["React", "TypeScript", "UI/UX", "Figma"],
      experience: "5 years",
      resumeUrl: "#",
    },
    {
      id: "2",
      name: "Emily Johnson",
      score: 92,
      matchPercentage: 92,
      skills: ["UI/UX", "Figma", "Adobe XD", "User Research"],
      experience: "7 years",
      resumeUrl: "#",
    },
    {
      id: "3",
      name: "Michael Brown",
      score: 78,
      matchPercentage: 78,
      skills: ["UI Design", "Sketch", "Illustrator", "Wireframing"],
      experience: "3 years",
      resumeUrl: "#",
    },
    {
      id: "4",
      name: "Sarah Davis",
      score: 88,
      matchPercentage: 88,
      skills: ["UI/UX", "User Research", "Prototyping", "Figma"],
      experience: "6 years",
      resumeUrl: "#",
    },
    {
      id: "5",
      name: "David Wilson",
      score: 73,
      matchPercentage: 73,
      skills: ["Visual Design", "Adobe XD", "CSS", "HTML"],
      experience: "2 years",
      resumeUrl: "#",
    },
  ];

  const toggleSort = (field: "score" | "name" | "experience") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortField === "score") {
      return sortDirection === "asc" ? a.score - b.score : b.score - a.score;
    } else if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === "experience") {
      const extractYears = (exp: string) => parseInt(exp.split(" ")[0]);
      return sortDirection === "asc"
        ? extractYears(a.experience) - extractYears(b.experience)
        : extractYears(b.experience) - extractYears(a.experience);
    }
    return 0;
  });

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseDialog = () => {
    setSelectedCandidate(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
        <CardHeader>
          <CardTitle>
            Resume Evaluation Results
          </CardTitle>
          <CardDescription>
            Review candidate evaluations and scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort("score")}>
                      Match Score
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Key Skills</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort("experience")}>
                      Experience
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="cursor-pointer hover:bg-background/50" onClick={() => handleCandidateClick(candidate)}>
                    <TableCell>
                      <div className="font-medium">{candidate.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${getScoreColor(candidate.score)}`}>
                        {candidate.score}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline" className="bg-background/50">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="outline" className="bg-background/50">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{candidate.experience}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Detail Dialog */}
      <Dialog open={selectedCandidate !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] bg-background/80 backdrop-blur-lg border border-border/50 shadow-lg">
          <DialogHeader>
            <DialogTitle>Candidate Profile</DialogTitle>
            <DialogDescription>
              Detailed evaluation for {selectedCandidate?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{selectedCandidate.name}</h3>
                <Badge variant="outline" className={`${getScoreColor(selectedCandidate.score)}`}>
                  {selectedCandidate.score}% Match
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Skills Match</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCandidate.skills.map((skill, i) => (
                    <div key={i} className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-2" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Experience</h4>
                <p className="text-sm mt-1">{selectedCandidate.experience}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Summary</h4>
                <p className="text-sm mt-1">
                  {selectedCandidate.name} has {selectedCandidate.experience} of relevant experience and 
                  shows strong proficiency in {selectedCandidate.skills.slice(0, 3).join(", ")}.
                  The candidate has a {selectedCandidate.score}% match with the job requirements.
                </p>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
                <Button>
                  <Star className="mr-2 h-4 w-4" />
                  Select Candidate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluationInterface;
