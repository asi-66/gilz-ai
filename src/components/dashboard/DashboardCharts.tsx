
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "@/components/ui/Chart";
import { ChartData } from "@/types/chart.types";

const DashboardCharts = ({ data }: { data: ChartData }) => {
  const { lineChartData, pieChartData, barChartData } = data;

  return (
    <div className="lg:col-span-2 grid gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resume Applications Trend</CardTitle>
          <CardDescription>Monthly resume submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart data={lineChartData} type="line" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Candidate Evaluation</CardTitle>
            <CardDescription>Distribution by qualification</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart data={pieChartData} type="pie" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Positions</CardTitle>
            <CardDescription>By department</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart data={barChartData} type="bar" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;
