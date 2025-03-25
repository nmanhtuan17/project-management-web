import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { Textarea } from "@/components/ui/textarea";
import { createLabel, loadProjectLabels } from "@/redux/actions/project.action";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

const labelFormSchema = z.object({
  title: z.string().min(1, "PLEASE_ENTER_TITLE"),
  description: z.string().optional(),
  backgroundColor: z.string().min(1, "PLEASE_ENTER_BACKGROUND"),
});

type LabelFormValues = z.infer<typeof labelFormSchema>


export function CreateLabelDialog() {
  const { createLabelDialog, setDialogOpen } = useDialogContext();
  const { loading } = useAppSelector(state => state.project);
  const dispatch = useAppDispatch();
  const { currentProject } = useCurrentProject()

  const form = useForm<LabelFormValues>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      title: "",
      description: "",
      backgroundColor: "#ffa8a8"
    },
  });

  const onSubmit = async (data: LabelFormValues) => {
    dispatch(createLabel({
      projectId: currentProject._id,
      payload: data
    })).then(res => {
      dispatch(loadProjectLabels(currentProject._id))
    }).finally(() => {
      setDialogOpen("createLabelDialog", false)
    })
  }


  return (
    <Dialog
      open={createLabelDialog.open}
      onOpenChange={open => {
        setDialogOpen("createLabelDialog", open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tạo mới nhãn
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem className={'space-y-1'}>
                  <FormLabel>
                    Background
                  </FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="text-right">
              <Button loading={loading} type="submit">
                Tạo mới
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}