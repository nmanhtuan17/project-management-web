import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { useAppSelector } from "@/redux/store"
import dayjs from 'dayjs'
import { Plus, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { RecentTasks } from "../components/RecentTasks"
import { MilestonesSpace } from "../components/MilestonesSpace"
import { LabelsManage } from "../components"

export const ProjectOverview = () => {
  const { currentProject } = useCurrentProject()
  const { members } = useAppSelector(state => state.project)
  const navigate = useNavigate()


  return (
    <div className="h-full flex flex-col">
      <div className="flex p-4 justify-between items-center">
        <div className="flex flex-row gap-4 items-center">
          <Avatar className="w-12 h-12 !rounded-lg">
            <AvatarImage src={currentProject.avatar || `https://avatar.vercel.sh/${currentProject.name}.png`} alt="@shadcn" />
            <AvatarFallback className="rounded-lg">{currentProject?.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="!mt-0">
            <p className="text-lg font-bold ">
              {currentProject.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {members.length} thành viên
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {dayjs(currentProject.createdAt).from(dayjs())}
          </p>
          <Button
            onClick={() => {
              navigate(`/projects/${currentProject.slug}/setting`)
            }}
            variant="secondary"
            className="px-2 w-8 h-8">
            <Settings size={18} />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex-1 grid grid-cols-5">
        <div className="col-span-4 flex flex-col">
          <MilestonesSpace />
          <Separator />
          <RecentTasks />
        </div>
        <div className="col-span-1 p-4 border-l">
          <LabelsManage />
        </div>
      </div>
    </div>
  )
}