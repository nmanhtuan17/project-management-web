import {useAppSelector} from "@/redux/store.ts";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "@radix-ui/react-icons";
import {Card} from "@/components/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useNavigate} from "react-router-dom";
import {Ellipsis, Plus, Settings} from "lucide-react";
import * as React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import { useDialogContext } from "@/components/providers/DialogProvider";

export default function Boarding() {
  const {projects} = useAppSelector(state => state.project);
  const navigate = useNavigate();
  const {createProject, setDialogOpen} = useDialogContext()

  return <div className={'flex-1 space-y-6 px-4 sm:px-0'}>
    <div>
      <div className={'flex flex-row justify-between'}>
        <h3 className="text-lg font-bold">Select Project</h3>
        <div>
          <Button onClick={() => {
            setDialogOpen('createProject', true)
          }}>
            <PlusIcon className={'mr-1'}/>
            Create Project
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Select project to continue...
      </p>
    </div>
    <div className={'flex flex-col space-y-4'}>
      {projects.map(project => {
        return <Card key={project._id} className={'p-4 hover:border-gray-500 cursor-pointer'} onClick={() => {
          navigate(`/projects/${project.slug}`)
        }}>
          <div className={'flex items-start flex-row'}>
            <div className={'flex-1 flex flex-col items-start'}>
              <h4 className={'font-bold mb-0.5'}>
                {project.name}
              </h4>
              <div
                className={'pl-1.5 pr-2 py-1 bg-muted hover:bg-gray-300 text-xs text-muted-foreground rounded-full flex flex-row gap-1 items-center'}>
                <Avatar className=" h-4 w-4">
                  <AvatarImage
                    src={project?.avatar || `https://avatar.vercel.sh/${project?.name}.png`}
                    alt={project?.name}
                  />
                  <AvatarFallback>
                    {project?.name}
                  </AvatarFallback>
                </Avatar>
                <span>/projects/{project.slug}</span>
              </div>

            </div>
            <div className="-mt-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={'w-8 h-8'}>
                    <Ellipsis size={16}/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <p className="font-medium">{project.name}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem className={'space-x-2'} onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${project.slug}/members`)
                  }}>
                    <Plus size={14}/>
                    <span>Invite</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className={'space-x-2'} onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${project.slug}/settings/project`)
                  }}>
                    <Settings size={14}/>
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className={'flex justify-between items-center mt-4'}>
            <div className={'text-muted-foreground text-[14px]'}>
            {project.memberCount} members
            </div>
            <Badge variant="outline" className="capitalize">
              {project.type}
            </Badge>
          </div>
        </Card>;
      })}
    </div>
  </div>
}
