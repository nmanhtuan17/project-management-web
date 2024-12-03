import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Check, X } from "lucide-react";
import { useState } from "react"

interface TaskDetailTitleProps {
  value: string;
}
export const TaskDetailTitle = (props: TaskDetailTitleProps) => {
  const [isEdit, setEdit] = useState(false)

  return (
    <div className=" my-2">
      {isEdit ?
        <div>
          <Input className="font-bold text-2xl" {...props} />
          <div className="flex justify-end mt-2 gap-2">
            <Button
              variant="secondary"
              className="p-2"
              onClick={() => setEdit(false)}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
        :
        <div
          onClick={(e) => {
            e.preventDefault()
            setEdit(true)
          }}
          className='text-2xl rounded-sm font-bold hover:bg-muted'>
          {props.value}
        </div>
      }
    </div>
  )
}