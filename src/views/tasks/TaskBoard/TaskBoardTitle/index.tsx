
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { BoardColumn } from "@/types/task";
import { useReducer, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, Delete, Ellipsis, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface TaskBoardTitleProps {
  column: BoardColumn;
  handleUpdateTitle: (columnId: string, title: string, backgroundColor: string) => void;
  handleRemoveColumn: (columnId: string) => void;
}

export default function TaskBoardTitle(props: TaskBoardTitleProps) {
  const { column, handleUpdateTitle, handleRemoveColumn } = props;
  const { openDialog } = useDialogContext();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(column.title)
  const [color, setColor] = useState(column.backgroundColor)

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
        <div className="gap-1 items-center">
          <div className="flex items-center">
            <Input
              className="mt-1"
              onChange={(e) => {
                setValue(e.target.value)
              }}
              value={value} />
            <input type="color" className="rounded-md m-2"
              onChange={(e) => {
                setColor(e.target.value)
              }}
              value={color}
            />
          </div>
          <div className="flex gap-1">
            <span
              onClick={() => {
                handleUpdateTitle(column._id, value, color)
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
        </div>
      }
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Ellipsis size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <Command className="rounded-lg border shadow-md min-w-[100px]">
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      handleRemoveColumn(column._id)
                    }}
                    className="items-center">
                    <Delete size={14} />
                    <span>Delete</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

      </div>
    </div>
  )
};
