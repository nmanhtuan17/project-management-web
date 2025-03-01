import { useDialogContext } from "@/components/providers/DialogProvider";
import { Button } from "@/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { loadMilestones } from "@/redux/actions/project.action";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { MilestonesHeader } from "@/views/milestones/components/MilestonesHeader";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";

export const Milestones = () => {
  const { openDialog } = useDialogContext();
  const { currentProject } = useCurrentProject();
  const dispatch = useAppDispatch();
  const { milestones } = useAppSelector(state => state.project)

  useEffect(() => {
    dispatch(loadMilestones(currentProject._id))
  }, [])

  console.log(milestones)


  return (
    <div className="h-full">
      <div className="p-4 flex flex-1 flex-col min-h-0 w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Milestones</h3>
          <p className="text-sm text-muted-foreground">
            A phase defines a part of your project
          </p>
        </div>
        <MilestonesHeader />
      </div>
      <Separator />
      <div className="h-full flex-1 grid grid-cols-5">
        <div className="col-span-3 flex">
          <div className="flex-1">

          </div>
          <Separator orientation="vertical" />
        </div>
        <div className="col-span-2">

        </div>
      </div>
    </div>
  )
}