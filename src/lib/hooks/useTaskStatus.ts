import { useAppSelector } from "@/redux/store"
import { useMemo } from "react"


export const useTaskStatus = () => {
  const { board } = useAppSelector(state => state.task)
  const taskStatuses: { value: string, label: string}[] = useMemo(() => {
    let statuses = []
    board.columns.forEach(s => statuses.push({
      value: s.id,
      label: s.title
    }))
    return statuses
  }, [])

  return {
    statuses: taskStatuses
  }
}