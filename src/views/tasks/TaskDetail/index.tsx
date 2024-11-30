import {
  FilePlus2Icon,
  InboxIcon, LinkIcon, LoaderCircleIcon,
  MessageSquareIcon,
  PencilIcon
} from "lucide-react";
import { useParams } from "react-router-dom";
import { createContext, createElement, useContext, useEffect, useState } from "react";
import apiService from "@/services/api.service.ts";
import { Task, TaskActivity, TaskPriority, TaskTypes } from "@/types/task";
import { taskConfig } from "@/configs/task.config.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { cn, getGravatar } from "@/lib/utils.ts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useAppDispatch } from "@/redux/store.ts";
import useApi from "@/lib/hooks/useApi.ts";
import { CaretDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { useDialogContext } from "@/components/providers/DialogProvider";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import { TaskTypeSelect } from "../components/TaskTypeSelect";
import { TaskStatusSelect } from "../components/TaskStatusSelect";
import { TaskPrioritySelect } from "../components/TaskPrioritySelect";
import { CalendarDateRangePicker } from "@/components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import TaskActivities from "../components/TaskActivities";
import { updateTask } from "@/redux/actions/task.action";
import { useTask } from "@/lib/hooks/useTask";

interface TaskDetailContextType {
  taskId: string;
  task?: Task;
  activities?: TaskActivity[];
  loadActivities?: () => Promise<void> | void;
}

const TaskDetailContext = createContext<TaskDetailContextType>({
  taskId: '',
});

export const useTaskDetailContext = () => useContext(TaskDetailContext);

interface TaskDetailProps {
  taskId: string;
}

export default function TaskDetail(props: TaskDetailProps) {
  const { taskId } = props;
  const dispatch = useAppDispatch();
  const project = useCurrentProject();
  const { task, setTask } = useTask(taskId);
  const [archiveDialog, setArchiveDialog] = useState<boolean>(false);
  const [getActivities, { data: activities, error, loading }] = useApi<TaskActivity[]>(apiService.getTaskActivities);
  // const [getSubTasks, { data: subTasks }] = useApi<Task[]>(apiService.getSubTasks);
  const { openDialog } = useDialogContext();

  const callUpdateTask = async (taskObject: Task) => {
    await dispatch(updateTask({
      projectId: project._id,
      task: taskObject,
    }));
    return loadActivities();
  }

  const loadActivities = () => {
    getActivities(project._id, taskId).then(() => { })
  };

  // useEffect(() => {
  //   if (project._id && taskId) {
  //     getSubTasks(project._id, taskId).then(() => {
  //     });
  //   }
  // }, [project._id, taskId]);

  const type = taskConfig.types.find(t => t.value === task?.type);
  return <TaskDetailContext.Provider value={{
    taskId,
    task,
    activities,
    loadActivities,
  }}>
    {!task ? (
      <>
        <div className={'flex-1 text-muted-foreground flex flex-col items-center justify-center'}>
          {taskId ? <LoaderCircleIcon /> : <InboxIcon className={'w-10 h-10'} />}
          <div>
            {taskId ? "Loading..." : "Select a task to continue..."}
          </div>
        </div>
      </>
    ) : (
      <div className={'p-4 flex-1 overflow-y-auto min-h-0'}>
        <div className={'flex flex-row'}>
          <div className={'bg-muted w-12 h-12 rounded-lg flex items-center justify-center'}>
            <type.icon className={'w-6 h-6'} />
          </div>
          <div className={'pl-2'}>
            <div className={'text-sm'}>
              {type.label}
            </div>
            <div className={'text-2xl font-bold'}>
              {task.title}
            </div>
          </div>
        </div>
        <div className={'flex flex-row gap-2 mt-2'}>
          <Button variant={'outline'} className={'shadow'}>
            <PencilIcon className={'w-4 h-4 mr-1'} />
            Edit
          </Button>
          <Button variant={'outline'} className={'shadow'}>
            <MessageSquareIcon className={'w-4 h-4 mr-1'} />
            Comment
          </Button>
          <div className={'flex flex-row'}>
            <Button variant={'outline'} className={'shadow rounded-r-none'}>
              Assign
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={'outline'} className={'shadow rounded-l-none border-l-0'}>
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className={'text-destructive'} onSelect={() => {
                  setArchiveDialog(true);
                }}>
                  Archive task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className={'grid grid-cols-1 md:grid-cols-3 mt-4 gap-4'}>
          <div className={'col-span-2 space-y-4'}>
            <div>
              <div className={'font-semibold'}>
                Description
              </div>
              <div className={cn('text-sm', !task.description ? 'text-muted-foreground' : '')}>
                {task.description || 'This task is missing a description...'}
              </div>
            </div>
            <div>
              <div className={'flex flex-row justify-between'}>
                <div className={'font-semibold'}>
                  Sub-tasks
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button size={'sm'} variant={'outline'} className={'px-2 py-1 h-6'}>
                        Add <CaretDownIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => openDialog('createTask', {
                        parentTaskId: task._id,
                      })}>
                        <PlusIcon /> Create new task
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LinkIcon className={'w-3 h-3 mr-1'} /> Add existing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {/* <div className={'mt-2 border rounded-lg p-2 space-y-1 bg-muted'}>
                {subTasks && subTasks.length > 0 ? subTasks.map(task => {
                  const Icon = taskConfig.types.find(t => t.value === task.type)?.icon || QuestionMarkCircleIcon;
                  return <div className={'border p-2 rounded bg-background flex flex-row items-center gap-2'}>
                    <Icon className={'w-4 h-4'} />
                    {task.title}
                  </div>
                }) : <div className={'text-sm text-muted-foreground'}>
                  There's no sub-tasks....
                </div>}
              </div> */}
            </div>
            <div>
              <div className={'font-semibold'}>
                Linked items
              </div>
              <div className={cn('text-sm', !task.description ? 'text-muted-foreground' : '')}>
                {task.description || 'This task is missing a description...'}
              </div>
            </div>
            {/* <TaskAttachments task={task}/> */}
            {/* <TaskActivities task={task} /> */}
          </div>


          <div className={'col-span-1'}>
            <div className={'font-semibold mb-2'}>
              Details
            </div>
            <Card>
              <CardContent className={'px-4 py-2 space-y-2'}>
                <div>
                  <div className={'text-sm font-semibold'}>
                    Assignees
                  </div>
                  <div className={'flex flex-row space-x-1'}>
                    {task.assignees.map(assignee => (
                      <Avatar className={'w-5 h-5'}>
                        <AvatarImage src={assignee.user.avatar || getGravatar(assignee.user.email)} alt="Avatar" />
                        <AvatarFallback>{assignee.user.fullName}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className={'grid grid-cols-1'}>
                  <div className={'flex flex-row items-center'}>
                    <div className={'w-32 text-sm font-semibold'}>
                      Status
                    </div>
                    <TaskStatusSelect
                      selected={task.status}
                      className={'border-none shadow-none'}
                      showIcon
                      onChange={(status: string) => {
                        const taskObject = {
                          ...task,
                          status,
                        };
                        setTask(taskObject);
                        callUpdateTask(taskObject);
                      }}
                    />
                  </div>
                  <div className={'flex flex-row items-center'}>
                    <div className={'w-32 text-sm font-semibold'}>
                      Type
                    </div>
                    <TaskTypeSelect
                      selected={task.type}
                      className={'border-none shadow-none'}
                      showIcon
                      onChange={(type: TaskTypes) => {
                        const taskObject = {
                          ...task,
                          type,
                        };
                        setTask(taskObject);
                        callUpdateTask(taskObject);
                      }}
                    />
                  </div>

                  <div className={'flex flex-row items-center'}>
                    <div className={'w-32 text-sm font-semibold'}>
                      Priority
                    </div>
                    <TaskPrioritySelect
                      selected={task.priority.toString()}
                      className={'border-none shadow-none'}
                      showIcon
                      onChange={(priority: string) => {
                        const taskObject: Task = {
                          ...task,
                          priority: parseInt(priority),
                        };
                        setTask(taskObject);
                        callUpdateTask(taskObject);
                      }}
                    />
                  </div>
                  <div className={'flex flex-row items-center'}>
                    <div className={'w-32 text-sm font-semibold'}>
                      Due Date
                    </div>
                    <CalendarDateRangePicker
                      variant="ghost"
                      className="flex-1 w-full"
                      date={task.time}
                      onChange={(time: { from: Date, to: Date }) => {
                        const taskObject = {
                          ...task,
                          time: time,
                        };
                        setTask(taskObject);
                        callUpdateTask(taskObject);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* <ConfirmArchiveTaskDialog
          open={archiveDialog}
          onCancel={() => setArchiveDialog(false)}
          onConfirm={() => {
            setArchiveDialog(false);
            const updated = {
              ...task,
              archived: true,
            };
            callUpdateTask(updated);
          }}
        /> */}
      </div>
    )}
  </TaskDetailContext.Provider>;
}
