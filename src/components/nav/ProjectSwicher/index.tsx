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
import { useDialogContext } from "@/components/providers/DialogProvider"
import { loadKanbanBoard, loadMilestones } from "@/redux/actions/project.action"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { Project } from "@/types/project"
import apiService from "@/services/api.service"
import { resetFilter } from "@/redux/slices/task.slice"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ProjectSwitcherProps extends PopoverTriggerProps {
}

export const ProjectSwitcher = ({ className }: ProjectSwitcherProps) => {
  const [open, setOpen] = React.useState(false);
  const { projects, members } = useAppSelector(state => state.project);
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const { setDialogOpen } = useDialogContext()
  const dispatch = useAppDispatch();
  const { currentProject, profile, setCurrentProject, setProfile } = useCurrentProject();

  const groups = [{
    label: 'Dự án cá nhân',
    key: 'personal'
  }, {
    label: 'Dự án nhóm',
    key: 'team'
  }]

  const onSelectProject = async (project: Project) => {
    setOpen(false)
    dispatch(loadKanbanBoard(project._id))
    dispatch(loadMilestones({ projectId: project._id, filter: { query: '' } }))
    dispatch(resetFilter())
    setCurrentProject(project)
    const profile = await apiService.getProjectProfile(project._id)
    setProfile(profile)
    navigate('/projects/' + project.slug);
  }

  return (<Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-label="Select a project"
        className={cn("w-[200px] justify-between overflow-hidden", className)}
      >
        {!!currentProject._id ? <>
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
        </> :
          <span className="truncate text-xs">Chọn dự án</span>
        }
        <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0">
      <Command>
        <CommandList>
          <CommandInput placeholder="Search project..." />
          <CommandEmpty>Không có dữ liệu</CommandEmpty>
          {groups.map((group) => {
            const items = projects.filter(s => s.type === group.key);
            if (items.length === 0) return;
            return (<CommandGroup key={group.key} heading={group.label}>
              {items.map((project) => (
                <CommandItem
                  key={project._id}
                  onSelect={() => onSelectProject(project)}
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
              setDialogOpen("createProject", true);
            }}>
              <PlusCircledIcon className="mr-2 h-5 w-5" />
              Tạo dự án
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>)
}
