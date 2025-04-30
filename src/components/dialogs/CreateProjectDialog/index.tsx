import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toast } from "sonner";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { ProjectTypes } from "@/types/project";
import { createProject as createProjectAction } from "@/redux/actions/project.action";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import apiService from "@/services/api.service";
import { Label } from "@radix-ui/react-label";
import { CheckIcon, Cross1Icon, ReloadIcon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { slugify } from "@/utils";

const projectFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên dự án"),
  slug: z.string().min(1, "PLEASE_ENTER_SLUG"),
  type: z.string().min(1, "Vui lòng chọn kiểu dự án"),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>

let slugCheck;

export function CreateProjectDialog() {
  const { createProject, setDialogOpen } = useDialogContext();
  const { loading } = useAppSelector(state => state.project);
  const dispatch = useAppDispatch();
  const [validatingSlug, setValidatingSlug] = useState<boolean | null>(null);
  const [slugValid, setSlugValid] = useState<boolean>(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: ProjectTypes.PERSONAL
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    dispatch(createProjectAction(data))
      .unwrap()
      .then((res) => {
        setDialogOpen("createProject", false);
        form.reset();
        toast.success(res.message)
      })
      .catch((res) => {
        toast.error(res.message)
      })

  }


  return (
    <Dialog
      open={createProject.open}
      onOpenChange={open => {
        setDialogOpen("createProject", open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tạo dự án
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Tên dự án</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a name..."
                      defaultValue={field.value}
                      onChange={e => {
                        form.setValue('name', e.target.value)
                        const slugified = slugify(e.target.value);
                        form.setValue('slug', slugified)
                        setValidatingSlug(true);
                        if (slugCheck) clearTimeout(slugCheck)
                        slugCheck = setTimeout(async () => {
                          if (slugified) {
                            try {
                              await apiService.callApi('POST', 'projects/slug', {
                                slug: slugified,
                              });
                              setSlugValid(true);
                            } catch (e) {
                              console.log(e)
                              setSlugValid(false);
                            }
                          }
                          setValidatingSlug(false);
                        }, 500);
                      }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <div className="grid gap-1">
                  <div className={'flex flex-row justify-between items-center'}>
                    <FormLabel>
                      URL
                    </FormLabel>
                    {validatingSlug !== null && (
                      <div
                        className={cn('flex flex-row justify-between items-center', validatingSlug ? '' : (slugValid ? 'text-green-500' : 'text-red-500'), 'space-x-1')}
                      >
                        {validatingSlug ? <ReloadIcon /> : <>
                          {slugValid ? <CheckIcon /> : <Cross1Icon />}
                        </>}
                        <span
                          className={'text-xs'}>{validatingSlug ? 'Validating...' : (slugValid ? 'Valid' : 'Invalid')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center">
                    <div className={'text-sm border h-full flex items-center px-2 border-r-0 rounded-l-lg bg-muted'}>
                      <span className={'text-muted-foreground'}>{location.origin}/projects/</span>
                    </div>
                    <FormControl>
                      <Input
                        className={'bg-transparent rounded-l-none'}
                        placeholder="awesome-project"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className={'space-y-1'}>
                  <FormLabel>
                    Loại
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal">Cá nhân</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="team" id="team" />
                        <Label htmlFor="team">Nhóm</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="text-right">
              <Button loading={loading} type="submit">
                Thêm mới
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}