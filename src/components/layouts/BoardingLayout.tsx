import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect } from "react";
import * as React from "react";
import { UserNav } from "@/views/project/components/user-nav.tsx";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";

export default function BoardingLayout() {
  const { loggedIn } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loaded } = useAppSelector(state => state.project);

  useEffect(() => {
    if (!loggedIn) {
      navigate('/auth/login');
    }
  }, [loggedIn]);

  return <div className={'w-full h-full flex'}>
    {loaded ? (
      <div className="flex justify-center items-center h-full w-full">
        <LoadingSpinner size={16} />
      </div>
    ) : <div className={'m-auto w-full max-w-[500px] py-8 space-y-4'}>
      <div className={'flex flex-row justify-between items-center'}>
        <div>
        </div>
        <UserNav />
      </div>
      <Outlet />
    </div>}
  </div>
}
