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
import { activeInternalEmail, updateProfile, updateProfileAvatar } from "@/redux/actions/app.action"
import { Camera } from "lucide-react"
import { useRef, useState } from "react"

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
  const { loading } = useAppSelector(state => state.app)
  const { user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const inputRef = useRef(null)
  const [file, setFile] = useState<File>()
  const [imageData, setImageData] = useState(null);

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
    if (!!file) {
      dispatch(updateProfileAvatar(file))
      setFile(undefined)
    }
  }

  return (
    <div className="space-y-4 flex flex-col overflow-y-auto min-h-0">
      <div className="self-baseline relative">
        <Avatar className="w-16 h-16">
          <AvatarImage src={imageData || user?.avatar} alt="@shadcn" />
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
          <Button loading={loading} disabled={form.formState.isDirty || file ? false : true} type="submit">Cập nhật</Button>
        </form>
      </Form>
    </div>
  )
}