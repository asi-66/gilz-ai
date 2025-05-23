
// Common chart data structures
export interface ChartDataset {
  label?: string;  // Make label optional here so all chart types can extend it
  data: number[];
}

export interface BaseChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface LineChartData extends BaseChartData {
  datasets: Array<ChartDataset & {
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }>;
}

export interface BarChartData extends BaseChartData {
  datasets: Array<ChartDataset & {
    backgroundColor: string;
  }>;
}

export interface PieChartData extends BaseChartData {
  datasets: Array<ChartDataset & {  // Remove Omit and keep label as optional from ChartDataset
    backgroundColor: string[];
    borderWidth: number;
    borderColor: string;
  }>;
}

export interface ChartData {
  lineChartData: LineChartData;
  pieChartData: PieChartData;
  barChartData: BarChartData;
}

// Activity interface
export interface ActivityItem {
  id: number;
  type: string;
  message: string;
  time: string;
}

// Dashboard metrics interface
export interface DashboardMetrics {
  totalActiveJobs: number;
  totalCandidates: number;
  resumesProcessed: number;
  interviewsScheduled: number;
}

// Main dashboard data interface
export interface DashboardData extends DashboardMetrics {
  recentActivity: ActivityItem[];
}
