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

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ show: boolean, title?: string, description?: string, error?: boolean }>({
    show: false,
    error: false,
  });

  const navigate = useNavigate();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    apiService.callApi('POST', '/auth/register', data)
      .then((response) => {
        // redirect
        setMessage({
          show: true,
          title: 'SUCCESS',
          description: response.message,
          error: false,
        })
        setTimeout(() => {
          navigate(`/auth/verify?email=${data.email}&src=registration`);
        }, 500);
      })
      .catch(err => {
        setMessage({
          error: true,
          show: true,
          title: 'Error',
          description: err.message,
        });
      }).finally(() => {
        setIsLoading(false);
      });
  }

  return <form className='space-y-2' onSubmit={onSubmit}>
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        Create account
      </h1>
    </div>
    <Alert hidden={!message.show} variant={message.error ? 'destructive' : 'default'}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{message.title}</AlertTitle>
      <AlertDescription>{message.description}</AlertDescription>
    </Alert>
    <div className="grid gap-1">
      <Label className="text-xs font-medium" htmlFor="fullName">
        Full name
      </Label>
      <Input
        id="fullName"
        placeholder="John Doe"
        name="fullName"
        autoCorrect="off"
      />
    </div>
    <div className="grid gap-1">
      <Label className="text-xs font-medium" htmlFor="email">
        Email
      </Label>
      <Input
        id="email"
        placeholder="email@example.com"
        name="email"
        type="email"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect="off"
      />
    </div>
    <div className="grid gap-1">
      <Label className="text-xs font-medium" htmlFor="password">
        Password
      </Label>
      <Input
        id="password"
        placeholder="Password..."
        name="password"
        type="password"
        autoCapitalize="none"
        autoCorrect="off"
      />
    </div>
    <div className={'pt-4'}>
      <Button className={'w-full'} disabled={isLoading}>
        Continue <ArrowRightIcon className={'ml-2 w-4 h-4'} />
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
}
