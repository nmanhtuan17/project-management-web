import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
// import {setSpaces} from "@/redux/slices/space.slice.ts";
// import SpaceApps from "@/views/space/components/apps.tsx";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import { loadProjects } from "@/redux/actions/project.action";
import { MainNav, ProjectSwitcher, UserNav, MainNavMobile, SubNav } from "@/views/project/components";

export default function MainLayout() {
  const dispatch = useAppDispatch();
  const { loggedIn } = useAppSelector(state => state.auth);
  const { projects, loaded } = useAppSelector(state => state.project);
  const currentSpace = useCurrentProject();
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const projectSlug = params.projectSlug;

  useEffect(() => {
    if (!loggedIn) {
      navigate('/auth/login');
    } else dispatch(loadProjects());
  }, [loggedIn]);

  useEffect(() => {
    if (!projectSlug || projectSlug === '') return navigate('/boarding');
    if (!loaded) return;
    if (!currentSpace) {
      navigate('/boarding');
      return;
    }
    // dispatch(setSpaces({
    //   currentSpaceProfile: currentSpace?.profile,
    // }))
  }, [projectSlug, loaded, projects]);
  if (!currentSpace) return <div className="flex justify-center items-center w-full h-full">
    <LoadingSpinner size={16} />
  </div>;

  return <>
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="border-b sticky top-0 left-0 right-0 bg-background">
        <div className="flex h-16 items-center px-4">
          {!!currentSpace && <MainNavMobile className="block sm:hidden" />}
          {!!currentSpace && <ProjectSwitcher />}
          {!!currentSpace && <MainNav className="mx-6 hidden sm:flex" />}
          <div className="ml-auto flex items-center space-x-4">
            {/* <ThemeSwitcher/> */}
            {!!currentSpace && <SubNav />}
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-grow flex-col min-h-0 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </div>
      <Dialog
        open={showCreateSpaceModal}
        onOpenChange={open => setShowCreateSpaceModal(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>It seems like you are not in any project</DialogTitle>
            <DialogDescription>
              Lost in projects? No worries, we had your back.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => navigate('/project/create')}>
              Create your project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </>
}
