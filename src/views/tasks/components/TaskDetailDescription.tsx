import { InputComposer } from "@/components/common/InputComposer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"


interface TaskDetailDescriptionProps {
  value: string
}

export const TaskDetailDescription = (props: TaskDetailDescriptionProps) => {
  const [isEdit, setEdit] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.setContent(props.value)
  }, [props.value]);

  return (
    <div className="">
      <InputComposer ref={inputRef} />
    </div>
  )
}