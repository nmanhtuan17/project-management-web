import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect } from "react";
import { loadProjects } from "@/redux/actions/project.action";
import { UserNav } from "@/components/nav/UserNav";

export default function BoardingLayout() {
  const { loggedIn, tokens } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (!loggedIn) {
      navigate('/auth/login');
    } else {
      dispatch(loadProjects())
    }
  }, [loggedIn]);

  return (
    <div className={'w-full h-full flex'}>
      <div className={'m-auto w-full max-w-[500px] py-8 space-y-4'}>
        <div className={'flex flex-row justify-between items-center'}>
          <div>
          </div>
          <UserNav />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
