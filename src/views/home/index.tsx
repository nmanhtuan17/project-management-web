import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent, TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { ArrowUpRight, CalendarClock, Download, Layers, ListChecks, PictureInPicture2, UserPlus } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx";
import { CalendarDateRangePicker } from "@/components/common/DateRangePicker";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { cn } from "@/lib/utils";
import { loadProjectMembers } from "@/redux/actions/project.action";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadRecentTask } from "@/redux/actions/task.action";
import { Label } from "@/components/ui/label";
import { RecentTaskItem } from "./components/RecentTaskItem";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { ProjectSpace } from "./components/ProjectSpace";

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const { members } = useAppSelector(state => state.project)
  const { user } = useAppSelector(state => state.auth)
  const { width } = useWindowSize();
  const isMobileScreen = width < 768;
  const { currentProject, profile, setCurrentProject, setProfile } = useCurrentProject();


  useEffect(() => {
    if (currentProject._id) {
      dispatch(loadProjectMembers(currentProject._id)).then(() => {
        dispatch(loadRecentTask({ projectId: currentProject._id, assignee: profile._id }))
      })
    }
  }, [currentProject._id]);

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
          <div className="flex flex-col flex-1 px-16 h-full">
            <div className={'py-4 md:py-6'}>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="flex flex-1 gap-4 pb-4">
              <div className="space-y-4">
                <Card className="w-[320px]">
                  <CardContent className="flex flex-col items-center justify-center p-4 pb-0 mt-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user?.avatar} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-lg mt-3">{user?.fullName}</p>
                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                    <Separator className="mt-2" />
                    <Button variant="link" className="w-full">
                      View profile
                      <ArrowUpRight size={18} />
                    </Button>
                  </CardContent>
                </Card>
                <Card className="w-[320px]">
                  <CardHeader>
                    <CardTitle>Activities</CardTitle>
                    <CardDescription>Your recent activities</CardDescription>
                    <Separator className="mt-2" />
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-4 pb-0 mt-4">

                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col flex-1 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="">
                    <CardHeader className='flex flex-row items-center justify-between pb-3'>
                      <CardTitle className="text-lg">Unresolve Tasks</CardTitle>
                      <Layers />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        16
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Statistics
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="">
                    <CardHeader className='flex flex-row items-center justify-between pb-3'>
                      <CardTitle className="text-lg">Overdue Tasks</CardTitle>
                      <CalendarClock />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        2
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Statistics
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="">
                    <CardHeader className='flex flex-row items-center justify-between pb-3'>
                      <CardTitle className="text-lg">Ongoing Tasks</CardTitle>
                      <PictureInPicture2 />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        16
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Statistics
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <ProjectSpace />
              </div>
            </div>
          </div>
        </ResizablePanel>
        {currentProject._id && <>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={isMobileScreen ? 5 : 15}
            collapsedSize={isMobileScreen ? 5 : 15}
            collapsible={true}
            minSize={isMobileScreen ? 5 : 15}
            maxSize={isMobileScreen ? 5 : 15}
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
                    <AvatarImage src={mem.user?.avatar} />
                    <AvatarFallback>{mem.user?.fullName.split(' ')?.pop()?.charAt(0)?.toUpperCase() || '!'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className={'font-semibold text-sm'}>
                      {mem.user?.fullName}
                    </div>
                    <div className={'text-xs'}>
                      {mem?.role}
                    </div>
                  </div>
                </div>
                :
                <div key={mem._id} className={'px-4 py-2 flex flex-row items-center justify-center hover:bg-muted cursor-pointer'}>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Avatar>
                          <AvatarImage src={mem?.user?.avatar} />
                          <AvatarFallback>{mem?.user?.fullName.split(' ')?.pop()?.charAt(0)?.toUpperCase() || '!'}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className={'text-sm'}>
                          {mem?.user?.fullName}
                        </div>
                        <div className={'text-xs'}>
                          {mem?.role}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>))}
            </div>
          </ResizablePanel>
        </>
        }
      </ResizablePanelGroup>
    </div>
  )
}

