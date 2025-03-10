import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/redux/store"
import { Milestone } from "@/types/project"
import { MilestoneItem } from "@/views/milestones/components/MilestoneItem"

interface Props {
  selectedMilestone: Milestone;
  selectItem: (val: Milestone) => void;
}
export const MilestonesList = ({ selectItem, selectedMilestone }: Props) => {
  const { milestones } = useAppSelector(state => state.project)
  console.log(milestones)
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-1 flex-col p-4 gap-3">
        {milestones.map(m =>
          <MilestoneItem key={m._id}
            selectedItem={selectedMilestone && selectedMilestone._id}
            milestone={m}
            onClick={(milestone) => selectItem(milestone)} />)}
      </div>
    </ScrollArea>
  )
}