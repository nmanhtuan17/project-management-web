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
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { cn } from "@/lib/utils";
import { getStatistics, loadProjectMembers } from "@/redux/actions/project.action";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadRecentTask } from "@/redux/actions/task.action";
import { Label } from "@/components/ui/label";
import { RecentTaskItem } from "./components/RecentTaskItem";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { ProjectSpace } from "./components/ProjectSpace";
import { ProfileCard } from "./components/ProfileCard";
import { ProjectList } from "./components/ProjectList";

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const { members } = useAppSelector(state => state.project)
  const { user } = useAppSelector(state => state.auth)
  const { width } = useWindowSize();
  const isMobileScreen = width < 768;
  const { currentProject, profile } = useCurrentProject();

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
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Trang chủ</h2>
            </div>
            <div className="flex flex-1 gap-4 pb-4">
              <div className="space-y-4">
                <ProfileCard />
              </div>
              <div className="flex flex-col flex-1 space-y-4">
                <ProjectList />
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

