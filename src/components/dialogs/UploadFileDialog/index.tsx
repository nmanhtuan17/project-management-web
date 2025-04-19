import { useDialogContext } from "@/components/providers/DialogProvider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCurrentProject } from "@/lib/hooks/useCurrentProject"
import { uploadAttachment } from "@/redux/actions/project.action"
import { useAppDispatch } from "@/redux/store"
import apiService from "@/services/api.service"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export const UploadFileDialog = () => {
  const { uploadFileDialog, setDialogOpen } = useDialogContext()
  const [file, setFile] = useState<FileList>()
  const { currentProject } = useCurrentProject()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleUploadFile = async () => {
    setLoading(true)
    try {
      const formdata = new FormData()
      formdata.append('attachment', file[0])
      dispatch(uploadAttachment({ project: currentProject._id, attachment: formdata }))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      closeDialog()
    }
  }

  const closeDialog = () => {
    setDialogOpen('uploadFileDialog', false)
  }

  return (
    <Dialog open={uploadFileDialog.open}
      onOpenChange={(open) => {
        setDialogOpen('uploadFileDialog', open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tải lên tài liệu
          </DialogTitle>
        </DialogHeader>
        <div>
          <Input type="file" onChange={(e) => setFile(e.target.files)} />
          <div className="flex items-end justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={closeDialog}>
              Hủy
            </Button>
            <Button disabled={loading} onClick={handleUploadFile}>
              {loading ?
                <>
                  <Loader2 className="animate-spin" />
                  <p>Đang tải lên</p>
                </>
                :
                'Tải lên'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}