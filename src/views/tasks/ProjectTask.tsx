import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect } from "react";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import { useDialogContext } from "@/components/providers/DialogProvider";
import TasksBoard from "@/views/tasks/TaskBoard";
import TasksListHeader from "@/views/tasks/components/TasksListHeader";
import { Outlet, useLocation } from "react-router-dom";
import { ProjectDetailNav } from "@/views/tasks/nav/ProjectDetailNav";
import { CheckCheck, Component, Gauge, ListChecks, SquareKanban } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { loadTasks } from "@/redux/actions/task.action";

export default function ProjectTasks() {
  const { openDialog } = useDialogContext();
  const currentProject = useCurrentProject();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (currentProject._id) {
      dispatch(loadTasks(currentProject._id));
    }
  }, [currentProject._id]);

  return (

    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch"
      onLayout={(sizes: number[]) => {

      }}
    >
      <ResizablePanel
        defaultSize={265}
        // collapsedSize={navCollapsedSize}
        collapsible={false}
        minSize={15}
        maxSize={15}
      >
        <ProjectDetailNav
          isCollapsed={false}
          links={[
            {
              title: "Performance",
              label: "",
              icon: Gauge,
              variant: pathname.includes('performance') ? 'default' : 'ghost',
              path: `/projects/${currentProject.slug}/details/tasks/performance`
            },
            {
              title: "List",
              label: "",
              icon: ListChecks,
              variant: pathname.includes('list') ? 'default' : 'ghost',
              path: `/projects/${currentProject.slug}/details/tasks/list`
            },
            {
              title: "Board",
              label: "",
              icon: SquareKanban,
              variant: pathname.includes('kanban') ? 'default' : 'ghost',
              path: `/projects/${currentProject.slug}/details/tasks/kanban`
            }
          ]}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={440} minSize={30}>
        <div className="p-4 flex flex-col min-h-0 h-screen w-full">
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium">Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Manage tasks of each project
              </p>
            </div>
            <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
              <TasksListHeader className="p-0 border-none w-full lg:w-[400px]" />
              <Button
                onClick={() => {
                  openDialog("createTask");
                }}
                className="gap-1 w-full sm:w-auto" icon={<PlusIcon />}>Create Task</Button>
            </div>
          </div>
          <Outlet />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>

  )
}