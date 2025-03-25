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

const verifyAccountSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(6),
  captcha: z.string().optional(),
});

type VerifyAccountFormValues = z.infer<typeof verifyAccountSchema>

export default function VerifyPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const initEmail = urlParams.get('email');
  const initCode = urlParams.get('code');

  const form = useForm({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      email: initEmail,
      code: initCode,
      captcha: '',
    }
  });

  const processData = (values: VerifyAccountFormValues) => {
    apiService.post(`/auth/verify`, values).then(response => {
      toast.success(response.message);
      navigate('/auth/login');
    }).catch(err => {
      toast.error(err.message);
    });
  }

  const processResend = (e: any) => {
    // TODO: process resend
    e.preventDefault();
    const { email, captcha } = form.getValues();
    if (!email) {
      form.setError('email', {
        message: 'INVALID_EMAIL'
      });
    } else {
      apiService.post(`/auth/resend`, {
        email,
        captcha
      }).then(response => {
        toast.success(response.message);
      }).catch(err => {
        toast.error(err.message);
      })
    }
  }

  return <>
    <Form {...form}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Xác thực tài khoản
        </h1>
        <p className="text-sm text-muted-foreground">
          Xác thực tài khoản của bạn để tiếp tục...
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
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mã xác thực
              </FormLabel>
              <FormControl>
                <Input placeholder="Code..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={'flex flex-row gap-2 mt-4'}>
          <Button className={'flex-1'} variant={'outline'} onClick={processResend}>
            Gửi lại mã
          </Button>
          <Button type={'submit'} className={'flex-1'}>
            Xác thực
          </Button>
        </div>
      </form>
    </Form>
  </>
}
