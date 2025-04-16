import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { useAppSelector } from "@/redux/store"
import { Task } from "gantt-task-react"
import { useMemo } from "react"

export const useGattTask = () => {
  const { tasks } = useAppSelector(state => state.task)
  const { milestones } = useAppSelector(state => state.project)
  const { currentProject: project } = useCurrentProject()

  const sortedMilestones = [...milestones].sort((a, b) =>
    new Date(a.time.to).getTime() - new Date(b.time.to).getTime()
  );
  const lastMilestoneDate = sortedMilestones.length
    ? new Date(sortedMilestones[sortedMilestones.length - 1].time.to)
    : (tasks.length ? new Date(tasks[tasks.length - 1].time.to) : new Date());

  const formatedTasks: any[] = useMemo(() => {

    const projectTasks = {
      id: project._id,
      name: project.name,
      start: new Date(project.createdAt),
      end: lastMilestoneDate,
      type: "project",
      progress: 0,
      dependencies: []
    };

    const milestoneTasks = milestones.filter(m => !m.closed).map(milestone => ({
      id: milestone._id,
      name: milestone.title,
      start: new Date(milestone.time.to),
      end: new Date(milestone.time.to),
      type: 'milestone',
      progress: 0,
      dependencies: [],
      project: project._id
    }));

    const taskItems = tasks.slice().reverse().map((task) => ({
      name: task.title,
      start: new Date(task.time.from),
      end: new Date(task.time.to),
      type: 'task',
      id: task._id,
      progress: 100,
      dependencies: [task?.parentTask],
      project: project._id
    }))

    return [projectTasks, ...taskItems, ...milestoneTasks]
  }, [tasks, milestones])

  const setTasks = () => {

  }
  return {
    tasks: formatedTasks,
    setTasks
  }
}