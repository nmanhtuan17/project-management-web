import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect } from "react";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { loadTasks } from "@/redux/actions/task.action";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { MemberItem } from "@/views/member/components/MemberItem";

export function MemberPage() {
  const { openDialog } = useDialogContext();
  const { currentProject } = useCurrentProject();
  const dispatch = useAppDispatch();
  const { members } = useAppSelector(state => state.project)

  useEffect(() => {
    if (currentProject._id) {
      dispatch(loadTasks(currentProject._id));
    }
  }, [currentProject._id]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch"
      onLayout={(sizes: number[]) => {

      }}
    >
      <ResizablePanel defaultSize={440} minSize={30}>
        <div className="p-4 flex flex-col min-h-0  w-full">
          <div className="flex justify-between items-center">
            <div className="mb-6">
              <h3 className="text-lg font-medium">Members</h3>
              <p className="text-sm text-muted-foreground">
                Members can be added by project owners
              </p>
            </div>
            <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  openDialog("inviteMember");
                }}
                className="gap-1 w-full sm:w-auto" icon={<PlusIcon />}>Invite</Button>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {
              members.map(mem => (<MemberItem key={mem._id} member={mem} />))
            }
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>

  )
}