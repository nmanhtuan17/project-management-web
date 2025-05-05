import { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useApi from '@/lib/hooks/useApi';
import { Task } from '@/types/task';
import apiService from '@/services/api.service';
import { useCurrentProject } from '@/lib/hooks/useCurrentProject';
import { taskConfig } from '@/configs/task.config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Thống kê công việc',
    },
  },
};
const CHART_OPTIONS_PERFORMANCE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Hiệu suất công việc',
    },
  },
};

export const TaskPerformance = () => {
  const { members } = useAppSelector(state => state.project);
  const { tasks, filter } = useAppSelector(state => state.task);
  const { currentProject } = useCurrentProject();
  const [getProjectPerformance, { data: projectPerformance }] = useApi(apiService.getTaskPerformance);
  const [getTaskPerformanceByMember, { data: performanceDataByMember }] = useApi(apiService.getTaskPerformanceByMember);

  useEffect(() => {
    getProjectPerformance(currentProject._id);
    getTaskPerformanceByMember(currentProject._id);
  }, [currentProject._id])


  console.log(projectPerformance);
  console.log(performanceDataByMember);

  const assignees = useMemo(() => {
    if (filter.assignees.length === 0) return [];
    return filter.assignees.map(a => members.find(m => a === m._id)).filter(Boolean);
  }, [filter.assignees, members]);

  const labels = useMemo(() =>
    assignees.length > 0
      ? assignees.map(member => member?.user?.fullName)
      : ['Tổng'],
    [assignees]
  );

  const data = useMemo(() => {
    const getTaskCountByStatus = (assigneeId?: string, status?: string) => {
      return tasks.filter(task => {
        if (assigneeId) {
          const hasAssignee = task.assignees.some(a => a._id === assigneeId);
          return status ? hasAssignee && task.status === status : hasAssignee;
        }
        return status ? task.status === status : true;
      }).length;
    };

    if (assignees.length === 0) {
      return {
        labels: ['Tổng'],
        datasets: [
          {
            label: 'Tổng',
            data: [tasks.length],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          ...taskConfig.statuses.map((item) => ({
            label: item.label,
            data: [getTaskCountByStatus(undefined, item.value)],
            backgroundColor: item.backgroundColor,
          })),
        ]
      };
    }

    return {
      labels,
      datasets: [
        {
          label: 'Tổng',
          data: assignees.map(ass => getTaskCountByStatus(ass._id)),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        ...taskConfig.statuses.map((item) => ({
          label: item.label,
          data: assignees.map(ass => getTaskCountByStatus(ass._id, item.value)),
          backgroundColor: item.backgroundColor,
        })),
      ]
    };
  }, [tasks]);

  const performanceData = {
    labels: ['Hoàn thành đúng hạn', 'Hoàn thành trễ', 'Chưa hoàn thành'],
    datasets: [
      {
        label: 'Tổng',
        data: [4, 9, 3],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ]
  }


  return (
    <div className='w-full flex flex-col gap-4 flex-1'>
      <div className='w-full'>
        <Bar options={CHART_OPTIONS} data={data} className='w-full' />
      </div>
      <div className='w-full'>

        <Bar options={CHART_OPTIONS_PERFORMANCE} data={performanceData} className='w-full' />
      </div>
    </div>
  );
};