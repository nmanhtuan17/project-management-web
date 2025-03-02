import { Separator } from "@/components/ui/separator";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { loadMilestones } from "@/redux/actions/project.action";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { MilestonesHeader } from "@/views/milestones/components/MilestonesHeader";
import { useEffect, useLayoutEffect, useState } from "react";
import { MilestonesList } from "./components/MilestonesList";
import { Milestone } from "@/types/project";
import { MilestoneDetail } from "@/views/milestones/components/MilestoneDetail";
import { useLocation } from "react-router-dom";

export const Milestones = () => {
  const location = useLocation()
  const { currentProject } = useCurrentProject();
  const dispatch = useAppDispatch();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | undefined>();


  useLayoutEffect(() => {
    setSelectedMilestone(location.state?.milestone)
  }, [location.state])


  return (
    <div className="h-full flex flex-col">
      <div className="p-4 w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Milestones</h3>
          <p className="text-sm text-muted-foreground">
            A phase defines a part of your project
          </p>
        </div>
        <MilestonesHeader />
      </div>
      <Separator />
      <div className="grid grid-cols-5 flex-1 overflow-y-auto">
        <div className="col-span-3 flex flex-1 min-h-0 overflow-y-auto" >
          <MilestonesList
            selectedMilestone={selectedMilestone}
            selectItem={(val) => {
              setSelectedMilestone(val)
            }} />
        </div>
        <div className="col-span-2 flex">
          <Separator orientation="vertical" />
          {selectedMilestone && <MilestoneDetail milestone={selectedMilestone} />}
        </div>
      </div>
    </div>
  )
}