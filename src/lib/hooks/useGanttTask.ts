import { useAppSelector } from "@/redux/store"
import { Task } from "gantt-task-react"
import { useMemo } from "react"

export const useGattTask = () => {
  const { tasks } = useAppSelector(state => state.task)
  // {
  //   start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  //   end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  //   name: "Some Project",
  //   id: "ProjectSample",
  //   progress: 25,
  //   type: "project",
  //   hideChildren: false,
  //   displayOrder: 1,
  // },
  console.log(tasks)

  const formatedTasks: Task[] = useMemo(() => {
    return tasks.map((task) => ({
      name: task.title,
      start: new Date(task.time.from),
      end: new Date(task.time.to),
      type: 'task',
      id: task._id,
      progress: 100
    }))
  }, [tasks])

  const setTasks = () => {

  }
  return {
    tasks: formatedTasks,
    setTasks
  }
}