import { CalendarDateRangePicker } from "@/components/common/DateRangePicker";
import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import { useTaskStatus } from "@/lib/hooks/useTaskStatus";
import { loadTasks } from "@/redux/actions/task.action";
import { useAppDispatch } from "@/redux/store";
import apiService from "@/services/api.service";
import { TaskPriority, TaskStatus, TaskTypes } from "@/types/task";
import CreateTaskMemberSelector from "@/views/tasks/components/CreateTaskMemberSelector";
import TaskDatePopupPicker from "@/views/tasks/components/TaskDatePopupPicker";
import { TaskPrioritySelect } from "@/views/tasks/components/TaskPrioritySelect";
import { TaskStatusSelect } from "@/views/tasks/components/TaskStatusSelect";
import { TaskTypeSelect } from "@/views/tasks/components/TaskTypeSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { log, time } from "console";
import { addDays } from "date-fns";
import { Dot, File, Plus } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";


const createTaskFormSchema = z.object({
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
    from: z.date({
      required_error: "Please select start date.",
    }),
    to: z.date({
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

type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>


export const CreateTaskDialog = () => {
  const { createTaskDialog, setDialogOpen } = useDialogContext();
  const currentProject = useCurrentProject()
  const dispatch = useAppDispatch();
  const [createTaskType, setCreateType] = useState<string>("normal");
  const { statuses } = useTaskStatus();

  const defaultValues: Partial<CreateTaskFormValues> = {
    type: TaskTypes.GENERAL,
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM.toString(),
    time: {
      from: new Date,
      to: addDays(new Date(), 1)
    },
    title: '',
    parentTask: '',
  }

  const form = useForm({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: CreateTaskFormValues) => {
    console.log(data)
    // if (data.project === "") delete data.project;
    // apiService.post(`/spaces/${currentSpace._id}/tasks`, data).then(() => {
    //   dispatch(loadTasks(currentSpace._id));
    //   setDialogOpen('createTask', false);
    // })
  }

  return (
    <Dialog
      open={createTaskDialog.open}
      onOpenChange={open => {
        setDialogOpen('createTaskDialog', open)
      }}
    >
      <DialogContent className="w-full max-w-[1280px] min-h-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={'grid grid-cols-5 gap-4'}>
              <div className={'col-span-3 space-y-4'}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Title..." {...field} />
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
                      <FormLabel>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Task description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className={'flex flex-row gap-2'}>

                  {/* <FormField
                  control={form.control}
                  name="parentTask"
                  render={({field}) => (
                    <FormItem className={'flex-1'}>
                      <FormLabel>
                        Parent Task
                      </FormLabel>
                      <FormControl>
                        <InputTask
                          value={field.value}
                          className={'h-10'}
                          onValueChange={(taskId) => {
                            field.onChange(taskId);
                          }}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                /> */}
                </div>
              </div>

              <div className={'col-span-2'}>
                <div className="flex gap-4 mb-2">
                  <FormField
                    name={'status'}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="items-center gap-4 !space-y-0">
                        <FormControl>
                          <TaskStatusSelect
                            className="shadow-none bg-muted/50 hover:bg-muted gap-2"
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

                </div>
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
                            date={field.value as DateRange}
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
                        <FormControl className="col-span-5">
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
                        <FormMessage />
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
            <div className="absolute bottom-0 right-0 p-6 space-x-2">
              <Button variant="secondary" onClick={(e) => {
                e.preventDefault()
                setDialogOpen('createTaskDialog', false)
                // form.reset()
              }}>
                Cancel
              </Button>
              <Button type={'submit'}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}