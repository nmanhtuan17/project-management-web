import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useState } from "react"


interface TaskDetailDescriptionProps {
  value: string
}

export const TaskDetailDescription = (props: TaskDetailDescriptionProps) => {
  const [isEdit, setEdit] = useState(false)

  return (
    <div className="">
      {isEdit ?
        <div>
          <Input {...props} />
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
        <>
          {props.value ? <div
            onClick={(e) => {
              e.preventDefault()
              setEdit(true)
            }}
            className='rounded-sm hover:bg-muted cursor-text'>
            {props.value}
          </div>
            :
            <div
              onClick={(e) => {
                e.preventDefault()
                setEdit(true)
              }}
              className='rounded-sm hover:bg-muted cursor-text font-semibold text-muted-foreground'>
              No description
            </div>
          }
        </>
      }
    </div>
  )
}