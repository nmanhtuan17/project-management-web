import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input.tsx";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button.tsx";
import apiService from "@/services/api.service.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

const verifyAccountSchema = z.object({
  email: z.string().email()
});

type VerifyAccountFormValues = z.infer<typeof verifyAccountSchema>

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      email: ''
    }
  });

  const processData = async (values: VerifyAccountFormValues) => {
    try {
      setIsLoading(true)
      const res = await apiService.post('auth/reset-password', values)
      toast.success(res.message)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return <>
    <Form {...form}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quên mật khẩu
        </h1>
        <p className="text-sm text-muted-foreground">
          Vui lòng nhập email của bạn...
        </p>
      </div>
      <form onSubmit={form.handleSubmit(processData)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
              </FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={'flex flex-row gap-2 mt-4'}>
          <Button type={'submit'} className={'flex-1'}>
            Xác nhận
          </Button>
        </div>
        <div className={'pt-4'}>
          <Button
            variant="outline"
            className={'w-full'}
            disabled={isLoading}
            onClick={() => {
              navigate('/auth/login')
            }}
          >
            <ArrowLeftIcon className={'ml-2 w-4 h-4'} /> Back
          </Button>
        </div>
      </form>
    </Form>
  </>
}
