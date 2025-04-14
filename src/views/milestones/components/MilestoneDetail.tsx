import IframeDocs from "@/components/common/IframeDocs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Milestone } from "@/types/project"
import { checkTimeExpiration } from "@/utils";
import dayjs from "dayjs";
import { Calendar, Ellipsis } from "lucide-react";

interface Props {
  milestone: Milestone
}

export const MilestoneDetail = ({ milestone }: Props) => {
  const { expired, remainingDays } = checkTimeExpiration(milestone.time);

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
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              Đóng
            </DropdownMenuItem>
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