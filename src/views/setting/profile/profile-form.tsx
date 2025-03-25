"use client"
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

const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Họ tên yêu cầu tối thiểu 2 ký tự",
    }),
  email: z
    .string({
      required_error: "Hãy chọn email",
    })
    .email(),
  alias: z
    .string({
      required_error: "Hãy chọn email nội bộ",
    }),
  bio: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>


export function ProfileForm() {
  const { user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  const defaultValues: Partial<ProfileFormValues> = {
    fullName: user.fullName,
    email: user.email ?? '',
    alias: user.alias,
    bio: user.bio ?? ''
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })




  function onSubmit(data: ProfileFormValues) {
    dispatch(updateProfile(data))
  }

  return (
    <div className="space-y-4 flex flex-col overflow-y-auto min-h-0">
      <Avatar className="w-16 h-16">
        <AvatarImage src={user?.avatar} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ tên</FormLabel>
                <FormControl>
                  <Input className="focus-visible:ring-0" placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  Đây là tên hiển thị công khai của bạn. Có thể là tên thật hoặc
                  bí danh của bạn.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled className="focus-visible:ring-0" placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  Bạn có thể quản lý các địa chỉ email đã xác minh{" "}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email nội bộ</FormLabel>
                <FormControl>
                  <div className="flex border items-center rounded-sm pr-4">
                    <Input disabled className="focus-visible:ring-0 border-none" placeholder="Please active your internal email" {...field} />
                    <Separator orientation="vertical" />
                    <span className="text-sm text-muted-foreground">@tuan.website</span>
                  </div>
                </FormControl>
                <FormDescription>
                  Email nội bộ đang hoạt động để sử dụng hệ thống thư nội bộ
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiểu sử</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Cập nhật</Button>
        </form>
      </Form>
    </div>
  )
}