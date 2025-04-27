import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input.tsx";
import * as React from "react";
import { Button } from "@/components/ui/button.tsx";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/16/solid";
import apiService from "@/services/api.service.ts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const registerSchema = z.object({
  fullName: z.string({required_error: "Họ tên là bắt buộc"}).min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string({required_error: "Email là bắt buộc"}).email("Email không hợp lệ"),
  password: z.string({required_error: "Mật khẩu là bắt buộc"}).min(8, "Mật khẩu phải có ít nhất 8 ký tự")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ show: boolean, title?: string, description?: string, error?: boolean }>({
    show: false,
    error: false,
  });

  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    },
    mode: "onSubmit"
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      const response = await apiService.callApi('POST', '/auth/register', data);
      setMessage({
        show: true,
        title: 'SUCCESS',
        description: response.message,
        error: false,
      });
      setTimeout(() => {
        navigate(`/auth/verify?email=${data.email}&src=registration`);
      }, 500);
    } catch (err: any) {
      setMessage({
        error: true,
        show: true,
        title: 'Error',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Đăng ký
          </h1>
        </div>
        <Alert hidden={!message.show} variant={message.error ? 'destructive' : 'default'}>
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>{message.title}</AlertTitle>
          <AlertDescription>{message.description}</AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">Họ tên</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password..."
                  type="password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={'pt-4'}>
          <Button className={'w-full'} disabled={isLoading} type="submit">
            Tiếp tục <ArrowRightIcon className={'ml-2 w-4 h-4'} />
          </Button>
        </div>
        <div className={'pt-4'}>
          <Button
            variant="outline"
            className={'w-full'}
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              navigate('/auth/login')
            }}
          >
            <ArrowLeftIcon className={'ml-2 w-4 h-4'} /> Back
          </Button>
        </div>
      </form>
    </Form>
  );
}
