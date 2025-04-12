
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, Users, CalendarCheck, ArrowUp, ArrowDown } from "lucide-react";

interface MetricsData {
  totalActiveJobs: number;
  totalCandidates: number;
  resumesProcessed: number;
  interviewsScheduled: number;
  isLoading: boolean;
}

const MetricsCards = ({ data }: { data: MetricsData }) => {
  const { totalActiveJobs, totalCandidates, resumesProcessed, interviewsScheduled, isLoading } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Active Jobs</p>
              <h3 className="text-2xl font-bold text-[#1F2937] mt-1">
                {isLoading ? "..." : totalActiveJobs}
              </h3>
              <div className="flex items-center mt-1 text-[#10B981]">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-xs">2 new this week</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-[#7efb98]/20">
              <Briefcase className="h-6 w-6 text-[#1F2937]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Total Candidates</p>
              <h3 className="text-2xl font-bold text-[#1F2937] mt-1">
                {isLoading ? "..." : totalCandidates}
              </h3>
              <div className="flex items-center mt-1 text-[#10B981]">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-xs">12 new this week</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-[#7efb98]/20">
              <Users className="h-6 w-6 text-[#1F2937]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Resumes Processed</p>
              <h3 className="text-2xl font-bold text-[#1F2937] mt-1">
                {isLoading ? "..." : resumesProcessed}
              </h3>
              <div className="flex items-center mt-1 text-[#10B981]">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-xs">23 this week</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-[#7efb98]/20">
              <FileText className="h-6 w-6 text-[#1F2937]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Interviews Scheduled</p>
              <h3 className="text-2xl font-bold text-[#1F2937] mt-1">
                {isLoading ? "..." : interviewsScheduled}
              </h3>
              <div className="flex items-center mt-1 text-[#EF4444]">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span className="text-xs">3 less than last week</span>
              </div>
            </div>
            <div className="rounded-full p-3 bg-[#7efb98]/20">
              <CalendarCheck className="h-6 w-6 text-[#1F2937]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
