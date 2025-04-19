import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { deleteAttachment, getAttachments } from "@/redux/actions/project.action"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { formatFileSize } from "@/utils"
import { Ellipsis, EllipsisVertical, Plus } from "lucide-react"
import { FC, useEffect } from "react"
import { AttachmentItem } from "./AttachmentItem"

interface Props {

}

export const ProjectDocument: FC<Props> = ({ }) => {
  const { setDialogOpen } = useDialogContext()
  const dispatch = useAppDispatch()
  const { attachments } = useAppSelector(state => state.project)
  const { currentProject } = useCurrentProject()

  useEffect(() => {
    dispatch(getAttachments(currentProject._id))
  }, []);

  const handleDelete = async (attachment: string) => {
    dispatch(deleteAttachment({ project: currentProject._id, attachment }))
    setDialogOpen('confirmDialog', false)
  }

  return <div className="flex-1 overflow-y-auto">
    <div className="flex p-4 items-center justify-between">
      <div className="">
        <p className="text-[14px] font-semibold">Tài liệu dự án</p>
        <p className="text-sm text-muted-foreground">
          Quản lý tất cả tài liệu nội bộ liên quan đến dự án
        </p>
      </div>
      <Button
        variant="secondary"
        className="px-2 w-8 h-8"
        onClick={() => {
          setDialogOpen('uploadFileDialog', true)
        }}
      >
        <Plus size={18} />
      </Button>
    </div>
    <Separator />
    <div className="px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Định dạng</TableHead>
            <TableHead>Kích cỡ</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attachments.map(attachment => (
            <AttachmentItem attachment={attachment} handleDelete={handleDelete} />
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
}