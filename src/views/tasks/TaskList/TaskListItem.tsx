import { useDialogContext } from "@/components/providers/DialogProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TableCell, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { taskConfig } from "@/configs/task.config"
import { Task } from "@/types/task"
import dayjs from "dayjs"
import { Ellipsis } from "lucide-react"
import TaskDetail from "../TaskDetail"
import { cn } from "@/lib/utils"
import apiService from "@/services/api.service"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { useAppDispatch } from "@/redux/store"
import { loadTasks } from "@/redux/actions/task.action"
import { toast } from "sonner"

interface TaskListItemProp {
  task: Task
}

export const TaskListItem = ({ task }: TaskListItemProp) => {
  const { taskDetail, setDialogOpen } = useDialogContext();
  const { currentProject } = useCurrentProject()
  const dispatch = useAppDispatch()
  const type = taskConfig.types.find(t => t.value === task?.type);
  const priority = taskConfig.priorities.find(t => t.value === task?.priority);
  const status = taskConfig.statuses.find(t => t.value === task?.status);

  const handleArchivedTask = async () => {
    try {
      const res = await apiService.delete(`projects/${currentProject._id}/tasks/${task._id}`, {})
      toast.success(res.message)
      dispatch(loadTasks({ projectId: currentProject._id }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <TableRow key={task._id}
      onDoubleClick={() => {
        setDialogOpen('taskDetail', true, { element: <TaskDetail taskId={task._id} /> })
      }}
      className="cursor-pointer"
    >
      <TableCell onClick={() => {
        setDialogOpen('taskDetail', true, { element: <TaskDetail taskId={task._id} /> })
      }}
        className="text-xs font-semibold gap-2 items-center hover:underline">
        {task?.title}
      </TableCell>
      <TableCell className="text-xs font-semibold">
        <div className="flex gap-2">
          {
            task.labels.length > 0 ?
              task.labels.map(label => (
                <div
                  key={label._id}
                  className='self-baseline rounded px-2 py-1'
                  style={{
                    background: label.backgroundColor
                  }}>
                  {label.title}
                </div>
              ))
              :
              'No labels'
          }
        </div>
      </TableCell>
      <TableCell className="text-xs font-semibold">
        <div className="flex flex-row gap-1" style={{ color: status?.text }}>
          {<status.icon className={'w-4 h-4'} />}
          <p className="text-[12px] line-clamp-1 font-semibold flex-row">
            {status.label}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-xs font-semibold ">
        <div className="flex items-center -space-x-2">
          {task.assignees.length ? task?.assignees?.slice(0, 2)?.map(item => (
            <TooltipProvider key={item?._id} >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={item?.user.avatar || ""}
                      alt={""}
                    />
                    <AvatarFallback className="text-xs">{item?.user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item?.user.fullName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
            :
            <p className="text-muted-foreground">
              unassigned
            </p>
          }
        </div>
      </TableCell>
      <TableCell className="text-xs font-semibold">{dayjs(task?.time?.to).format('DD/MM/YYYY')}</TableCell>
      <TableCell className="text-xs font-semibold">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2 outline-none">
              <Ellipsis size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onSelect={handleArchivedTask}>
              Hủy
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}