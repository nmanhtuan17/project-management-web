import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FunnelIcon } from "@heroicons/react/16/solid";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts";
import { TaskFilterForm } from "@/views/tasks/components/TasksFilterForm";
import { loadTasks } from "@/redux/actions/task.action";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import AssigneesSelector from "@/components/common/AssigneesSelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TasksListHeaderProps {
  className?: string;
}

export default function TasksListHeader(props: TasksListHeaderProps) {
  const { className } = props;
  const dispatch = useAppDispatch();
  const { currentProject } = useCurrentProject()
  const [value, setValue] = useState<string>('');
  const [open, setOpen] = useState(false)
  const { filter } = useAppSelector(state => state.task)
  const { members } = useAppSelector(state => state.project)

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(loadTasks({ projectId: currentProject._id, query: value }))
    }, 500)
    return () => clearTimeout(timeout);
  }, [value]);

  return <div className={cn("p-4 flex flex-row gap-1 border-b items-center", className)}>
    <Input
      className={'h-8 text-sm w-48'}
      placeholder={'Tìm kiếm...'}
      onChange={(e) => setValue(e.target.value)}
    />
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger>
        <Button
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          variant={'outline'}
          size={'lg'}
          className={'p-0 h-8 text-muted-foreground aspect-square'}>
          <FunnelIcon className={'w-4 h-4'} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <TaskFilterForm setOpen={setOpen} />
      </PopoverContent>
    </Popover>
    <div className="flex p-1 rounded-full overflow-hidden items-center flex-wrap -space-x-2 bg-muted">
      {filter.assignees.length > 0 && filter.assignees.map((item) => (
        <div key={item}>
          {members.map(mem => mem._id === item && (
            <TooltipProvider key={mem._id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className={'w-5 h-5'}>
                    <AvatarImage src={mem?.user?.avatar} />
                    <AvatarFallback className="text-xs">{mem.user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mem?.user?.fullName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
          }
        </div>
      ))}
    </div>
  </div>
}
