import { Outlet, useLocation, useParams } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ProjectDetailNav } from "@/views/tasks/nav/ProjectDetailNav";
import { CheckCheck, Component, Milestone, Settings, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { useAppDispatch } from "@/redux/store";
import { loadProjectLabels } from "@/redux/actions/project.action";


export function ProjectLayout(props: any) {
  const { defaultLayout = [265, 440, 655], defaultCollapsed = false, navCollapsedSize } = props;
  const { currentProject } = useCurrentProject()
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadProjectLabels(currentProject._id))
  }, [currentProject]);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch"
        onLayout={(sizes: number[]) => {
          setIsCollapsed((sizes[0] < 15))
        }}
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={15}
          className={cn(
            isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <ProjectDetailNav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Overview",
                label: "",
                icon: Component,
                variant: pathname.includes('overview') ? 'default' : 'ghost',
                path: `/projects/${currentProject.slug}/overview`
              },
              {
                title: "Tasks",
                label: "",
                icon: CheckCheck,
                variant: pathname.includes('tasks') ? 'default' : 'ghost',
                path: `/projects/${currentProject.slug}/tasks/performance`
              },
              {
                title: "Milestones",
                label: "",
                icon: Milestone,
                variant: pathname.includes('milestones') ? 'default' : 'ghost',
                path: `/projects/${currentProject.slug}/milestones`
              },
              {
                title: "Members",
                label: "",
                icon: Users,
                variant: pathname.includes('members') ? 'default' : 'ghost',
                path: `/projects/${currentProject.slug}/members`
              },
              {
                title: "Setting",
                label: "",
                icon: Settings,
                variant: pathname.includes('setting') ? 'default' : 'ghost',
                path: `/projects/${currentProject.slug}/setting`
              }
            ]}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}