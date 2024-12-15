import * as React from "react";
import { cn } from "@/lib/utils";

import { Check, X, ChevronsUpDown, PlusCircleIcon, ChevronsDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CommandList } from "cmdk";
import { ReactNode } from "react";
import { useAppSelector } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

export type OptionType = {
  label: string | ReactNode;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const [newOption, setNewOption] = React.useState("");

  const handleNewOptionEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(e.target.value);
  };

  const handleNewOptionSubmit = () => {
    if (newOption) {
      options.push({ label: newOption, value: newOption });
      onChange(
        selected.includes(newOption)
          ? selected.filter((item) => item !== newOption)
          : [...selected, newOption]
      );
      setNewOption("");
      setOpen(true);
    }
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
          <div className="flex gap-1 overflow-hidden items-center flex-wrap">
            {selected.length === 0 && <span className={'text-muted-foreground'}>Select...</span>}
            {selected.map((item) => (
              <Badge
                variant="secondary"
                key={item}
                className="text-xs"
                onClick={() => handleUnselect(item)}
              >
                {options.find(x => x.value === item)?.label}
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
            ))}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandList>
            <CommandInput placeholder={placeholder || "Search..."} />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    );
                    setOpen(true);
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


interface MultiSelectAssigneesProps extends MultiSelectProps {
}

export function MultiSelectAssignees({
  options,
  selected,
  onChange,
  className,
  placeholder,
  ...props
}: MultiSelectAssigneesProps) {
  const [open, setOpen] = React.useState(false);
  const { members } = useAppSelector(state => state.project)
  const { currentProject, profile } = useCurrentProject()

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between flex-1', "h-auto", 'px-2')}
          onClick={() => setOpen(!open)}
        >
          <div className="flex px-1 overflow-hidden items-center flex-wrap -space-x-2">
            {selected.length === 0 && <span className={'text-muted-foreground'}>Unassigned</span>}
            {selected.map((item) => (
              <div key={item}>
                {members.map(mem => mem._id === item && (
                  <TooltipProvider key={mem._id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className={'w-7 h-7'}>
                          <AvatarImage src={mem?.user?.avatar} />
                          <AvatarFallback className="text-xs">{mem.user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{mem?.user?.fullName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
                }
              </div>
            ))}
          </div>
        </Button>
      </PopoverTrigger>
      <Button
        variant="link"
        onClick={(e) => {
          e.preventDefault()
          onChange([profile._id])
        }}
        className="text-muted-foreground"
      >Assign to me</Button>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandList>
            <CommandInput placeholder={placeholder || "Search..."} />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {members.map((mem) => (
                <CommandItem
                  key={mem._id}
                  value={mem._id}
                  onSelect={() => {
                    onChange(
                      selected.includes(mem._id)
                        ? selected.filter((item) => item !== mem._id)
                        : [...selected, mem._id]
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