import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { setAuth } from "@/redux/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import apiService from "@/services/api.service";
import { ReactNode, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const AuthProvider = () => {
  const dispatch = useAppDispatch();
  const { tokens, loggedIn } = useAppSelector(state => state.auth);
  const [authLoaded, setAuthLoaded] = useState(false);
  const navigate = useNavigate();
  const {currentProject} = useCurrentProject();
  useEffect(() => {
    if (loggedIn && tokens.access_token) {
      apiService.setCredentials({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      })
        .then(() => setAuthLoaded(true))
        .catch(err => {
          dispatch(setAuth({
            loggedIn: false,
          }))
          setAuthLoaded(true);
        });
    } else {
      setAuthLoaded(true);
      dispatch(setAuth({
        loggedIn: false,
      }))
      setAuthLoaded(true);
      navigate('/auth/login')
    }
  }, [loggedIn, tokens]);
  if (!authLoaded) return <div className="flex justify-center items-center w-full h-full">
    <LoadingSpinner size={16} />
  </div>;
  return <>
    <Outlet />
  </>;
}