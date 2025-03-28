import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect } from "react";
import { useDialogContext } from "@/components/providers/DialogProvider";
import TasksBoard from "@/views/tasks/TaskBoard";
import TasksListHeader from "@/views/tasks/components/TasksListHeader";
import { Outlet, useLocation } from "react-router-dom";
import { ProjectDetailNav } from "@/views/tasks/nav/ProjectDetailNav";
import { ChartNoAxesGantt, CheckCheck, Component, Gauge, ListChecks, SquareKanban } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { loadTasks } from "@/redux/actions/task.action";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

export default function TaskLayout() {
  const { openDialog } = useDialogContext();
  const { currentProject } = useCurrentProject();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (currentProject._id) {
      dispatch(loadTasks({projectId: currentProject._id}));
    }
  }, [currentProject._id]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className=" items-stretch"
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
              title: "Hiệu suất",
              label: "",
              icon: Gauge,
              variant: pathname.includes('performance') ? 'default' : 'ghost',
              path: `/projects/${currentProject.slug}/tasks/performance`
            },
            {
              title: "Biểu đồ",
              label: "",
              icon: ChartNoAxesGantt,
              variant: pathname.includes('timeline') ? 'default' : 'ghost',
              path: `/projects/${currentProject.slug}/tasks/timeline`
            },
            {
              title: "Danh sách",
              label: "",
              icon: ListChecks,
              variant: pathname.includes('list') ? 'default' : 'ghost',
              path: `/projects/${currentProject.slug}/tasks/list`
            },
            {
              title: "Kanban",
              label: "",
              icon: SquareKanban,
              variant: pathname.includes('kanban') ? 'default' : 'ghost',
              path: `/projects/${currentProject.slug}/tasks/kanban`
            }
          ]}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={440} minSize={30}>
        <div className="p-4 flex flex-col h-full w-full">
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium">Quản lý công việc</h3>
              <p className="text-sm text-muted-foreground">
                Quản lý công việc trong dự án của bạn
              </p>
            </div>
            <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
              <TasksListHeader className="p-0 border-none w-full " />
              <Button
                onClick={() => {
                  openDialog("createTaskDialog");
                }}
                className="gap-1 w-full sm:w-auto" icon={<PlusIcon />}>Thêm công việc</Button>
            </div>
          </div>
          <Outlet />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>

  )
}