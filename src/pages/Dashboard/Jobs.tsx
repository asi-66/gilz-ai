
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Job status component
const JobStatus = ({ status }: { status: string }) => {
  let bgColor = "bg-gray-100 text-gray-800";
  
  if (status === "Active") {
    bgColor = "bg-green-100 text-green-800";
  } else if (status === "Draft") {
    bgColor = "bg-yellow-100 text-yellow-800";
  } else if (status === "Closed") {
    bgColor = "bg-red-100 text-red-800";
  }
  
  return (
    <Badge variant="outline" className={`${bgColor} border-none`}>
      {status}
    </Badge>
  );
};

const Jobs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
    requiredSkills: "",
    preferredSkills: "",
    minimumExperience: "",
    educationRequirements: ""
  });

  useEffect(() => {
    // Simulate loading job data
    setTimeout(() => {
      // Initialize with empty jobs array for production
      setJobs([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle dialog open for new job
  const handleNewJob = () => {
    setCurrentJob(null);
    setFormData({
      title: "",
      department: "",
      location: "",
      description: "",
      requiredSkills: "",
      preferredSkills: "",
      minimumExperience: "",
      educationRequirements: ""
    });
    setIsDialogOpen(true);
  };

  // Handle dialog open for editing job
  const handleEditJob = (job: any) => {
    setCurrentJob(job);
    setFormData({
      title: job.title || "",
      department: job.department || "",
      location: job.location || "",
      description: job.description || "",
      requiredSkills: job.requiredSkills?.join(", ") || "",
      preferredSkills: job.preferredSkills?.join(", ") || "",
      minimumExperience: job.minimumExperience || "",
      educationRequirements: job.educationRequirements || ""
    });
    setIsDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const jobData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(",").map(skill => skill.trim()),
        preferredSkills: formData.preferredSkills.split(",").map(skill => skill.trim())
      };

      console.log("Job data to submit:", jobData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update UI
      if (currentJob) {
        setJobs(prev => prev.map(job => job.id === currentJob.id ? { ...job, ...jobData } : job));
        toast({
          title: "Job updated",
          description: `${jobData.title} has been updated successfully.`
        });
      } else {
        // Add new job
        const newJob = {
          id: Date.now().toString(),
          ...jobData,
          status: "Draft",
          postedDate: new Date().toISOString().split("T")[0],
          applicants: 0
        };
        setJobs(prev => [newJob, ...prev]);
        toast({
          title: "Job created",
          description: `${jobData.title} has been created successfully.`
        });
      }

      // Close dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting job:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete job
  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    toast({
      title: "Job deleted",
      description: "The job has been deleted successfully."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Jobs Management</h1>
            <p className="text-[#4B5563]">Create and manage job listings</p>
          </div>
          <Button 
            onClick={handleNewJob}
            className="bg-[#333333] hover:bg-[#1F2937] self-start"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <Input 
              placeholder="Search jobs..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Jobs table */}
        <div className="bg-white overflow-hidden rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    {Array(7).fill(0).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      <JobStatus status={job.status} />
                    </TableCell>
                    <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{job.applicants}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log("View job", job.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditJob(job)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#6B7280]">
                    {searchQuery ? "No jobs found matching your search." : "No jobs available. Create your first job to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Job creation/editing dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentJob ? "Edit Job" : "Create New Job"}</DialogTitle>
            <DialogDescription>
              Fill in the details for this job listing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Software Engineer"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="e.g. Engineering"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Remote, New York, NY"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed job description..."
                  rows={4}
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requiredSkills">Required Skills</Label>
                  <Input
                    id="requiredSkills"
                    name="requiredSkills"
                    placeholder="JavaScript, React, Node.js"
                    value={formData.requiredSkills}
                    onChange={handleFormChange}
                  />
                  <p className="text-xs text-[#6B7280]">Comma-separated list</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredSkills">Preferred Skills</Label>
                  <Input
                    id="preferredSkills"
                    name="preferredSkills"
                    placeholder="TypeScript, AWS, Docker"
                    value={formData.preferredSkills}
                    onChange={handleFormChange}
                  />
                  <p className="text-xs text-[#6B7280]">Comma-separated list</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimumExperience">Minimum Experience</Label>
                  <Input
                    id="minimumExperience"
                    name="minimumExperience"
                    placeholder="e.g. 3 years"
                    value={formData.minimumExperience}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educationRequirements">Education Requirements</Label>
                  <Input
                    id="educationRequirements"
                    name="educationRequirements"
                    placeholder="e.g. Bachelor's in CS"
                    value={formData.educationRequirements}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#333333] hover:bg-[#1F2937]"
              >
                {isSubmitting ? "Processing..." : currentJob ? "Save Changes" : "Create Job"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Jobs;
