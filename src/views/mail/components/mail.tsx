import {
  Archive,
  ArchiveX,
  File,
  Inbox,
  Search,
  Send, Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { AccountSwitcher } from "@/views/mail/components/account-switcher.tsx";
import { MailDisplay } from "@/views/mail/components/mail-display.tsx";
import { MailList } from "@/views/mail/components/mail-list.tsx";
import { Nav } from "@/views/mail/components/nav.tsx";
import { useLocation } from "react-router-dom";
import { useMailContext } from "@/views/mail";
import { useState } from "react";
import { EmailLabel } from "@/types/mail";

interface MailProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail(props: MailProps) {
  const { defaultLayout = [265, 440, 655], defaultCollapsed = false, navCollapsedSize } = props;
  const { pathname } = useLocation();
  const { emails } = useMailContext();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

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
          maxSize={20}
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
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all" className={'w-full h-full flex flex-col min-h-full'}>
            <div className="">
              <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">
                  {emailLabel[pathname.split("/")[2]]}
                </h1>
                <TabsList className="ml-auto">
                  <TabsTrigger
                    value="all"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    All mail
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    Unread
                  </TabsTrigger>
                </TabsList>
              </div>
              <Separator />
              <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                  </div>
                </form>
              </div>
            </div>
            <TabsContent value="all" className="m-0 flex-1 overflow-y-auto">
              <div className={'flex flex-col flex-1 h-full'}>
                <MailList items={emails} />
              </div>
            </TabsContent>
            <TabsContent value="unread" className="m-0 flex-1 overflow-y-auto">
              <div className={'flex flex-col flex-1 h-full'}>
                <MailList items={emails} />
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="overflow-hidden" defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
