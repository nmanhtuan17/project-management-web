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
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  alias: z
    .string({
      required_error: "Please select an internal email to display.",
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
    console.log(data)
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
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input className="focus-visible:ring-0" placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or a
                  pseudonym. You can only change this once every 30 days.
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
                  You can manage verified email addresses in your{" "}
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
                <FormLabel>Internal Email</FormLabel>
                <FormControl>
                  <div className="flex border items-center rounded-sm pr-4">
                    <Input disabled className="focus-visible:ring-0 border-none" placeholder="Please active your internal email" {...field} />
                    <Separator orientation="vertical" />
                    <span className="text-sm text-muted-foreground">@tuan.website</span>
                  </div>
                </FormControl>
                <FormDescription>
                  Active internal email to use internal mail system
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
                <FormLabel>Bio</FormLabel>
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
          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </div>
  )
}