import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { GoogleLogin } from "@react-oauth/google";
import apiService from "@/services/api.service.ts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { setAuth } from "@/redux/slices/auth.slice";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { toast } from "sonner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ show: boolean, title?: string, description?: string }>({
    show: false,
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const navigate = useNavigate();
  const [hide, setHide] = useState<boolean>(true);
  const { reset } = useCurrentProject();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (!showLoginPassword) return setShowLoginPassword(true);
    const formData = new FormData(event.target as HTMLFormElement);
    setIsLoading(true);
    apiService.callApi('POST', '/auth/login', Object.fromEntries(formData), {}, true)
      .then(finalizeLogin)
      .catch(err => {
        setMessage({
          show: true,
          title: 'Error',
          description: err.message,
        });
      }).finally(() => {
        setIsLoading(false);
      });
  }

  const finalizeLogin = async (response: any) => {
    const { data } = response;
    const authRdr = localStorage.getItem('auth_rdr');
    if (authRdr) {
      localStorage.clear();
      location.href = authRdr + `#access_token=${encodeURI(data.access_token)}&refresh_token=${encodeURI(data.refresh_token)}`;
    } else {
      await apiService.setCredentials({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
      const { data: user } = await apiService.callApi('GET', '/users/me');
      dispatch(setAuth({
        loggedIn: true,
        tokens: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        },
        user
      }));
      reset();
      navigate('/')
    }
  }

  useEffect(() => {
    if (message.show) setTimeout(() => {
      setMessage({
        show: false,
      })
    }, 5000);
  }, [message.show]);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await apiService.post('http://localhost:3000/auth/google-login', {
        token: credentialResponse.credential,
      });
      finalizeLogin(res)
    } catch (error) {
      toast.error('Lỗi khi đăng nhập với Google')
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Alert hidden={!message.show} variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>{message.title}</AlertTitle>
        <AlertDescription>{message.description}</AlertDescription>
      </Alert>
      <div className={'grid gap-2'}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            toast.error('Đăng nhập thất bại')
          }} >

        </GoogleLogin>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Hoặc
          </span>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {showLoginPassword && (
            <>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  name="email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Mật khẩu
                </Label>
                <div className={'flex items-center relative'}>
                  <Input
                    id="password"
                    placeholder="Password..."
                    name="password"
                    type={hide ? 'password' : 'text'}
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  {hide ? (
                    <EyeOff
                      className={'w-4 h-4 absolute right-2 cursor-pointer text-foreground dark:text-black'}
                      onClick={() => setHide(!hide)} />
                  ) : (
                    <Eye
                      className={'w-4 h-4 absolute right-2 cursor-pointer text-foreground dark:text-black'}
                      onClick={() => setHide(!hide)} />
                  )}
                </div>
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Đăng nhập
            </Button>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-sm text-muted-foreground text-center">
              Bạn chưa có tài khoản?
              <Link to='/auth/register' className="text-sm">Đăng ký</Link>
            </span>
            <span className="text-sm text-muted-foreground text-center">
              <Link to='/auth/reset-password' className="text-sm">Quên mật khẩu?</Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}
