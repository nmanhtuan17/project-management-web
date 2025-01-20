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
import { Email, MessageStreams } from "@/types/mail.ts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"
import apiService from "@/services/api.service"
import { useMailContext } from ".."
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import IframeDocs from "@/components/common/IframeDocs"

export function MailDisplay() {
  const params = useParams();
  const [email, setEmail] = useState<Email>()
  const { currentEmailLabel } = useMailContext()
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    if (!!params.mailId) {
      loadEmail()
    }
  }, [params.mailId])

  const loadEmail = async () => {
    setLoading(true)
    const res = await apiService.get(`mails/${MessageStreams[currentEmailLabel]}/${params.mailId}`)
    setEmail({ ...res.data, From: res.data.From.replace(/[<>]/g, "") })
    setLoading(false)
  }

  return (
    <div className="flex h-full flex-col">
      {loading ?
        <div className="flex justify-center items-center h-full w-full">
          <LoadingSpinner size={16} />
        </div>
        :
        <>
          {email ? (
            <div className="flex flex-1 flex-col min-h-0">
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="line-clamp-1 text-xl font-medium">{email.Subject}</div>
                  <div className="flex items-center p-2">
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
                        <DropdownMenuItem>Foward</DropdownMenuItem>
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        <DropdownMenuItem>Move to trash</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-start gap-4 text-sm">
                    <Avatar>
                      <AvatarImage alt={email.From} />
                      <AvatarFallback>
                        {email?.From?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="font-semibold">{email.From}</div>
                      <div className="text-sm text-muted-foreground flex gap-2">To:
                        <div>
                          {email.MessageStream === 'outbound' ? email.Recipients.join(', ')
                            :
                            <p>{email.To}</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  {email.Date && (
                    <div className="ml-auto text-xs text-muted-foreground">
                      {dayjs(new Date(email?.Date)).fromNow()}
                    </div>
                  )}
                </div>

              </div>
              <Separator />
              <div className="flex-1 whitespace-pre-wrap p-4 text-sm min-h-0 overflow-y-auto ">
                <IframeDocs content={email.HtmlBody} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center text-center text-muted-foreground text-[14px]">
              No message selected
            </div>
          )}
        </>
      }
    </div>
  )
}
