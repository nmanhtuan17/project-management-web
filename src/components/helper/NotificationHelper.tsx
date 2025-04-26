import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import apiService from "@/services/api.service"
import TaskDetail from "@/views/tasks/TaskDetail"
import { Bell, Dot } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const NotificationHelper = () => {
  const { setDialogOpen } = useDialogContext();
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    const res = await apiService.get('notification');
    setNotifications(res.data);
  }

  const markAsRead = async (id: string) => {
    await apiService.markAsReadNotification(id);
    fetchNotifications()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-2">
          <Bell size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="max-w-[300px]">
        <div>
          <p className="text-md font-semibold">Thông báo</p>
          <Separator />
          <div className="flex flex-col gap-2 mt-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex justify-between items-center gap-2 bg-muted p-2 rounded-md cursor-pointer"
                onClick={() => {
                  markAsRead(notification._id);
                  if (notification.type === 'task') {
                    setDialogOpen('taskDetail', true, { element: <TaskDetail taskId={notification.task._id} /> });
                  } else if (notification.type === 'email') {
                    navigate(`/mails/inbox`);
                  }
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    {notification.type === 'task' && <p>[{`${notification.task.project.name}`}] </p>}
                    <p className="text-sm font-semibold">{notification.title}</p>
                  </div>
                  <p className="text-xs">{notification.body}</p>
                </div>
                {!notification.isRead && <Dot color="blue" size={36} />}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>

  )
}
