import { MultiSelect, MultiSelectAssignees } from "@/components/ui/multi-select.tsx";
import { useEffect, useState } from "react";
import apiService from "@/services/api.service.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { ProjectMember } from "@/types/project";
import { useAppSelector } from "@/redux/store";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberSelectorProps {
  assignees: string[];
  className?: string;
  onChange?: (members: string[]) => void,
}

export default function AssigneesSelector({
  assignees,
  onChange,
  className,
  ...props
}: MemberSelectorProps) {
  const [open, setOpen] = useState(false);
  const { members } = useAppSelector(state => state.project)

  const handleUnselect = (item: string) => {
    onChange(assignees.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', "h-auto", 'px-2', className)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex overflow-hidden items-center flex-wrap">
            {assignees.length === 0 && <span className={'text-muted-foreground text-xs font-semibold'}>Chọn...</span>}
            {assignees.map((item) => (
              <div key={item}>
                {members.map(mem => mem._id === item && (
                  <Badge
                    variant="secondary"
                    key={item}
                    className="gap-1"
                    onClick={() => handleUnselect(item)}
                  >
                    <Avatar className={'w-4 h-4'}>
                      <AvatarImage src={mem?.user?.avatar} />
                      <AvatarFallback className="text-xs">{mem.user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p>{mem?.user?.fullName}</p>
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(item)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
                }
              </div>
            ))}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandList>
            <CommandInput placeholder={"Search..."} />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {members.map((mem) => (
                <CommandItem
                  key={mem._id}
                  value={mem._id}
                  onSelect={() => {
                    onChange(
                      assignees.includes(mem._id)
                        ? assignees.filter((item) => item !== mem._id)
                        : [...assignees, mem._id]
                    );
                    setOpen(true);
                  }}
                  className="hover:bg-muted"
                >
                  <Avatar className={'w-4 h-4'}>
                    <AvatarImage src={mem?.user?.avatar} />
                    <AvatarFallback className="text-xs">{mem.user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {mem.user.fullName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
