import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppSelector } from "@/redux/store"
import { TaskListItem } from "@/views/tasks/TaskList/TaskListItem"
import dayjs from "dayjs"

export const TaskList = () => {
  const { tasks } = useAppSelector(state => state.task)


  return (
    <div className="flex flex-1 mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignees</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskListItem task={task} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}