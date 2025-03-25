import IframeDocs from "@/components/common/IframeDocs";
import { cn } from "@/lib/utils";
import { Milestone } from "@/types/project"
import { checkTimeExpiration } from "@/utils";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";

interface Props {
  milestone: Milestone
}

export const MilestoneDetail = ({ milestone }: Props) => {
  const { expired, remainingDays } = checkTimeExpiration(milestone.time);

  if (!milestone) return;
  return (
    <div className="p-4">
      <div className="font-bold text-xl">
        {milestone.title}
      </div>
      <div className="flex flex-1 items-center gap-1">
        <Calendar size={12} />
        <div className="text-muted-foreground font-medium text-[12px]">
          {`${dayjs(milestone.time.from).format('MMMM D, YYYY')} - ${dayjs(milestone.time.to).format('MMMM D, YYYY')}`}
        </div>
        <div className={cn("text-muted-foreground font-medium text-[12px] ml-1 rounded-full px-2", expired ? 'bg-red-300 text-white' : 'bg-green-300')}>
          {expired ? 'quá hạn' : `hết hạn trong ${remainingDays}`}
        </div>
      </div>
      <div className="mt-4">
        <div className="font-semibold text-[16px]">
          Description
        </div>
        <IframeDocs content={milestone.description} />
      </div>
    </div>
  )
}