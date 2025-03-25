import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { useAppSelector } from "@/redux/store"
import { useNavigate } from "react-router-dom"

export const LabelsManage = () => {
  const { currentProject } = useCurrentProject()
  const { labels } = useAppSelector(state => state.project)
  const navigate = useNavigate()
  const { openDialog } = useDialogContext()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="">
          <p className="text-[14px] font-semibold">Nhãn</p>
          <p className="text-sm text-muted-foreground">
            Nhãn được áp dụng cho các công việc
          </p>
        </div>
        {labels.length > 0 &&
          <Button variant="secondary" onClick={() => navigate(`/projects/${currentProject.slug}/setting`)}>
            Chi tiết
          </Button>}
      </div>
      {!labels.length ?
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => openDialog('createLabelDialog')}
        >
          Thêm 
        </Button>
        :
        <div className="flex gap-2 flex-wrap">
          {labels.map(label => {
            return (
              <div key={label._id}
                className="rounded-sm px-2 text-white text-sm font-medium"
                style={{ backgroundColor: label.backgroundColor }}>
                {label.title}
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}