import {
  Dot,
  FilePlus2Icon,
  InboxIcon, LinkIcon, LoaderCircleIcon,
  MessageSquareIcon,
  PencilIcon,
  Plus,
  File
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
import { TaskTypeSelect } from "../components/TaskTypeSelect";
import { TaskStatusSelect } from "../components/TaskStatusSelect";
import { TaskPrioritySelect } from "../components/TaskPrioritySelect";
import { CalendarDateRangePicker } from "@/components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import TaskActivities from "../components/TaskActivities";
import { updateTask } from "@/redux/actions/task.action";
import { useTask } from "@/lib/hooks/useTask";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CreateTaskMemberSelector from "../components/CreateTaskMemberSelector";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDays } from "date-fns";
import { useTaskStatus } from "@/lib/hooks/useTaskStatus";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskDetailTitle } from "../components/TaskDetailTitle";
import { TaskDetailDescription } from "../components/TaskDetailDescription";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

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


const taskFormSchema = z.object({
  type: z.enum(Object.values(TaskTypes) as [string, ...string[]], {
    required_error: "Please select task type.",
  }),
  status: z.string({
    required_error: "Please select task status.",
  }),
  priority: z.enum(Object.values(TaskPriority).map(m => m.toString()) as [string, ...string[]], {
    required_error: "Please select task priority.",
  }),
  title: z.string({
    required_error: "Please enter task title",
  }).min(4, {
    message: "Task title too short",
  }).max(100, {
    message: "Task title too long"
  }),
  assignees: z.string().array().optional(),
  time: z.object({
    from: z.string({
      required_error: "Please select start date.",
    }),
    to: z.string({
      required_error: "Please select due date.",
    }),
  }),
  description: z.string().optional(),
  parentTask: z.string().optional(),
  project: z.string().optional(),
  attachments: z.string().array().optional(),
  phase: z.string().optional(),
  label: z.string().optional()
})

type TaskFormValues = z.infer<typeof taskFormSchema>


