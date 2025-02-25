import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const Milestones = () => {
  const { setDialogOpen } = useDialogContext()

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between">
        <div className="">
          <p className="text-[14px] font-semibold">Milestones</p>
          <p className="text-sm text-muted-foreground">
            Use milestones to track issues and merge requests over a fixed period of time
          </p>
        </div>
        <Button
          onClick={() => {
            // navigate(`/projects/${currentProject.slug}/setting`)
            setDialogOpen('createMilestone', true)
          }}
          variant="secondary"
          className="px-2 w-8 h-8">
          <Plus size={18} />
        </Button>
      </div>
    </div>
  )
}