import { Separator } from "@/components/ui/separator";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { MilestonesHeader } from "@/views/milestones/components/MilestonesHeader";
import { useEffect, useLayoutEffect, useState } from "react";
import { MilestonesList } from "./components/MilestonesList";
import { Milestone } from "@/types/project";
import { MilestoneDetail } from "@/views/milestones/components/MilestoneDetail";
import { useLocation } from "react-router-dom";
import useDebounce from "@/lib/hooks/useDebouce";
import { loadMilestones } from "@/redux/actions/project.action";

export const Milestones = () => {
  const location = useLocation()
  const { currentProject } = useCurrentProject();
  const dispatch = useAppDispatch();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | undefined>();
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const deb = useDebounce(query, 300)

  useEffect(() => {
    handleLoadMilestones()
  }, [deb, status]);

  useLayoutEffect(() => {
    setSelectedMilestone(location.state?.milestone)
  }, [location.state])

  const handleLoadMilestones = () => {
    let closed;
    if (status === 'all') closed = undefined;
    if (status === 'open') closed = false;
    if (status === 'closed') closed = true;
    console.log(deb)

    dispatch(loadMilestones({ projectId: currentProject._id, filter: { query: deb, closed } }))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Milestones</h3>
          <p className="text-sm text-muted-foreground">
            Một giai đoạn xác định một phần của dự án của bạn
          </p>
        </div>
        <MilestonesHeader
          onChangeText={(text) => setQuery(text)}
          onSelectChange={(s) => setStatus(s)}
        />
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