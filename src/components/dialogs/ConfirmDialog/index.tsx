import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface ConfirmDialogProps {
  children: ReactNode;
}

export const ConfirmDialog = ({ children }: ConfirmDialogProps) => {
  const { setDialogOpen, confirmDialog } = useDialogContext()

  return (
    <Dialog open={confirmDialog.open}
      onOpenChange={open => {
        setDialogOpen('confirmDialog', open)
      }}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>
            Xác nhận
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}