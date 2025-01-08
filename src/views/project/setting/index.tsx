import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect } from "react";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { loadTasks } from "@/redux/actions/task.action";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { MemberItem } from "@/views/member/components/MemberItem";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { current } from "@reduxjs/toolkit";
import { slugify } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectTypes } from "@/types/project";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";


export function ProjectSetting() {
  const { openDialog } = useDialogContext();
  const { currentProject } = useCurrentProject();
  const { labels } = useAppSelector(state => state.project)
  const dispatch = useAppDispatch();
  const form = useForm({
    defaultValues: {
      name: currentProject.name,
      slug: currentProject.slug,
      type: currentProject.type,
    }
  })

  const onSubmit = () => {

  }

  return (
    <div className="h-full">
      <div className="p-4 flex flex-col min-h-0 w-full">
        <div className="flex justify-between items-center">
          <div className="">
            <h3 className="text-lg font-semibold">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Settings for your project
            </p>
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-4 flex flex-col flex-1 overflow-y-auto min-h-0 p-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={currentProject?.avatar} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormDescription>
                    Can view and edit project information.
                  </FormDescription>
                  <FormControl>
                    <Input className="focus-visible:ring-0" placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project slug</FormLabel>
                  <FormDescription>
                    Can view and edit project information.
                  </FormDescription>
                  <FormControl>
                    <Input disabled className="focus-visible:ring-0" placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Project type</FormLabel>
                  <FormDescription>
                    Can view and edit project information.
                  </FormDescription>
                  <FormControl>
                    <Select value={value} onValueChange={(e) => onChange(e)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ProjectTypes).map((option, index) => (
                          <SelectItem value={option} key={index}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="">
              <div>
                <Label>
                  Project labels
                </Label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Labels can be applied to tasks.
                </p>
              </div>
              <div className="rounded-[8px] shadow-sm border p-3 flex gap-2 mt-3">
                {labels.map(l => {
                  return (
                    <div key={l._id} className={cn(`bg-[${l.backgroundColor}]`, 'text-xs py-1 px-2 rounded-sm text-white')}>
                      {l.title}
                    </div>
                  )
                })}
                <div
                  onClick={() => {
                    openDialog('createLabel')
                  }}
                  className="border border-dashed rounded align-middle items-center flex px-2 py-1 cursor-pointer">
                  <Plus size={14} />
                </div>
              </div>
            </div>
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}