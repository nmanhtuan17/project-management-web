import { useEffect, useMemo } from 'react';
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
import { useAppSelector } from '@/redux/store';
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


export const TaskPerformance = () => {
  const { members } = useAppSelector(state => state.project)
  const [getTasks, { data: tasks }] = useApi<Task[]>(apiService.getTasks)
  const { currentProject } = useCurrentProject()

  useEffect(() => {
    getTasks(currentProject._id, {})
  }, [currentProject])

  const options = {
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


  const labels = useMemo(() => members.map(member => member.user.fullName), [members])
  console.log(tasks)

  const data = {
    labels,
    datasets: [
      {
        label: 'Tổng',
        data: members.map((mem) =>
          tasks && tasks.filter(task => task.assignees.find(a => a._id === mem._id)).length),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      ...taskConfig.statuses.map((item) => ({
        label: item.label,
        data: members.map((mem) =>
          tasks ? tasks.filter(task => task.status === item.value && task.assignees.find(a => a._id === mem._id)).length : 0),
        backgroundColor: item.backgroundColor,
      }))]
  };

  return (
    <div className='w-full flex-1'>
      <Bar options={options} data={data} className='w-full' />
    </div>
  )
}