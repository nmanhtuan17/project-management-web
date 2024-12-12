import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { taskConfig } from "@/configs/task.config";
import { Task } from "@/types/task";
import dayjs from "dayjs";
import { ArrowUpRight, Dot } from "lucide-react";

interface RecentTaskItemProps {
  task: Task;
}

export const RecentTaskItem = ({ task }: RecentTaskItemProps) => {
  const type = taskConfig.types.find(t => t.value === task?.type);
  const priority = taskConfig.priorities.find(t => t.value === task?.priority);
  
  return (
    <div className="p-6 border rounded-lg col-span-1 gap-2 space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-[14px] line-clamp-2 font-semibold text-muted-foreground">
          <type.icon className="w-4 h-4 inline-block font-light mb-[1px]" />
          {""} {type?.label}
        </p>
        <Button variant="link" className="p-0 h-4">
          <ArrowUpRight size={16} />
        </Button>
      </div>
      <div className="text-lg font-bold text-ellipsis whitespace-nowrap overflow-hidden">{task.title}</div>
      <div className="flex items-center text-sm text-muted-foreground">
        <div>{priority.label}</div>
        <Dot />
        <p>
          {dayjs(task.updatedAt).from(dayjs())}
        </p>
      </div>
      {task?.assignees?.slice(0, 2)?.map(item => (
        <TooltipProvider key={item._id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar key={item?._id} className="h-6 w-6">
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
      ))}
    </div>
  )
}