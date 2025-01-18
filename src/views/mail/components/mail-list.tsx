import { useEffect } from "react";
import { cn } from "@/lib/utils.ts";
import dayjs from "dayjs";
import { Email, EmailStatus } from "@/types/mail.ts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import { useMailContext } from "@/views/mail";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

interface MailListProps {
  items: Email[];
}

export function MailList({ items }: MailListProps) {
  const navigate = useNavigate();
  const params = useParams();
  const { loading, currentEmailLabel } = useMailContext();
  const { pathname } = useLocation();


  return (
    <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoadingSpinner size={16} />
        </div>
      ) : (
        <>
          {items.length > 0 ? (
            items.map(item => (
              <button
                key={item.MessageID}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  params.mailId === item.MessageID && "bg-muted"
                )}
                onClick={() => navigate(`/mails/${currentEmailLabel}/${item.MessageID}`)}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="font-semibold line-clamp-1 w-full">
                        {
                          item.MessageStream === 'inbound' ?
                            item.From
                            :
                            `To: ${item.Recipients.map(e => e.split('@')[0]).join(', ')}`
                        }
                      </div>
                      {/* {item.Status !== EmailStatus.OPENED && <span className="flex h-[6px] w-[6px] rounded-full bg-blue-600" />} */}
                    </div>
                    <div
                      className={cn("text-xs", params.mailId === item._id ? "text-foreground" : "text-muted-foreground")}>
                      {dayjs(new Date(item.Date)).fromNow()}
                    </div>
                  </div>
                  <div className="text-xs font-medium">{item.Subject}</div>
                </div>
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
