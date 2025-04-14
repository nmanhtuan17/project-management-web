import { useDialogContext } from "@/components/providers/DialogProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon } from "lucide-react";

interface Props {
  onChangeText: (text: string) => void;
  onSelectChange: (val: string) => void;
}

export const MilestonesHeader = ({ onChangeText, onSelectChange }: Props) => {
  const { openDialog } = useDialogContext();

  return (
    <div className="flex justify-between">
      <div className="flex gap-1 items-center">
        <Input className={'h-8 text-sm w-48'}
          placeholder="Search milestone..."
          onChange={e => onChangeText(e.target.value)}
        />
        <Select onValueChange={onSelectChange}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={() => {
          openDialog("createMilestone");
        }}
        className="gap-1 w-full sm:w-auto" icon={<PlusIcon />}>Thêm mới</Button>
    </div>
  )
}