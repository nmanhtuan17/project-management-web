import { useDialogContext } from "@/components/providers/DialogProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FunnelIcon } from "@heroicons/react/16/solid";
import { PlusIcon } from "lucide-react";

export const MilestonesHeader = () => {
  const { openDialog } = useDialogContext();

  return (
    <div className="flex justify-between">
      <div className="flex gap-1 items-center">
        <Input className={'h-8 text-sm w-48'}
          placeholder="Search milestone..."
        />
        <Popover>
          <PopoverTrigger>
            <Button variant={'outline'} size={'lg'} className={'p-0 h-8 text-muted-foreground aspect-square'}>
              <FunnelIcon className={'w-4 h-4'} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            {/* <TaskFilterForm /> */}
          </PopoverContent>
        </Popover>
      </div>
      <Button
        onClick={() => {
          openDialog("createMilestone");
        }}
        className="gap-1 w-full sm:w-auto" icon={<PlusIcon />}>Thêm mới</Button>
    </div>
  )
}