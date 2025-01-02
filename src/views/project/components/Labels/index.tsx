import { Button } from "@/components/ui/button"

export const LabelsManage = () => {

  return (
    <div className="flex items-center justify-between">
      <div className="">
        <p className="text-[14px] font-semibold">Project Labels</p>
        <p className="text-sm text-muted-foreground">
          Labels to applied to tasks
        </p>
      </div>
      <Button variant="secondary">
        View all
      </Button>
    </div>
  )
}