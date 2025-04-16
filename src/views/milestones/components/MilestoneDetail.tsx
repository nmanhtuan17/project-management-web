import IframeDocs from "@/components/common/IframeDocs";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { cn } from "@/lib/utils";
import { loadMilestones } from "@/redux/actions/project.action";
import { useAppDispatch } from "@/redux/store";
import apiService from "@/services/api.service";
import { Milestone } from "@/types/project"
import { checkTimeExpiration } from "@/utils";
import { elementFromString } from "@tiptap/core";
import dayjs from "dayjs";
import { Calendar, Ellipsis } from "lucide-react";

interface Props {
  milestone: Milestone
}

export const MilestoneDetail = ({ milestone }: Props) => {
  const { expired, remainingDays } = checkTimeExpiration(milestone.time);
  const { currentProject } = useCurrentProject()
  const { setDialogOpen } = useDialogContext()
  const dispatch = useAppDispatch()

  const closeDialog = () => {
    setDialogOpen('confirmDialog', false)
  }

  const handleClose = async () => {
    try {
      const res = await apiService.put(`projects/${currentProject._id}/milestones/${milestone._id}`, {
        closed: true
      })
      dispatch(loadMilestones({ projectId: currentProject._id, filter: { query: '' } }))
    } catch (error) {
      console.log(error)
    } finally {
      closeDialog()
    }
  }
  const handleReopen = async () => {
    try {
      const res = await apiService.put(`projects/${currentProject._id}/milestones/${milestone._id}`, {
        closed: false
      })
      dispatch(loadMilestones({ projectId: currentProject._id, filter: { query: '' } }))
    } catch (error) {
      console.log(error)
    } finally {
      closeDialog()
    }
  }

  const onClose = () => {
    setDialogOpen('confirmDialog', true, {
      element: <div>
        <p>
          Bạn chắc chắn muốn đóng milestone?
        </p>
        <div className=" flex gap-2 justify-end">
          <Button onClick={closeDialog} variant="secondary">
            Hủy
          </Button>
          <Button onClick={handleClose} variant="destructive">
            Xác nhận
          </Button>
        </div>
      </div>
    })
  }

  const onReopen = () => {
    setDialogOpen('confirmDialog', true, {
      element: <div>
        <p>
          Bạn chắc chắn muốn mở lại milestone này?
        </p>
        <div className=" flex gap-2 justify-end">
          <Button onClick={closeDialog} variant="secondary">
            Hủy
          </Button>
          <Button onClick={handleReopen} variant="destructive">
            Xác nhận
          </Button>
        </div>
      </div>
    })
  }

  if (!milestone) return;
  return (
    <div className="p-4 flex-1">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">
          {milestone.title}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2 outline-none">
              <Ellipsis size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {/* <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Cập nhật quyền
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Quản lý</DropdownMenuItem>
                  <DropdownMenuItem>Nhân viên</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub> */}
            <DropdownMenuSeparator />
            {!milestone.closed ? <DropdownMenuItem onClick={onClose} className="text-red-600 focus:text-red-600">
              Đóng
            </DropdownMenuItem>
              :
              <DropdownMenuItem onClick={onReopen} className="text-blue-600 focus:text-blue-600">
                Mở lại
              </DropdownMenuItem>
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-1 items-center gap-1">
        <Calendar size={12} />
        <div className="text-muted-foreground font-medium text-[12px]">
          {`${dayjs(milestone.time.from).format('D MMMM, YYYY')} - ${dayjs(milestone.time.to).format('D MMMM, YYYY')}`}
        </div>
        {milestone?.closed ?
          <div className={cn("text-muted-foreground font-medium text-[12px] ml-1 rounded-full px-2", 'bg-orange-400')}>
            Đã đóng
          </div>
          :
          <div className={cn("text-muted-foreground font-medium text-[12px] ml-1 rounded-full px-2", expired ? 'bg-red-300 text-white' : 'bg-green-300')}>
            {expired ? 'quá hạn' : `hết hạn trong ${remainingDays}`}
          </div>
        }
      </div>
      <div className="mt-4">
        <div className="font-semibold text-[16px]">
          Mô tả
        </div>
        <IframeDocs content={milestone.description} />
      </div>
    </div>
  )
}