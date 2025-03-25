import { useDialogContext } from "@/components/providers/DialogProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import useApi from "@/lib/hooks/useApi";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import apiService from "@/services/api.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const inviteFormSchema = z.object({
  email: z.string().email()
});

type InviteFormValues = z.infer<typeof inviteFormSchema>

export const InviteMemberDialog = () => {
  const { inviteMember, setDialogOpen } = useDialogContext()
  const { currentProject } = useCurrentProject()
  const [loading, setLoading] = useState(false)

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (data: InviteFormValues) => {
    console.log(data)
    setLoading(true)
    apiService.post(`projects/${currentProject._id}/members/invite`, data).then(res => {
      toast.success(res.message)
      setDialogOpen('inviteMember', false)
      form.reset()
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <Dialog
      open={inviteMember.open}
      onOpenChange={open => {
        setDialogOpen("inviteMember", open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Thêm thành viên
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      defaultValue={field.value}
                      onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setDialogOpen("inviteMember", false)
                  form.reset()
                }}
              >
                Hủy
              </Button>
              <Button
                className="flex-1"
                type="submit"
              >
                {loading ?
                  <div className="flex justify-center items-center w-full h-full">
                    <LoadingSpinner size={16} />
                  </div>
                  :
                  'Gửi lời mời'
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}