export default function TaskDetail(props: TaskDetailProps) {
  const { taskId } = props;
  const dispatch = useAppDispatch();
  const { currentProject: project, profile } = useCurrentProject();
  const { task, setTask } = useTask(taskId);
  const [getActivities, { data: activities, error, loading }] = useApi<TaskActivity[]>(apiService.getTaskActivities);
  // const [getSubTasks, { data: subTasks }] = useApi<Task[]>(apiService.getSubTasks);
  const { statuses } = useTaskStatus()


  const loadActivities = () => {
    getActivities(project._id, taskId).then(() => { })
  };

  useEffect(() => {
    if (task) {
      form.reset({
        ...task as unknown as TaskFormValues,
        assignees: task.assignees.map(mem => mem._id),
      })
    }
  }, [task]);

  const defaultValues: Partial<TaskFormValues> = {
    type: TaskTypes.GENERAL,
    status: statuses[0].value,
    priority: TaskPriority.MEDIUM.toString(),
    time: {
      from: new Date as unknown as string,
      to: addDays(new Date(), 1) as unknown as string
    },
    title: '',
    parentTask: ''
  }

  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: defaultValues,
  })

  const onSubmit = (data: TaskFormValues) => {
    dispatch(updateTask({
      task: {
        ...task,
        ...data,
        priority: +data.priority
      } as unknown as Task, projectId: project._id
    })).then(res => {
    })
  }

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={'grid grid-cols-5 gap-4 p-4'}>
            <div className={'col-span-3 space-y-4'}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <Button variant="secondary"
                          className="cursor-default"
                          onClick={(e) => {
                            e.preventDefault()
                          }}>
                          <type.icon className={'w-4 h-4'} />
                          <div className={'text-sm pl-2'}>
                            {type.label}
                          </div>
                        </Button>
                        <TaskDetailTitle {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Description
                    </FormLabel>
                    <FormControl>
                      <TaskDetailDescription {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={'col-span-2'}>
              <div className="border p-3 rounded space-y-2">
                <FormField
                  name={'time'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex gap-4 items-center !space-y-0 my-2">
                      <div className="flex items-center">
                        <FormLabel className="text-muted-foreground">
                          Start Date
                        </FormLabel>
                        <Dot />
                        <FormLabel className="text-muted-foreground" >
                          Due Date
                        </FormLabel>
                      </div>
                      <FormControl>
                        <CalendarDateRangePicker
                          variant="ghost"
                          className="flex-1 w-full"
                          date={field.value as unknown as DateRange}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="my-4" />
                <FormField
                  control={form.control}
                  name="assignees"
                  render={({ field }) => (
                    <FormItem className={'flex items-center gap-4 !space-y-0'}>
                      <FormLabel className="text-muted-foreground">
                        Assignees
                      </FormLabel>
                      <FormControl>
                        <CreateTaskMemberSelector
                          members={field.value}
                          onChange={members => {
                            field.onChange(members)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="my-4" />
                <FormField
                  name={'status'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-4 !space-y-0">
                      <FormLabel className="col-span-1 text-muted-foreground">
                        Status
                      </FormLabel>
                      <FormControl className="col-span-5">
                        <TaskStatusSelect
                          options={statuses}
                          className="shadow-none border-transparent hover:bg-muted/50"
                          selected={field.value}
                          showIcon
                          onChange={type => {
                            field.onChange(type);
                            console.log(type)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={'type'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-4 !space-y-0">
                      <FormLabel className="col-span-1 text-muted-foreground">
                        Type
                      </FormLabel>
                      <FormControl className="col-span-5">
                        <TaskTypeSelect
                          className="shadow-none border-transparent hover:bg-muted/50"
                          selected={field.value}
                          showIcon
                          onChange={type => {
                            field.onChange(type);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name={'priority'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-4 !space-y-0">
                      <FormLabel className="col-span-1 text-muted-foreground">
                        Priority
                      </FormLabel>
                      <FormControl className="col-span-5">
                        <TaskPrioritySelect
                          className="shadow-none border-transparent hover:bg-muted/50"
                          selected={field.value}
                          showIcon
                          onChange={type => {
                            field.onChange(type);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="col-span-6" />
                    </FormItem>
                  )}
                />

                {/* <FormField
                    name={'phase'}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-6 items-center gap-4 !space-y-0">
                        <FormLabel className="col-span-1 text-muted-foreground">
                          Phase
                        </FormLabel>
                        <FormControl className="col-span-5">
                          <TaskPrioritySelect
                            className="shadow-none border-transparent hover:bg-muted/50"
                            selected={field.value}
                            showIcon
                            onChange={type => {
                              field.onChange(type);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={'label'}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-6 items-center !space-y-0">
                        <FormLabel className="col-span-1 text-muted-foreground">
                          Label
                        </FormLabel>
                        <FormControl className="col-span-5">
                          <TaskPrioritySelect
                            className="shadow-none border-transparent hover:bg-muted/50"
                            selected={field.value}
                            showIcon
                            onChange={type => {
                              field.onChange(type);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
              </div>
              <div className="mt-2">
                <FormField
                  name={'attachments'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4 !space-y-0">
                      <FormLabel className="flex flex-1 items-center gap-2 text-muted-foreground">
                        <File size={16} />
                        <span>
                          Attachments
                        </span>
                      </FormLabel>
                      <FormControl className="">
                        <Button
                          className="p-0 w-6 h-6 align-middle items-center"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault()
                          }}>
                          <Plus size={16} />
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          {form.formState.isDirty && <div className="absolute bottom-0 right-0 p-6 space-x-2">
            <Button type={'submit'}>
              Update
            </Button>
          </div>}
        </form>
      </Form>
    )}
  </TaskDetailContext.Provider>;
}
