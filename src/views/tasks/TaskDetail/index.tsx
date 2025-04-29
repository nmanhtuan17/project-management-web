import {
  Dot,
  FilePlus2Icon,
  InboxIcon, LinkIcon, LoaderCircleIcon,
  MessageSquareIcon,
  PencilIcon,
  Plus,
  File,
  CircleAlert,
  Ellipsis
} from "lucide-react";
import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import apiService from "@/services/api.service.ts";
import { ETaskStatus, Task, TaskActivity, TaskPriority, TaskTypes } from "@/types/task";
import { activitiesConfig, taskConfig } from "@/configs/task.config.ts";
import { Button } from "@/components/ui/button.tsx";
import { cn, getGravatar } from "@/lib/utils.ts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import useApi from "@/lib/hooks/useApi.ts";
import { CaretDownIcon, CounterClockwiseClockIcon, PlusIcon } from "@radix-ui/react-icons";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { TaskTypeSelect } from "../components/TaskTypeSelect";
import { TaskStatusSelect } from "../components/TaskStatusSelect";
import { TaskPrioritySelect } from "../components/TaskPrioritySelect";
import { CalendarDateRangePicker } from "@/components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import TaskActivities from "../components/TaskActivities";
import { loadTasks, updateTask } from "@/redux/actions/task.action";
import { useTask } from "@/lib/hooks/useTask";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CreateTaskMemberSelector from "../components/CreateTaskMemberSelector";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDays } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskDetailTitle } from "../components/TaskDetailTitle";
import { TaskDetailDescription } from "../components/TaskDetailDescription";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { TaskMilestoneSelect } from "@/views/tasks/components/TaskMilestoneSelect";
import { TaskLabelsSelect } from "@/views/tasks/components/TaskLabelsSelect";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import { toast } from "sonner";

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
    required_error: "Vui lòng chọn loại công việc",
  }),
  status: z.string({
    required_error: "Vui lòng chọn trạng thái",
  }),
  priority: z.enum(Object.values(TaskPriority).map(m => m.toString()) as [string, ...string[]], {
    required_error: "Vui lòng chọn mức độ ưu tiên",
  }),
  title: z.string({
    required_error: "Nhập tiêu đề công việc",
  }).min(4, {
    message: "Tiêu đề quá ngắn, yêu cầu tối thiểu 4 kí tự",
  }).max(100, {
    message: "Tiêu đề quá dài"
  }),
  assignees: z.string().array().optional(),
  time: z.object({
    from: z.date({
      required_error: "Chọn ngày bắt đầu",
    }),
    to: z.date({
      required_error: "Chọn hạn hoàn thành",
    }),
  }),
  description: z.string().optional(),
  parentTask: z.string().optional(),
  project: z.string().optional(),
  attachments: z.string().array().optional(),
  milestone: z.string().optional(),
  labels: z.string().array().optional()
})

type TaskFormValues = z.infer<typeof taskFormSchema>


