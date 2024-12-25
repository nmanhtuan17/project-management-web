import { useDialogContext } from "@/components/providers/DialogProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import apiService from "@/services/api.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inviteFormSchema = z.object({
  email: z.string().email()
});

type InviteFormValues = z.infer<typeof inviteFormSchema>

export const InviteMemberDialog = () => {
  const { inviteMember, setDialogOpen } = useDialogContext()
  const {currentProject} = useCurrentProject()

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (data: InviteFormValues) => {
    console.log(data)
    apiService.post(`projects/${currentProject._id}/members/invite`, data).then(res => {
      
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
            Invite Member
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
                Cancel
              </Button>
              <Button
                className="flex-1"
                type="submit"
              >
                Send Invitation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}