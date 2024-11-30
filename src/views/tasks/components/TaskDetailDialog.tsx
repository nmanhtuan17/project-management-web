import { useDialogContext } from "@/components/providers/DialogProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ReactNode } from "react"

interface TaskDetailDialogProps {
  children: ReactNode;
}


export const TaskDetailDialog = ({ children }: TaskDetailDialogProps) => {
  const { taskDetail, setDialogOpen } = useDialogContext();

  return (
    <Dialog open={taskDetail.open}
      onOpenChange={open => {
        setDialogOpen('taskDetail', open)
      }}>
      <DialogContent className="w-full max-w-[1280px] min-h-[600px]">
        {children}
      </DialogContent>
    </Dialog>
  )
}