export default function TaskDetail(props: TaskDetailProps) {
  const { taskId } = props;
  const dispatch = useAppDispatch();
  const { currentProject: project, profile } = useCurrentProject();
  const { task, setTask } = useTask(taskId);
  const [getActivities, { data: activities, error, loading }] = useApi<TaskActivity[]>(apiService.getTaskActivities);
  const [getSubTasks, { data: subTasks }] = useApi<Task[]>(apiService.getSubTasks);
  const { setDialogOpen } = useDialogContext()
  const { milestones } = useAppSelector(state => state.project)


  const loadActivities = () => {
    getActivities(project._id, taskId).then(() => { })
  };

  useEffect(() => {
    if (task) {
      form.reset({
        ...task as unknown as TaskFormValues,
        time: {
          from: new Date(task.time.from),
          to: new Date(task.time.to)
        },
        priority: task.priority.toString(),
        milestone: task.milestone?._id,
        labels: task.labels.map(label => label._id),
        assignees: task.assignees.map(mem => mem._id),
      })
    }
  }, [task]);

  useEffect(() => {
    getSubTasks(project._id, taskId)
    getActivities(project._id, taskId)
  }, [taskId])

  const defaultValues: Partial<TaskFormValues> = {
    type: TaskTypes.GENERAL,
    status: ETaskStatus.TODO,
    priority: TaskPriority.MEDIUM.toString(),
    time: {
      from: new Date(),
      to: addDays(new Date(), 1)
    },
    title: '',
    parentTask: '',
    milestone: '',
    labels: []
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

  const handleArchivedTask = async () => {
    try {
      const res = await apiService.delete(`projects/${project._id}/tasks/${task._id}`, {})
      dispatch(loadTasks({ projectId: project._id }))
      setDialogOpen('taskDetail', false)
      toast.success(res.message)
    } catch (error) {
      setDialogOpen('taskDetail', false)
      toast.error(error.message)
    }
  }

  const milestone = useMemo(() => milestones.find(m => m._id === form.watch('milestone')), [form.watch('milestone'), milestones])

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
            {taskId ? "Loading..." : "Chọn công việc..."}
          </div>
        </div>
      </>
    ) : (
      <Form {...form}>
        <div className={'grid grid-cols-5 gap-4 p-4'}>
          <div className={'col-span-3 space-y-4'}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <div className="flex justify-between items-center">
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-2 outline-none">
                              <Ellipsis size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={handleArchivedTask}>
                              Hủy
                              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <TaskDetailDescription {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col flex-1 max-h-[100px] gap-2 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[14px] font-medium">
                  Công việc phụ
                </span>
                <Button
                  className="p-0 w-6 h-6 align-middle items-center"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault()
                    setDialogOpen('createTaskDialog', true, { parentTask: taskId })
                  }}>
                  <Plus size={16} />
                </Button>
              </div>
              {subTasks && subTasks.map(subTask => (
                <div
                  key={subTask._id}
                  className="border px-2 py-1 rounded-md flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <CircleAlert size={16} />
                    {subTask.title}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-2 outline-none">
                        <Ellipsis size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[80px]">
                      <DropdownMenuItem onClick={() => {
                        setDialogOpen('taskDetail', true, { element: <TaskDetail taskId={subTask._id} /> })
                      }} >
                        Chi tiết
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
            <div>
              <div className="mb-3">
                <span className="text-muted-foreground text-[14px] font-medium">
                  Hoạt động
                </span>
              </div>
              <div className="flex flex-col flex-1 gap-2 max-h-[200px] overflow-y-auto">
                {activities && activities.length > 0 && activities.reverse().map(ac => (
                  <div key={ac._id}>
                    <div className="flex items-center gap-3">
                      <Avatar className={'w-4 h-4'}>
                        <AvatarImage src={ac?.member?.user.avatar} />
                        <AvatarFallback className="text-xs">{ac.member.user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        {ac.field === 'assignees' &&
                          <p className="text-[14px]"> {`Cập nhật mới người phụ trách ${ac.meta.oldValue.join('')} -> ${ac.meta.newValue.join('')}`}</p>
                        }
                        {ac.field === 'time' &&
                          <p className="text-[14px]"> {`Cập nhật thời gian ${dayjs(ac.meta.oldValue.from).format('D/MM/YY')} - ${dayjs(ac.meta.oldValue.to).format('D/MM/YY')} -> ${dayjs(ac.meta.newValue.from).format('D/MM/YY')} - ${dayjs(ac.meta.newValue.to).format('D/MM/YY')}`}</p>
                        }
                        {ac.field === 'labels' &&
                          <p className="text-[14px]"> {`Cập nhật Nhãn công việc`}</p>
                        }
                        {ac.field === 'milestone' &&
                          <p className="text-[14px]"> {`Cập nhật Milestone`}</p>
                        }
                        {ac.field !== 'time' && ac.field !== 'assignees' && ac.field !== 'labels' && ac.field !== 'milestone' &&
                          <p className="text-[14px]"> {`Cập nhật ${activitiesConfig[ac.field]?.label} ${activitiesConfig[ac.field]?.value[ac.meta.oldValue]} -> ${activitiesConfig[ac.field]?.value[ac.meta.newValue]}`}</p>
                        }
                        <p className="text-muted-foreground text-xs">
                          {dayjs(ac.createdAt).format('D MMMM, YYYY  HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
                }
              </div>
            </div>
          </div>

          <div className={'col-span-2'}>
            <div className="border p-3 rounded space-y-2">
              <FormField
                name={'time'}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex gap-4 items-center !space-y-0 my-2">
                    <div className="flex items-center">
                      <FormLabel className="text-muted-foreground text-[12px]">
                        Ngày bắt đầu
                      </FormLabel>
                      <Dot />
                      <FormLabel className="text-muted-foreground text-[12px]" >
                        Hạn hoàn thành
                      </FormLabel>
                    </div>
                    <FormControl>
                      <CalendarDateRangePicker
                        variant="ghost"
                        className="flex-1 w-full"
                        date={field.value as unknown as DateRange}
                        min={milestone?.time.from}
                        max={milestone?.time.to}
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
                    <FormLabel className="text-muted-foreground text-[12px]">
                      Người phụ trách
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
                    <FormLabel className="col-span-1 text-muted-foreground text-[12px]">
                      Trạng thái
                    </FormLabel>
                    <FormControl className="col-span-5">
                      <TaskStatusSelect
                        className="shadow-none border-transparent hover:bg-muted/50"
                        selected={field.value}
                        showIcon
                        onChange={status => {
                          field.onChange(status);
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
                    <FormLabel className="col-span-1 text-muted-foreground text-[12px]">
                      Phân loại
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
                    <FormLabel className="col-span-1 text-muted-foreground text-[12px]">
                      Độ ưu tiên
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

              <FormField
                name={'milestone'}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4 !space-y-0">
                    <FormLabel className="col-span-1 text-muted-foreground text-[12px]">
                      Milestone
                    </FormLabel>
                    <FormControl className="col-span-5">
                      <TaskMilestoneSelect
                        className="shadow-none border-transparent hover:bg-muted/50"
                        selected={field.value}
                        showIcon
                        onChange={milestone => {
                          field.onChange(milestone);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={'labels'}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center !space-y-0">
                    <FormLabel className="col-span-1 text-muted-foreground text-[12px]">
                      Nhãn
                    </FormLabel>
                    <FormControl className="col-span-5">
                      <TaskLabelsSelect
                        className="shadow-none border-transparent hover:bg-muted/50"
                        selected={field.value}
                        showIcon
                        onChange={labels => {
                          field.onChange(labels);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        Đính kèm
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
          <Button type={'submit'} onClick={form.handleSubmit(onSubmit)}>
            Cập nhật
          </Button>
        </div>}
      </Form>
    )}
  </TaskDetailContext.Provider>;
}
