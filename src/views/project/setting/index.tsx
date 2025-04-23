import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect, useRef, useState } from "react";
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
import { Camera, Plus } from "lucide-react";


export function ProjectSetting() {
  const { openDialog } = useDialogContext();
  const { currentProject } = useCurrentProject();
  const { labels } = useAppSelector(state => state.project)
  const dispatch = useAppDispatch();
  const inputRef = useRef(null)
  const [file, setFile] = useState<File>()
  const [imageData, setImageData] = useState(null);

  const form = useForm({
    defaultValues: {
      name: currentProject.name,
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
            <h3 className="text-lg font-semibold">Cài đặt</h3>
            <p className="text-sm text-muted-foreground">
              Cài đặt dự án của bạn
            </p>
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-4 flex flex-col flex-1 overflow-y-auto min-h-0 p-4">
        <div className="self-baseline relative">
          <Avatar className="w-16 h-16">
            <AvatarImage src={imageData || currentProject?.avatar} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            className="absolute -bottom-2 z-10 -right-2 rounded-full w-8 h-8 p-2 bg-slate-300"
            onClick={() => inputRef.current.click()}
          >
            <Camera />
            <input ref={inputRef} onChange={(e) => {
              setFile(e.target.files[0])
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setImageData(e.target.result);
                };
                reader.readAsDataURL(file);
              }
            }} type="file" className="hidden" />
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên dự án</FormLabel>
                  <FormDescription>
                    Tên sự án của bạn
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
              name="type"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Kiểu dự án</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={(e) => onChange(e)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ProjectTypes).map((option, index) => (
                          <SelectItem value={option} key={index}>
                            {option === ProjectTypes.PERSONAL ? 'Cá nhân' : 'Nhóm'}
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
                  Nhãn
                </Label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Có thể áp dụng nhãn cho các công việc.
                </p>
              </div>
              <div className="rounded-[8px] shadow-sm border p-3 flex gap-2 mt-3">
                {labels.map(l => {
                  return (
                    <div key={l._id}
                      className={cn('text-xs py-1 px-2 rounded-sm text-white')}
                      style={{ backgroundColor: l.backgroundColor }}
                    >
                      {l.title}
                    </div>
                  )
                })}
                <div
                  onClick={() => {
                    openDialog('createLabelDialog')
                  }}
                  className="border border-dashed rounded align-middle items-center flex px-2 py-1 cursor-pointer">
                  <Plus size={14} />
                </div>
              </div>
            </div>
            <Button disabled={form.formState.isDirty || file ? false : true} type="submit">Cập nhật</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}