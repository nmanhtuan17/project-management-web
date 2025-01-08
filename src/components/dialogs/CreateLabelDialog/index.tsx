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
import { Textarea } from "@/components/ui/textarea";

const labelFormSchema = z.object({
  title: z.string().min(1, "PLEASE_ENTER_TITLE"),
  description: z.string().optional(),
  backgroundColor: z.string().min(1, "PLEASE_ENTER_BACKGROUND"),
});

type LabelFormValues = z.infer<typeof labelFormSchema>


export function CreateLabelDialog() {
  const { createLabel, setDialogOpen } = useDialogContext();
  const { loading } = useAppSelector(state => state.project);
  const dispatch = useAppDispatch();

  const form = useForm<LabelFormValues>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      title: "",
      description: "",
      backgroundColor: "#ffa8a8"
    },
  });

  const onSubmit = async (data: LabelFormValues) => {
    console.log(data)

  }


  return (
    <Dialog
      open={createLabel.open}
      onOpenChange={open => {
        setDialogOpen("createLabel", open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Label
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
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
                    Background Color
                  </FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="text-right">
              <Button loading={loading} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}