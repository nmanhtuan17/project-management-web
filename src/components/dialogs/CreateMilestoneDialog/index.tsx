import { CalendarDateRangePicker } from "@/components/common/DateRangePicker";
import { InputComposer } from "@/components/common/InputComposer";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import useEditor from "@/lib/hooks/useEditor";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { Dot } from "lucide-react";
import { useRef } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createMilestone as createMilestoneAction } from "@/redux/actions/project.action";
import { Milestone } from "@/types/project";

const labelFormSchema = z.object({
  title: z.string().min(1, "PLEASE_ENTER_TITLE"),
  time: z.object({
    from: z.date({
      required_error: "Please select start date.",
    }),
    to: z.date({
      required_error: "Please select due date.",
    }),
  }),
  description: z.string().optional(),
});

type MileStoneFormValues = z.infer<typeof labelFormSchema>

export const CreateMilestoneDialog = () => {
  const { createMilestone, setDialogOpen } = useDialogContext();
  const { loading } = useAppSelector(state => state.project);
  const dispatch = useAppDispatch();
  const { currentProject } = useCurrentProject()
  const inputRef = useRef(null)

  const form = useForm<MileStoneFormValues>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      title: "",
      time: {
        from: new Date(),
        to: addDays(new Date(), 1)
      }
    },
  });

  const onSubmit = async (data: MileStoneFormValues) => {
    const payload = {
      ...data,
      description: inputRef.current.getHTML()
    } as Partial<Milestone>
    console.log(payload)
    dispatch(createMilestoneAction({
      projectId: currentProject._id,
      milestone: payload
    }))
    setDialogOpen("createMilestone", false)
  }

  return (
    <Dialog
      open={createMilestone.open}
      onOpenChange={open => {
        setDialogOpen("createMilestone", open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            New Milestone
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={'time'}
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex gap-4 items-center !space-y-0">
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
          <div>
            <div className="font-medium text-[14px] my-1">
              Description
            </div>
            <InputComposer ref={inputRef} />
          </div>
          <div className="text-right">
            <Button onClick={form.handleSubmit(onSubmit)} loading={loading} type="submit">
              Create
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}