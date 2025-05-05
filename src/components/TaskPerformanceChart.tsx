import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export interface TaskPerformanceData {
  completionRate: number;
  onTimeCompletionRate: number;
  delayRate: number;
  totalTasks: number;
  completedTasks: number;
  onTimeCompletedTasks: number;
  delayedTasks: number;
}

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export function TaskPerformanceChart(data: TaskPerformanceData) {
  const chartData = [
    {
      name: 'Hoàn thành đúng hạn',
      value: data.onTimeCompletedTasks,
      percentage: data.onTimeCompletionRate,
    },
    {
      name: 'Hoàn thành trễ hạn',
      value: data.delayedTasks,
      percentage: data.delayRate,
    },
    {
      name: 'Chưa hoàn thành',
      value: data.totalTasks - data.completedTasks,
      percentage: 100 - data.completionRate,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hiệu suất công việc</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) =>
                  percentage > 0 ? `${name}: ${percentage.toFixed(1)}%` : ''
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value} công việc (${props.payload.percentage.toFixed(1)}%)`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng số công việc</p>
            <p className="text-2xl font-bold">{data.totalTasks}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã hoàn thành</p>
            <p className="text-2xl font-bold">{data.completedTasks}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chưa hoàn thành</p>
            <p className="text-2xl font-bold">{data.totalTasks - data.completedTasks}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 