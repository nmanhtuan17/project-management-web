import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { activeInternalEmail, updateProfile } from "@/redux/actions/app.action"
import apiService from "@/services/api.service"

const changePasswordFormSchema = z.object({
  oldPassword: z
    .string()
    .min(8, {
      message: "Mật khẩu yêu cầu tối thiểu 8 ký tự",
    }),
  newPassword: z
    .string({
      message: "Mật khẩu yêu cầu tối thiểu 8 ký tự",
    }),
  confirmPassword: z
    .string({
      message: "Mật khẩu yêu cầu tối thiểu 8 ký tự",
    }),
})

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>


export function ChangePasswordForm() {

  const defaultValues: Partial<ChangePasswordFormValues> = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues,
    mode: "onChange",
  })



  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      const res = await apiService.post(`auth/change-password`, data)
      toast.success(res.message)
      form.reset()
    } catch (error) {
      if (error.message.prop && error.message.prop.constructor === Array)
        error.message.forEach(m => toast.error(m))
      else
        toast.error(error.message)
    }
  }

  return (
    <div className="space-y-4 flex flex-col overflow-y-auto min-h-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu cũ</FormLabel>
                <FormControl>
                  <Input className="focus-visible:ring-0" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input className="focus-visible:ring-0" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <FormControl>
                  <Input className="focus-visible:ring-0" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Đổi mật khẩu</Button>
        </form>
      </Form>
    </div>
  )
}