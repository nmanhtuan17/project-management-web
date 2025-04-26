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
import { ProjectRoles, ProjectTypes } from "@/types/project";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Camera, Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteProject, leaveProject, updateProject, updateProjectAvatar } from "@/redux/actions/project.action";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UpdateProjectForm = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(ProjectTypes),
})

type UpdateProjectFormData = z.infer<typeof UpdateProjectForm>


export function ProjectSetting() {
  const { openDialog, setDialogOpen } = useDialogContext();
  const { currentProject, setCurrentProject, profile, reset } = useCurrentProject();
  const { labels } = useAppSelector(state => state.project)
  const dispatch = useAppDispatch();
  const inputRef = useRef(null)
  const [file, setFile] = useState<File>()
  const [imageData, setImageData] = useState(null);
  const { loading } = useAppSelector(state => state.project)
  const navigate = useNavigate()

  const form = useForm<UpdateProjectFormData>({
    defaultValues: {
      name: currentProject.name,
      type: currentProject.type,
    },
    resolver: zodResolver(UpdateProjectForm)
  })

  const onSubmit = async (data: UpdateProjectFormData) => {
    try {
      const updateProjectPromise = dispatch(updateProject({
        projectId: currentProject._id,
        payload: data
      }));

      let updateAvatarPromise;
      if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        updateAvatarPromise = dispatch(updateProjectAvatar({
          projectId: currentProject._id,
          avatar: formData
        }));
      }
      const [projectResult, avatarResult] = await Promise.all([
        updateProjectPromise,
        updateAvatarPromise
      ]);

      if (avatarResult) {
        setCurrentProject({
          ...currentProject,
          ...data,
          avatar: avatarResult.payload.data
        });
      } else {
        setCurrentProject({
          ...currentProject,
          ...data
        });
      }
      form.reset();
      setFile(undefined);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  const handleLeaveProject = async (e) => {
    e.preventDefault()
    try {
      if (profile.role === ProjectRoles.OWNER) {
        dispatch(deleteProject({
          projectId: currentProject._id
        })).then(() => {
          reset()
          navigate('/')
        })
      } else {
        dispatch(leaveProject({
          projectId: currentProject._id,
          memberId: profile._id
        })).then(() => {
          reset()
          navigate('/')
        })
      }
    } catch (error) {
      toast.error('Rời dự án thất bại')
    } finally {
      setDialogOpen('confirmDialog', false)
    }
  }

  const handleOpenDialog = (e) => {
    e.preventDefault()
    setDialogOpen('confirmDialog', true, {
      element: <div>
        <p>Bạn chắc chắn muốn {profile.role === ProjectRoles.OWNER ? 'xóa dự án' : 'rời dự án'}?</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDialogOpen('confirmDialog', false)}>Hủy</Button>
          <Button variant="destructive" onClick={handleLeaveProject}>Xác nhận</Button>
        </div>
      </div>
    })
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
                    Tên dự án của bạn
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
            <div className="flex gap-2">
              <Button loading={loading} disabled={form.formState.isDirty || file ? false : true} type="submit">Cập nhật</Button>
              <Button variant="destructive" onClick={handleOpenDialog}>{profile.role === ProjectRoles.OWNER ? 'Xóa dự án' : 'Rời dự án'}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}