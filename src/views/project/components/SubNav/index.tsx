import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BanknoteIcon, CheckCheckIcon, LayoutGrid, MailIcon, SettingsIcon, StarIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/redux/store.ts";
import useCurrentProject from "@/lib/hooks/useCurrentProject";

export const SubNav = () => {
  const currentProject = useCurrentProject();

  return <Popover>
    <PopoverTrigger asChild>
      <Button className={'p-0 w-8 h-8 hover:border'} variant={'ghost'}>
        <LayoutGrid className={'w-4 h-4'} />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div className={'grid grid-cols-3'}>
        <Link to={`/projects/${currentProject.slug}/mails/inbox`}
          className={'aspect-square flex flex-col items-center justify-center group cursor-pointer'}>
          <div
            className={'w-10 h-10 bg-muted flex items-center justify-center rounded border group-hover:bg-muted-foreground'}>
            <MailIcon className={'group-hover:text-muted group-hover:border-none'} />
          </div>
          <div className={'text-sm mt-2'}>
            Mail
          </div>
        </Link>
        <Link to={`/projects/${currentProject.slug}/tasks`}>
          <div className={'aspect-square flex flex-col items-center justify-center group cursor-pointer'}>
            <div
              className={'w-10 h-10 bg-muted flex items-center justify-center rounded border group-hover:bg-muted-foreground'}>
              <CheckCheckIcon className={'group-hover:text-muted group-hover:border-none'} />
            </div>
            <div className={'text-sm mt-2'}>
              Tasks
            </div>
          </div>
        </Link>
        <Link to={`/projects/${currentProject.slug}/settings/profile`}>
          <div
            className={'aspect-square flex flex-col items-center justify-center group cursor-pointer'}>
            <div
              className={'w-10 h-10 bg-muted flex items-center justify-center rounded border group-hover:bg-muted-foreground'}>
              <SettingsIcon className={'group-hover:text-muted group-hover:border-none'} />
            </div>
            <div className={'text-sm mt-2'}>
              Settings
            </div>
          </div>
        </Link>
      </div>
    </PopoverContent>
  </Popover>
}
