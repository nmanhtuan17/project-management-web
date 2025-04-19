import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { deleteAttachment } from "@/redux/actions/project.action"
import { useAppDispatch } from "@/redux/store"
import { ProjectAttachment } from "@/types/project"
import { formatFileSize } from "@/utils"
import { EllipsisVertical } from "lucide-react"

interface Props {
  attachment: ProjectAttachment,
  handleDelete: (att) => void;
}

export const AttachmentItem = ({ attachment, handleDelete }: Props) => {
  const { setDialogOpen } = useDialogContext()

  const closeDialog = () => {
    setDialogOpen('confirmDialog', false)
  }

  return (
    <TableRow key={attachment._id} className="cursor-pointer">
      <TableCell onClick={() => {
        window.open(attachment.url)
      }} className="text-xs font-semibold gap-2 items-center hover:underline">
        <p className="line-clamp-1 w-[200px]">{attachment.name}</p>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {attachment.contentType}
      </TableCell>
      <TableCell>
        {formatFileSize(attachment.size)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2 outline-none">
              <EllipsisVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onSelect={() => {
              setDialogOpen('confirmDialog', true, {
                element: <div>
                  <p>
                    Bạn chắc chắn muốn xóa file này?
                  </p>
                  <div className=" flex gap-2 justify-end">
                    <Button onClick={closeDialog} variant="secondary">
                      Hủy
                    </Button>
                    <Button onClick={() => handleDelete(attachment._id)} variant="destructive">
                      Xác nhận
                    </Button>
                  </div>
                </div>
              })
            }}>
              Xóa
              <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}