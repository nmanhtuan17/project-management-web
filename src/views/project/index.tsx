import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent, TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import apiService from "@/services/api.service.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Download } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx";
// import {useFloatingWindowCtx} from "@/components/providers/floating-window-provider.tsx";
// import EmailComposer from "@/components/layouts/components/email-composer.tsx";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import { ProjectMember } from "@/types/project";
import { CalendarDateRangePicker } from "@/components/common/DateRangePicker";
import useApi from "@/lib/hooks/useApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { cn } from "@/lib/utils";
import { loadProjectMembers } from "@/redux/actions/project.action";

export default function ProjectPage() {
  // const {createWindow} = useFloatingWindowCtx();
  const currentProject = useCurrentProject();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const { members } = useAppSelector(state => state.project)

  useEffect(() => {
    if (currentProject._id) {
      console.log(currentProject)
      dispatch(loadProjectMembers(currentProject._id))
    }
  }, [currentProject]);

  return (
    <div className={'flex-1 flex flex-row'}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch"
        onLayout={(sizes: number[]) => {
          setIsCollapsed(sizes[1] < 15)
        }}
      >
        <ResizablePanel>
          <div className={'flex-1 p-4 md:p-8'}>
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between mb-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <CalendarDateRangePicker />
                <Button className="w-full">
                  <Download className="block sm:hidden" size={16} />
                  <span className="hidden sm:block">Download</span>
                </Button>
              </div>
            </div>
            {/* <Button onClick={() => {
              createWindow({
                title: "Compose email",
                children: <EmailComposer/>,
                width: 300,
                height: 400,
              })
            }}>
              Create window
            </Button> */}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={20}
          collapsedSize={15}
          collapsible={true}
          minSize={15}
          maxSize={20}
          className={cn(
            isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div>
            <div className={'px-4 py-2 font-bold'}>
              {!isCollapsed && 'Contacts'}
            </div>
            {members.map(mem => (!isCollapsed ?
              <div
                className={'px-4 py-2 flex flex-row items-center gap-2 hover:bg-muted cursor-pointer'}
                key={mem._id}
              >
                <Avatar>
                  <AvatarImage src={mem.user.avatar} />
                  <AvatarFallback>{mem.user.fullName.split(' ')?.pop()?.charAt(0)?.toUpperCase() || '!'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className={'font-semibold text-sm'}>
                    {mem.user.fullName}
                  </div>
                  <div className={'text-xs'}>
                    {mem.role}
                  </div>
                </div>
              </div>
              :
              <div className={'px-4 py-2 flex flex-row items-center justify-center hover:bg-muted cursor-pointer'}>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Avatar>
                        <AvatarImage src={mem.user.avatar} />
                        <AvatarFallback>{mem.user.fullName.split(' ')?.pop()?.charAt(0)?.toUpperCase() || '!'}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className={'text-sm'}>
                        {mem.user.fullName}
                      </div>
                      <div className={'text-xs'}>
                        {mem.role}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

