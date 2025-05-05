import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAppSelector } from '@/redux/store';

interface MemberPerformanceData {
  completionRate: number;
  onTimeCompletionRate: number;
  delayRate: number;
  totalTasks: number;
  completedTasks: number;
  onTimeCompletedTasks: number;
  delayedTasks: number;
}

interface TeamPerformanceData {
  [memberId: string]: MemberPerformanceData;
}

interface TeamPerformanceChartsProps {
  data: TeamPerformanceData;
}

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export function TeamPerformanceCharts({ data }: TeamPerformanceChartsProps) {
  const { members } = useAppSelector(state => state.project);

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m._id === memberId);
    return member ? member.user.fullName : `Thành viên ${memberId.slice(0, 6)}...`;
  };

  if (!data || Object.keys(data).length === 0) return;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(data).map(([memberId, memberData]) => {
        const chartData = [
          {
            name: 'Hoàn thành đúng hạn',
            value: memberData.onTimeCompletedTasks,
            percentage: memberData.onTimeCompletionRate,
          },
          {
            name: 'Hoàn thành trễ hạn',
            value: memberData.delayedTasks,
            percentage: memberData.delayRate,
          },
          {
            name: 'Chưa hoàn thành',
            value: memberData.totalTasks - memberData.completedTasks,
            percentage: 100 - memberData.completionRate,
          },
        ];

        return (
          <Card key={memberId} className="w-full">
            <CardHeader>
              <CardTitle>
                {getMemberName(memberId)}
              </CardTitle>
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
                  <p className="text-2xl font-bold">{memberData.totalTasks}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đã hoàn thành</p>
                  <p className="text-2xl font-bold">{memberData.completedTasks}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chưa hoàn thành</p>
                  <p className="text-2xl font-bold">{memberData.totalTasks - memberData.completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 