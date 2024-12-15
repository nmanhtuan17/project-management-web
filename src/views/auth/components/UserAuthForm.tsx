import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
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

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ show: boolean, title?: string, description?: string }>({
    show: false,
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const navigate = useNavigate();
  const [hide, setHide] = useState<boolean>(true);

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

  // useGoogleOneTapLogin({
  //   onSuccess: credentialResponse => {
  //     const {credential} = credentialResponse;
  //     apiService.authSso('google', {
  //       access_token: credential,
  //       redirect_uri: location.origin + '/oauth/google',
  //     }).then(finalizeLogin).catch(err => {
  //       setMessage({
  //         show: true,
  //         title: 'Error',
  //         description: err.message,
  //       });
  //     }).finally(() => {
  //       setIsLoading(false);
  //     });
  //   },
  //   onError: () => {
  //     console.log('Login Failed');
  //   },
  // });

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
      const {data: user} = await apiService.callApi('GET', '/users/me');
      dispatch(setAuth({
        loggedIn: true,
        tokens: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        },
        user
      }));
      navigate('/')
    }
  }

  // const googleLogin = useGoogleLogin({
  //   flow: 'auth-code',
  //   redirect_uri: location.origin + '/oauth/google',
  //   onSuccess: tokenResponse => {
  //     const code = tokenResponse.code;
  //     setIsLoading(true);
  //     apiService.authSso('google', {
  //       code,
  //       redirect_uri: 'postmessage'
  //     }).then(finalizeLogin).catch(err => {
  //       setMessage({
  //         show: true,
  //         title: 'Error',
  //         description: err.message,
  //       });
  //     }).finally(() => {
  //       setIsLoading(false);
  //     });
  //   },
  //   onError() {
  //     setIsLoading(false);
  //   },
  //   onNonOAuthError() {
  //     setIsLoading(false);
  //   }
  // });

  useEffect(() => {
    if (message.show) setTimeout(() => {
      setMessage({
        show: false,
      })
    }, 5000);
  }, [message.show]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Alert hidden={!message.show} variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>{message.title}</AlertTitle>
        <AlertDescription>{message.description}</AlertDescription>
      </Alert>
      <div className={'grid gap-2'}>
        <Button
          icon={<Icons.google className="mr-2 h-4 w-4" />}
          variant="outline" type="button"
          onClick={() => {
            setIsLoading(true);
            // googleLogin();
          }}
          loading={isLoading}
        >
          Continue with Google
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
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
                  Password
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
              Sign In with Email
            </Button>
          </div>
          <div className="grid gap-2">
            <span className="text-sm text-muted-foreground text-center">
              You do not have account?
              <Link to='/auth/register' className="text-sm">Create account</Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}
