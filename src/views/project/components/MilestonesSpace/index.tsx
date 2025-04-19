import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/redux/store"
import { Milestone } from "@/types/project"
import { checkTimeExpiration } from "@/utils"
import { MilestonesList } from "@/views/milestones/components/MilestonesList"
import dayjs from "dayjs"
import { Calendar, Plus } from "lucide-react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

export const MilestonesSpace = () => {
  const { setDialogOpen } = useDialogContext()
  const { milestones } = useAppSelector(state => state.project)
  const navigate = useNavigate()
  const { currentProject } = useCurrentProject()

  const filterMilestones = useMemo(() => milestones.filter(m => !m.closed), [milestones])

  const renderItem = (milestone: Milestone) => {
    const { expired, remainingDays } = checkTimeExpiration(milestone.time);

    return (
      <div
        key={milestone._id}
        onClick={() => {
          navigate(`/projects/${currentProject.slug}/milestones`, { state: { milestone: milestone } })
        }}
        className="bg-muted p-2 px-4 rounded-md">
        <div className="flex items-center justify-between">
          <div className="font-semibold hover:underline cursor-pointer">
            {milestone.title}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-1">
              <Calendar size={12} />
              <div className="text-muted-foreground font-medium text-[12px]">
                {`${dayjs(milestone.time.from).format('D MMMM, YYYY')} - ${dayjs(milestone.time.to).format('D MMMM, YYYY')}`}
              </div>
              <div className={cn("text-muted-foreground font-medium text-[12px] ml-1 rounded-full px-2", expired ? 'bg-red-300 text-white' : 'bg-green-300')}>
                {expired ? 'quá hạn' : `hết hạn trong ${remainingDays}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex p-4 pb-0 items-center justify-between">
        <div className="">
          <p className="text-[14px] font-semibold">Milestones</p>
          <p className="text-sm text-muted-foreground">
            Sử dụng các mốc quan trọng để theo dõi các vấn đề và hợp nhất các yêu cầu trong một khoảng thời gian cố định
          </p>
        </div>
        <Button
          onClick={() => {
            setDialogOpen('createMilestone', true)
          }}
          variant="secondary"
          className="px-2 w-8 h-8">
          <Plus size={18} />
        </Button>
      </div>
      <div className="flex flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-1 flex-col p-4 gap-3">
          {filterMilestones.map(m => renderItem(m)
          )}
        </div>
      </div>
    </div>
  )
}