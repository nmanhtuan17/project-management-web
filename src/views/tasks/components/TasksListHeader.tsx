import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FunnelIcon } from "@heroicons/react/16/solid";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { useAppDispatch } from "@/redux/store.ts";
import { useEffect, useState } from "react";
import { searchTask } from "@/redux/slices/task.slice.ts";
import { cn } from "@/lib/utils.ts";
import { TaskFilterForm } from "@/views/tasks/components/TasksFilterForm";

interface TasksListHeaderProps {
  className?: string;
}

export default function TasksListHeader(props: TasksListHeaderProps) {
  const { className } = props;
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(searchTask(value))
    }, 500)
    return () => clearTimeout(timeout);
  }, [value]);
  return <div className={cn("p-4 flex flex-row gap-1 border-b", className)}>
    <Input
      className={'h-8 text-sm w-48'}
      placeholder={'Search...'}
      onChange={(e) => setValue(e.target.value)}
    />
    <Popover>
      <PopoverTrigger>
        <Button variant={'outline'} size={'lg'} className={'p-0 h-8 text-muted-foreground aspect-square'}>
          <FunnelIcon className={'w-4 h-4'} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <TaskFilterForm />
      </PopoverContent>
    </Popover>
  </div>
}
