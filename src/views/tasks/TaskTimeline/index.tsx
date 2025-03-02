import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { useState } from 'react';
import { useGattTask } from '@/lib/hooks/useGanttTask';
import { useDialogContext } from '@/components/providers/DialogProvider';
import TaskDetail from '../TaskDetail';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useCurrentProject } from '@/lib/hooks/useCurrentProject';
import { updateTask } from '@/redux/actions/task.action';
import { ProjectMember } from '@/types/project';
import { useWindowDimensions } from '@/lib/hooks/useWindowDimensions';

export const TaskTimeline = () => {
  const { tasks: defaultTasks } = useAppSelector(state => state.task)
  const { tasks } = useGattTask()
  const { setDialogOpen } = useDialogContext()
  const dispatch = useAppDispatch()
  const { currentProject } = useCurrentProject()
  const { height } = useWindowDimensions()

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:", task);
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
    // setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    setDialogOpen('taskDetail', true, { element: <TaskDetail taskId={task.id} /> })
  }

  return (
    <div className='flex-1 mt-4 h-full'>
      <Gantt
        tasks={tasks || []}
        onDateChange={handleTaskChange}
        onExpanderClick={handleExpanderClick}
        onClick={handleClick}
        ganttHeight={height - 300}
      />
    </div>
  )
}