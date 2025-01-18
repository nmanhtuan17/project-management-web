import {
  Archive,
  ArchiveX,
  File,
  Inbox,
  Pen,
  RotateCcw,
  Search,
  Send, Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { AccountSwitcher } from "@/views/mail/components/account-switcher.tsx";
import { MailDisplay } from "@/views/mail/components/mail-display.tsx";
import { MailList } from "@/views/mail/components/mail-list.tsx";
import { Nav } from "@/views/mail/components/nav.tsx";
import { Outlet, useLocation } from "react-router-dom";
import { useMailContext } from "@/views/mail";
import { useState } from "react";
import { EmailLabel } from "@/types/mail";
import { Button } from "@/components/ui/button";
import { useFloatingWindowCtx } from "@/components/providers/FloatingWindowProvider";
import { EmailComposer } from "@/components/common/EmailComposer";

interface MailProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail(props: MailProps) {
  const { defaultLayout = [265, 440, 655], defaultCollapsed = false, navCollapsedSize } = props;
  const { pathname } = useLocation();
  const { emails, loadMails } = useMailContext();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { createWindow } = useFloatingWindowCtx()

  const emailLabel = {
    [EmailLabel.INBOX]: "Inbox",
    [EmailLabel.SENT]: "Sent",
    [EmailLabel.TRASH]: "Trash",
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch"
        onLayout={(sizes: number[]) => {
          setIsCollapsed((sizes[0] < 15))
        }}
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={15}
          className={cn(
            isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} />
          </div>
          <Separator />
          <div className="p-2">
            <Button variant="secondary" className="w-full h-12 gap-2"
              onClick={() => {
                createWindow({
                  title: "Compose email",
                  children: <EmailComposer />,
                  width: 800,
                  height: 600,
                })
              }}
            >
              <Pen size={14} />
              <p>Compose</p>
            </Button>
          </div>
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Inbox",
                label: "",
                icon: Inbox,
                variant: pathname.includes('inbox') ? 'default' : 'ghost',
                path: `/mails/inbox`
              },
              {
                title: "Sent",
                label: "",
                icon: Send,
                variant: pathname.includes('sent') ? 'default' : 'ghost',
                path: `/mails/sent`
              },
              {
                title: "Trash",
                label: "",
                icon: Trash2,
                variant: pathname.includes('trash') ? 'default' : 'ghost',
                path: `/mails/trash`
              }
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} maxSize={30}>
          <Tabs defaultValue="all" className={'w-full h-full flex flex-col min-h-full'}>
            <div className="">
              <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">
                  {emailLabel[pathname.split("/")[2]]}
                </h1>
              </div>
              <Separator />
              <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          loadMails()
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reload</TooltipContent>
                  </Tooltip>
                </form>
              </div>
            </div>
            <TabsContent value="all" className="m-0 flex-1 overflow-y-auto">
              <div className={'flex flex-col flex-1 h-full'}>
                <MailList items={emails} />
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="overflow-hidden" defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
