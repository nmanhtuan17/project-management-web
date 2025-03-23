import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { ListChecks, UserPlus, Users } from "lucide-react";
import { RecentTaskItem } from "../RecentTaskItem";
import { useAppSelector } from "@/redux/store";
import { useNavigate } from "react-router-dom";

export const ProjectSpace = () => {
  const { currentProject } = useCurrentProject();
  const { recentTasks } = useAppSelector(state => state.task)
  const { members } = useAppSelector(state => state.project)
  const navigate = useNavigate()

  if (!currentProject._id) return (
    <p className="text-lg font-semibold text-muted-foreground">Select project to continue...</p>
  )
  return (
    <Card className="flex-1">
      <CardHeader className='pb-3 flex flex-row gap-4 items-center mt-0 justify-between'>
        <div className="flex flex-row gap-4 items-center">
          <Avatar className="w-12 h-12 !rounded-lg">
            <AvatarImage src={currentProject.avatar || `https://avatar.vercel.sh/${currentProject.name}.png`} alt="@shadcn" />
            <AvatarFallback className="rounded-lg">{currentProject?.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="!mt-0 cursor-pointer" onClick={() => navigate(`/projects/${currentProject.slug}/overview`)}>
            <p className="text-lg font-bold ">
              {currentProject.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {members.length} members
            </p>
          </div>
        </div>
        <div className="space-x-4">
          <Button onClick={() => {
            navigate(`/projects/${currentProject.slug}/overview`)
          }}>
            <ListChecks size={18} className="mr-2" />
            Tasks
          </Button>
          <Button onClick={() => {
            navigate(`/projects/${currentProject.slug}/members`)
          }}>
            <Users size={18} className="mr-2" />
            Member
          </Button>
        </div>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent>
        <div>
          <Label>Recent Task</Label>
          {recentTasks.length > 0 ?
            <div className="gap-4 mt-2 grid grid-cols-4">
              {
                recentTasks.map(task => <RecentTaskItem key={task._id} task={task} />)

              }
            </div>
            :
            <p className="text-muted-foreground font-medium">You haven't had any tasks recently.</p>
          }
        </div>
      </CardContent>
    </Card>
  )
}