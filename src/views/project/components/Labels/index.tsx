import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/redux/store"

export const LabelsManage = () => {
  const { labels } = useAppSelector(state => state.project)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="">
          <p className="text-[14px] font-semibold">Project Labels</p>
          <p className="text-sm text-muted-foreground">
            Labels to applied to tasks
          </p>
        </div>
        {labels.length > 0 &&
          <Button variant="secondary">
            View all
          </Button>}
      </div>
      {!labels.length &&
        <Button variant="secondary" className="w-full">
          Add
        </Button>}
    </div>
  )
}