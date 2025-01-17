import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react"

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu.tsx"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { Label } from "@/components/ui/label.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx"
import dayjs from "dayjs";
import { Email } from "@/types/mail.ts";
import { useParams } from "react-router-dom";

export function MailDisplay() {
  const today = new Date();
  const params = useParams();
  const email: any = {}



  if (!email) return (<div></div>);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!email}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!email}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!email}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!email}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                        {dayjs(today).add(4, 'hour').format('E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {dayjs(today).add(1, 'day').format('E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {dayjs(today).add(7, 'days').format('E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {dayjs(today).add(7, 'days').format('E, h:m b')}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!email}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!email}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!email}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!email}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {email ? (
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={email.from} />
                <AvatarFallback>
                  {email?.from?.split(' ').slice(0, -1).join(' ').replace(/"/g, '')?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{email.from}</div>
                <div className="line-clamp-1 text-xs">{email.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {email.sender}
                </div>
              </div>
            </div>
            {email.createdAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {dayjs(new Date(email.createdAt)).format("PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm min-h-0 overflow-y-auto ">
            {email.body}
          </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply ${email.from}...`}
                />
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                  <Button
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                    className="ml-auto"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center text-center text-muted-foreground text-[14px]">
          No message selected
        </div>
      )}
    </div>
  )
}
