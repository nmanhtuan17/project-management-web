
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { BoardColumn, TaskStatus } from "@/types/task";
import { useReducer, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";

interface TaskBoardTitleProps {
  column: BoardColumn;
  handleUpdateTitle: (columnId: string, title: string) => void;
}

export default function TaskBoardTitle(props: TaskBoardTitleProps) {
  const { column, handleUpdateTitle } = props;
  const { openDialog } = useDialogContext();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(column.title)

  return (
    <div className="flex items-center justify-between mb-4 pl-2 pr-[10px]">
      {!editing ?
        <p
          onClick={() => {
            setEditing(true)
          }}
          className="font-medium text-[14px]">
          {column.title}
        </p>
        :
        <div className="flex gap-1 items-center">
          <Input
            className="outline-none focus:outline-[0px] mt-1"
            onChange={(e) => {
              setValue(e.target.value)
            }}
            value={value} />
          <span
            onClick={() => {
              handleUpdateTitle(column._id, value)
            }}
            className="p-2 bg-white rounded-sm cursor-pointer">
            <Check size={16} />
          </span>
          <span
            onClick={() => setEditing(false)}
            className="p-2 bg-white rounded-sm cursor-pointer">
            <X size={16} />
          </span>
        </div>
      }
    </div>
  )
};
