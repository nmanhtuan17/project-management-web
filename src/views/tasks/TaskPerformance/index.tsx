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
  const { tasks, filter } = useAppSelector(state => state.task)
  const { currentProject } = useCurrentProject()
  const [chartLabels, setLabels] = useState([])


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

  console.log(filter.assignees)
  const assignees = useMemo(() => filter.assignees.map(a => members.find(m => a === m._id)), [filter.assignees, members])
  const labels = useMemo(() => assignees.length ? assignees.map(member => member.user.fullName) : (['Tổng']), [assignees])

  const data = {
    labels,
    datasets: [
      {
        label: 'Tổng',
        data: [tasks.length],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      ...taskConfig.statuses.map((item) => ({
        label: item.label,
        data: [tasks ? tasks.filter(task => task.status === item.value).length : 0],
        backgroundColor: item.backgroundColor,
      }))]
  };

  return (
    <div className='w-full flex-1'>
      {/* <Bar options={options} data={data} className='w-full' /> */}
      <Bar options={options} data={data} className='w-full' />
    </div>
  )
}