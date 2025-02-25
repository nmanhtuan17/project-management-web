import { useAppSelector } from "@/redux/store"
import { Task } from "gantt-task-react"
import { useMemo } from "react"

export const useGattTask = () => {
  const { tasks } = useAppSelector(state => state.task)

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