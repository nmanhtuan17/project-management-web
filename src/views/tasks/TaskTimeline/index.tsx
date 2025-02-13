import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { useState } from 'react';
import { getStartEndDateForProject, initTasks } from '../helper';
import { useGattTask } from '@/lib/hooks/useGanttTask';
import { useDialogContext } from '@/components/providers/DialogProvider';
import TaskDetail from '../TaskDetail';

export const TaskTimeline = () => {

  // const [tasks, setTasks] = useState<Task[]>(initTasks());
  const { tasks } = useGattTask()
  const { setDialogOpen } = useDialogContext()

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    // setTasks(newTasks);
  };

  const handleExpanderClick = (task: Task) => {
    // setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    setDialogOpen('taskDetail', true, { element: <TaskDetail taskId={task.id} /> })
  }

  return (
    <div className='flex-1 mt-4'>
      <Gantt
        tasks={tasks}
        onDateChange={handleTaskChange}
        onExpanderClick={handleExpanderClick}
        onClick={handleClick}
      />
    </div>
  )
}