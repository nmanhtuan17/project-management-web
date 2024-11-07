import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useNavigate } from "react-router-dom";
import useCurrentProject from "@/lib/hooks/useCurrentProject"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ProjectSwitcherProps extends PopoverTriggerProps {
}

export const ProjectSwitcher = ({ className }: ProjectSwitcherProps) => {
  const [open, setOpen] = React.useState(false);
  const { projects } = useAppSelector(state => state.project);
  const currentProject = useCurrentProject();
  const navigate = useNavigate();

  const groups = [{
    label: 'Personal Projects',
    key: 'personal'
  }, {
    label: 'Teams',
    key: 'team'
  }]

  return (<Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-label="Select a project"
        className={cn("w-[200px] justify-between overflow-hidden", className)}
      >
        <Avatar className="mr-2 h-5 w-5">
          <AvatarImage
            src={currentProject.avatar || `https://avatar.vercel.sh/${currentProject?.name}.png`}
            alt={currentProject?.name}
          />
          <AvatarFallback>{currentProject?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="truncate">
          {currentProject?.name}
        </span>
        <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0">
      <Command>
        <CommandList>
          <CommandInput placeholder="Search project..." />
          <CommandEmpty>No project found.</CommandEmpty>
          {groups.map((group) => {
            const items = projects.filter(s => s.type === group.key);
            if (items.length === 0) return;
            return (<CommandGroup key={group.key} heading={group.label}>
              {items.map((project) => (
                <CommandItem
                  key={project._id}
                  onSelect={() => {
                    setOpen(false)
                    navigate('/projects/' + project.slug);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={project.avatar || `https://avatar.vercel.sh/${project.name}.png`}
                      alt={project.name}
                    />
                    <AvatarFallback>{project.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {project.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentProject._id === project._id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>)
          })}
        </CommandList>
        <CommandSeparator />
        <CommandList>
          <CommandGroup>
            <CommandItem className={'cursor-pointer'} onSelect={() => {
              console.log('ok')
              navigate('/boarding/new');
            }}>
              <PlusCircledIcon className="mr-2 h-5 w-5" />
              Create Project
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>)
}
