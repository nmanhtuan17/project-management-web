import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { useEffect, useRef, useState } from 'react';
import { useGattTask } from '@/lib/hooks/useGanttTask';
import { useDialogContext } from '@/components/providers/DialogProvider';
import TaskDetail from '../TaskDetail';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useCurrentProject } from '@/lib/hooks/useCurrentProject';
import { updateTask } from '@/redux/actions/task.action';
import { ProjectMember } from '@/types/project';
import { useWindowDimensions } from '@/lib/hooks/useWindowDimensions';

let timeoutId;

export const TaskTimeline = () => {
  const { tasks: defaultTasks } = useAppSelector(state => state.task)
  const { tasks } = useGattTask()
  const { setDialogOpen } = useDialogContext()
  const dispatch = useAppDispatch()
  const { currentProject } = useCurrentProject()
  const { height } = useWindowDimensions()
  const lastUpdatedTask = useRef<any>(null);
  const [task, setTask] = useState<Task>()
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    if (update) {
      timeoutId = setTimeout(() => {
        handleTaskChange()
        setUpdate(true)
      }, 100)
    }
    return () => clearTimeout(timeoutId);
  }, [task, update]);

  const handleTaskChange = () => {
    const updatedTask = defaultTasks.find(t => t._id === task.id)
    dispatch(updateTask({
      task: {
        ...updatedTask,
        assignees: updatedTask.assignees.map(a => a._id) as unknown as ProjectMember[],
        time: {
          from: task.start,
          to: task.end
        }
      },
      projectId: currentProject._id
    }))
  };

  const handleExpanderClick = (task: Task) => {
    console.log("On expander click Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    setDialogOpen('taskDetail', true, { element: <TaskDetail taskId={task.id} /> })
  }

  return (
    <div className='flex-1 mt-4 h-full'>
      <Gantt
        tasks={tasks || []}
        onDateChange={(task) => {
          setTask(task)
          setUpdate(true)
        }}
        onExpanderClick={handleExpanderClick}
        onClick={handleClick}
        ganttHeight={height - 300}
      />
    </div>
  )
}