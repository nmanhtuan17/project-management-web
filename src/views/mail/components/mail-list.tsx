import {useEffect} from "react";
import {cn} from "@/lib/utils.ts";
import dayjs from "dayjs";
import {Email} from "@/types/mail.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {LoadingSpinner} from "@/components/ui/loading-spinner.tsx";
import useCurrentSpace from "@/lib/hooks/useCurrentProject";
import { useMailContext } from "@/views/mail";

interface MailListProps {
  items: Email[];
}

export function MailList({items}: MailListProps) {
  const space = useCurrentSpace();
  const navigate = useNavigate();
  const params = useParams();
  const {loading} = useMailContext();
  const {pathname} = useLocation();
  const currentEmailLabel = pathname.split("/")[4];


  return (
    <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoadingSpinner size={16}/>
        </div>
      ) : (
        <>
          {items.length > 0 ? (
            items.map(item => (
              <button
                key={item._id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  params.mailId === item._id && "bg-muted"
                )}
                onClick={() => navigate(`/spaces/${space.slug}/mails/${currentEmailLabel}/${item._id}`)}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.from}</div>
                      {!item.seen && <span className="flex h-[6px] w-[6px] rounded-full bg-blue-600"/>}
                    </div>
                    <div
                      className={cn("ml-auto text-xs", params.mailId === item._id ? "text-foreground" : "text-muted-foreground")}>
                      {dayjs(new Date(item.createdAt)).fromNow()}
                    </div>
                  </div>
                  <div className="text-xs font-medium">{item.subject}</div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">{item.strippedText?.substring(0, 300)}</div>
              </button>
            ))
          ) : (
            <p className="flex justify-center items-center h-full w-full text-center text-muted-foreground text-[14px]">
              No chat messages.
            </p>
          )}
        </>
      )}
    </div>
  );
}
