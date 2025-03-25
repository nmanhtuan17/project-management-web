import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Milestone } from "@/types/project"
import { checkTimeExpiration } from "@/utils";
import { formatDate } from "date-fns"
import dayjs from "dayjs"
import { Calendar, Dot } from "lucide-react";

interface Props {
  milestone: Milestone;
  selectedItem: string;
  onClick?: (milestone: Milestone) => void;
}

export const MilestoneItem = ({ milestone, selectedItem, onClick }: Props) => {
  const { expired, remainingDays } = checkTimeExpiration(milestone.time);

  return <div
    onClick={() => onClick(milestone)}
    className={cn("bg-muted p-4 rounded-md", selectedItem === milestone._id && 'border shadow-sm')}>
    <div className="">
      <div className="font-semibold hover:underline cursor-pointer">
        {milestone.title}
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-1">
        <Calendar size={12} />
        <div className="text-muted-foreground font-medium text-[12px]">
          {`${dayjs(milestone.time.from).format('MMMM D, YYYY')} - ${dayjs(milestone.time.to).format('MMMM D, YYYY')}`}
        </div>
        <div className={cn("text-muted-foreground font-medium text-[12px] ml-1 rounded-full px-2", expired ? 'bg-red-300 text-white' : 'bg-green-300')}>
          {expired ? 'quá hạn' : `hết hạn trong ${remainingDays}`}
        </div>
      </div>
      <div className=" flex-1 self-end ">
        <div className="flex flex-1 items-center justify-end text-muted-foreground text-[12px]">
          <span>
            {milestone.tasks.length} công việc
          </span>
          {/* <span>
            0% complete
          </span> */}
        </div>
        {/* <Progress value={66} /> */}
      </div>
    </div>
  </div>
}