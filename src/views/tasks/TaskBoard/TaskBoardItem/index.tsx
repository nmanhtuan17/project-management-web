import { Task } from "@/types/task";
import { Card } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import * as React from "react";
import { Badge } from "@/components/ui/badge.tsx";
import dayjs from "dayjs";
import { taskConfig } from "@/configs/task.config";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDialogContext } from "@/components/providers/DialogProvider";
import TaskDetail from "../../TaskDetail";

interface TaskBoardItemProps {
  task: Task;
}

export function TaskBoardItem(props: TaskBoardItemProps) {
  const { setDialogOpen } = useDialogContext()
  const { task } = props;
  const type = taskConfig.types.find(t => t.value === task?.type);
  const priority = taskConfig.priorities.find(t => t.value === task?.priority);



  return (
    <Card
      onClick={() => {
        setDialogOpen('taskDetail', true, { element: <TaskDetail taskId={task._id} /> })
      }}
      className="shadow-none rounded-lg px-4 py-2 w-[264px]">
      <p className="text-[14px] line-clamp-2 font-semibold">
        <type.icon className="w-4 h-4 inline-block font-light mb-[1px]" />
        {""} {task?.title}
      </p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Badge className="px-2 text-xs" variant="secondary">{priority?.label}</Badge>
          <p className="text-xs text-muted-foreground">{dayjs(task?.time?.to).format('MMMM D')}</p>
        </div>
        <div className="flex -space-x-2 *:ring-1 *:ring-transparent">
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
      </div>
    </Card>
  )
};
