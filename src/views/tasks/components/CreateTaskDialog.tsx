import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


const createTaskFormSchema = z.object({
  type: z.enum(Object.values(TaskTypes) as [string, ...string[]], {
    required_error: "Please select task type.",
  }),
  status: z.enum(Object.values(TaskStatus) as [string, ...string[]], {
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
  dueDate: z.date({
    required_error: "Please select task due date.",
  }).optional(),
  description: z.string().optional(),
  parentTask: z.string().optional(),
  project: z.string().optional(),
})

type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>


export const CreateTaskDialog = () => {
  const { createTaskDialog, setDialogOpen } = useDialogContext();
  const currentProject = useCurrentProject()
  const dispatch = useAppDispatch();
  const [createTaskType, setCreateType] = useState<string>("normal");

  const defaultValues: Partial<CreateTaskFormValues> = {
    type: TaskTypes.GENERAL,
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM.toString(),
    dueDate: new Date(),
    title: '',
    parentTask: '',
    project: '',
  }

  const form = useForm({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: CreateTaskFormValues) => {
    if (data.project === "") delete data.project;
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
      <DialogContent className="w-full max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between">
              <p>
                Create Task
              </p>
              {/* {!projectId && <Tabs
              onValueChange={(e) => setCreateType(e)}
              defaultValue={createTaskType}
              className="mr-6 h-full">
              <TabsList className={'w-full flex'}>
                <TabsTrigger value="normal" className="h-full">
                  Normal
                </TabsTrigger>
                <TabsTrigger value="project" className="h-full">
                  Project
                </TabsTrigger>
              </TabsList>
            </Tabs>} */}
            </div>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={'grid grid-cols-3 gap-4'}>
              <div className={'col-span-2 space-y-4'}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Task Title
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
                  <FormField
                    control={form.control}
                    name="assignees"
                    render={({ field }) => (
                      <FormItem className={'flex-1'}>
                        <FormLabel>
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
                <div className={'mt-4'}>
                  <Button type={'submit'}>
                    Create
                  </Button>
                </div>
              </div>
              <div className={'col-span-1 space-y-4'}>
                <FormField
                  name={'type'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type
                      </FormLabel>
                      <FormControl>
                        <TaskTypeSelect
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
                  name={'status'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Status
                      </FormLabel>
                      <FormControl>
                        <TaskStatusSelect
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
                    <FormItem>
                      <FormLabel>
                        Priority
                      </FormLabel>
                      <FormControl>
                        <TaskPrioritySelect
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
                  name={'dueDate'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Due Date
                      </FormLabel>
                      <FormControl>
                        <TaskDatePopupPicker
                          date={field.value}
                          onChange={date => field.onChange(date)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}